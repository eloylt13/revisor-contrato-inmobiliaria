import { NextRequest, NextResponse } from 'next/server';
import { extractTextByPages } from '@/lib/pdf/extract';
import { detectDocumentType, getDocumentLabel } from '@/lib/analysis/detect';
import { classifyRisks } from '@/lib/analysis/classify';
import type { AnalysisResult } from '@/types/risk';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('pdf') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No se ha enviado ningún archivo PDF.' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'El archivo debe ser un PDF.' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'El archivo supera el límite de 10 MB.' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const pages = await extractTextByPages(buffer);

    if (!pages.length || pages.every((p) => p.text.trim().length < 20)) {
      return NextResponse.json(
        { error: 'No se ha podido extraer texto del PDF. Asegúrate de que no es un PDF escaneado sin OCR.' },
        { status: 422 }
      );
    }

    const fullText = pages.map((p) => p.text).join(' ');
    const documentType = detectDocumentType(fullText);
    const documentLabel = getDocumentLabel(documentType);

    if (documentType === 'documento_informativo') {
      const result: AnalysisResult = {
        documentType,
        documentLabel,
        risks: [],
        summary: { red: 0, yellow: 0, blue: 0, total: 0 },
      };
      return NextResponse.json(result);
    }

    const risks = classifyRisks(pages);

    const summary = {
      red: risks.filter((r) => r.severity === 'red').length,
      yellow: risks.filter((r) => r.severity === 'yellow').length,
      blue: risks.filter((r) => r.severity === 'blue').length,
      total: risks.length,
    };

    const result: AnalysisResult = { documentType, documentLabel, risks, summary };
    return NextResponse.json(result);
  } catch (err) {
    console.error('[analyze] Error:', err);
    return NextResponse.json(
      { error: 'Error interno al procesar el PDF. Inténtalo de nuevo.' },
      { status: 500 }
    );
  }
}
