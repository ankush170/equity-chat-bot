"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import ChatInterface from "../../components/ChatInterface";
import ChatInput from "../../components/ChatInput";
import { motion } from "framer-motion";

export type Message = {
  id: number;
  type: "user" | "bot";
  text: string;
  timestamp: string;
};

export type Thread = {
  id: number;
  title: string;
  messages: Message[];
};

const dummyThread: Thread = {
  id: 1,
  title: "Dummy Chat",
  messages: [
    {
      id: 1,
      type: "bot",
      text: "Hello! I'm your finance assistant. How can I help you today? [Citation: Investopedia]",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: 2,
      type: "user",
      text: "I'm looking for in-depth equity research on tech stocks.",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: 3,
      type: "bot",
      text: "Sure, here is some detailed research on tech stocks. [Citation: MarketWatch]",
      timestamp: new Date().toLocaleTimeString(),
    },
  ],
};

export default function DashboardPage() {
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [threads, setThreads] = useState<Thread[]>([dummyThread]);

  const handleNewChat = () => {
    // Create a new empty thread
    const newThread: Thread = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };
    setThreads((prev) => [newThread, ...prev]);
    setSelectedThread(newThread);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        threads={threads} 
        onSelectThread={setSelectedThread} 
        onNewChat={handleNewChat}
        selectedThread={selectedThread}
      />
      <div className="flex flex-col flex-1 bg-[#FDF6ED]">
        <div className="flex-grow overflow-auto p-4">
          <ChatInterface thread={selectedThread} onStartChat={handleNewChat} />
        </div>
        {selectedThread && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.3 }}
          >
            <ChatInput thread={selectedThread} />
          </motion.div>
        )}
      </div>
    </div>
  );
} 