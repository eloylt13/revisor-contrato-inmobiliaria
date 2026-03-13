'use client';

import { useState, useRef, useCallback } from 'react';
import type { AnalysisResult } from '@/types/risk';
import ResultsPanel from '@/components/ResultsPanel';

export default function Home() {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const analyze = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Por favor sube un archivo PDF.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setFileName(file.name);
    const form = new FormData();
    form.append('pdf', file);
    try {
      const res = await fetch('/api/analyze', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al analizar el contrato.');
      } else {
        setResult(data as AnalysisResult);
      }
    } catch {
      setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) analyze(file);
    },
    [analyze]
  );

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) analyze(file);
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <main style={{ minHeight: '100vh', background: '#F2EDE3' }}>
      {/* HEADER */}
      <header
        style={{
          background: 'linear-gradient(135deg, #12112A 0%, #2A1F3D 100%)',
          padding: '48px 24px 56px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏠</div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(26px, 5vw, 40px)',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '16px',
              lineHeight: 1.2,
            }}
          >
            Revisor de Contrato de Agencia Inmobiliaria
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '16px',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '540px',
              margin: '0 auto 24px',
              lineHeight: 1.6,
            }}
          >
            Sube el contrato que te ha dado la inmobiliaria y detectamos automáticamente cláusulas abusivas antes de que lo firmes.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {['✓ Gratuito', '✓ Sin registro', '✓ Resultado inmediato'].map((t) => (
              <span
                key={t}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: '#fff',
                  borderRadius: '20px',
                  padding: '6px 16px',
                  fontSize: '13px',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* UPLOAD ZONE */}
        {!result && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !loading && inputRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? '#8B6F4E' : '#C4B49A'}`,
              borderRadius: '16px',
              background: dragging ? '#EDE7DB' : '#FAF7F2',
              padding: '48px 24px',
              textAlign: 'center',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              style={{ display: 'none' }}
              onChange={handleFile}
            />
            {loading ? (
              <div>
                <div className="spinner" style={{ margin: '0 auto 16px', borderTopColor: '#8B6F4E', borderColor: '#DDD3C5' }} />
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#8B6F4E', fontWeight: 500 }}>
                  Analizando {fileName}…
                </p>
              </div>
            ) : (
              <>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#12112A', marginBottom: '8px', fontWeight: 600 }}>
                  Arrastra tu contrato aquí
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#8B6F4E', fontSize: '14px', marginBottom: '20px' }}>
                  o haz clic para seleccionar el PDF
                </p>
                <div
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #12112A, #2A1F3D)',
                    color: '#fff',
                    padding: '12px 32px',
                    borderRadius: '10px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  Seleccionar PDF
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#B5A89A', fontSize: '12px', marginTop: '16px' }}>
                  Solo PDF · Máximo 10 MB · No almacenamos tu documento
                </p>
              </>
            )}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div
            style={{
              background: '#FFF5F5',
              border: '1.5px solid #FCA5A5',
              borderRadius: '12px',
              padding: '16px 20px',
              marginTop: '20px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '20px' }}>❌</span>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#DC2626', fontSize: '14px', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* RESULTS */}
        {result && (
          <div className="fade-in-up">
            <ResultsPanel result={result} />
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button
                onClick={reset}
                style={{
                  background: 'linear-gradient(135deg, #12112A, #2A1F3D)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 32px',
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Analizar otro contrato
              </button>
            </div>
          </div>
        )}

        {/* CÓMO FUNCIONA */}
        {!result && (
          <div style={{ marginTop: '56px' }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '24px',
                color: '#12112A',
                textAlign: 'center',
                marginBottom: '32px',
              }}
            >
              ¿Qué detecta el revisor?
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                { emoji: '🔴', title: 'Exclusividad abusiva', desc: 'Contratos que te impiden vender por tu cuenta o con otra agencia.' },
                { emoji: '🔴', title: 'Penalizaciones excesivas', desc: 'Indemnizaciones desproporcionadas si vendes sin la agencia.' },
                { emoji: '🔴', title: 'Prórroga automática', desc: 'Renovaciones automáticas sin que te avisen.' },
                { emoji: '🟡', title: 'Comisión ambigua', desc: 'Honorarios no especificados o calculados de forma confusa.' },
                { emoji: '🟡', title: 'Sin obligaciones concretas', desc: 'La agencia no detalla qué acciones va a realizar.' },
                { emoji: '🔵', title: 'Precio no fijado', desc: 'El precio de venta acordado no consta en el contrato.' },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #E8E0D4',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.emoji}</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', color: '#12112A', marginBottom: '6px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#6B7280', lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEO TEXT */}
        <section
          style={{
            marginTop: '72px',
            background: '#fff',
            borderRadius: '16px',
            padding: '40px',
            border: '1px solid #E8E0D4',
          }}
        >
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#12112A', marginBottom: '16px' }}>
            Cómo revisar un contrato de agencia inmobiliaria antes de firmarlo
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#4B5563', lineHeight: 1.7, marginBottom: '16px' }}>
            Cuando decides vender o alquilar tu vivienda a través de una agencia inmobiliaria, lo primero que te presentarán es un contrato de intermediación o encargo de venta. Este documento establece las condiciones bajo las que la agencia trabajará para ti: la comisión que cobrará, el tiempo durante el que tendrá el encargo y, en muchos casos, una cláusula de exclusividad.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#4B5563', lineHeight: 1.7, marginBottom: '16px' }}>
            El problema es que estos contratos suelen estar redactados por los servicios jurídicos de la agencia y están pensados para proteger sus intereses, no los tuyos. Cláusulas como la <strong>exclusividad sin límite claro</strong>, las <strong>prórrogas automáticas</strong> o las <strong>penalizaciones excesivas</strong> son habituales y pueden costarte muy caro si no las detectas a tiempo.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#4B5563', lineHeight: 1.7 }}>
            Nuestro revisor analiza automáticamente el PDF de tu contrato y te muestra en segundos qué cláusulas son problemáticas, cuál es su base legal y qué riesgos supone firmarlo sin negociarlas. Todo gratis, sin registro y sin que almacenemos tu documento.
          </p>
        </section>

        {/* FAQ */}
        <section style={{ marginTop: '48px' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#12112A', marginBottom: '28px' }}>
            Preguntas frecuentes
          </h2>
          {[
            {
              q: '¿Es legal que la inmobiliaria me exija exclusividad?',
              a: 'Sí, la exclusividad es legal siempre que esté redactada con claridad y la penalización por incumplimiento sea proporcional (STS 10/5/2019). El problema aparece cuando la cláusula es ambigua, no tiene límite temporal claro o la penalización es desproporcionada, en cuyo caso puede considerarse abusiva según el TRLGDCU.',
            },
            {
              q: '¿Qué comisión puede cobrar una inmobiliaria en España?',
              a: 'En España no existe una comisión máxima fijada por ley. Lo habitual es entre el 3% y el 5% del precio de venta, pero lo importante es que la comisión esté especificada claramente en el contrato: importe o porcentaje, base de cálculo y en qué momento es exigible.',
            },
            {
              q: '¿Puedo cancelar un contrato en exclusiva antes del plazo?',
              a: 'Depende de lo que diga el contrato. La Ley 12/1992 de Contrato de Agencia reconoce el derecho de desistimiento con preaviso razonable, pero si el contrato tiene una cláusula de penalización, tendrás que pagarla. Antes de firmar, asegúrate de que el contrato especifica el plazo de preaviso para cancelar.',
            },
            {
              q: '¿Almacenáis mi contrato?',
              a: 'No. El PDF se procesa en el servidor para extraer el texto y se descarta inmediatamente. No almacenamos ningún documento ni información personal.',
            },
            {
              q: '¿El análisis es un asesoramiento jurídico?',
              a: 'No. El revisor es una herramienta orientativa basada en un motor de reglas que detecta patrones habituales en contratos de agencia inmobiliaria española. Para asesoramiento jurídico específico sobre tu contrato, consulta con un abogado especialista en derecho inmobiliario.',
            },
          ].map(({ q, a }) => (
            <details
              key={q}
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '20px 24px',
                marginBottom: '12px',
                border: '1px solid #E8E0D4',
                cursor: 'pointer',
              }}
            >
              <summary
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '15px',
                  color: '#12112A',
                  listStyle: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {q}
                <span style={{ color: '#8B6F4E', fontSize: '18px' }}>+</span>
              </summary>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#6B7280', marginTop: '12px', lineHeight: 1.7 }}>
                {a}
              </p>
            </details>
          ))}
        </section>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          background: '#12112A',
          color: 'rgba(255,255,255,0.5)',
          textAlign: 'center',
          padding: '32px 24px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '13px',
        }}
      >
        <p>
          Revisor de Contrato de Agencia Inmobiliaria · Herramienta orientativa, no asesoramiento jurídico · España
        </p>
        <p style={{ marginTop: '8px' }}>
          Basado en la Ley 12/1992 de Contrato de Agencia, el TRLGDCU y jurisprudencia del Tribunal Supremo
        </p>
      </footer>
    </main>
  );
}
