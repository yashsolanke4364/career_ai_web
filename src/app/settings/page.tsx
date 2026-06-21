"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

export default function Settings() {
  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your profile and preferences.</p>
      </motion.div>

      <div className="space-y-6">
        <GlassCard hoverEffect={false}>
          <h2 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full Name</label>
              <input type="text" defaultValue="Alex Johnson" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email Address</label>
              <input type="email" defaultValue="alex@example.com" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors" />
            </div>
          </div>
        </GlassCard>

        <GlassCard hoverEffect={false}>
          <h2 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Email Notifications</p>
                <p className="text-sm text-gray-400">Receive weekly market updates</p>
              </div>
              <div className="w-10 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Public Profile</p>
                <p className="text-sm text-gray-400">Allow recruiters to view your roadmap</p>
              </div>
              <div className="w-10 h-6 bg-white/10 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full" />
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="flex justify-end gap-4 mt-8">
          <button className="px-6 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors">Cancel</button>
          <button className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
