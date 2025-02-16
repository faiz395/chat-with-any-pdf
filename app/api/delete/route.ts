import { NextRequest } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { delteComplteNameSpaceById } from "@/lib/pinecone";
import serviceServer from "@/appwriteServer";

export async function DELETE(request: NextRequest) {
    // Auth check
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    // 1. take id from the body
    const { id } = await request.json();
    console.log("id: ", id);
    
    // 2. delete the document from the vector store
    const res = await delteComplteNameSpaceById(id);
    if (!res || !id) {
      return new Response("Failed to delete namespace", { status: 500 });
    }
    const deletedFromStorage = await serviceServer.deletePdfFromBucketById(id);
    if (!deletedFromStorage) {
      return new Response("Failed to delete document from storage", { status: 500 });
    }
    console.log("deletedFromStorage: ", deletedFromStorage);

    // 3. delete the document from the database
    console.log("trying to delete document from database");
    const deletedFromDB = await serviceServer.deleteDocumentFromDocumentsTableById(id);
    if (!deletedFromDB) {
      console.log("Failed to delete document from database");
      return new Response("Failed to delete document from database", { status: 500 });
    }
    console.log("deletedFromDB: ", deletedFromDB);

    // 4. delete all the chat messages related to the document
    console.log("trying to delete document from chats");
    const deletedFromChats = await serviceServer.deleteDocumentFromChatsTableById(id);
    if (!deletedFromChats) {
      return new Response("Failed to delete document from chats", { status: 500 });
    }
    console.log("deletedFromChats: ", deletedFromChats);

    // 5. return success message
    return new Response(JSON.stringify({ success: true, message: "Document deleted successfully" }), { status: 200 });
}