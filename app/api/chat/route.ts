import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "@/types";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import pineconeClient from "@/lib/pinecone";
import { indexName } from "@/lib/langchain";

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { message, documentId, history } = await request.json();

    // Initialize embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY!,
      modelName: "models/embedding-001",
    });

    // Get Pinecone index
    const index = pineconeClient.Index(indexName);

    // Create vector store
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: documentId,
    });

    // Perform similarity search to get relevant context
    const vectorResults = await vectorStore.similaritySearch(message, 3);
    const relevantContext = vectorResults.map(doc => doc.pageContent).join("\n");

    // Format conversation history
    const formattedHistory = history.map((msg: Message) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    // Start chat
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Construct prompt with context
    const prompt = `Based on the following context from the PDF document:

${relevantContext}

Answer the following question: ${message}

Please provide a clear and concise response based only on the information provided in the context. If the answer cannot be found in the context, please say so.`;

    // Get response
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      message: text,
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
