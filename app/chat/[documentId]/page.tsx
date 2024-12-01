import ChatContainer from '@/components/chat/ChatContainer';
// import { auth } from '@clerk/nextjs';
import { auth } from "@clerk/nextjs/server";

import { redirect } from 'next/navigation';
import serviceServer from '@/appwriteServer';

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

    return (
      <div className="h-screen">
        <ChatContainer document={document} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching document:", error);
    redirect('/dashboard');
  }
}
