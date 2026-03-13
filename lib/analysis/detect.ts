import type { DocumentType } from '@/types/risk';

const AGENCY_CONTRACT_KEYWORDS = [
  'contrato de agencia',
  'contrato de intermediacion',
  'contrato de mediacion',
  'encargo de venta',
  'encargo de intermediacion',
  'nota de encargo',
  'hoja de encargo',
  'mandato de venta',
  'contrato de corretaje',
  'agencia inmobiliaria',
  'agente inmobiliario',
  'intermediario inmobiliario',
  'honorarios de agencia',
  'comision de agencia',
];

const EXCLUSIVITY_KEYWORDS = [
  'en exclusiva',
  'exclusividad',
  'exclusivo',
  'mandato exclusivo',
  'contrato en exclusiva',
  'venta en exclusiva',
];

const INFORMATIVE_KEYWORDS = [
  'dossier',
  'folleto informativo',
  'guia de servicios',
  'presentacion comercial',
  'nota informativa',
  'catalogo de servicios',
];

export function detectDocumentType(fullText: string): DocumentType {
  const hasAgencyKeywords = AGENCY_CONTRACT_KEYWORDS.some((kw) => fullText.includes(kw));
  const hasExclusivityKeywords = EXCLUSIVITY_KEYWORDS.some((kw) => fullText.includes(kw));
  const hasInformativeKeywords = INFORMATIVE_KEYWORDS.some((kw) => fullText.includes(kw));
  const hasContractStructure =
    fullText.includes('las partes') ||
    fullText.includes('primera parte') ||
    fullText.includes('comparecen') ||
    fullText.includes('firman el presente') ||
    fullText.includes('acuerdan') ||
    fullText.includes('propietario') ||
    fullText.includes('titular del inmueble');

  if (!hasAgencyKeywords && !hasContractStructure) {
    if (hasInformativeKeywords) return 'documento_informativo';
    return 'desconocido';
  }

  if (hasExclusivityKeywords) return 'contrato_exclusiva';
  if (hasAgencyKeywords) return 'contrato_agencia';

  return 'desconocido';
}

export function getDocumentLabel(type: DocumentType): string {
  const labels: Record<DocumentType, string> = {
    contrato_agencia: 'Contrato de agencia inmobiliaria',
    contrato_exclusiva: 'Contrato en exclusiva',
    documento_informativo: 'Documento informativo',
    desconocido: 'Documento no identificado',
  };
  return labels[type];
}
