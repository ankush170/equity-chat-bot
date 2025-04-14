"use client";

import { useEffect, useRef } from 'react';
import { Thread, StreamMessage } from "../types/thread";
import { motion } from "framer-motion";
import { Sparkles, LineChart, Database, Globe, FileText, Search, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useAuth } from '../contexts/AuthContext';
interface ChatInterfaceProps {
  thread: Thread | null;
  onStartChat: () => void;
  streamingMessage?: StreamMessage;
}

interface CodeProps extends React.HTMLProps<HTMLElement> {
  inline?: boolean;
}

export default function ChatInterface({ thread, onStartChat, streamingMessage }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [thread?.messages, streamingMessage]);

  if (!thread) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-full flex flex-col items-center justify-center p-8 bg-[#FDF6ED]/50 backdrop-blur-sm text-center"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Sparkles size={56} className="text-[#D4A24C]" />
        </motion.div>
        <h1 className="text-4xl font-bold text-[#2D2A28] mb-6">
          Welcome to Equity Research AI
        </h1>
        <p className="text-xl text-[#6E6963] max-w-2xl mb-12">
          Leverage advanced AI for comprehensive financial analysis, real-time market insights, and data-driven investment decisions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {/* Financial Analysis Card */}
          <motion.div 
            whileHover={{ y: -5, boxShadow: "0 12px 30px rgba(209, 95, 64, 0.15)" }}
            className="bg-[#FFFBF5] p-8 rounded-2xl border border-[#DCD2C7] shadow-lg flex flex-col items-center text-center"
          >
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="bg-[#F7D8CE] w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
            >
              <LineChart className="text-[#D15F40]" size={32} />
            </motion.div>
            <h3 className="text-xl font-semibold text-[#2D2A28] mb-3">Financial Analysis & Research</h3>
            <p className="text-[#6E6963] leading-relaxed">
              Expert financial advisory and equity research assistance. Get detailed insights on companies, markets, and investment opportunities with comprehensive analysis.
            </p>
          </motion.div>

          {/* Market Intelligence Card */}
          <motion.div 
            whileHover={{ y: -5, boxShadow: "0 12px 30px rgba(209, 95, 64, 0.15)" }}
            className="bg-[#FFFBF5] p-8 rounded-2xl border border-[#DCD2C7] shadow-lg flex flex-col items-center text-center"
          >
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="bg-[#F7D8CE] w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
            >
              <Search className="text-[#D15F40]" size={32} />
            </motion.div>
            <h3 className="text-xl font-semibold text-[#2D2A28] mb-3">Real-Time Market Intelligence</h3>
            <p className="text-[#6E6963] leading-relaxed">
              Access latest market data through web search with verified citations. Stay updated with real-time financial news, trends, and market movements.
            </p>
          </motion.div>

          {/* Smart Tools Card */}
          <motion.div 
            whileHover={{ y: -5, boxShadow: "0 12px 30px rgba(209, 95, 64, 0.15)" }}
            className="bg-[#FFFBF5] p-8 rounded-2xl border border-[#DCD2C7] shadow-lg flex flex-col items-center text-center"
          >
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="bg-[#F7D8CE] w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
            >
              <MessageSquare className="text-[#D15F40]" size={32} />
            </motion.div>
            <h3 className="text-xl font-semibold text-[#2D2A28] mb-3">Smart Interaction Tools</h3>
            <p className="text-[#6E6963] leading-relaxed">
              Seamlessly interact through voice commands and document analysis. Upload financial documents for instant insights or use voice chat for quick market queries.
            </p>
          </motion.div>
        </div>
        
        <motion.button 
          onClick={onStartChat}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bg-[#D15F40] px-10 py-4 rounded-lg text-white text-lg font-medium shadow-lg shadow-[#D15F40]/20 hover:shadow-xl hover:bg-[#B54A32] hover:shadow-[#D15F40]/30 transition-all"
        >
          Start Analysis
        </motion.button>
      </motion.div>
    );
  }

  const allMessages = [
    ...(thread?.messages || []),
    ...(streamingMessage ? [streamingMessage] : [])
  ];

  return (
    <div className="space-y-8 p-6">
      {allMessages.map((message) => (
        <motion.div 
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* User Query */}
          <motion.div className="flex justify-end">
            <div className="flex items-start gap-4 max-w-3xl flex-row-reverse">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="w-8 h-8 rounded-full shadow-md overflow-hidden flex-shrink-0 bg-[#D15F40]/10"
              >
                <img 
                  src={`https://api.dicebear.com/6.x/micah/svg?seed=${user?.email || 'guest'}`}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="bg-[#D15F40] text-white px-6 py-4 rounded-2xl shadow-md"
              >
                <p className="text-base font-medium">{message.user_query}</p>
                <span className="text-xs mt-2 block text-white/70">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Agent Response */}
          <motion.div className="flex justify-start">
            <div className="flex items-start gap-4 max-w-3xl">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-8 h-8 rounded-full shadow-md overflow-hidden flex-shrink-0 bg-[#499A97]/10"
              >
                <img 
                  src={`https://api.dicebear.com/6.x/bottts/svg?`}
                  alt="Assistant"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="bg-[#F0E5D8] text-[#2D2A28] px-6 py-4 rounded-2xl shadow-md border border-[#DCD2C7]"
              >
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      p: ({node, ...props}) => <p className="text-base mb-4 last:mb-0" {...props} />,
                      a: ({node, ...props}) => <a className="text-[#D15F40] hover:text-[#B54A32]" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-4" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-4" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />,
                      table: ({node, ...props}) => (
                        <div className="overflow-x-auto mb-4">
                          <table className="min-w-full border-collapse border border-[#DCD2C7] rounded-lg" {...props} />
                        </div>
                      ),
                      thead: ({node, ...props}) => <thead className="bg-[#F7D8CE]" {...props} />,
                      th: ({node, ...props}) => (
                        <th className="border border-[#DCD2C7] px-4 py-2 text-left text-[#2D2A28] font-semibold" {...props} />
                      ),
                      td: ({node, ...props}) => (
                        <td className="border border-[#DCD2C7] px-4 py-2 text-[#6E6963]" {...props} />
                      ),
                      tr: ({node, ...props}) => (
                        <tr className="hover:bg-[#FFFBF5] transition-colors" {...props} />
                      ),
                      br: ({node, ...props}) => <br className="mb-2" {...props} />,
                      hr: ({node, ...props}) => (
                        <hr className="my-4 border-t border-[#DCD2C7]" {...props} />
                      ),
                      code: ({inline, ...props}: CodeProps) => (
                        inline 
                          ? <code className="bg-[#FFFBF5] px-1 py-0.5 rounded text-sm font-mono" {...props} />
                          : <code className="block bg-[#FFFBF5] p-4 rounded-lg text-sm font-mono mb-4" {...props} />
                      ),
                      pre: ({node, ...props}) => <pre className="bg-transparent p-0" {...props} />,
                    }}
                  >
                    {message.agent_response}
                  </ReactMarkdown>
                </div>
                {/* Only show timestamp if message is not a streaming message */}
                {!('isStreaming' in message && message.isStreaming) && (
                  <span className="text-xs mt-2 block text-[#6E6963]">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
} 