export interface Citation {
  pageNumber: number;
  text: string;
  highlight: string;
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  $createdAt: Date;
  citations?: Citation[];
  reactions?: Reaction[];
  parentMessageId?: string; // For threading
  status?: 'sending' | 'sent' | 'error';
}

export interface PDFDocument {
  $id: string;
  documentId: string;
  fileName: string;
  documentUrl: string;
  userId: string;
  contentHash?: string;
  $createdAt: Date;
}
