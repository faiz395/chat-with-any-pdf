'use client';

import { Message } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-lg p-4 ${
        message.role === 'user' 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 text-gray-900'
      }`}>
        <div className="flex justify-between items-start gap-2">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>
              {message.content}
            </ReactMarkdown>
          </div>
          <button
            onClick={handleCopy}
            className={`text-xs p-1 rounded hover:bg-gray-200 transition-colors ${
              message.role === 'user' ? 'text-white' : 'text-gray-500'
            }`}
            title={copied ? 'Copied!' : 'Copy message'}
          >
            <Copy size={14} />
          </button>
        </div>
        <div className={`text-xs mt-2 ${
          message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </div>
      </div>
    </div>
  );
}
