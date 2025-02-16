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
  const { isLoaded, userId } = useAuth()
  const { toast } = useToast()

  console.log("document.$id: ", document.$id);
  
  useEffect(()=>{
    try {
      serviceClient.getChatFromDb(userId!, document.documentId).then((res) => {
      if (!res) {
        console.log("no res from db");
        return;
      }
      let newMessages: Message[] = res.documents.map((doc) => ({
        id: ID.unique(),
        role: doc.role,
        content: doc.message,
        $createdAt: new Date(doc.$createdAt),
      }));
      if(res.documents.length === 0){
        // newMessages = [
        //   {
        //     id: ID.unique(),
        //     role: 'model',
        //     content: 'Hello! I am your PDF assistant. How can I help you today?',
        //     $createdAt: new Date(),
        //   }
        // ];
      }
      console.log("newMessages", newMessages);
      setMessages(newMessages);
    });
    } catch (error) {
      console.log("error from getChatFromDb: ", error);
      
    }
  },[userId,document]);

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Optimistic update
      const userMessage: Message = {
        id: ID.unique(),
        role: 'user',
        content,
        $createdAt: new Date()
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
        toast({
          title: "Something went wrong",
          description: "Please try again later.",
          // action: (
          //   <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
          // ),
        })
        throw new Error('Failed to get response');
      }

      const aiResponse = await response.json();
      
      // Add AI response to messages
      setMessages(prev => [...prev, {
        id: ID.unique(),
        role: 'model',
        content: aiResponse.message,
        $createdAt: new Date()
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // In case the user signs out while on the page.
  if (!isLoaded || !userId) {
    return null
  }

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
