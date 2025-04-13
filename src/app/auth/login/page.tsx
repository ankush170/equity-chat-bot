"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    router.push("/dashboard");
  };

  const handleGoogleSignIn = () => {
    // Simulate Google authentication with dummy creds
    login("googleuser@example.com", "google", "Google User");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 to-purple-200">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Welcome Back!</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
          <button 
            type="submit" 
            className="bg-purple-600 text-white py-3 rounded hover:bg-purple-700 transition-colors"
          >
            Login
          </button>
        </form>
        <div className="my-4 text-center text-sm text-gray-500">or</div>
        <button 
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 border py-3 rounded hover:bg-gray-100 transition-colors"
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-6 h-6" />
          Sign in with Google
        </button>
        <p className="mt-4 text-center text-sm">
          Don't have an account? <a href="/auth/signup" className="text-purple-600 hover:underline">Sign up</a>
        </p>
      </motion.div>
    </div>
  );
} 