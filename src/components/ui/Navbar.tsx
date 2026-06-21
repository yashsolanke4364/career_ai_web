"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/components/ui/GlassCard";
import { Compass, BarChart2, MessageSquare, FileText, Settings, LayoutDashboard, LogOut, LogIn } from "lucide-react";
import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/career-explorer", label: "Explorer", icon: Compass },
  { href: "/market-trends", label: "Market", icon: BarChart2 },
  { href: "/ai-chat", label: "AI Chat", icon: MessageSquare },
  { href: "/resume-analyzer", label: "Resume", icon: FileText },
];

export function Navbar({ session }: { session: Session | null }) {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-6 py-4 flex items-center justify-between backdrop-blur-xl">
      <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
        CareerAI
      </Link>
      
      <div className="hidden md:flex items-center space-x-1 bg-white/5 p-1 rounded-full border border-white/10">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2",
                isActive ? "text-white" : "text-white/60 hover:text-white"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-white/10 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon size={16} />
              <span className="relative z-10">{link.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        {session?.user ? (
          <>
            <Link href="/settings" className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Settings size={20} className="text-white/60" />
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-red-400 flex items-center gap-2"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline text-sm">Sign Out</span>
            </button>
            {session.user.image && (
              <img src={session.user.image} alt="User avatar" className="w-8 h-8 rounded-full" />
            )}
          </>
        ) : (
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors text-white text-sm font-medium"
          >
            <LogIn size={16} />
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
