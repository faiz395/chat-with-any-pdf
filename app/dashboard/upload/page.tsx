import FileUploader from '@/components/FileUploader'
// import PDFList from '@/components/PDFList'
// import PlaceholderDocument from '@/components/PlaceholderDocument'
import React from 'react'
import { redirect } from 'next/navigation'
import serviceServer from '@/appwriteServer';
import { auth } from "@clerk/nextjs/server";
import { PDFDocument } from '@/types'
// import { Button } from '@/components/ui/button'


async function page() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }
  const documents = await serviceServer.getUserDocuments(userId);
  // @ts-ignore
  const doc: PDFDocument[]= documents.map((doc: any) => ({
    $id: doc.$id,
    documentId: doc.documentId,
    fileName: doc.fileName,
    documentUrl: doc.documentUrl,
    userId: doc.userId,
    $createdAt: doc.$createdAt,
  }))
  console.log("doc: ", doc);
  
  console.log("documents: ", documents);
  
  return (
    <>
      <div className="container mx-auto bg-indigo-50">
        <FileUploader />
        {/* <div className='flex flex-col justify-center items-center'>
        </div> */}
      </div>
    </>
  )
}

export default page