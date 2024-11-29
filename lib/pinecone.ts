import { Pinecone } from '@pinecone-database/pinecone';

const PINECONE_INDEX_NAME = "chatwithpdf";

if (!process.env.PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is not set");
}

const pineconeClient = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

export const pineconeIndex = pineconeClient.index(PINECONE_INDEX_NAME);

export default pineconeClient;