/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Prevents the site from being embedded in iframes (clickjacking protection)
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  // Prevents MIME-type sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Controls how much referrer information is sent
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Restricts access to browser features/APIs
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  // Content Security Policy — broad enough for Three.js, GSAP, Razorpay & Google Fonts
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: self + inline (Three.js/GSAP need it) + Razorpay + Cloudflare Turnstile
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://challenges.cloudflare.com",
      // Styles: self + inline + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: self + Google Fonts CDN
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + data URIs (Three.js textures) + any HTTPS source
      "img-src 'self' data: blob: https:",
      // Media (audio/video): self + blob (Three.js)
      "media-src 'self' blob:",
      // Workers (Three.js, Lenis): self + blob
      "worker-src 'self' blob:",
      // Frames: Razorpay payment iframe + Cloudflare Turnstile
      "frame-src https://api.razorpay.com https://challenges.cloudflare.com",
      // Fetch/XHR: self + Razorpay API + Neon DB (via server routes) + Resend
      "connect-src 'self' https://api.razorpay.com https://lottiefiles.com",
    ].join('; '),
  },
];

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

