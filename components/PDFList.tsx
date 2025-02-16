'use client';

import { PDFDocument } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { FileText, MessageSquare, Trash2 } from 'lucide-react';
import Link from 'next/link';
// import axios from 'axios';

interface PDFListProps {
  documents: PDFDocument[];
}

export default function PDFList({ documents }: PDFListProps) {

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/delete`, {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("response: ", response);
      
      window.location.reload();
    } catch (error) {
      console.error("Error in handleDelete:", error);
    }
  };
  if (!documents || documents.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No documents uploaded yet. Upload your first PDF to get started!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => {
        console.log("doc: ", doc);

        return (
          <div
            key={doc.$id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="font-medium text-gray-900 truncate max-w-[200px]">
                    {doc.fileName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(doc.$createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <div>
                {/* delete icon */}
                <Trash2
                  onClick={() => handleDelete(doc.documentId)}
                  className="h-4 w-4 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                />
              </div>
              <Link
                href={`/chat/${doc.documentId}`}
                className="flex items-center space-x-2 text-sm text-blue-500 hover:text-blue-700 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Chat with PDF</span>
              </Link>
            </div>
          </div>)
      })}
    </div>
  );
}
