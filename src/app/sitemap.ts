import type { MetadataRoute } from 'next';

/**
 * Only public pages belong here. The dashboard, preferences and onboarding
 * are behind auth and shouldn't be crawled or indexed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://geeglot.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://geeglot.com/sign-in',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}