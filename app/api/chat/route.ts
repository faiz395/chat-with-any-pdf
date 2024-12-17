import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "@/types";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import pineconeClient from "@/lib/pinecone";
import { indexName } from "@/lib/langchain";
import { auth, currentUser } from '@clerk/nextjs/server'
import serviceServer from "@/appwriteServer";

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { message, documentId, history } = await request.json();
    console.log("Raw History:", history);
    // Create a TransformStream for streaming the response
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Start processing in the background
    (async () => {
      try {
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

        // Perform similarity search
        const vectorResults = await vectorStore.similaritySearch(message, 3);
        const relevantContext = vectorResults.map(doc => doc.pageContent).join("\n");
        
        const validRoles = ["user", "model", "function", "system"];
        // Format conversation history
        const formattedHistory = history.map((msg: Message) => {
          let role = msg.role;
          if (!validRoles.includes(role)) {
            role = "model"; // Default to "model" if the role is invalid
          }
          return {
            role,
            parts: [{ text: msg.content }],
          };
        });
        console.log("Formatted History:", formattedHistory);

        // Start chat
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const chat = model.startChat({
          history: formattedHistory,
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.8,
          },
        });

        // Construct prompt with context
        const prompt = `Based on the following context from the PDF document:

${relevantContext}

Answer the following question: ${message}

Please provide a clear and concise response based only on the information provided in the context. If the answer cannot be found in the context, please say so.`;

        // Stream the response
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract citations from the context
        // const citations = vectorResults.map(doc => ({
        //   pageNumber: doc.metadata?.page || 1,
        //   text: doc.pageContent,
        //   highlight: doc.pageContent.substring(0, 150) + "...",
        // }));

        // Save message to Appwrite
        await serviceServer.createMessage({
          role: 'user',
          message,
          // timestamp: new Date(),
          userId,
          documentId,
        });

        const assistantMessage = await serviceServer.createMessage({
          role: 'model',
          message: text,
          // timestamp: new Date(),
          userId,
          documentId,
          // citations,
        });

        // Write the final response
        const finalResponse = JSON.stringify({
          message: text,
          messageId: assistantMessage.$id,
          // citations,
        });

        await writer.write(encoder.encode(finalResponse));
      } catch (error) {
        console.error("Streaming Error:", error);
        const errorResponse = JSON.stringify({
          error: "An error occurred while processing your message",
        });
        await writer.write(encoder.encode(errorResponse));
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat message" }),
      { status: 500 }
    );
  }
}
