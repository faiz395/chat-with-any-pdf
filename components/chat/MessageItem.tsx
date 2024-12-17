'use client';

import { Message, Reaction } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Copy, ThumbsUp, MessageCircle, Bookmark } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MessageItemProps {
  message: Message;
  onReply?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

const REACTION_EMOJIS = ['👍', '❤️', '🎯', '👏', '🤔'];

export default function MessageItem({ message, onReply, onReact }: MessageItemProps) {
  const [copied, setCopied] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReaction = (emoji: string) => {
    onReact?.(message.id, emoji);
    setShowReactions(false);
  };

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4 group`}>
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          message.role === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        {/* Message Content */}
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.citations.map((citation, index) => (
              <div
                key={index}
                className="text-sm bg-white/10 rounded p-2 cursor-pointer hover:bg-white/20"
                onClick={() => {
                  // TODO: Implement scroll to page in PDF viewer
                }}
              >
                <div className="font-medium">Page {citation.pageNumber}</div>
                <div className="text-sm opacity-80">{citation.highlight}</div>
              </div>
            ))}
          </div>
        )}

        {/* Message Actions */}
        <div className="mt-2 flex items-center justify-between text-sm">
          <div className="text-xs opacity-70">
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </div>
          
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className={`p-1 rounded hover:bg-white/10 transition-colors ${
                message.role === 'user' ? 'text-white' : 'text-gray-500'
              }`}
              title={copied ? 'Copied!' : 'Copy message'}
            >
              <Copy size={14} />
            </button>
            
            <button
              onClick={() => onReply?.(message.id)}
              className={`p-1 rounded hover:bg-white/10 transition-colors ${
                message.role === 'user' ? 'text-white' : 'text-gray-500'
              }`}
            >
              <MessageCircle size={14} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowReactions(!showReactions)}
                className={`p-1 rounded hover:bg-white/10 transition-colors ${
                  message.role === 'user' ? 'text-white' : 'text-gray-500'
                }`}
              >
                <ThumbsUp size={14} />
              </button>

              {showReactions && (
                <div className="absolute bottom-full mb-2 p-1 bg-white rounded-full shadow-lg flex space-x-1">
                  {REACTION_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reactions Display */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {message.reactions.map((reaction, index) => (
              <div
                key={index}
                className={`text-xs px-2 py-1 rounded-full ${
                  message.role === 'user'
                    ? 'bg-white/10 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {reaction.emoji} {reaction.count}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
