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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {documents.map((doc) => (
        <div
          key={doc.$id}
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between min-h-[180px] group animate-fade-in-up"
        >
          <div className="flex items-center gap-4 mb-4">
            <FileText className="h-10 w-10 text-indigo-500 group-hover:text-indigo-700 transition-colors" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate max-w-[180px] text-lg">
                {doc.fileName}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatDistanceToNow(new Date(doc.$createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto pt-2">
            <button
              onClick={() => handleDelete(doc.documentId)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/40 transition-colors text-sm font-medium shadow-sm"
              title="Delete PDF"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
            <Link
              href={`/chat/${doc.documentId}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800/40 transition-colors text-sm font-medium shadow-sm"
              title="Chat with PDF"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Chat with PDF</span>
            </Link>
          </div>
        </div>
      ))}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in 0.8s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
    </div>
  );
}
