'use client';

import type { AnalysisResult, RiskItem, Severity } from '@/types/risk';

const SEV_CONFIG: Record<Severity, { emoji: string; label: string; bg: string; border: string; badge: string }> = {
  red: {
    emoji: '🔴',
    label: 'Cláusula muy problemática',
    bg: '#FFF5F5',
    border: '#FCA5A5',
    badge: '#DC2626',
  },
  yellow: {
    emoji: '🟡',
    label: 'Cláusula a revisar',
    bg: '#FFFBEB',
    border: '#FCD34D',
    badge: '#D97706',
  },
  blue: {
    emoji: '🔵',
    label: 'Recomendación',
    bg: '#EFF6FF',
    border: '#93C5FD',
    badge: '#2563EB',
  },
};

function RiskCard({ item }: { item: RiskItem }) {
  const cfg = SEV_CONFIG[item.severity];
  return (
    <div
      style={{
        background: cfg.bg,
        border: `1.5px solid ${cfg.border}`,
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
        <span style={{ fontSize: '20px', flexShrink: 0 }}>{cfg.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: '16px',
                color: '#12112A',
              }}
            >
              {item.title}
            </span>
            {item.page && (
              <span
                style={{
                  fontSize: '11px',
                  background: '#E5E7EB',
                  color: '#6B7280',
                  borderRadius: '6px',
                  padding: '2px 8px',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Pág. {item.page}
              </span>
            )}
          </div>
          <div
            style={{
              display: 'inline-block',
              marginTop: '4px',
              fontSize: '11px',
              background: cfg.badge,
              color: '#fff',
              borderRadius: '6px',
              padding: '2px 8px',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
            }}
          >
            {cfg.label}
          </div>
        </div>
      </div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#374151', margin: '0 0 10px', lineHeight: '1.6' }}>
        {item.explanation}
      </p>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#6B7280', margin: 0 }}>
        📋 <strong>Base legal:</strong> {item.legalBasis}
      </p>
    </div>
  );
}

function SummaryBadge({ count, severity }: { count: number; severity: Severity }) {
  const cfg = SEV_CONFIG[severity];
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: cfg.bg,
        border: `1.5px solid ${cfg.border}`,
        borderRadius: '12px',
        padding: '16px 24px',
        minWidth: '90px',
      }}
    >
      <span style={{ fontSize: '28px', fontWeight: 800, color: cfg.badge, fontFamily: "'DM Sans', sans-serif" }}>
        {count}
      </span>
      <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: "'DM Sans', sans-serif", marginTop: '2px' }}>
        {severity === 'red' ? 'Críticas' : severity === 'yellow' ? 'A revisar' : 'Sugerencias'}
      </span>
    </div>
  );
}

export default function ResultsPanel({ result }: { result: AnalysisResult }) {
  // Documento informativo
  if (result.documentType === 'documento_informativo') {
    return (
      <div
        style={{
          background: '#FFF7ED',
          border: '2px solid #FB923C',
          borderRadius: '16px',
          padding: '32px',
          marginTop: '32px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#12112A', marginBottom: '12px' }}>
          Este documento es informativo
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#6B7280', fontSize: '15px', maxWidth: '480px', margin: '0 auto' }}>
          El archivo que has subido parece ser un dossier, folleto o documento informativo, no un contrato. Sube el
          contrato que vas a firmar para analizarlo.
        </p>
      </div>
    );
  }

  // Documento desconocido
  if (result.documentType === 'desconocido') {
    return (
      <div
        style={{
          background: '#F9FAFB',
          border: '2px solid #D1D5DB',
          borderRadius: '16px',
          padding: '32px',
          marginTop: '32px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#12112A', marginBottom: '12px' }}>
          No hemos podido identificar el documento
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#6B7280', fontSize: '15px', maxWidth: '480px', margin: '0 auto' }}>
          El PDF no contiene las marcas típicas de un contrato de agencia inmobiliaria. Asegúrate de subir el contrato
          correcto o contáctanos si crees que es un error.
        </p>
      </div>
    );
  }

  const redRisks = result.risks.filter((r) => r.severity === 'red');
  const yellowRisks = result.risks.filter((r) => r.severity === 'yellow');
  const blueRisks = result.risks.filter((r) => r.severity === 'blue');

  const verdict =
    result.summary.red > 0
      ? { emoji: '⚠️', text: 'Contrato con cláusulas muy problemáticas. No firmes sin leer el análisis.', color: '#DC2626' }
      : result.summary.yellow > 0
      ? { emoji: '🔎', text: 'Contrato con cláusulas que deberías revisar antes de firmar.', color: '#D97706' }
      : { emoji: '✅', text: 'No hemos detectado cláusulas problemáticas evidentes.', color: '#16A34A' };

  return (
    <div style={{ marginTop: '40px' }}>
      {/* Cabecera resultado */}
      <div
        style={{
          background: 'linear-gradient(135deg, #12112A, #2A1F3D)',
          borderRadius: '16px',
          padding: '28px 32px',
          marginBottom: '28px',
          color: '#fff',
        }}
      >
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', opacity: 0.6, marginBottom: '6px' }}>
          Tipo de documento detectado
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', margin: '0 0 20px' }}>
          {result.documentLabel}
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <SummaryBadge count={result.summary.red} severity="red" />
          <SummaryBadge count={result.summary.yellow} severity="yellow" />
          <SummaryBadge count={result.summary.blue} severity="blue" />
        </div>
      </div>

      {/* Veredicto */}
      <div
        style={{
          border: `2px solid ${verdict.color}`,
          borderRadius: '12px',
          padding: '18px 24px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: '#fff',
        }}
      >
        <span style={{ fontSize: '24px' }}>{verdict.emoji}</span>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '15px', color: verdict.color, margin: 0 }}>
          {verdict.text}
        </p>
      </div>

      {/* Disclaimer legal */}
      <div
        style={{
          background: '#F9FAFB',
          border: '1px solid #E5E7EB',
          borderRadius: '10px',
          padding: '14px 20px',
          marginBottom: '28px',
        }}
      >
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#9CA3AF', margin: 0, lineHeight: '1.5' }}>
          ⚖️ <strong>Aviso legal:</strong> Este análisis es orientativo y no constituye asesoramiento jurídico. Ante dudas concretas, consulta con un abogado especialista en derecho inmobiliario.
        </p>
      </div>

      {result.risks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
          <p>No se han detectado cláusulas problemáticas en este contrato.</p>
        </div>
      )}

      {redRisks.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#DC2626', marginBottom: '16px' }}>
            🔴 Cláusulas muy problemáticas ({redRisks.length})
          </h3>
          {redRisks.map((r) => <RiskCard key={r.id} item={r} />)}
        </section>
      )}

      {yellowRisks.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#D97706', marginBottom: '16px' }}>
            🟡 Cláusulas a revisar ({yellowRisks.length})
          </h3>
          {yellowRisks.map((r) => <RiskCard key={r.id} item={r} />)}
        </section>
      )}

      {blueRisks.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#2563EB', marginBottom: '16px' }}>
            🔵 Recomendaciones ({blueRisks.length})
          </h3>
          {blueRisks.map((r) => <RiskCard key={r.id} item={r} />)}
        </section>
      )}
    </div>
  );
}
