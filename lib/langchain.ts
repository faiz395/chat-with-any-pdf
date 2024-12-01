import serviceServer from "@/appwriteServer";
import { auth } from "@clerk/nextjs/server";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const indexName = "chatwithpdf";

export async function namespaceExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (namespace === null) throw new Error("No Namespace passed");

  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] !== undefined;
}

export async function generateDocs(pdfId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found!");
  }

  console.log("🔍 Fetching PDF from Appwrite...");

  if (!pdfId) {
    console.error("❌ No PDF ID provided in request");
  }

  try {
    const pdfFile = await serviceServer.getPdfDownloadFromBucketById(pdfId);
    if (!pdfFile) {
      console.error("❌ Failed to retrieve PDF from Appwrite");
    }
    console.log("🔄 Converting file to buffer...");
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

    return documents;
  } catch (error) {
    console.error("Error fetching PDF:", error);
    throw error;
  }
}
