/**
 * Client-side PDF text extraction (browser only).
 * Loaded dynamically so pdfjs never enters the SSR bundle.
 */
export async function extractPdfText(file: File, maxPages = 60): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  const pages = Math.min(doc.numPages, maxPages);
  const chunks: string[] = [];
  for (let i = 1; i <= pages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((it) => ("str" in it ? (it as { str: string }).str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (text) chunks.push(text);
  }
  return chunks.join("\n\n");
}
