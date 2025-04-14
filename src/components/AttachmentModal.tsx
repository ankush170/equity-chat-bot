"use client";

import { motion } from "framer-motion";
import { X, Upload, Loader2, FileText, Check } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { uploadToAzure } from '../utils/azure-storage';
import { useAuth } from '../contexts/AuthContext';

interface Document {
  id: string;
  file_name: string;
  url: string;
  uploaded_at: string;
  processing_status: string;
}

interface AttachmentModalProps {
  onClose: () => void;
  onAttachmentChange: (hasFile: boolean, documentId?: string, fileName?: string) => void;
}

export default function AttachmentModal({ onClose, onAttachmentChange }: AttachmentModalProps) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/documents`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch documents');
      
      const data = await response.json();
      setDocuments(data.documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      setUploadError('Only PDF files are allowed');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const blobUrl = await uploadToAzure(file);
      const fileName = blobUrl.split('/').pop() || file.name;

      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: user?.id,
          blob_url: blobUrl,
          file_name: fileName
        })
      });

      if (!response.ok) throw new Error('Failed to process upload');

      const data = await response.json();
      await fetchDocuments();
      
      // Select the newly uploaded document
      const newDoc = {
        id: data.document_id,
        file_name: fileName,
        url: blobUrl,
        uploaded_at: new Date().toISOString(),
        processing_status: 'completed'
      };
      setSelectedDocument(newDoc);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDone = () => {
    if (selectedDocument) {
      onAttachmentChange(true, selectedDocument.id, selectedDocument.file_name);
      onClose();
    }
  };

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
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-[#F7D8CE] rounded-full transition-colors text-[#6E6963] hover:text-[#D15F40]"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold text-[#2D2A28] mb-6">Upload Document</h2>

        {/* Upload Section */}
        <div className="mb-8">
          <label 
            htmlFor="file-upload"
            className={`block w-full p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors
              ${isUploading ? 'bg-[#F7D8CE]/30 border-[#D15F40]' : 'border-[#DCD2C7] hover:border-[#D15F40] hover:bg-[#F7D8CE]/10'}`}
          >
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              disabled={isUploading}
            />
            {isUploading ? (
              <div className="flex items-center justify-center gap-3 text-[#D15F40]">
                <Loader2 className="animate-spin" size={24} />
                <span>Uploading document...</span>
              </div>
            ) : (
              <div className="text-[#6E6963]">
                <Upload size={24} className="mx-auto mb-2" />
                <p>Click to upload or drag and drop</p>
                <p className="text-sm mt-1">Only PDF files are supported</p>
              </div>
            )}
          </label>
          {uploadError && (
            <p className="mt-2 text-sm text-red-500">{uploadError}</p>
          )}
        </div>

        {/* Documents List */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-[#2D2A28] mb-3">Your Documents</h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {documents.map((doc) => (
              <motion.button
                key={doc.id}
                onClick={() => setSelectedDocument(doc)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  selectedDocument?.id === doc.id
                    ? 'bg-[#F7D8CE] text-[#D15F40]'
                    : 'hover:bg-[#F7D8CE]/30 text-[#6E6963]'
                }`}
              >
                <FileText size={20} />
                <div className="flex-1 text-left">
                  <p className="font-medium truncate">{doc.file_name}</p>
                  <p className="text-xs">
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
                {selectedDocument?.id === doc.id && (
                  <Check size={20} />
                )}
              </motion.button>
            ))}
            {documents.length === 0 && (
              <p className="text-center text-[#6E6963] py-4">
                No documents uploaded yet
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-[#6E6963] hover:text-[#D15F40] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            disabled={!selectedDocument}
            className={`px-6 py-2 rounded-lg transition-all ${
              selectedDocument
                ? 'bg-[#D15F40] text-white hover:bg-[#B54A32]'
                : 'bg-[#DCD2C7] text-[#6E6963] cursor-not-allowed'
            }`}
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
} 