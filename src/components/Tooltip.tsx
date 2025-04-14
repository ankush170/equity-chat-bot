"use client";

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TooltipProps {
  children: ReactNode;
  content: string;
}

export default function Tooltip({ children, content }: TooltipProps) {
  return (
    <div className="relative group">
      {children}
      <div 
        className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 pointer-events-none hidden group-hover:block"
      >
        <div className="px-2 py-1 text-xs text-white bg-[#2D2A28] rounded shadow-lg whitespace-nowrap">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2D2A28]" />
        </div>
      </div>
    </div>
  );
} 