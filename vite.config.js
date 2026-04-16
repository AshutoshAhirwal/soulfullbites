import { defineConfig, loadEnv } from 'vite';
import { existsSync } from 'node:fs';
import path from 'node:path';

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

        const modulePath = requestPath.endsWith('.js') ? requestPath : `${requestPath}.js`;
        const apiFilePath = path.join(process.cwd(), modulePath.slice(1));

        if (!existsSync(apiFilePath)) {
          return next();
        }

        try {
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
        },
      },
    },
  };
});
