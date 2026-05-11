/**
 * DNS Patcher for @neondatabase/serverless
 * 
 * Problem: Some ISPs (common in India) block/refuse to resolve AWS hostnames
 * like *.neon.tech via their DNS servers. The global fetch() in Node 18+ uses
 * libuv's getaddrinfo which respects /etc/resolv.conf set by the ISP.
 *
 * Solution: Intercept fetch() calls to Neon endpoints and resolve the hostname
 * manually using dns.Resolver (which we can configure to use Google DNS 8.8.8.8),
 * then rewrite the URL to use the resolved IP while sending the correct Host header.
 *
 * Usage: import './dns-patch.js' at the top of any file that uses the Neon client.
 */

import { Resolver } from 'node:dns/promises';
import https from 'node:https';
import http from 'node:http';

const resolver = new Resolver();
resolver.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const dnsCache = new Map(); // hostname -> { ip, cachedAt }
const DNS_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function resolveHostname(hostname) {
  const cached = dnsCache.get(hostname);
  if (cached && Date.now() - cached.cachedAt < DNS_TTL_MS) {
    return cached.ip;
  }
  const addrs = await resolver.resolve4(hostname);
  if (!addrs || !addrs.length) throw new Error(`DNS resolution failed for ${hostname}`);
  const ip = addrs[0];
  dnsCache.set(hostname, { ip, cachedAt: Date.now() });
  return ip;
}

/**
 * A fetch() implementation that manually resolves DNS via Google DNS
 * before making the request. Falls back to native fetch on error.
 */
async function patchedFetch(url, options = {}) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    // Only patch Neon-related hostnames
    if (!hostname.endsWith('.neon.tech') && !hostname.endsWith('.aws.neon.tech')) {
      return fetch(url, options);
    }

    const ip = await resolveHostname(hostname);
    const patchedUrl = url.toString().replace(hostname, ip);

    // Keep the original hostname in the Host header for TLS SNI + virtual hosting
    const patchedOptions = {
      ...options,
      headers: {
        ...(options.headers || {}),
        'Host': hostname,
      },
    };

    // Use Node's native https module to bypass undici DNS issues
    return await nodeFetch(patchedUrl, hostname, patchedOptions);
  } catch (err) {
    // Fall back to native fetch if patching fails
    console.warn('[DNS Patch] Falling back to native fetch:', err.message);
    return fetch(url, options);
  }
}

/**
 * Low-level HTTPS fetch using Node's native https module
 * (bypasses undici and its DNS resolver entirely)
 */
function nodeFetch(url, sniHostname, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const isHttps = parsedUrl.protocol === 'https:';
    const agent = isHttps ? https : http;

    const reqOptions = {
      hostname: parsedUrl.hostname,  // This is now the IP
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      servername: sniHostname, // SNI: use original hostname for TLS
      rejectUnauthorized: true,
    };

    const req = agent.request(reqOptions, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          headers: res.headers,
          json: () => Promise.resolve(JSON.parse(body)),
          text: () => Promise.resolve(body),
          arrayBuffer: () => Promise.resolve(Buffer.concat(chunks).buffer),
        });
      });
      res.on('error', reject);
    });

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }

    req.end();
  });
}

export { patchedFetch };
export default patchedFetch;
