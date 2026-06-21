"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";

const steps = [
  { title: "Junior Developer", status: "completed", description: "Mastered basics of React and Node.js." },
  { title: "Mid-level Engineer", status: "current", description: "Currently focusing on system design and AWS." },
  { title: "Senior Architect", status: "upcoming", description: "Target role. Requires deep distributed systems knowledge." },
];

export default function CareerExplorer() {
  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold mb-2">Career Explorer</h1>
        <p className="text-gray-400">Your personalized roadmap to becoming a Senior Architect.</p>
      </motion.div>

      <div className="relative border-l border-white/10 ml-6 pl-8 space-y-12">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className="relative"
          >
            <div className={`absolute -left-[45px] p-1 bg-background rounded-full ${step.status === "completed" ? "text-emerald-400" : step.status === "current" ? "text-blue-400" : "text-gray-500"}`}>
              {step.status === "completed" ? <CheckCircle2 size={24} /> : <Circle size={24} />}
            </div>
            <GlassCard className={step.status === "current" ? "border-blue-500/50" : ""}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                {step.title}
                {step.status === "current" && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">In Progress</span>}
              </h3>
              <p className="text-gray-400 mb-4">{step.description}</p>
              {step.status === "current" && (
                <button className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  View recommended courses <ArrowRight size={16} />
                </button>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
