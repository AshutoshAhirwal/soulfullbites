import { defineConfig, loadEnv } from 'vite';
import { existsSync } from 'node:fs';
import path from 'node:path';
import dns from 'node:dns';
import { Resolver } from 'node:dns/promises';

// ── ISP DNS Fix ───────────────────────────────────────────────────────────────
// Some Indian ISPs block/refuse to resolve AWS/Neon hostnames.
// Override both Node dns AND undici (used by global fetch) to use Google DNS.
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

// Patch undici's global dispatcher to use Google DNS for all fetch() calls
// (needed because @neondatabase/serverless uses the global fetch, not node:http)
try {
  const { setGlobalDispatcher, Agent } = await import('undici');
  const customResolver = new Resolver();
  customResolver.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  setGlobalDispatcher(new Agent({
    connect: {
      lookup: (hostname, options, callback) => {
        customResolver.lookup(hostname, options && options.family ? { family: options.family } : {})
          .then(({ address, family }) => callback(null, address, family))
          .catch((err) => callback(err));
      },
    },
  }));
  console.log('\x1b[32m[DNS Fix]\x1b[0m Using Google DNS (8.8.8.8) for all fetch requests.');
} catch (e) {
  console.warn('[DNS Fix] Could not patch undici:', e.message);
}
// ─────────────────────────────────────────────────────────────────────────────

async function readJsonBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {};
  }

  const rawBody = Buffer.concat(chunks).toString('utf8').trim();
  return rawBody ? JSON.parse(rawBody) : {};
}

function decorateResponse(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };

  res.json = (payload) => {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
    }

    res.end(JSON.stringify(payload));
    return res;
  };

  return res;
}

function localApiPlugin() {
  return {
    name: 'local-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const requestPath = req.url ? req.url.split('?')[0] : '';

        if (!requestPath.startsWith('/api/')) {
          return next();
        }

        // First try exact match: /api/foo -> api/foo.js
        let modulePath = requestPath.endsWith('.js') ? requestPath : `${requestPath}.js`;
        let apiFilePath = path.join(process.cwd(), modulePath.slice(1));

        // If exact not found, try parent segment: /api/media/4 -> api/media.js
        if (!existsSync(apiFilePath)) {
          const segments = requestPath.split('/').filter(Boolean); // ['api', 'media', '4']
          if (segments.length >= 3) {
            const parentPath = '/' + segments.slice(0, -1).join('/'); // /api/media
            const parentModule = `${parentPath}.js`;
            const parentFile = path.join(process.cwd(), parentModule.slice(1));
            if (existsSync(parentFile)) {
              modulePath = parentModule;
              apiFilePath = parentFile;
            }
          }
        }

        if (!existsSync(apiFilePath)) {
          return next();
        }

        try {
          const parsedUrl = new URL(req.url || '/', 'http://localhost');
          req.query = Object.fromEntries(parsedUrl.searchParams.entries());

          if (req.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase())) {
            req.body = await readJsonBody(req);
          } else {
            req.body = {};
          }

          decorateResponse(res);

          const { default: handler } = await server.ssrLoadModule(modulePath);
          await handler(req, res);

          if (!res.writableEnded) {
            next();
          }
        } catch (error) {
          server.ssrFixStacktrace(error);
          console.error('Local API error:', error);

          if (!res.writableEnded) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Local API failed' }));
          }
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [localApiPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: path.resolve(process.cwd(), 'index.html'),
          about: path.resolve(process.cwd(), 'about.html'),
          faq: path.resolve(process.cwd(), 'faq.html'),
          shop: path.resolve(process.cwd(), 'shop.html'),
          checkout: path.resolve(process.cwd(), 'checkout.html'),
          admin: path.resolve(process.cwd(), 'admin.html'),
          login: path.resolve(process.cwd(), 'login.html'),
          dashboard: path.resolve(process.cwd(), 'dashboard.html'),
          inspiration: path.resolve(process.cwd(), 'inspiration.html'),
        },
      },
    },
  };
});
