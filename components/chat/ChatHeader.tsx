'use client';

import { PDFDocument } from '@/types';
import { FileText, MoreVertical, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface ChatHeaderProps {
  document: PDFDocument;
  onTogglePdf: () => void;
  showPdfButton: boolean;
}

export default function ChatHeader({ document, onTogglePdf, showPdfButton }: ChatHeaderProps) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <FileText className="h-6 w-6 text-blue-500" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 truncate max-w-[200px]">
              {document.fileName}
            </h2>
            <p className="text-sm text-gray-500">
              Chat with your PDF
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {showPdfButton && (
            <button
              onClick={onTogglePdf}
              className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              View PDF
            </button>
          )}
          
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>

            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                <button
                  onClick={() => {
                    // Implement clear chat
                    setShowOptions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Clear Chat
                </button>
                <a
                  href={document.documentUrl}
                  download
                  className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Download PDF
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
