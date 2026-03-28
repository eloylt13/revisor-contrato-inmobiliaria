import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';

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
        <footer style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #e5e7eb',
          padding: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-iamagica.png" alt="IAMagica" style={{ height: '28px', width: 'auto' }} />
            <span style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>© 2026 IAMagica</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#1B4332', letterSpacing: '0.5px' }}>DIGITALIZA TU NEGOCIO</span>
            <a
              href="mailto:info@iamagica.es"
              style={{ textDecoration: 'none', color: '#6b7280', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '4px' }}
            >
              <span style={{ fontSize: '20px', lineHeight: 1 }}>✉</span>
              <span style={{ fontSize: '12px' }}>info@iamagica.es</span>
            </a>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}