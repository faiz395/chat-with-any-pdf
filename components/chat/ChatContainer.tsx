'use client';

import { useState } from 'react';
import { Message, PDFDocument } from '@/types';
import MessageItem from './MessageItem';
import ChatInput from './ChatInput';
import PdfViewer from '../PdfView';

interface ChatContainerProps {
  document: PDFDocument;
}

export default function ChatContainer({ document }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Optimistic update
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);

      // API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          documentId: document.documentId,
          history: messages.slice(-10) // Send last 10 messages for context
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const aiResponse = await response.json();
      
      // Add AI response to messages
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date()
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left side: PDF Viewer */}
      <div className="w-1/2 border-r border-gray-200">
        <div className="h-full">
          <PdfViewer fileId={document.documentId} />
        </div>
      </div>

      {/* Right side: Chat Interface */}
      <div className="w-1/2 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">{document.fileName}</h2>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map(message => (
            <MessageItem key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <div className="animate-bounce">●</div>
              <div className="animate-bounce delay-100">●</div>
              <div className="animate-bounce delay-200">●</div>
            </div>
          )}
          {error && (
            <div className="text-red-500 p-4 text-center">{error}</div>
          )}
        </div>

        {/* Chat Input */}
        <ChatInput documentId={document.documentId} onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
