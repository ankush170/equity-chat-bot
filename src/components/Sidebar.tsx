"use client";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Thread, ThreadSummary } from "../types/thread";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon, LogOutIcon, Loader2 } from 'lucide-react';

interface SidebarProps {
  threads: ThreadSummary[];
  onSelectThread: (thread: ThreadSummary) => void;
  onNewChat: () => void;
  selectedThread: Thread | null;
  isLoading: boolean;
}

export default function Sidebar({ threads, onSelectThread, onNewChat, selectedThread, isLoading }: SidebarProps) {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div 
      animate={{ width: isCollapsed ? "5rem" : "18rem" }}
      className="bg-[#F0E5D8] border-r border-[#DCD2C7] h-screen flex flex-col shadow-lg relative z-[20]"
    >
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0">
          <div className="p-4">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="self-end mb-6 p-2 hover:bg-[#F7D8CE] rounded-full transition-colors text-[#6E6963] hover:text-[#D15F40]"
            >
              {isCollapsed ? <ChevronRightIcon size={20} /> : <ChevronLeftIcon size={20} />}
            </button>
          </div>
          
          <div className="px-4 mb-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNewChat}
              className="w-full py-3 px-4 bg-[#D15F40] text-white rounded-xl shadow-lg shadow-[#D15F40]/20 hover:shadow-xl hover:bg-[#B54A32] hover:shadow-[#D15F40]/30 flex items-center justify-center gap-2 transition-all"
            >
              <PlusIcon size={18} />
              {!isCollapsed && <span>New Chat</span>}
            </motion.button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 px-4">
          <AnimatePresence>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-[#D15F40]" size={24} />
              </div>
            ) : threads.length === 0 ? (
              <p className="text-center text-[#6E6963] text-sm px-4">
                No conversations yet
              </p>
            ) : (
              threads.map((thread) => {
                const isSelected = selectedThread?.id === thread.id;
                
                return (
                  <motion.button 
                    key={thread.id}
                    onClick={() => onSelectThread(thread)}
                    whileHover={{ backgroundColor: isSelected ? "rgba(209, 95, 64, 0.15)" : "rgba(209, 95, 64, 0.08)" }}
                    className={`w-full text-left rounded-lg text-sm transition-colors flex items-center gap-3
                      ${isSelected 
                        ? `text-[#D15F40] ${isCollapsed ? "justify-center py-3" : "px-4 py-3 border-l-4 border-[#D15F40] bg-[#F7D8CE]/50"}` 
                        : `text-[#6E6963] hover:text-[#D15F40] ${isCollapsed ? "justify-center py-3" : "px-4 py-3"}`
                      }`}
                  >
                    {isCollapsed ? (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium
                        ${isSelected 
                          ? "bg-[#D15F40] text-white" 
                          : "bg-[#F7D8CE] text-[#D15F40]"
                        }`}>
                        {thread.first_message.charAt(0)}
                      </div>
                    ) : (
                      <>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium
                          ${isSelected 
                            ? "bg-[#D15F40] text-white" 
                            : "bg-[#F7D8CE] text-[#D15F40]"
                          }`}>
                          {thread.first_message.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <motion.p 
                            className="truncate"
                            animate={thread.isNew ? { scale: [1, 1.02, 1] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            {thread.first_message}
                          </motion.p>
                          <p className="text-xs text-[#6E6963] mt-1">
                            {new Date(thread.created_at).toLocaleDateString()} · {thread.message_count} messages
                          </p>
                        </div>
                      </>
                    )}
                  </motion.button>
                );
              })
            )}
          </AnimatePresence>
        </div>

        <div className="flex-shrink-0 p-4 border-t border-[#DCD2C7]">
          <div className="flex items-center gap-3">
            <img 
              src={`https://api.dicebear.com/6.x/micah/svg?seed=${user?.email || 'guest'}`}
              alt={user?.name || "User"} 
              className={`${isCollapsed ? "w-10 h-10 mx-auto" : "w-10 h-10"} rounded-full ring-2 ring-[#D15F40]/20 shadow-md`} 
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#2D2A28] truncate">{user?.name}</p>
                <p className="text-xs text-[#6E6963] truncate">{user?.email}</p>
              </div>
            )}
            {!isCollapsed && (
              <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: "#F7D8CE" }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="p-2 rounded-full transition-colors"
              >
                <LogOutIcon size={18} className="text-[#6E6963] hover:text-[#D15F40]" />
              </motion.button>
            )}
          </div>
          {isCollapsed && (
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: "#F7D8CE" }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="p-2 rounded-full transition-colors mt-4 mx-auto flex items-center justify-center"
            >
              <LogOutIcon size={18} className="text-[#6E6963] hover:text-[#D15F40]" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
} 