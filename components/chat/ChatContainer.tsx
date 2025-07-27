'use client';

import { useEffect, useState } from 'react';
import { Message, PDFDocument } from '@/types';
import MessageItem from './MessageItem';
import ChatInput from './ChatInput';
import PdfViewer from '../PdfView';
import { useAuth } from '@clerk/nextjs'
import serviceClient from '@/appwriteClient';
import { ID } from 'appwrite';
interface ChatContainerProps {
  document: PDFDocument;
}
import { useToast } from "@/hooks/use-toast";




export default function ChatContainer({ document }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);
  const { isLoaded, userId } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    try {
      serviceClient.getChatFromDb(userId!, document.documentId).then((res) => {
        if (!res) {
          return;
        }
        let newMessages: Message[] = res.documents.map((doc) => ({
          id: ID.unique(),
          role: doc.role,
          content: doc.message,
          $createdAt: new Date(doc.$createdAt),
        }));
        setMessages(newMessages);
      });
    } catch (error) {
      // handle error
    }
  }, [userId, document]);

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const userMessage: Message = {
        id: ID.unique(),
        role: 'user',
        content,
        $createdAt: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          documentId: document.documentId,
          history: messages.slice(-10),
        }),
      });
      if (!response.ok) {
        toast({
          title: 'Something went wrong',
          description: 'Please try again later.',
        });
        throw new Error('Failed to get response');
      }
      const aiResponse = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: ID.unique(),
          role: 'model',
          content: aiResponse.message,
          $createdAt: new Date(),
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || !userId) {
    return null;
  }

  return (
    <div className="relative min-h-[100dvh] bg-white dark:bg-gray-900 flex flex-col md:flex-row">
      {/* PDF and Chat side by side on desktop, stacked on mobile/tablet */}
      {/* PDF Viewer */}
      <div className="w-full md:w-1/2 flex-shrink-0">
        <div className="fixed bottom-0 left-0 w-full flex justify-center z-40 md:static md:z-0 md:w-full md:block md:h-screen md:max-h-screen md:overflow-y-auto md:overflow-x-hidden">
          <div className={`transition-all duration-300 ${pdfOpen ? 'max-h-[80vh] max-w-[480px] w-full shadow-2xl border rounded-t-2xl bg-white dark:bg-gray-900' : 'max-h-0 overflow-hidden'} md:max-h-none md:max-w-none md:w-full md:rounded-none md:shadow-none md:border-none md:h-full`} style={{marginBottom: pdfOpen ? '56px' : '0'}}>
            <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-white dark:bg-gray-900 md:hidden">
              <span className="font-semibold text-base">PDF Preview</span>
              <button
                className="text-indigo-600 font-medium px-3 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900 transition"
                onClick={() => setPdfOpen((v) => !v)}
              >
                {pdfOpen ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className={`w-full ${pdfOpen ? '' : 'hidden md:block'} p-2 md:p-0 md:h-full`} style={{height: '100%'}}>
              <PdfViewer fileId={document.documentId} />
            </div>
          </div>
          {/* PDF toggle button (floating) */}

          {/* 
          {!pdfOpen && (
            <button
              className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white px-6 py-2 rounded-full shadow-lg md:hidden"
              onClick={() => setPdfOpen(true)}
            >
              Show PDF
            </button>
          )}
           */}
        </div>
      </div>

      {/* Chat Section (always on top, solid background) */}
      <div className="relative z-30 flex-1 flex flex-col w-full md:w-1/2 mx-auto bg-gray-50 dark:bg-gray-900 min-h-[100dvh] md:ml-0 md:mr-0 md:max-h-screen md:h-screen">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white dark:bg-gray-900 sticky top-0 z-10">
          <h2 className="text-lg font-semibold truncate">{document.fileName}</h2>
        </div>
        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:max-h-[calc(100vh-120px)]">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <div className="animate-bounce">●</div>
              <div className="animate-bounce delay-100">●</div>
              <div className="animate-bounce delay-200">●</div>
            </div>
          )}
          {error && <div className="text-red-500 p-4 text-center">{error}</div>}
        </div>
        {/* Chat Input (sticky on mobile/tablet) with Show PDF button on mobile */}
        <div className="sticky bottom-0 z-20 bg-white dark:bg-gray-900 border-t border-gray-200 p-2">
          <div className="flex items-end gap-2 p-2 mx-2 md:p-0 ">
            {/* Show PDF button only on mobile, right of input */}
            <div className="md:hidden flex-shrink-0">
              {!pdfOpen && (
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg transition"
                  onClick={() => setPdfOpen(true)}
                >
                  Show PDF
                </button>
              )}
            </div>
            <div className="flex-1">
              <ChatInput documentId={document.documentId} onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        html, body, #__next, #__app {
          height: 100%;
        }
        .min-h-[100dvh] { min-height: 100dvh !important; }
      `}</style>
    </div>
  );
}
