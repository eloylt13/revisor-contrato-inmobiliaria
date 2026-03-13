import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://revisor-contrato-inmobiliaria.vercel.app/sitemap.xml',
  };
}
