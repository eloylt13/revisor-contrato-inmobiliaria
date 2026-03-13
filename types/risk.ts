export type Severity = 'red' | 'yellow' | 'blue';

export type DocumentType =
  | 'contrato_agencia'
  | 'contrato_exclusiva'
  | 'documento_informativo'
  | 'desconocido';

export interface RiskItem {
  id: string;
  severity: Severity;
  title: string;
  explanation: string;
  legalBasis: string;
  page?: number;
}

export interface AnalysisResult {
  documentType: DocumentType;
  documentLabel: string;
  risks: RiskItem[];
  summary: {
    red: number;
    yellow: number;
    blue: number;
    total: number;
  };
}
