import { Client, Account, Databases, Storage, ID } from "appwrite";

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

class ServiceClient {
  client = new Client();
  databases: Databases;
  bucket: Storage;

  constructor() {
    this.client
      .setEndpoint(endPointUrl as string)
      .setProject(projectId as string);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

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

  async getChatFromDb(queries : string[]){
    console.log("called getChatFromDb");
    
    try {
      const res = await this.databases.listDocuments(databaseId as string, chatsCollectionId as string, queries as string[]);
      console.log("getChatFromDb res: ",res);
      return res;   
    } catch (error) {
      console.log("error from getChatFromDb: ", error); 
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

  async addNewPdfToBucket(file: File) {
    const uniqueId = ID.unique();
    // const formData = new FormData();
    // formData.append("file", file); // Add the file to form data
    // console.log("fordataL ", formData);
    // console.log("type of formData: ", typeof formData);

    try {
      console.log("uniqueId: ", uniqueId);
      console.log("file: ", file);

      const res = await this.bucket.createFile(
        storageId as string,
        uniqueId as string,
        file
      );

      console.log("File uploaded successfully:", res);
      return res;
    } catch (error) {
      console.error("Error in addNewPdfToBucket:", error);
    }
  }
}

const serviceClient = new ServiceClient();
export default serviceClient;
