// import FileUploader from '@/components/FileUploader'
import PDFList from '@/components/PDFList'
// import PlaceholderDocument from '@/components/PlaceholderDocument'
import React from 'react'
import { redirect } from 'next/navigation'
import serviceServer from '@/appwriteServer';
import { auth } from "@clerk/nextjs/server";
import { PDFDocument } from '@/types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'


async function page() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }
  const documents = await serviceServer.getUserDocuments(userId);
  console.log("documents: ", documents);
  // @ts-ignore
  const doc: PDFDocument[]= documents.map((doc: any) => ({
    $id: doc.$id,
    documentId: doc.documentId,
    fileName: doc.fileName,
    documentUrl: doc.documentUrl,
    userId: doc.userId,
    $createdAt: doc.$createdAt,
  }))

  // console.log("documents: ", documents);
  
  return (
    <>
      <div className="container mx-auto py-10 bg-indigo-50">
        
        <div className='my-10 flex flex-col justify-center items-center'>
        <h1 className="text-2xl font-bold mb-6">Upload Your PDF</h1>
        <Link href="/dashboard/upload">
          <Button>+</Button>
        </Link>
        </div>
      </div>
    <div className='bg-indigo-50 flex justify-center items-center h-full max-w-7xl mx-auto my-5 py-6'>
      <div className=" max-w-4xl text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white sm:text-xl lg:text-2xl">
          My Documents
        </h3>
        <div className='my-10 flex justify-center items-center'>
          {/* <PlaceholderDocument /> */}
          <PDFList documents={doc}/>
          
        </div>
      </div>
    </div>
    </>
  )
}

export default page