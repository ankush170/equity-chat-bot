"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AttachmentModal from "./AttachmentModal";
import { Thread, StreamMessage } from "../types/thread";
import { Search, Paperclip, Mic, Send, Globe, Loader2, Info, FileText } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext";
import Tooltip from "./Tooltip";
import AudioRecorder from './AudioRecorder';

interface ChatInputProps {
  thread: Thread;
  onMessageSent: (newThreadId: string | null) => void;
  onStreamMessage: (message: StreamMessage) => void;
}

export default function ChatInput({ thread, onMessageSent, onStreamMessage }: ChatInputProps) {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [hasAttachment, setHasAttachment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{id: string, file_name: string} | null>(null);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  const handleSend = async (e: React.FormEvent, queryOverride?: string) => {
    e.preventDefault();
    // Use the override if provided; otherwise use state value
    const query = queryOverride !== undefined ? queryOverride : input;
    if (!query.trim() || isLoading || !user?.id) return;
    setInput("");

    // Create a temporary message ID
    const tempMessageId = Date.now().toString();
    
    // Create initial streaming message
    const streamMessage: StreamMessage = {
      id: tempMessageId,
      user_query: query,
      agent_response: "",
      created_at: new Date().toISOString(),
      isStreaming: true
    };

    onStreamMessage(streamMessage);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: user.id,
          query,
          thread_id: thread?.id?.startsWith('temp_') ? null : thread?.id || null,
          web_search: webSearchEnabled,
          document_id: selectedDocument?.id || null
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let accumulatedResponse = "";
      let newThreadId: string | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        lines.forEach(line => {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(5));
            switch (data.type) {
              case 'thread_id':
                newThreadId = data.content;
                // Pass the new thread ID to parent
                onStreamMessage({
                  ...streamMessage,
                  threadId: data.content // Add threadId to StreamMessage type
                });
                break;
              case 'content':
                accumulatedResponse += data.content;
                onStreamMessage({
                  ...streamMessage,
                  agent_response: accumulatedResponse,
                  threadId: newThreadId || undefined  // Convert null to undefined
                });
                break;
              case 'done':
                reader.cancel();
                break;
              case 'error':
                console.error('Error:', data.content);
                reader.cancel();
                break;
            }
          }
        });
      }

      onMessageSent(newThreadId); // Pass the new thread ID to parent
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWebSearch = () => {
    if (hasAttachment || selectedDocument) return;
    setWebSearchEnabled(!webSearchEnabled);
  };

  const handleAttachmentAdded = (hasFile: boolean) => {
    setHasAttachment(hasFile);
    if (hasFile) {
      setWebSearchEnabled(false);
    }
  };

  const handleDocumentSelect = (docId: string, fileName: string) => {
    setSelectedDocument({ id: docId, file_name: fileName });
    setHasAttachment(true);
    setWebSearchEnabled(false);
  };

  const handleTranscriptionComplete = async (transcript: string) => {
    if (transcript) {
      setInput(transcript);
      // Create a synthetic form event
      const syntheticEvent = {
        preventDefault: () => {},
        target: document.createElement('form')
      } as unknown as React.FormEvent<HTMLFormElement>;
      
      await handleSend(syntheticEvent, transcript);
    }
  };

  const clearSelectedDocument = () => {
    setSelectedDocument(null);
    setHasAttachment(false); // Reset attachment state
  };

  return (
    <>
      <div className="bg-[#FDF6ED]/50 backdrop-blur-sm p-5 relative z-[10]">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Tooltip content={hasAttachment ? "Web search is disabled when files are attached" : "Enable web search"}>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: webSearchEnabled ? "#F7D8CE" : "" }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleWebSearch}
              disabled={hasAttachment}
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
                webSearchEnabled 
                  ? "bg-[#F7D8CE] text-[#D15F40]" 
                  : hasAttachment
                    ? "text-[#6E6963] opacity-50 cursor-not-allowed"
                    : "text-[#6E6963] hover:text-[#D15F40] hover:bg-[#F7D8CE]"
              }`}
            >
              <Globe size={22} />
            </motion.button>
          </Tooltip>
          
          <Tooltip content={webSearchEnabled ? "File upload is disabled during web search" : "Upload files"}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => !webSearchEnabled && setShowAttachmentModal(true)}
              disabled={webSearchEnabled}
              className={`p-2.5 rounded-xl transition-all ${
                webSearchEnabled
                  ? "text-[#6E6963] opacity-50 cursor-not-allowed"
                  : hasAttachment 
                    ? "bg-[#F7D8CE] text-[#D15F40]"
                    : "text-[#6E6963] hover:text-[#D15F40] hover:bg-[#F7D8CE]"
              }`}
            >
              <Paperclip size={22} />
            </motion.button>
          </Tooltip>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAudioRecorder(true)}
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
                disabled={isLoading}
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
              disabled={isLoading}
              className="p-3.5 bg-[#D15F40] text-white rounded-xl shadow-lg shadow-[#D15F40]/20 hover:shadow-xl hover:bg-[#B54A32] hover:shadow-[#D15F40]/30 transition-all flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <Send size={22} />
              )}
            </motion.button>
          </form>
        </div>
        
        {selectedDocument && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="max-w-4xl mx-auto mt-2 text-sm text-[#6E6963] px-4"
          >
            <span className="flex items-center gap-1">
              <FileText size={14} className="text-[#D15F40]" />
              Document selected: {selectedDocument.file_name}
              <button 
                onClick={clearSelectedDocument}
                className="ml-2 p-1 rounded-full hover:bg-[#F7D8CE] text-[#6E6963] hover:text-[#D15F40]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </span>
          </motion.div>
        )}
        
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
      
      <AnimatePresence>
        {showAttachmentModal && (
          <AttachmentModal 
            onClose={() => setShowAttachmentModal(false)} 
            onAttachmentChange={(hasFile, docId, fileName) => {
              if (hasFile && docId && fileName) {
                handleDocumentSelect(docId, fileName);
              }
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAudioRecorder && (
          <AudioRecorder 
            onTranscriptionComplete={handleTranscriptionComplete}
            onClose={() => setShowAudioRecorder(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
} 