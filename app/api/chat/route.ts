import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "@/types";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import pineconeClient from "@/lib/pinecone";
import { indexName } from "@/lib/langchain";
import { auth } from '@clerk/nextjs/server';
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

        const validRoles = ["user", "model", "function", "system"];

        // Format conversation history
        const formattedHistory = history
          .filter((msg: Message) => msg && msg.role && msg.content)
          .map((msg: Message) => {
            const role = validRoles.includes(msg.role) ? msg.role : "model";
            return {
              role,
              parts: [{ text: msg.content }],
            };
          });

        console.log("Formatted History:", formattedHistory);

        // Create vector store
        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
          pineconeIndex: index,
          namespace: documentId,
        });

        // Generate a standalone question
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt1 = `Given the user's current question and the previous chat history, generate a standalone question that incorporates relevant context from the chat history. This standalone question will be used for semantic searching; therefore, it must be self-contained and meaningful without requiring additional context. Remove any extraneous details. If the current question refers to previous discussions, integrate pertinent information from the chat history to form a comprehensive standalone question. Output only the standalone question without any additional commentary.

User's Current Question: ${message}
Chat History: ${JSON.stringify(formattedHistory)}
Standalone Question:`;

        const result1 = await model.generateContent(prompt1);
        const standaloneQuestion = result1.response.text().trim();

        console.log("Standalone Question:", standaloneQuestion);

        // Perform similarity search
        const vectorResults = await vectorStore.similaritySearch(standaloneQuestion, 5);
        const relevantContext = vectorResults.map(doc => doc.pageContent).join("\n");

        console.log("Relevant Context:", relevantContext);

        // Start chat with context and history
        const chat = model.startChat({
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7, // Dynamic temperature can be applied based on use case
          },
        });

        const prompt = `You are an AI assistant tasked with answering questions based on the provided PDF document context and chat history. Please adhere to the following guidelines:

1. **Contextual Accuracy**: Base your response solely on the information available in the 'context' and 'chat history' section. If the answer is not present in the context, clearly state, "The answer is not available in the provided context."

2. **Conciseness**: Provide brief and to-the-point answers.

3. **Chat History Awareness**: Utilize the 'Chat history' to maintain continuity and relevance in your responses. If the answer is not present in the context, try to infer from the chat history.

**Context**:
${relevantContext}

**Chat History**:
${JSON.stringify(formattedHistory)}

**Question**:
${message}`;

        const result = await chat.sendMessage(prompt);
        const responseText = await result.response.text();

        console.log("Generated Response:", responseText);

        // Save message to Appwrite
        await serviceServer.createMessage({
          role: 'user',
          message,
          userId,
          documentId,
        });

        const assistantMessage = await serviceServer.createMessage({
          role: 'model',
          message: responseText,
          $createdAt: new Date(),
          userId,
          documentId,
        });

        // Write the final response
        const finalResponse = JSON.stringify({
          message: responseText,
          messageId: assistantMessage.$id,
        });

        await writer.write(encoder.encode(finalResponse));
      } catch (error) {
        console.error("Streaming Error:", error);
        const errorResponse = JSON.stringify({
          error: "An error occurred while processing your message",
        });
        await writer.write(encoder.encode(errorResponse));
      } finally {
        try {
          await writer.close();
        } catch (closeError) {
          console.error("Error closing writer:", closeError);
        }
      }
    })();

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat message" }),
      { status: 500 }
    );
  }
}


// import { NextRequest } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { Message } from "@/types";
// import { PineconeStore } from "@langchain/pinecone";
// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import pineconeClient from "@/lib/pinecone";
// import { indexName } from "@/lib/langchain";
// import { auth, currentUser } from '@clerk/nextjs/server'
// import serviceServer from "@/appwriteServer";

// // Initialize Google Generative AI
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function POST(request: NextRequest) {
//   try {
//     const { userId } = await auth();
//     if (!userId) {
//       return new Response("Unauthorized", { status: 401 });
//     }

//     const { message, documentId, history } = await request.json();
//     console.log("Raw History:", history);
//     // Create a TransformStream for streaming the response
//     const encoder = new TextEncoder();
//     const stream = new TransformStream();
//     const writer = stream.writable.getWriter();

//     // Start processing in the background 
//     (async () => {
//       try {
//         // Initialize embeddings
//         const embeddings = new GoogleGenerativeAIEmbeddings({
//           apiKey: process.env.GEMINI_API_KEY!,
//           modelName: "models/embedding-001",
//         });

//         // Get Pinecone index
//         const index = pineconeClient.Index(indexName);

//         const validRoles = ["user", "model", "function", "system"];

//         // Format conversation history
//         const formattedHistory = history
//           .filter((msg: Message) => msg && msg.role && msg.content) // Filter out invalid messages
//           .map((msg: Message, index: number) => {
//             const role = validRoles.includes(msg.role) ? msg.role : "model"; // Fallback role
//             return {
//               role,
//               parts: [{ text: msg.content }],
//             };
//           });

//         console.log("Formatted History:", formattedHistory);
//         // Create vector store
//         const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
//           pineconeIndex: index,
//           namespace: documentId,
//         });

//         // create a standalone question from message passed by user
//         const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//         const prompt1 = `Given the user's current question and the previous chat history, generate a standalone question that incorporates relevant context from the chat history. This standalone question will be used for semantic searching; therefore, it must be self-contained and meaningful without requiring additional context. Remove any extraneous details. If the current question refers to previous discussions, integrate pertinent information from the chat history to form a comprehensive standalone question. Output only the standalone question without any additional commentary.
//         User's Current Question: ${message}
//         Chat History: ${formattedHistory}
//         Standalone Question: `;

//         const result1 = await model.generateContent(prompt1);
//         console.log("message: ", message);
//         console.log("standAloneQuestion: ", result1.response.text());
//         const standaloneQuestion = result1.response.text();

//         // Perform similarity search
//         const vectorResults = await vectorStore.similaritySearch(standaloneQuestion, 5);
//         const relevantContext = vectorResults.map(doc => doc.pageContent).join("\n\n");
//         console.log("relevantContext: ", relevantContext)

//         // Start chat
//         // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//         const chat = model.startChat({
//           // history: formattedHistory,
//           generationConfig: {
//             // maxOutputTokens: 1000,
//             temperature: 0.8,
//           },
//         });

//         // Construct prompt with context
//         const prompt = `You are an AI assistant tasked with answering questions based on the provided PDF document context and chat history. Please adhere to the following guidelines:

//         1. **Contextual Accuracy**: Base your response solely on the information available in the 'context' and 'chat history' section. If the answer is not present in the context, clearly state, "The answer is not available in the provided context."

//         2. **Conciseness**: Provide brief and to-the-point answers.

//         3. **Chat History Awareness**: Utilize the 'Chat history' to maintain continuity and relevance in your responses, if the answer is not present in the context try to use the chat history contents.

//         **Context**:
//         ${relevantContext}

//         **Chat History**:
//         ${formattedHistory}

//         **Question**:
//         ${message}`;


//         // Stream the response
//         const result = await chat.sendMessage(prompt);
//         const response = await result.response;
//         const text = response.text();

//         // Extract citations from the context
//         // const citations = vectorResults.map(doc => ({
//         //   pageNumber: doc.metadata?.page || 1,
//         //   text: doc.pageContent,
//         //   highlight: doc.pageContent.substring(0, 150) + "...",
//         // }));

//         // Save message to Appwrite
//         await serviceServer.createMessage({
//           role: 'user',
//           message,
//           // timestamp: new Date(),
//           userId,
//           documentId,
//         });

//         const assistantMessage = await serviceServer.createMessage({
//           role: 'model',
//           message: text,
//           $createdAt: new Date(),
//           userId,
//           documentId,
//           // citations,
//         });

//         // Write the final response
//         const finalResponse = JSON.stringify({
//           message: text,
//           messageId: assistantMessage.$id,
//           // citations,
//         });
//         // await writer.close();
//         console.log("🎉 Processing complete! finalResponse: ", finalResponse);

//         // return new Response(
//         //   JSON.stringify({ message: text })
//         //   // stream.readable
//         //   , {
//         //     headers: {
//         //       "Content-Type": "application/json",
//         //       "Cache-Control": "no-cache",
//         //       "Connection": "keep-alive",
//         //     },
//         //   });
//         await writer.write(encoder.encode(finalResponse));
//       } catch (error) {
//         console.error("Streaming Error:", error);
//         const errorResponse = JSON.stringify({
//           error: "An error occurred while processing your message",
//         });
//         await writer.write(encoder.encode(errorResponse));
//       } finally {
//         try {
//           await writer.close();
//         } catch (closeError) {
//           console.error("Error closing writer:", closeError);
//         }
//       }
//     })();
//     console.log(" sending response");

//     return new Response(stream.readable, {
//       headers: {
//         "Content-Type": "text/event-stream",
//         "Cache-Control": "no-cache",
//         "Connection": "keep-alive",
//       },
//     });
//   } catch (error: any) {
//     console.error("Chat API Error:", error);
//     return new Response(
//       JSON.stringify({ error: "Failed to process chat message" }),
//       { status: 500 }
//     );
//   }
// }
