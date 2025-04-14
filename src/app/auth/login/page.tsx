"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { motion } from "framer-motion";
import { Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const { login, googleLogin, error, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      await googleLogin(credentialResponse.credential);
    } catch (err) {
      console.error("Google login error:", err);
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
          <h2 className="text-3xl font-bold text-[#2D2A28]">Welcome Back</h2>
          <p className="text-[#6E6963] mt-2">Please sign in to continue</p>
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
              placeholder="Enter your password" 
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
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#DCD2C7]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#6E6963]">Or continue with</span>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.error('Google Login Failed');
              }}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              width={312}
            />
          </div>
        </div>

        <p className="mt-8 text-center text-[#6E6963]">
          Don&apos;t have an account?{" "}
          <a href="/auth/signup" className="text-[#D15F40] hover:text-[#B54A32] font-medium">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
} 