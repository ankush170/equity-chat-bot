"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AttachmentModal from "./AttachmentModal";
import { Thread } from "../app/dashboard/page";
import { Search, Paperclip, Mic, Send, Globe } from 'lucide-react';

interface ChatInputProps {
  thread: Thread;
}

export default function ChatInput({ thread }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setInput("");
  };

  const toggleWebSearch = () => {
    setWebSearchEnabled(!webSearchEnabled);
  };

  return (
    <div className="bg-[#FDF6ED]/50 backdrop-blur-sm p-5 relative z-[10]">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <motion.button 
          whileHover={{ scale: 1.05, backgroundColor: webSearchEnabled ? "#F7D8CE" : "" }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleWebSearch}
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
            webSearchEnabled 
              ? "bg-[#F7D8CE] text-[#D15F40]" 
              : "text-[#6E6963] hover:text-[#D15F40] hover:bg-[#F7D8CE]"
          }`}
        >
          <Globe size={22} />
          <AnimatePresence>
            {webSearchEnabled && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden ml-2 text-sm font-medium"
              >
                Web Search
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAttachmentModal(true)}
          className="p-2.5 text-[#6E6963] hover:text-[#D15F40] hover:bg-[#F7D8CE] rounded-xl transition-all"
        >
          <Paperclip size={22} />
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 text-[#6E6963] hover:text-[#D15F40] hover:bg-[#F7D8CE] rounded-xl transition-all"
        >
          <Mic size={22} />
        </motion.button>

        <form onSubmit={handleSend} className="flex-1 flex gap-2">
          <motion.div 
            initial={false}
            animate={webSearchEnabled ? { boxShadow: "none" } : { boxShadow: "none" }}
            className="flex-1 relative"
          >
            <input 
              type="text" 
              placeholder={webSearchEnabled ? "Search the web for financial data..." : "Ask anything about finance..."} 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-5 py-3.5 bg-[#FFFBF5] text-[#2D2A28] rounded-xl border border-[#DCD2C7] focus:border-[#D15F40] focus:ring-2 focus:ring-[#F7D8CE] transition-all outline-none shadow-sm text-base"
            />
            {webSearchEnabled && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="bg-[#F7D8CE] text-[#D15F40] text-xs font-semibold py-1 px-2 rounded-full">WEB</span>
              </div>
            )}
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="p-3.5 bg-[#D15F40] text-white rounded-xl shadow-lg shadow-[#D15F40]/20 hover:shadow-xl hover:bg-[#B54A32] hover:shadow-[#D15F40]/30 transition-all"
          >
            <Send size={22} />
          </motion.button>
        </form>

        <AnimatePresence>
          {showAttachmentModal && (
            <AttachmentModal onClose={() => setShowAttachmentModal(false)} />
          )}
        </AnimatePresence>
      </div>
      
      {webSearchEnabled && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="max-w-4xl mx-auto mt-2 text-sm text-[#6E6963] px-4"
        >
          <span className="flex items-center gap-1">
            <Globe size={14} className="text-[#D15F40]" />
            Web search enabled: Results will include real-time data from the internet
          </span>
        </motion.div>
      )}
    </div>
  );
} 