import FileUploader from '@/components/FileUploader'
import PDFList from '@/components/PDFList'
import PlaceholderDocument from '@/components/PlaceholderDocument'
import React from 'react'
import { redirect } from 'next/navigation'
import serviceServer from '@/appwriteServer';
import { auth } from "@clerk/nextjs/server";
import { PDFDocument } from '@/types'
import { Button } from '@/components/ui/button'


async function page() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }
  const documents = await serviceServer.getUserDocuments(userId);
  const doc: PDFDocument[]= documents.map((doc: any) => ({
    $id: doc.$id,
    documentId: doc.documentId,
    fileName: doc.fileName,
    documentUrl: doc.documentUrl,
    userId: doc.userId,
    $createdAt: doc.$createdAt,
  }))

  console.log("documents: ", documents);
  
  return (
    <>
      <div className="container mx-auto py-10 bg-indigo-50">
        <div className='my-10 flex flex-col justify-center items-center'>
        <FileUploader />
        </div>
      </div>
    </>
  )
}

export default page