import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "@/types";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "@/lib/pinecone";
import { indexName } from "@/lib/langchain";
import { auth } from '@clerk/nextjs/server';
import serviceServer from "@/appwriteServer";

// Initialize Google AI and embeddings
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
console.log(genAI);
const modelLLM = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GEMINI_API_KEY,
  // maxOutputTokens: 2048,
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY!,
  modelName: "models/embedding-001",
});

// Utility functions
const preprocessContext = (context: string) => {
  return context
    .replace(/\\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};
// @ts-ignore
const combineDocs = (docs: any[]) => {
  const combinedText = docs
    .map(doc => preprocessContext(doc.pageContent))
    .join("\n\n");
  console.log("Combined context:", combinedText);
  return combinedText;
};

const convertToLangChainMessages = (history: Message[]) => {
  return history
    .filter(msg => msg && msg.role && msg.content)
    .map(msg => {
      switch (msg.role) {
        // case 'system':
        //   return new SystemMessage(msg.content);
        case 'user':
          return new HumanMessage(msg.content);
        case 'model':
          return new AIMessage(msg.content);
        default:
          return new AIMessage(msg.content);
      }
    });
};

// Prompt templates
const STANDALONE_QUESTION_TEMPLATE = `Given the following conversation and a follow-up question, rephrase the follow-up question to be standalone.
Chat History: {history}
Follow Up Question: {userQuestion}
Standalone question:`;

const RESPONSE_TEMPLATE = `You are a helpful AI assistant analyzing documents and answering questions. Use the following context and chat history to provide accurate, relevant answers.

Context: {context}

Chat History: {history}

Human Question: {userQuestion}

Provide a clear, direct answer based on the context and history provided. If the information isn't in the context, say so politely.

Answer:`;

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Parse request
    const { message, documentId, history } = await request.json();
    console.log("Processing message:", message);

    // Setup streaming
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Process in background
    (async () => {
      try {
        // Initialize Pinecone
        const index = pineconeClient.Index(indexName);
        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
          pineconeIndex: index,
          namespace: documentId,
        });

        // Convert history to LangChain messages
        const langChainHistory = convertToLangChainMessages(history);
        
        // Setup chain components
        const standaloneQuestionPrompt = PromptTemplate.fromTemplate(STANDALONE_QUESTION_TEMPLATE);
        const responsePrompt = PromptTemplate.fromTemplate(RESPONSE_TEMPLATE);

        const questionChain = standaloneQuestionPrompt
          .pipe(modelLLM)
          .pipe(new StringOutputParser());

        const retrieverChain = RunnableSequence.from([
          prevResult => prevResult.question,
          async (question) => {
            const results = await vectorStore.similaritySearch(question, 10);
            return combineDocs(results);
          }
        ]);

        const responseChain = responsePrompt
          .pipe(modelLLM)
          .pipe(new StringOutputParser());

        // Main chain
        const chain = RunnableSequence.from([
          {
            question: ({ userQuestion, history }) =>
              questionChain.invoke({ userQuestion, history }),
            original_input: new RunnablePassthrough(),
          },
          {
            context: ({ question }) => retrieverChain.invoke({ question }),
            history: ({ original_input }) => original_input.history,
            userQuestion: ({ original_input }) => original_input.userQuestion,
          },
          ({ context, history, userQuestion }) =>
            responseChain.invoke({ context, history, userQuestion }),
        ]);

        // Generate response
        const response = await chain.invoke({
          userQuestion: message,
          history: langChainHistory,
        });

        console.log("Generated response:", response);

        // Save messages to Appwrite
        await serviceServer.createMessage({
          role: 'user',
          message,
          userId,
          documentId,
        });

        const assistantMessage = await serviceServer.createMessage({
          role: 'model',
          message: response,
          $createdAt: new Date(),
          userId,
          documentId,
        });

        // Send response
        const finalResponse = JSON.stringify({
          message: response,
          messageId: assistantMessage.$id,
        });

        await writer.write(encoder.encode(finalResponse));
      } catch (error) {
        console.error("Processing error:", error);
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
  } catch (error) {
    console.error("API error:", error);
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
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import pineconeClient from "@/lib/pinecone";
// import { indexName } from "@/lib/langchain";
// import { auth } from '@clerk/nextjs/server';
// import { StringOutputParser } from "@langchain/core/output_parsers";
// import serviceServer from "@/appwriteServer";
// import { PromptTemplate } from "@langchain/core/prompts";
// import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";


// // Initialize Google Generative AI
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// const modelLLM = new ChatGoogleGenerativeAI({
//   model: "gemini-pro",
//   // maxOutputTokens: 2048,
//   apiKey: process.env.GEMINI_API_KEY,
// });

// // Initialize embeddings
// const embeddings = new GoogleGenerativeAIEmbeddings({
//   apiKey: process.env.GEMINI_API_KEY!,
//   modelName: "models/embedding-001",
// });

// export async function POST(request: NextRequest) {
//   try {
//     const { userId } = await auth();
//     if (!userId) {
//       return new Response("Unauthorized", { status: 401 });
//     }

//     const { message, documentId, history } = await request.json();
//     // console.log("Raw History:", history);

//     // Create a TransformStream for streaming the response
//     const encoder = new TextEncoder();
//     const stream = new TransformStream();
//     const writer = stream.writable.getWriter();
//     // 
//     console.log("messagebeingpassed:", message);
//     // Start processing in the background
//     (async () => {
//       try {
//         // Get Pinecone index
//         const index = pineconeClient.Index(indexName);

//         const validRoles = ["user", "model", "function", "system"];

//         // Format conversation history
//         const formattedHistory = history
//           .filter((msg: Message) => msg && msg.role && msg.content)
//           .map((msg: Message) => {
//             const role = validRoles.includes(msg.role) ? msg.role : "model";
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


//         // start langchain prompts and templates here
//         const standaloneQuestionTemplate = `Given the user's current question and the previous chat history, generate a standalone question that incorporates relevant context from the chat history. This standalone question will be used for semantic searching; therefore, it must be self-contained and meaningful without requiring additional context. Remove any extraneous details. If the current question refers to previous discussions, integrate pertinent information from the chat history to form a comprehensive standalone question. Output only the standalone question without any additional commentary.
//         User's Current Question: {userQuestion}
//         Chat History: {history}
//         Standalone Question:`;

//         const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);

//         const standAloneQuestionChain = standaloneQuestionPrompt.pipe(modelLLM).pipe(new StringOutputParser());
      
//         // const retrieverNew = vectorStore.similaritySearch();
//         // const retrieverNew = vectorStore.asRetriever({
//         //   k: 3,  // Reduce number of results for more focused context
//         //   searchType: "similarity",  // Use similarity search
//         //   // minRelevanceScore: 0.7,  // Add minimum relevance threshold
//         // });
        
//         function preprocessContext(context: string) {
//           // Remove special characters and normalize spaces
//           return context
//             .replace(/\\n/g, ' ')  // Replace \n with space
//             .replace(/\s+/g, ' ')  // Normalize multiple spaces to single space
//             .trim();  // Remove leading/trailing spaces
//         }
    
//         // function combineDocs(docs: any[]) {
//         //   console.log("docs: ", docs);
//         //   return docs.map(doc => doc.pageContent).join(" \n\n\n");
//         // }

//         function combineDocs(docs: any[]) {
//           const combinedText = docs
//             .map(doc => preprocessContext(doc.pageContent))
//             .join("\n\n");
//           console.log("Processed context:", combinedText);
//           return combinedText;
//         }
    
//         const retrieverChain = RunnableSequence.from([
//           prevResult => prevResult.question,
//           (prevResult)=>vectorStore.similaritySearch(prevResult, 5),
//           // prevResult => console.log("prevResult: ", prevResult),
//           combineDocs
//         ])

//         const answerTemplate = `You are a friendly AI assistant chatbot tasked with answering questions based on the provided context and chat history. Use the guidelines below to formulate responses:

//         1. Base your response on the information available in 'context' and 'chat history.' If the exact answer isn't available, infer logically or provide a general explanation. context might contain contents text without any spaces and with some special characters, so please understand it properly and then answer it.

//         2. Be concise, friendly, and accurate.

//         Context:
//         {context}

//         Chat History:
//         {history}

//         Question:
//         {userQuestion}

//         Answer:`;

//         const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

//         const answerChain = answerPrompt.pipe(modelLLM).pipe(new StringOutputParser());

//         // const chain = standaloneQuestionPrompt.pipe(modelLLM).pipe(new StringOutputParser()).pipe(retrieverNew).pipe(answerPrompt);
//         const chain = RunnableSequence.from([
//           // Log initial input
//           prevResult => {
//             console.log("result 1", prevResult);
//             return prevResult; // Ensure input is passed forward
//           },
//           {
//             question: ({ userQuestion, history }) =>
//               standAloneQuestionChain.invoke({ userQuestion, history }),
//             original_input: new RunnablePassthrough(),
//           },
//           // Log after question generation
//           prevResult => {
//             console.log("result 2", prevResult);
//             return prevResult;
//           },
//           {
//             context: ({ question }) => 
//               retrieverChain.invoke({ question }), // Use question from prevResult
//             // context: async ({ question }) => {
//             //   const results = await retrieverChain.invoke({ question });
//             //   const processedContext = combineDocs(results);
//             //   console.log("Retrieved and processed context:", processedContext);
//             //   return processedContext;
//             // },
//             history: ({ original_input }) => original_input.history, // Maintain history
//           },
//           // Log before answering
//           prevResult => {
//             console.log("result 3", prevResult);
//             return prevResult;
//           },
//           ({ context, history, userQuestion }) =>
//             answerChain.invoke({ context, history, userQuestion }),
//           // Log after answering
//           prevResult => {
//             console.log("result 4", prevResult);
//             return prevResult;
//           },
//         ]);

//         const response = await chain.invoke({
//           userQuestion: message,
//           history: formattedHistory,
//         });

//         console.log("Response from langchain docs : ", response);

//         // Save message to Appwrite
//         await serviceServer.createMessage({
//           role: 'user',
//           message,
//           userId,
//           documentId,
//         });

//         const assistantMessage = await serviceServer.createMessage({
//           role: 'model',
//           message: response,
//           $createdAt: new Date(),
//           userId,
//           documentId,
//         });

//         // Write the final response
//         const finalResponse = JSON.stringify({
//           message: response,
//           messageId: assistantMessage.$id,
//         });

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

//     return new Response(stream.readable, {
//       headers: {
//         "Content-Type": "text/event-stream",
//         "Cache-Control": "no-cache",
//         "Connection": "keep-alive",
//       },
//     });
//   } catch (error) {
//     console.error("Chat API Error:", error);
//     return new Response(
//       JSON.stringify({ error: "Failed to process chat message" }),
//       { status: 500 }
//     );
//   }
// }