"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { motion } from "framer-motion";
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const { signup, error, isLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF6ED] p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#DCD2C7]"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-[#2D2A28]">Create Account</h2>
          <p className="text-[#6E6963] mt-2">Get started with your free account</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 rounded-lg bg-[#F7D8CE] border border-[#D15F40] text-[#D15F40] text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#2D2A28] mb-2">
              Full Name
            </label>
            <input 
              id="name"
              type="text" 
              placeholder="Enter your name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#DCD2C7] focus:outline-none focus:ring-2 focus:ring-[#D15F40] focus:border-transparent transition duration-200 bg-[#FFFBF5] text-[#2D2A28]"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#2D2A28] mb-2">
              Email Address
            </label>
            <input 
              id="email"
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#DCD2C7] focus:outline-none focus:ring-2 focus:ring-[#D15F40] focus:border-transparent transition duration-200 bg-[#FFFBF5] text-[#2D2A28]"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#2D2A28] mb-2">
              Password
            </label>
            <input 
              id="password"
              type="password" 
              placeholder="Create a password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#DCD2C7] focus:outline-none focus:ring-2 focus:ring-[#D15F40] focus:border-transparent transition duration-200 bg-[#FFFBF5] text-[#2D2A28]"
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#D15F40] text-white py-3 rounded-lg hover:bg-[#B54A32] focus:outline-none focus:ring-2 focus:ring-[#D15F40] focus:ring-offset-2 transition duration-200 flex items-center justify-center shadow-lg shadow-[#D15F40]/20 hover:shadow-xl hover:shadow-[#D15F40]/30"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[#6E6963]">
          Already have an account?{" "}
          <a href="/auth/login" className="text-[#D15F40] hover:text-[#B54A32] font-medium">
            Sign in
          </a>
        </p>
      </motion.div>
    </div>
  );
} 