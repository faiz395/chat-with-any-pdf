import React from 'react';
import { redirect } from 'next/navigation';
import serviceServer from '@/appwriteServer';
import { auth } from "@clerk/nextjs/server";
import { PDFDocument } from '@/types';
import DashboardClient from '@/components/DashboardClient';

export default async function Page() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }
  const documents = await serviceServer.getUserDocuments(userId);
  // @ts-ignore
  const doc: PDFDocument[] = documents.map((doc: any) => ({
    $id: doc.$id,
    documentId: doc.documentId,
    fileName: doc.fileName,
    documentUrl: doc.documentUrl,
    userId: doc.userId,
    $createdAt: doc.$createdAt,
  }));
  return <DashboardClient documents={doc} />;
}