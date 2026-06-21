"use client";

import { useEffect, useRef } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import gsap from "gsap";

const demandData = [
  { skill: "Python", demand: 95 },
  { skill: "React", demand: 88 },
  { skill: "AWS", demand: 82 },
  { skill: "Node.js", demand: 75 },
  { skill: "Go", demand: 68 },
];

const forecastData = [
  { period: "1 Year", Engineering: 82, Medicine: 78, Pharmacy: 72, Business: 80 },
  { period: "3 Years", Engineering: 88, Medicine: 83, Pharmacy: 76, Business: 87 },
  { period: "5 Years", Engineering: 93, Medicine: 86, Pharmacy: 79, Business: 91 },
];

export default function MarketTrends() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div ref={headerRef} className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-emerald-400">Real-Time Market Trends</h1>
        <p className="text-gray-400">Live data on skill demands and salary distributions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="h-100">
          <h2 className="text-xl font-semibold mb-6">Top Skill Demand</h2>
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demandData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" stroke="#666" />
                <YAxis dataKey="skill" type="category" stroke="#ccc" width={80} />
                <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }} />
                <Bar dataKey="demand" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard>
            <h3 className="text-lg font-medium text-gray-300">Average Salary</h3>
            <p className="text-4xl font-bold text-white mt-2">$135,000</p>
            <p className="text-sm text-emerald-400 mt-1">+12% from last year</p>
          </GlassCard>
          
          <GlassCard>
            <h3 className="text-lg font-medium text-gray-300">Remote Work Trend</h3>
            <p className="text-4xl font-bold text-white mt-2">64%</p>
            <p className="text-sm text-emerald-400 mt-1">Offers are fully remote</p>
          </GlassCard>
        </div>
      </div>

      <div className="mt-10 space-y-6">
        <GlassCard>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Career Forecast Engine</h2>
              <p className="text-gray-400 max-w-3xl">
                Projected demand for Engineering, Medicine, Pharmacy, and Business over the next 1, 3, and 5 years.
                Use these forecasts to compare growth trajectories across industries and identify future opportunity zones.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-sm text-gray-400">Engineering</p>
                <p className="text-2xl font-bold text-white mt-2">93</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-sm text-gray-400">Medicine</p>
                <p className="text-2xl font-bold text-white mt-2">86</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-sm text-gray-400">Pharmacy</p>
                <p className="text-2xl font-bold text-white mt-2">79</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-sm text-gray-400">Business</p>
                <p className="text-2xl font-bold text-white mt-2">91</p>
              </div>
            </div>
          </div>

          <div className="mt-8 h-90 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid stroke="#2a2a2a" strokeDasharray="4 4" />
                <XAxis dataKey="period" stroke="#888" />
                <YAxis stroke="#888" domain={[60, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 10 }} />
                <Line type="monotone" dataKey="Engineering" stroke="#38bdf8" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Medicine" stroke="#f472b6" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Pharmacy" stroke="#facc15" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Business" stroke="#34d399" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <div className="rounded-3xl bg-white/5 p-5">
              <p className="text-sm text-gray-400">Engineering outlook</p>
              <p className="text-xl font-semibold text-white mt-2">Strong growth driven by AI, cloud systems, and automation.</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-5">
              <p className="text-sm text-gray-400">Medicine outlook</p>
              <p className="text-xl font-semibold text-white mt-2">Steady demand from digital health, telemedicine, and aging care.</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-5">
              <p className="text-sm text-gray-400">Pharmacy outlook</p>
              <p className="text-xl font-semibold text-white mt-2">Rising need for clinical pharmacy and biopharma support roles.</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-5">
              <p className="text-sm text-gray-400">Business outlook</p>
              <p className="text-xl font-semibold text-white mt-2">Growth from analytics, product leadership, and digital transformation.</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
