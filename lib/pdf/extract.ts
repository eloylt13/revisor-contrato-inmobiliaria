export interface PageText {
  page: number;
  text: string;
}

export async function extractTextByPages(buffer: ArrayBuffer): Promise<PageText[]> {
  const { extractText } = await import('unpdf');
  const uint8 = new Uint8Array(buffer);
  const { text } = await extractText(uint8, { mergePages: false });

  if (Array.isArray(text)) {
    return text.map((t: string, i: number) => ({
      page: i + 1,
      text: t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
    }));
  }

  // fallback si viene como string plano
  return [{ page: 1, text: (text as string).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') }];
}

export function flatText(pages: PageText[]): string {
  return pages.map((p) => p.text).join(' ');
}
