import type { RiskItem, Severity } from '@/types/risk';
import type { PageText } from '@/lib/pdf/extract';

interface RulePattern {
  keywords: string[];
  absent?: boolean;
}

interface Rule {
  id: string;
  severity: Severity;
  title: string;
  explanation: string;
  legalBasis: string;
  pattern: RulePattern;
}

const RULES: Rule[] = [
  // ─── 🔴 ROJOS ────────────────────────────────────────────────────────────
  {
    id: 'R1',
    severity: 'red',
    title: 'Exclusividad sin límite temporal claro',
    explanation:
      'El contrato incluye una cláusula de exclusividad pero no especifica claramente su duración o las condiciones para levantarla. Esto puede impedirte vender tu vivienda por tu cuenta o con otra agencia durante un período indefinido.',
    legalBasis: 'TRLGDCU art. 85 — Cláusulas abusivas por limitar los derechos del consumidor',
    pattern: {
      keywords: [
        'exclusividad',
        'en exclusiva',
        'exclusivo',
        'mandato exclusivo',
        'venta en exclusiva',
        'captacion exclusiva',
      ],
    },
  },
  {
    id: 'R2',
    severity: 'red',
    title: 'Penalización excesiva por vender sin la agencia',
    explanation:
      'El contrato prevé una indemnización, penalización o compensación si vendes la propiedad sin intervención de la agencia. Si la penalización es desproporcionada respecto a los servicios prestados, puede considerarse abusiva.',
    legalBasis: 'TRLGDCU art. 85.6 — Penalizaciones desproporcionadas',
    pattern: {
      keywords: [
        'penalizacion',
        'penalidad',
        'clausula penal',
        'indemnizacion por incumplimiento',
        'compensacion economica',
        'danos y perjuicios',
        'rescision anticipada',
        'vender por su cuenta',
        'venta directa',
        'vendiera directamente',
        'al margen de la inmobiliaria',
        'al margen del intermediario',
        'obligado al abono',
        'mitad de los honorarios',
        'resarcir al mediador',
        'frustracion de sus legitimas expectativas',
        'gastos de inversion y medios desplegados',
        'vendiere directamente',
      ],
    },
  },
  {
    id: 'R3',
    severity: 'red',
    title: 'Prórroga automática sin aviso previo',
    explanation:
      'El contrato se renueva automáticamente sin que la agencia tenga obligación de avisarte con antelación. Podrías quedar vinculado sin saberlo por otro período completo.',
    legalBasis: 'TRLGDCU art. 85.2 — Prórroga automática sin notificación',
    pattern: {
      keywords: [
        'prorroga automatica',
        'renovacion automatica',
        'se prorrogara automaticamente',
        'se renovara automaticamente',
        'tacita reconduccion',
        'renovacion tacita',
        'prorroga tacita',
        'prorrogado tacitamente',
        'entendera prorrogado',
        'se entendera renovado',
        'periodos iguales y sucesivos',
        'periodos sucesivos',
        'prorrogara por periodos',
        'renovara por periodos',
      ],
    },
  },
  {
    id: 'R4',
    severity: 'red',
    title: 'Duración excesiva o renuncia al desistimiento',
    explanation:
      'El contrato tiene una duración muy prolongada (más de 12 meses) o incluye cláusulas que te impiden resolverlo anticipadamente. La Ley de Contrato de Agencia reconoce el derecho a desistir con preaviso razonable.',
    legalBasis: 'Ley 12/1992, de 27 de mayo, de Contrato de Agencia',
    pattern: {
      keywords: [
        'irrevocable',
        'no podra resolver',
        'renuncia al desistimiento',
        'sin posibilidad de rescision',
        'veinticuatro meses',
        'treinta y seis meses',
        'dos años',
        'tres años',
        '24 meses',
        '36 meses',
        'no puede cancelar',
        'renuncia a la cancelacion',
      ],
    },
  },

  // ─── 🟡 AMARILLOS ─────────────────────────────────────────────────────────
  {
    id: 'A1',
    severity: 'yellow',
    title: 'Comisión no especificada o ambigua',
    explanation:
      'La comisión de la agencia no está claramente definida: falta el importe exacto, el porcentaje o la base sobre la que se calcula (precio de venta, precio de oferta, etc.). Esto puede dar lugar a reclamaciones posteriores.',
    legalBasis: 'Ley 12/1992, art. 11 — La remuneración debe pactarse por escrito',
    pattern: {
      keywords: [
        'segun acuerdo',
        'a convenir',
        'se determinara en su momento',
        'honorarios variables',
        'comision a determinar',
        'precio a negociar',
        'segun tarifa vigente',
      ],
    },
  },
  {
    id: 'A2',
    severity: 'yellow',
    title: 'Obligaciones concretas de la agencia no detalladas',
    explanation:
      'El contrato no especifica qué se compromete a hacer la agencia: en qué portales publicará el inmueble, cuántas visitas realizará, si elaborará reportaje fotográfico, etc. Sin obligaciones concretas, es difícil exigir responsabilidad.',
    legalBasis: 'Ley 12/1992 — Obligaciones del agente',
    pattern: {
      absent: true,
      keywords: [
        'publicara en',
        'realizara visitas',
        'gestion de visitas',
        'reportaje fotografico',
        'fotografia profesional',
        'publicidad en portales',
        'se compromete a realizar',
        'acciones de comercializacion',
        'plan de comercializacion',
        'idealista',
        'fotocasa',
        'habitaclia',
      ],
    },
  },
  {
    id: 'A3',
    severity: 'yellow',
    title: 'Comisión exigible aunque no se cierre la venta',
    explanation:
      'La agencia se reserva el derecho a cobrar comisión si presenta un comprador "dispuesto y en condiciones" aunque la operación no llegue a escriturarse. Según el Tribunal Supremo (STS 10/5/2019), esta cláusula puede ser válida pero debe estar redactada con total claridad.',
    legalBasis: 'STS 10/05/2019 — Comisión por presentación de comprador',
    pattern: {
      keywords: [
        'comprador dispuesto',
        'comprador en condiciones',
        'aunque no se cierre',
        'aunque el propietario desista',
        'independientemente de la firma',
        'derecho a honorarios aunque',
        'comprador presentado por',
        'haya captado al comprador',
        'comprador localizado por',
        'como consecuencia de sus gestiones',
        'aunque la operacion se acabase',
        'aun despues de finalizada la duracion',
        'aun despues de finalizado el contrato',
        'perfeccionando con comprador',
        'derecho al cobro de sus honorarios cuando',
        'a favor de parientes',
        'entidades en las que participasen',
      ],
    },
  },
  {
    id: 'A4',
    severity: 'yellow',
    title: 'Plazo de preaviso para cancelar no especificado',
    explanation:
      'El contrato no indica con cuántos días de antelación debes avisar si quieres cancelarlo. Sin este dato, la agencia puede alegar que no se cumplió el preaviso y exigir continuidad del contrato.',
    legalBasis: 'TRLGDCU — Transparencia en condiciones de resolución',
    pattern: {
      absent: true,
      keywords: [
        'preaviso',
        'dias de antelacion',
        'notificacion previa',
        'comunicacion fehaciente',
        'burofax',
        'correo certificado',
        'plazo de cancelacion',
        'resolucion anticipada',
      ],
    },
  },
  {
    id: 'A5',
    severity: 'yellow',
    title: 'Cesión del contrato a terceros sin tu consentimiento',
    explanation:
      'La agencia se reserva el derecho a ceder o subcontratar el encargo a otras agencias o colaboradores sin necesidad de tu autorización expresa. Debes saber quién gestiona tu propiedad en todo momento.',
    legalBasis: 'Ley 12/1992, art. 26 — Cesión del contrato de agencia',
    pattern: {
      keywords: [
        'ceder el contrato',
        'cesion a terceros',
        'subcontratar',
        'colaboradores externos',
        'agencias colaboradoras',
        'red de colaboradores',
        'sin necesidad de consentimiento',
        'puede subcontratar',
      ],
    },
  },

  // ─── 🔵 AZULES ────────────────────────────────────────────────────────────
  {
    id: 'S1',
    severity: 'blue',
    title: 'Precio de venta o alquiler no fijado en el contrato',
    explanation:
      'No se menciona el precio al que se ofertará tu inmueble. Es recomendable que figure el precio de salida acordado para evitar que la agencia lo publique a un precio diferente al pactado.',
    legalBasis: 'Buenas prácticas contractuales',
    pattern: {
      absent: true,
      keywords: [
        'precio de venta',
        'precio de oferta',
        'precio de salida',
        'precio minimo',
        'importe de venta',
        'valor de tasacion',
        'precio acordado',
        'precio de alquiler',
        'renta mensual',
      ],
    },
  },
  {
    id: 'S2',
    severity: 'blue',
    title: 'Medios de comercialización no especificados',
    explanation:
      'El contrato no detalla en qué canales se publicará tu inmueble. Conviene que conste expresamente: portales, redes sociales, escaparate físico, visitas virtuales, etc.',
    legalBasis: 'Buenas prácticas contractuales',
    pattern: {
      absent: true,
      keywords: [
        'portales inmobiliarios',
        'medios de difusion',
        'canales de comercializacion',
        'redes sociales',
        'web de la agencia',
        'escaparate',
        'visita virtual',
        'tour virtual',
        'cartel de venta',
        'medios de publicidad',
      ],
    },
  },
  {
    id: 'S3',
    severity: 'blue',
    title: 'Cláusula de confidencialidad con penalización',
    explanation:
      'El contrato incluye una cláusula de confidencialidad que puede limitarte a la hora de compartir información sobre tu propiedad o sobre la operación con otras personas o agencias.',
    legalBasis: 'Buenas prácticas contractuales',
    pattern: {
      keywords: [
        'confidencialidad',
        'clausula de confidencialidad',
        'informacion confidencial',
        'no divulgar',
        'secreto profesional',
        'no revelar',
        'datos confidenciales',
      ],
    },
  },
];

function textContainsAny(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw));
}

export function classifyRisks(pages: PageText[]): RiskItem[] {
  const fullText = pages.map((p) => p.text).join(' ');
  const results: RiskItem[] = [];

  for (const rule of RULES) {
    const { pattern } = rule;

    if (pattern.absent) {
      const found = textContainsAny(fullText, pattern.keywords);
      if (!found) {
        results.push({
          id: rule.id,
          severity: rule.severity,
          title: rule.title,
          explanation: rule.explanation,
          legalBasis: rule.legalBasis,
        });
      }
    } else {
      let matched = false;
      for (const page of pages) {
        if (textContainsAny(page.text, pattern.keywords)) {
          results.push({
            id: rule.id,
            severity: rule.severity,
            title: rule.title,
            explanation: rule.explanation,
            legalBasis: rule.legalBasis,
            page: page.page,
          });
          matched = true;
          break;
        }
      }
      if (!matched && textContainsAny(fullText, pattern.keywords)) {
        results.push({
          id: rule.id,
          severity: rule.severity,
          title: rule.title,
          explanation: rule.explanation,
          legalBasis: rule.legalBasis,
        });
      }
    }
  }

  const order: Record<Severity, number> = { red: 0, yellow: 1, blue: 2 };
  return results.sort((a, b) => order[a.severity] - order[b.severity]);
}