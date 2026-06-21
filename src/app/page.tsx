"use client";

import * as THREE from "three";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("@/components/3d/Globe"), { ssr: false });
const Particles = dynamic(() => import("@/components/3d/Particles"), { ssr: false });

export default function LandingPage() {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden">
      <Particles />
      <Globe />
      
      <main className="z-10 flex flex-col items-center text-center px-4 max-w-4xl mt-[-50px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/10 glass text-sm font-medium text-blue-400"
        >
          Introducing Career Intelligence 2.0
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
        >
          Navigate your future with <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
            AI Precision.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl"
        >
          Analyze your resume, predict salary trajectories, and get real-time market insights powered by advanced AI and large language models.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/dashboard"
            className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform"
          >
            Get Started Free
          </Link>
          <Link
            href="/ai-chat"
            className="px-8 py-4 rounded-full glass hover:bg-white/10 transition-colors font-semibold"
          >
            Try AI Chat
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
