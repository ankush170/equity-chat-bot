"use client";

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Loader2 } from 'lucide-react';

interface AudioRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  onClose: () => void;
}

export default function AudioRecorder({ onTranscriptionComplete, onClose }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        await convertSpeechToText(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const convertSpeechToText = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');
      formData.append('model', 'saarika:v2');
      formData.append('language_code', 'unknown');
      formData.append('with_timestamps', 'false');
      formData.append("with_diarization", "false");
      formData.append("num_speakers", "123");

      const response = await fetch('https://api.sarvam.ai/speech-to-text', {
        method: 'POST',
        headers: {
          'api-subscription-key': process.env.NEXT_PUBLIC_SARVAM_API_KEY!,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to convert speech to text');

      const data = await response.json();
      onTranscriptionComplete(data.transcript);
    } catch (error) {
      console.error('Error converting speech to text:', error);
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] grid place-items-center overflow-hidden">
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
        className="relative bg-[#FFFBF5] rounded-2xl p-8 shadow-lg z-10"
      >
        <div className="flex flex-col items-center gap-4 min-w-[200px]">
          <motion.div
            animate={isRecording ? {
              scale: [1, 1.2, 1],
              transition: { repeat: Infinity, duration: 1.5 }
            } : {}}
            className={`p-8 rounded-full ${
              isRecording ? 'bg-red-100' : 'bg-[#F7D8CE]'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="animate-spin text-[#D15F40]" size={48} />
            ) : (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className="text-[#D15F40]"
              >
                {isRecording ? (
                  <Square size={48} />
                ) : (
                  <Mic size={48} />
                )}
              </button>
            )}
          </motion.div>
          <p className="text-[#6E6963] text-center">
            {isProcessing ? 'Processing...' : 
             isRecording ? 'Click to stop recording' : 
             'Click to start recording'}
          </p>
        </div>
      </motion.div>
    </div>
  );
} 