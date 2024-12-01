export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface PDFDocument {
  $id: string;
  documentId: string;
  fileName: string;
  documentUrl: string;
  userId: string;
  contentHash: string;
  createdAt: Date;
}
