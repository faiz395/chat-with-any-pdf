import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import pineconeClient from "@/lib/pinecone";
import serviceClient from "@/appwriteClient";
import serviceServer from "@/appwriteServer";
import { ID } from "appwrite";

export async function POST(request: NextRequest) {
  console.log("🚀 Starting PDF processing...");
  try {
    const formData = await request.formData();
    const pdfId = formData.get('fileId') as string;
    // const { pdfId } = await request.json();
    console.log("📝 Received PDF ID:", pdfId);

    if (!pdfId) {
      console.error("❌ No PDF ID provided in request");
      return new NextResponse(JSON.stringify({ error: "No PDF ID provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("🔍 Fetching PDF from Appwrite...");
    const pdfFile = await serviceServer.getPdfDownloadFromBucketById(pdfId);
    // console.log("✅ PDF retrieved successfully:", pdfFile);

    if (!pdfFile) {
      console.error("❌ Failed to retrieve PDF from Appwrite");
      return new NextResponse(
        JSON.stringify({ error: "Failed to retrieve PDF" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    try {
      // Convert File to Buffer
      console.log("🔄 Converting file to buffer...");

      // const bytes = await pdfFile.arrayBuffer
      //   ? await pdfFile.arrayBuffer()
      //   : await (pdfFile as any).stream().getReader().read().then((r: any) => r.value);
      // const bytes = await (pdfFile as any).stream().getReader().read().then((r: any) => r.value);

      const buffer = Buffer.from(pdfFile);
      console.log("✅ Buffer created successfully:", {
        bufferSize: `${(buffer.length / 1024 / 1024).toFixed(2)}MB`,
      });

      // Create a Blob from the buffer
      console.log("🔄 Creating Blob from buffer...");
      const blob = new Blob([buffer], { type: "application/pdf" });
      console.log("✅ Blob created successfully:", {
        blobSize: `${(blob.size / 1024 / 1024).toFixed(2)}MB`,
      });

      // Use PDFLoader with blob
      console.log("📚 Loading PDF with LangChain PDFLoader...");
      const loader = new PDFLoader(blob);
      const pages = await loader.load();
      console.log("📄 PDF loaded successfully:", {
        pageCount: pages.length,
        firstPagePreview: pages[0]?.pageContent?.substring(0, 100) + "...",
      });

      // Split the text into chunks
      console.log("✂️ Splitting document into chunks...");
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const documents = await textSplitter.splitDocuments(pages);
      console.log("📑 Document splitting complete:", {
        totalChunks: documents.length,
        averageChunkSize:
          documents.reduce((acc, doc) => acc + doc.pageContent.length, 0) /
          documents.length,
        firstChunkPreview: documents[0]?.pageContent?.substring(0, 100) + "...",
      });

      // Initialize Google Generative AI embeddings
      console.log("🤖 Initializing Google Generative AI embeddings...");
      const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY!,
        modelName: "models/embedding-001",
      });
      console.log("✅ Embeddings model initialized");

      // Initialize Pinecone client
      console.log("🔄 Connecting to Pinecone...");
      const pinecone = pineconeClient;
      const pineconeIndex = pinecone.Index("chatwithpdf");
      console.log("✅ Pinecone connection established");

      // Store documents in Pinecone
      console.log("💾 Storing document chunks in Pinecone...");
      console.log("📊 Storage details:", {
        namespace: pdfId,
        chunksToStore: documents.length,
        indexName: "chatwithpdf",
      });

      await PineconeStore.fromDocuments(documents, embeddings, {
        pineconeIndex,
        namespace: pdfId,
      });
      console.log("✅ Documents successfully stored in Pinecone");

      console.log("🎉 Processing complete! Sending response...");
      return new NextResponse(
        JSON.stringify({
          success: true,
          pageCount: pages.length,
          chunkCount: documents.length,
          namespace: pdfId,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (processingError: any) {
      console.error("❌ PDF processing error:", {
        error: processingError.message,
        stack: processingError.stack,
        phase: processingError.phase || "unknown",
      });
      return new NextResponse(
        JSON.stringify({
          error: "Failed to process PDF",
          details: processingError.message,
        }),
        {
          status: 422,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: any) {
    console.error("❌ Request processing error:", {
      error: error.message,
      stack: error.stack,
    });
    return new NextResponse(
      JSON.stringify({
        error: "Failed to process request",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// export async function POST(request: NextRequest) {
//   console.log('🚀 Starting PDF upload and processing...');
//   try {
//     console.log('📝 Extracting form data from request...');
//     console.log("request.body: ", request);

//     // const {fileId} = await request.body;
//     // console.log("fileId provided: ", fileId);

//     const formData = await request.formData();
//     const file = formData.get('file') as File;
//     console.log('📄 File details:', {
//       name: file?.name,
//       type: file?.type,
//       size: file?.size ? `${(file.size / 1024 / 1024).toFixed(2)}MB` : 'N/A'
//     });

//     if (!file) {
//       console.error('❌ No file provided in request');
//       return new NextResponse(
//         JSON.stringify({ error: 'No file provided' }),
//         {
//           status: 400,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//     }

//     // try {
//     //   // Convert File to Buffer
//     //   console.log('🔄 Converting file to buffer...');
//     //   const bytes = await file.arrayBuffer();
//     //   const buffer = Buffer.from(bytes);
//     //   console.log('✅ Buffer created successfully:', {
//     //     bufferSize: `${(buffer.length / 1024 / 1024).toFixed(2)}MB`
//     //   });

//     //   // Create a Blob from the buffer
//     //   console.log('🔄 Creating Blob from buffer...');
//     //   const blob = new Blob([buffer], { type: 'application/pdf' });
//     //   console.log('✅ Blob created successfully:', {
//     //     blobSize: `${(blob.size / 1024 / 1024).toFixed(2)}MB`
//     //   });

//     //   // Use PDFLoader with blob
//     //   console.log('📚 Loading PDF with LangChain PDFLoader...');
//     //   const loader = new PDFLoader(blob);
//     //   const pages = await loader.load();
//     //   console.log('📄 PDF loaded successfully:', {
//     //     pageCount: pages.length,
//     //     firstPagePreview: pages[0]?.pageContent?.substring(0, 100) + '...'
//     //   });

//     //   // Split the text into chunks
//     //   console.log('✂️ Splitting document into chunks...');
//     //   const textSplitter = new RecursiveCharacterTextSplitter({
//     //     chunkSize: 1000,
//     //     chunkOverlap: 200,
//     //   });
//     //   const documents = await textSplitter.splitDocuments(pages);
//     //   console.log('📑 Document splitting complete:', {
//     //     totalChunks: documents.length,
//     //     averageChunkSize: documents.reduce((acc, doc) => acc + doc.pageContent.length, 0) / documents.length,
//     //     firstChunkPreview: documents[0]?.pageContent?.substring(0, 100) + '...'
//     //   });

//     //   // Initialize Google Generative AI embeddings
//     //   console.log('🤖 Initializing Google Generative AI embeddings...');
//     //   const embeddings = new GoogleGenerativeAIEmbeddings({
//     //     apiKey: process.env.GEMINI_API_KEY!,
//     //     modelName: "models/embedding-001",
//     //   });
//     //   console.log('✅ Embeddings model initialized');

//     //   // Initialize Pinecone client
//     //   console.log('🔄 Connecting to Pinecone...');
//     //   const pinecone = pineconeClient;
//     //   const pineconeIndex = pinecone.Index("chatwithpdf");
//     //   console.log('✅ Pinecone connection established');

//     //   // Store documents in Pinecone
//     //   console.log('💾 Storing document chunks in Pinecone...');
//     //   console.log('📊 Storage details:', {
//     //     namespace: file.name,
//     //     chunksToStore: documents.length,
//     //     indexName: "chatwithpdf"
//     //   });

//     //   await PineconeStore.fromDocuments(documents, embeddings, {
//     //     pineconeIndex,
//     //     namespace: file.name,
//     //   });
//     //   console.log('✅ Documents successfully stored in Pinecone');

//     //   console.log('🎉 Processing complete! Sending response...');
//     //   return new NextResponse(
//     //     JSON.stringify({
//     //       success: true,
//     //       pageCount: pages.length,
//     //       chunkCount: documents.length,
//     //       namespace: file.name,
//     //     }),
//     //     {
//     //       status: 200,
//     //       headers: { 'Content-Type': 'application/json' },
//     //     }
//     //   );
//     // } catch (processingError: any) {
//     //   console.error('❌ PDF processing error:', {
//     //     error: processingError.message,
//     //     stack: processingError.stack,
//     //     phase: processingError.phase || 'unknown'
//     //   });
//     //   return new NextResponse(
//     //     JSON.stringify({ error: 'Failed to process PDF', details: processingError.message }),
//     //     {
//     //       status: 422,
//     //       headers: { 'Content-Type': 'application/json' },
//     //     }
//     //   );
//     // }

//   } catch (error: any) {
//     console.error('❌ Request processing error:', {
//       error: error.message,
//       stack: error.stack
//     });
//     return new NextResponse(
//       JSON.stringify({ error: 'Failed to process request', details: error.message }),
//       {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   }
//   return new NextResponse(
//     JSON.stringify({
//       success: true,
//       pageCount: 2,
//       chunkCount: 2,
//       namespace: 'testApiRes',
//     }),
//     {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     }
//   );
// }

// export async function POST(request: NextRequest) {
//   console.log('🚀 Starting PDF upload and processing...');
//   try {
//     const formData = await request.formData();
//     const file = formData.get('file') as File;

//     if (!file) {
//       return NextResponse.json(
//         { error: 'No file provided' },
//         { status: 400 }
//       );
//     }

//     try {
//       // Upload to Appwrite
//       const uploadedFile = await serviceClient.addNewPdfToBucket(file);

//       if (!uploadedFile?.$id) {
//         throw new Error("Failed to upload file to bucket");
//       }

//       // Optional: Add additional processing here
//       // For example, extract text, create embeddings, etc.

//       return NextResponse.json({
//         success: true,
//         fileId: uploadedFile.$id,
//         fileName: file.name,
//         fileSize: file.size
//       }, { status: 200 });

//     } catch (error: any) {
//       console.error('Appwrite Upload Error:', error);
//       return NextResponse.json(
//         {
//           error: 'Failed to upload file to bucket',
//           details: error.message
//         },
//         { status: 500 }
//       );
//     }
//   } catch (error: any) {
//     console.error('Request Processing Error:', error);
//     return NextResponse.json(
//       { error: 'Failed to process request', details: error.message },
//       { status: 500 }
//     );
//   }
// }
