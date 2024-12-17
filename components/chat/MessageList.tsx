'use client';

import { Message } from '@/types';
import { useEffect, useRef, useState } from 'react';
import MessageItem from './MessageItem';
import { useVirtualizer } from '@tanstack/react-virtual';

interface MessageListProps {
  documentId: string;
}

export default function MessageList({ documentId }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const parentRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Virtual list configuration
  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimated height of each message
    overscan: 5, // Number of items to render outside of the visible area
  });

  useEffect(() => {
    // Load initial messages
    const loadMessages = async () => {
      try {
        // TODO: Implement message loading from Appwrite
        setLoading(false);
      } catch (error) {
        console.error('Error loading messages:', error);
        setLoading(false);
      }
    };

    loadMessages();
  }, [documentId]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 overflow-hidden flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-40"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={parentRef}
      className="flex-1 overflow-y-auto p-4"
      style={{
        height: '100%',
        width: '100%',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: virtualItem.size,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <MessageItem message={messages[virtualItem.index]} />
          </div>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
