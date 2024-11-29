declare module 'pdf-parse' {
  interface PDFInfo {
    Title?: string;
    Author?: string;
    CreationDate?: string;
    [key: string]: any;
  }

  interface PDFParseResult {
    text: string;
    numpages: number;
    info?: PDFInfo;
  }

  function pdf(buffer: Buffer): Promise<PDFParseResult>;

  export = pdf;
}
