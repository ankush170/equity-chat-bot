"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import ChatInterface from "../../components/ChatInterface";
import ChatInput from "../../components/ChatInput";
import { motion } from "framer-motion";
import { Thread, ThreadSummary, StreamMessage } from "../../types/thread";
import { useAuth } from "../../contexts/AuthContext";

export default function DashboardPage() {
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [streamingMessage, setStreamingMessage] = useState<StreamMessage | undefined>();
  const { logout } = useAuth();

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/threads`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error('Failed to fetch threads');
      }

      const data = await response.json();
      setThreads(data.threads);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchThreadMessages = async (threadId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/threads/${threadId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error('Failed to fetch thread messages');
      }

      const data = await response.json();
      setSelectedThread(data.thread);
    } catch (error) {
      console.error('Error fetching thread messages:', error);
    }
  };

  const handleNewChat = () => {
    const newThread: ThreadSummary = {
      id: `temp_${Date.now()}`,
      created_at: new Date().toISOString(),
      first_message: "New Chat",
      message_count: 0,
      isNew: true
    };
    
    setThreads(prev => [newThread, ...prev]);
    setSelectedThread({ 
      id: newThread.id, 
      created_at: newThread.created_at,
      messages: [] 
    });
  };

  const handleSelectThread = async (thread: ThreadSummary) => {
    await fetchThreadMessages(thread.id);
  };

  const handleStreamMessage = (message: StreamMessage) => {
    setStreamingMessage(message);
    
    // If we received a new thread ID, update the thread
    if (message.threadId && selectedThread?.id.startsWith('temp_')) {
      // Update the thread ID in threads list
      setThreads(prev => prev.map(thread => 
        thread.id === selectedThread.id
          ? {
              ...thread,
              id: message.threadId!,
              first_message: message.user_query,
              isNew: false,
              message_count: 1
            }
          : thread
      ));
      
      // Update selected thread with new ID
      setSelectedThread(prev => prev ? {
        ...prev,
        id: message.threadId!
      } : null);
    }
  };

  const handleMessageSent = async (newThreadId: string | null) => {
    setStreamingMessage(undefined);
    if (newThreadId) {
      // Fetch the thread with the new ID
      await fetchThreadMessages(newThreadId);
    } else if (selectedThread?.id) {
      // Fetch existing thread
      await fetchThreadMessages(selectedThread.id);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        threads={threads} 
        onSelectThread={handleSelectThread} 
        onNewChat={handleNewChat}
        selectedThread={selectedThread}
        isLoading={isLoading}
      />
      <div className="flex flex-col flex-1 bg-[#FDF6ED]">
        <div className="flex-grow overflow-auto p-4">
          <ChatInterface 
            thread={selectedThread} 
            onStartChat={handleNewChat}
            streamingMessage={streamingMessage}
          />
        </div>
        {selectedThread && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.3 }}
          >
            <ChatInput 
              thread={selectedThread} 
              onMessageSent={handleMessageSent}
              onStreamMessage={handleStreamMessage}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
} 