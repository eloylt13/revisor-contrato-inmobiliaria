import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';

const BASE_URL = 'https://revisor-contrato-inmobiliaria.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Revisor de Contrato de Agencia Inmobiliaria — Detecta Cláusulas Abusivas',
  description:
    'Analiza gratis tu contrato de agencia inmobiliaria antes de firmarlo. Detectamos automáticamente exclusividades abusivas, penalizaciones desproporcionadas, prórrogas automáticas y comisiones ambiguas.',
  keywords: [
    'revisar contrato agencia inmobiliaria',
    'cláusulas abusivas inmobiliaria',
    'exclusividad inmobiliaria ilegal',
    'contrato intermediación inmobiliaria',
    'penalización vender sin inmobiliaria',
    'contrato inmobiliaria exclusiva abusivo',
    'comisión inmobiliaria contrato',
    'analizar contrato inmobiliaria PDF',
  ],
  openGraph: {
    title: 'Revisor de Contrato de Agencia Inmobiliaria',
    description: 'Detecta cláusulas abusivas en tu contrato con la inmobiliaria antes de firmarlo. Gratis, sin registro.',
    url: BASE_URL,
    siteName: 'Revisor Contrato Inmobiliaria',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Revisor de Contrato de Agencia Inmobiliaria',
    description: 'Detecta cláusulas abusivas en tu contrato con la inmobiliaria antes de firmarlo. Gratis.',
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: '6Cr92jGfY8D6cZX4sdEC1v1vECb_mgjBy8Jd9qoUfI4',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Revisor de Contrato de Agencia Inmobiliaria',
  url: BASE_URL,
  description:
    'Herramienta gratuita para analizar contratos de agencia inmobiliaria en España. Detecta automáticamente cláusulas abusivas antes de firmar.',
  applicationCategory: 'LegalTool',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  inLanguage: 'es',
  audience: { '@type': 'Audience', audienceType: 'Propietarios de vivienda en España' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}