'use client';

import { PDFDocument } from '@/types';
import { useState } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import PdfViewer from '../PdfView';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ChatLayoutProps {
  document: PDFDocument;
}

interface MessageListProps {
  documentId: string;
}

interface ChatInputProps {
  documentId: string;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatLayout({ document }: ChatLayoutProps) {
  const [showPdf, setShowPdf] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="flex h-screen bg-white">
      {/* PDF Viewer Section */}
      {(!isMobile || showPdf) && (
        <div className={`${isMobile ? 'w-full absolute inset-0 z-10' : 'w-1/2'} border-r border-gray-200`}>
          <div className="h-full relative">
            <PdfViewer fileId={document.documentId} />
            {isMobile && (
              <button
                onClick={() => setShowPdf(false)}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg"
              >
                <span className="sr-only">Close PDF</span>
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Chat Section */}
      <div className={`${isMobile ? 'w-full' : 'w-1/2'} flex flex-col ${showPdf && isMobile ? 'hidden' : ''}`}>
        <ChatHeader 
          document={document}
          onTogglePdf={() => setShowPdf(!showPdf)}
          showPdfButton={isMobile}
        />
        <MessageList documentId={document.documentId.toString()} />
        <ChatInput 
          documentId={document.documentId.toString()} 
          onSendMessage={(message) => {
            // Implement your send message logic here
            console.log(`Sending message: ${message} for document ${document.documentId}`);
          }}
          isLoading={false}
        />
      </div>
    </div>
  );
}
