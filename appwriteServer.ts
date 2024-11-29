import { Query } from "appwrite";
import { Client, Databases, Storage, ID, Models } from "node-appwrite";
import { InputFile } from "node-appwrite/file";



// Helper function to assert that environment variables are defined
function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is undefined`);
  }
  return value;
}

const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const endPointUrl = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const usersCollectionId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;
const documentsCollectionId =
  process.env.NEXT_PUBLIC_APPWRITE_DOCUMENTS_COLLECTION_ID;
const chatsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_CHATS_COLLECTION_ID;

const storageId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID;

console.log("Environment variables loaded:", {
  projectId,
  endPointUrl,
  databaseId,
  usersCollectionId,
  documentsCollectionId,
  storageId,
});

console.log(
  typeof projectId,
  typeof endPointUrl,
  typeof databaseId,
  typeof usersCollectionId,
  typeof documentsCollectionId,
  typeof storageId
);

class ServiceServer {
  // let client, projectId, endPointUrl;
  client = new Client();
  databases;
  bucket;
  constructor() {
    this.client
      .setEndpoint(endPointUrl as string)
      .setProject(projectId as string);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  //   services will go here
  async addNewUserToDb(userId: string) {
    try {
      const res = await this.databases.createDocument(
        databaseId as string,
        usersCollectionId as string,
        ID.unique(),
        { userId }
      );
      return res;
    } catch (error) {
      console.error("Error in addNewUserToDb:", error);
    }
  }

  async addNewDocumentToDb({
    documentId,
    documentUrl,
    userId,
  }: {
    documentId: string;
    documentUrl: string;
    userId: string;
  }) {
    try {
      const res = await this.databases.createDocument(
        databaseId as string,
        documentsCollectionId as string,
        ID.unique(),
        {
          userId,
          documentId,
          documentUrl,
        }
      );
      return res;
    } catch (error) {
      console.error("Error in addNewDocumentToDb:", error);
    }
  }

  async getDocumentsById(id: string) {
    const queries = [Query.equal("documentId", id)];
    try {
      const res = await this.databases.listDocuments(
        databaseId as string,
        documentsCollectionId as string,
        queries as string[]
      );
      console.log("getDocumentsById res: ", res);
      return res;
    } catch (error) {
      console.error("Error in addNewDocumentToDb:", error);
    }
  }

  async addNewChatToDB({
    role,
    message,
    userId,
    documentId,
  }: {
    role: string;
    message: string;
    userId: string;
    documentId: string;
  }) {
    try {
      const res = await this.databases.createDocument(
        databaseId as string,
        chatsCollectionId as string,
        ID.unique(),
        {
          userId,
          role,
          message,
          documentId,
        }
      );
      console.log("res for addNechatToDb: ", res);
      return res;
    } catch (error) {
      console.log("Error from: ", error);
    }
  }
  async getChatFromDb(queries: string[]) {
    console.log("called getChatFromDb");

    try {
      const res = await this.databases.listDocuments(
        databaseId as string,
        chatsCollectionId as string,
        queries as string[]
      );
      console.log("getChatFromDb res: ", res);
      return res;
    } catch (error) {
      console.log("error from getChatFromDb: ", error);
    }
  }
// In your appwriteServer.ts or similar file
async addNewPdfToBucket(file: File) {
  const uniqueId = ID.unique();

  try {
    console.log("Starting file upload to bucket...", {
      storageId,
      uniqueId,
      fileName: file.name
    });

    // Convert File to Blob first
    const blob = new Blob([await file.arrayBuffer()], { type: file.type });

    // Use InputFile.fromBlob method
    const inputFile = InputFile.fromBuffer(blob, file.name);

    const res = await this.bucket.createFile(
      storageId as string,
      uniqueId as string,
      inputFile
    );

    console.log("File uploaded successfully:", res);
    return res;
  } catch (error) {
    console.error("Detailed Error in addNewPdfToBucket:", error);
    throw error;
  }
}


  // write a function to get a file from th bucket if the id is provided
  async getPdfFromBucketById(fileId: string) {
    try {
      const res = await this.bucket.getFile(storageId as string, fileId as string);
      console.log("✅ File retrieved successfully:", res);
      return res;
    } catch (error) {
      console.error("Error in getFileFromBucket:", error);
      throw error;
    }
  }

  // write a function to get a file from th bucket if the id is provided
  async getPdfDownloadFromBucketById(fileId: string) {
    try {
      const res = await this.bucket.getFileDownload(storageId as string, fileId as string);
      console.log("✅ File retrieved successfully:", res);
      return res;
    } catch (error) {
      console.error("Error in getFileFromBucket:", error);
      throw error;
    }
  }
}

const serviceServer = new ServiceServer();
export default serviceServer;
