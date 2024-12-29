import { NextResponse } from 'next/server';
import { pineconeIndex } from '@/lib/pinecone';

export async function GET() {
    try {
        // Test vector insertion
        const testVector = {
            id: 'test-vector',
            values: Array(768).fill(0.1), // Create a test vector of 768 dimensions
            metadata: { test: true }
        };

        // Get index stats before insertion
        const beforeStats = await pineconeIndex.describeIndexStats();
        console.log('Index stats before insertion:', beforeStats);

        // Insert test vector
        await pineconeIndex.upsert([testVector]);
        console.log('Test vector inserted successfully');

        // Query the vector to verify insertion
        const queryResponse = await pineconeIndex.query({
            vector: Array(768).fill(0.1),
            topK: 1,
            includeMetadata: true
        });
        console.log('Query response:', queryResponse);

        // Clean up test vector
        await pineconeIndex.deleteOne('test-vector');
        console.log('Test vector cleaned up');

        return NextResponse.json({ 
            success: true, 
            message: 'Pinecone connection test successful',
            stats: beforeStats,
            queryResponse
        });
    } catch (error) {
        console.error('Pinecone connection test failed:', error);
        return NextResponse.json({ 
            success: false, 
            message: error, 
        }, { status: 500 });
    }
}