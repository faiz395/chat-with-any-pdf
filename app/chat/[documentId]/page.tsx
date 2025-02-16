import ChatContainer from '@/components/chat/ChatContainer';
// import { auth } from '@clerk/nextjs';
import { auth } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import serviceServer from '@/appwriteServer';
import { PDFDocument } from '@/types';

interface ChatPageProps {
  params: {
    documentId: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  try {
    // Fetch document details
    const documents = await serviceServer.getUserDocuments(userId);
    const document = documents.find(doc => doc.documentId === params.documentId);
    
    if (!document) {
      redirect('/dashboard');
    }

    const doc: PDFDocument = {
      $id: document.$id,
      documentId: document.documentId,
      fileName: document.fileName,
      documentUrl: document.documentUrl,
      userId: document.userId,
      $createdAt: new Date(document.$createdAt),
    };

    return (
      <div className="h-screen">
        <ChatContainer document={doc} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching document:", error);
    redirect('/dashboard');
  }
}
