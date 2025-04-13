"use client";

import { Thread } from "../app/dashboard/page";
import { motion } from "framer-motion";
import { Sparkles, LineChart, Database, Globe, FileText } from 'lucide-react';

interface ChatInterfaceProps {
  thread: Thread | null;
  onStartChat: () => void;
}

export default function ChatInterface({ thread, onStartChat }: ChatInterfaceProps) {
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl w-full">
          {/* Feature 1 */}
          <motion.div 
            whileHover={{ y: -8, boxShadow: "0 12px 30px rgba(209, 95, 64, 0.15)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#FFFBF5] p-6 rounded-xl border border-[#DCD2C7] shadow-lg flex flex-col items-center text-center"
          >
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="bg-[#F7D8CE] w-16 h-16 rounded-full flex items-center justify-center mb-4"
            >
              <LineChart size={32} className="text-[#D15F40]" />
            </motion.div>
            <h3 className="text-lg font-semibold text-[#2D2A28] mb-2">Financial Analysis</h3>
            <p className="text-[#6E6963]">Advanced algorithms for accurate market trend predictions</p>
          </motion.div>
          
          {/* Feature 2 */}
          <motion.div
            whileHover={{ y: -8, boxShadow: "0 12px 30px rgba(212, 162, 76, 0.15)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-[#FFFBF5] p-6 rounded-xl border border-[#DCD2C7] shadow-lg flex flex-col items-center text-center"
          >
            <motion.div 
              whileHover={{ rotate: -15, scale: 1.1 }}
              className="bg-[#F7D8CE] w-16 h-16 rounded-full flex items-center justify-center mb-4"
            >
              <Database size={32} className="text-[#D15F40]" />
            </motion.div>
            <h3 className="text-lg font-semibold text-[#2D2A28] mb-2">Research Database</h3>
            <p className="text-[#6E6963]">Access comprehensive financial research and reports</p>
          </motion.div>
          
          {/* Feature 3 */}
          <motion.div
            whileHover={{ y: -8, boxShadow: "0 12px 30px rgba(73, 154, 151, 0.15)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-[#FFFBF5] p-6 rounded-xl border border-[#DCD2C7] shadow-lg flex flex-col items-center text-center"
          >
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="bg-[#F7D8CE] w-16 h-16 rounded-full flex items-center justify-center mb-4"
            >
              <Globe size={32} className="text-[#D15F40]" />
            </motion.div>
            <h3 className="text-lg font-semibold text-[#2D2A28] mb-2">Real-time Insights</h3>
            <p className="text-[#6E6963]">Up-to-date market data and real-time analysis</p>
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

  return (
    <div className="space-y-8 p-6">
      {thread.messages.map((message) => (
        <motion.div 
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
        >
          <div className={`flex items-start gap-4 max-w-3xl ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <motion.div 
              whileHover={{ scale: 1.1, rotate: message.type === "user" ? -5 : 5 }}
              className={`w-8 h-8 rounded-full shadow-md overflow-hidden flex-shrink-0 ${message.type === "user" ? "bg-[#D15F40]/10" : "bg-[#499A97]/10"}`}
            >
              <img 
                src={message.type === "bot" 
                  ? `https://api.dicebear.com/6.x/bottts/svg?seed=assistant` 
                  : `https://api.dicebear.com/6.x/micah/svg?seed=user`}
                alt={message.type === "bot" ? "Assistant" : "User"}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="flex flex-col">
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className={`px-6 py-4 rounded-2xl shadow-md ${
                  message.type === "user" 
                    ? "bg-[#D15F40] text-white" 
                    : "bg-[#F0E5D8] text-[#2D2A28] border border-[#DCD2C7]"
                }`}
              >
                <p className="text-base font-medium">{message.text.split('[Citation:')[0].trim()}</p>
                <span className={`text-xs mt-2 block ${
                  message.type === "user" 
                    ? "text-blue-100" 
                    : "text-gray-500"
                }`}>
                  {message.timestamp}
                </span>
              </motion.div>
              
              {message.type === "bot" && message.text.includes('[Citation:') && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-2 ml-4 flex items-center gap-2 text-sm text-[#6E6963] bg-[#FFFBF5] px-3 py-1.5 rounded-lg border border-[#DCD2C7] shadow-sm max-w-fit"
                >
                  <FileText size={14} className="text-[#D4A24C]" />
                  <span>
                    {message.text.split('[Citation:')[1].replace(']', '')}
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 