declare module 'pdf-parse' {
  interface PDFData {
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    text: string;
    version: string;
  }

  export default function pdf(dataBuffer: Buffer | Uint8Array | ArrayBuffer, options?: any): Promise<PDFData>;
}
