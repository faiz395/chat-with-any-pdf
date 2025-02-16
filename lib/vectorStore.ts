import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import pineconeClient from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import serviceServer from "@/appwriteServer";
// import { Query } from "appwrite";

/**
 * Processes a PDF file and generates embeddings stored in Pinecone
 * @param pdfBlob - The PDF file as a Blob
 * @param docId - Document ID from Appwrite database
 * @returns Object containing number of chunks and vectors created
 */
export async function generateEmbeddingsInPineconeVectorStore(
    docId: string
) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not found!");
    }
    // 1. Load and parse PDF

    console.log('📚 Loading PDF document...');
    // @ts-ignore
    let response = await serviceServer.getPdfDownloadFromBucketById(docId);

    console.log("ref: ", response);

    const buffer = Buffer.from(response);
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
    console.log(`📄 Loaded ${pages.length} pages`);

    // 2. Split text into chunks
    console.log('✂️ Splitting document into chunks...');
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const chunks = await textSplitter.splitDocuments(pages);
    console.log(`📑 Created ${chunks.length} chunks`);

    // 3. Generate embeddings and store in Pinecone
    console.log('🧠 Initializing embeddings model...');
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY!,
        modelName: "models/embedding-001",
    });

    // 4. Store in Pinecone
    console.log('💾 Storing vectors in Pinecone...');
    const pinecone = pineconeClient;
    const pineconeIndex = pinecone.Index("chatwithpdf");

    await PineconeStore.fromDocuments(chunks, embeddings, {
        pineconeIndex,
        namespace: docId, // Using docId as namespace for easy retrieval
    });

    return {
        chunks: chunks.length,
        vectors: chunks.length, // Each chunk creates one vector
    };
}


export async function generateDocs(docId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not found!");
    }
    // 1. Load and parse PDF
    console.log('📚 Loading PDF document...');

    const ref = await serviceServer.getDocumentsById(docId);

    console.log("ref: ", ref?.documents[0].documentUrl);

    const downloadUrl = ref?.documents[0].documentUrl;

    if (!downloadUrl) throw new Error("Download url not found");

    console.log("download URL fetched successfully" + downloadUrl + ".....");

    try {
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error('Failed to fetch PDF');

        const buffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        const blob = new Blob([uint8Array], { type: 'application/pdf' });

        console.log(`loading pdf documents....`);
        const loader = new PDFLoader(blob);
        const docs = await loader.load();

        const pages = await loader.load();
        console.log(`📄 Loaded ${pages.length} pages`);

        // 2. Split text into chunks
        console.log('✂️ Splitting document into chunks...');
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const splitDocs = await textSplitter.splitDocuments(docs);
        console.log(`📑 Created ${splitDocs.length} chunks`);

        return splitDocs;
    } catch (error) {
        console.error("Error processing PDF:", error);
        throw error;
    }
}

/**
 * Queries the vector store for similar content
 * @param query - The search query
 * @param docId - Document ID to search within
 * @returns Array of similar document chunks
 */
export async function queryVectorStore(query: string, docId: string) {
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY!,
        modelName: "models/embedding-001",
    });

    const pinecone = pineconeClient;
    const pineconeIndex = pinecone.Index("chatwithpdf");

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
        namespace: docId,
    });

    const results = await vectorStore.similaritySearch(query, 4);
    return results;
}