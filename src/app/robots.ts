import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Nothing behind auth should be crawled. These pages need a session
      // anyway, so a crawler would only ever see a redirect.
      disallow: ['/app', '/preferences', '/welcome', '/auth/'],
    },
    sitemap: 'https://geeglot.com/sitemap.xml',
  };
}