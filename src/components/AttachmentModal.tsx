"use client";

import { motion } from "framer-motion";
import { X, Upload } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface AttachmentModalProps {
  onClose: () => void;
}

export default function AttachmentModal({ onClose }: AttachmentModalProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  const modalContent = (
    <div className="fixed inset-0 z-[9999] grid place-items-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#2D2A28]"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative bg-[#FFFBF5] rounded-2xl p-8 w-[90%] max-w-lg shadow-[0_10px_40px_rgba(164,129,109,0.2)] border border-[#DCD2C7]"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-[#2D2A28]">Upload Document</h3>
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "#F7D8CE" }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 rounded-full transition-colors"
          >
            <X size={20} className="text-[#D15F40]" />
          </motion.button>
        </div>
        
        <motion.div 
          whileHover={{ borderColor: "#D15F40", boxShadow: "0 4px 12px rgba(209, 95, 64, 0.1)" }}
          className="border-2 border-dashed border-[#DCD2C7] rounded-xl p-10 text-center bg-[#FDF6ED] transition-all duration-300"
        >
          <motion.div
            whileHover={{ y: -5 }}
            className="mb-4"
          >
            <Upload size={38} className="mx-auto text-[#D4A24C]" />
          </motion.div>
          <p className="text-[#2D2A28] text-lg mb-2 font-medium">Drag and drop your files here</p>
          <p className="text-[#6E6963] mb-6">or</p>
          <motion.label 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-[#D15F40] text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-[#B54A32] transition-colors inline-block shadow-lg shadow-[#D15F40]/20 hover:shadow-xl hover:shadow-[#D15F40]/30"
          >
            Browse Files
            <input type="file" className="hidden" />
          </motion.label>
        </motion.div>
        
        <div className="flex gap-3 items-center mt-6 text-[#6E6963] text-sm">
          <div className="bg-[#F0E5D8] px-3 py-1 rounded-full">PDF</div>
          <div className="bg-[#F0E5D8] px-3 py-1 rounded-full">DOC</div>
          <div className="bg-[#F0E5D8] px-3 py-1 rounded-full">DOCX</div>
          <div className="bg-[#F0E5D8] px-3 py-1 rounded-full">XLS</div>
          <div className="bg-[#F0E5D8] px-3 py-1 rounded-full">XLSX</div>
        </div>
      </motion.div>
    </div>
  );

  // Client-side only
  if (!mounted) return null;
  
  // Use createPortal to render the modal at the document body level
  return createPortal(modalContent, document.body);
} 