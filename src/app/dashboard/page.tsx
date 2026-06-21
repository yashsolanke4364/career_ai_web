"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { OrbitControls, Stars } from "@react-three/drei";
import gsap from "gsap";
import { Briefcase, Sparkles, TrendingUp, Zap, Globe, ChartPie } from "lucide-react";

const skillRadarData = [
  { subject: "AI", value: 92, fullMark: 100 },
  { subject: "Cloud", value: 84, fullMark: 100 },
  { subject: "Product", value: 76, fullMark: 100 },
  { subject: "Data", value: 88, fullMark: 100 },
  { subject: "UX", value: 70, fullMark: 100 },
  { subject: "Leadership", value: 79, fullMark: 100 },
];

const growthForecastData = [
  { period: "2025", Engineering: 78, Medicine: 72, Pharmacy: 66, Business: 81 },
  { period: "2026", Engineering: 84, Medicine: 76, Pharmacy: 69, Business: 85 },
  { period: "2027", Engineering: 90, Medicine: 79, Pharmacy: 73, Business: 88 },
];

const salaryProjectionData = [
  { title: "Engineering", salary: 142 },
  { title: "Medicine", salary: 158 },
  { title: "Pharmacy", salary: 132 },
  { title: "Business", salary: 120 },
];

const heatmapMatrix = [
  { industry: "Engineering", current: 88, demand: 92, forecast: 94 },
  { industry: "Medicine", current: 82, demand: 85, forecast: 87 },
  { industry: "Pharmacy", current: 74, demand: 78, forecast: 80 },
  { industry: "Business", current: 84, demand: 89, forecast: 91 },
];

const aiInsights = [
  "Demand for interdisciplinary skills is rising across all industries.",
  "Engineering remains strongest in cloud-native systems and AI-enabled automation.",
  "Medicine growth is driven by telehealth, diagnostics, and precision care.",
  "Business roles are shifting toward analytics, strategy, and digital transformation.",
];

function SkillSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.6, 2]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.2} roughness={0.2} transparent opacity={0.28} />
      </mesh>
      <mesh scale={1.12}>
        <icosahedronGeometry args={[1.6, 2]} />
        <meshBasicMaterial color="#f472b6" wireframe opacity={0.6} transparent />
      </mesh>
    </group>
  );
}

export default function Dashboard() {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.from(headerRef.current, { opacity: 0, y: 30, duration: 1, ease: "power3.out" });
    }
    if (cardsRef.current) {
      gsap.from(cardsRef.current.children, {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });
    }
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold mb-3 text-emerald-300">Futuristic Career Dashboard</h1>
        <p className="text-gray-400 max-w-3xl">
          Explore next-generation insights with 3D skill radar visuals, demand heatmaps, forecast projections, salary signals, and AI-driven recommendations.
        </p>
      </motion.div>

      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Career Match", value: "91%", icon: ChartPie, accent: "bg-sky-500/10 text-sky-300" },
          { label: "Growth Forecast", value: "+14%", icon: TrendingUp, accent: "bg-emerald-500/10 text-emerald-300" },
          { label: "Salary Projection", value: "$148k", icon: Briefcase, accent: "bg-violet-500/10 text-violet-300" },
          { label: "AI Insights", value: "4 Actions", icon: Sparkles, accent: "bg-fuchsia-500/10 text-fuchsia-300" },
        ].map((item, index) => (
          <motion.div key={item.label} className="dashboard-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08, duration: 0.6 }}>
            <GlassCard className="flex items-center justify-between gap-4 p-6">
              <div>
                <p className="text-sm text-gray-400">{item.label}</p>
                <p className="text-3xl font-semibold mt-3 text-white">{item.value}</p>
              </div>
              <div className={`p-3 rounded-3xl ${item.accent}`}>
                <item.icon size={24} />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6 mb-10">
        <GlassCard className="h-140 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Skill Radar</h2>
              <p className="text-sm text-gray-400 mt-1">Interactive 3D skill geometry plus radar score distribution.</p>
            </div>
            <div className="rounded-3xl bg-white/5 px-4 py-3 text-sm text-gray-300">Real-time</div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.95fr_0.85fr]">
            <div className="h-90 rounded-4xl overflow-hidden bg-[#050816] shadow-2xl shadow-cyan-500/10">
              <Canvas camera={{ position: [0, 0, 8], fov: 38 }}>
                <Stars radius={50} depth={20} count={200} factor={6} saturation={0} fade speed={1} />
                <SkillSphere />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} enablePan={false} />
              </Canvas>
            </div>

            <div className="h-90 p-4 rounded-4xl bg-[#08101e] border border-white/10">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="80%" data={skillRadarData} margin={{ top: 15, right: 10, left: 10, bottom: 5 }}>
                  <PolarGrid stroke="#2c3e50" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar name="Skill" dataKey="value" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.25} />
                  <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "10px" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold">Demand Heatmap</h2>
                <p className="text-sm text-gray-400">Cross-industry demand intensity across current, demand, and forecast views.</p>
              </div>
              <div className="rounded-3xl bg-white/5 px-3 py-2 text-xs text-gray-300">AI-powered</div>
            </div>

            <div className="grid gap-3">
              <div className="grid grid-cols-4 gap-2 px-2 text-xs text-gray-400 uppercase">
                <span>Industry</span>
                <span className="text-center">Current</span>
                <span className="text-center">Demand</span>
                <span className="text-center">Forecast</span>
              </div>
              {heatmapMatrix.map((row) => (
                <div key={row.industry} className="grid grid-cols-4 gap-2 items-center px-2 py-3 rounded-3xl bg-white/5">
                  <span>{row.industry}</span>
                  {[row.current, row.demand, row.forecast].map((value, index) => {
                    const intensity = Math.round((value - 60) * 2.5);
                    return (
                      <div
                        key={index}
                        className="h-10 rounded-3xl flex items-center justify-center text-sm font-semibold"
                        style={{
                          background: `rgba(56, 189, 248, ${0.15 + intensity / 150})`,
                          color: `rgba(255, 255, 255, ${0.9 - index * 0.08})`,
                        }}
                      >
                        {value}%
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="h-80 p-6">
            <h2 className="text-2xl font-semibold mb-4">Growth Forecast</h2>
            <div className="h-55">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthForecastData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                  <CartesianGrid stroke="#1f2937" strokeDasharray="4 4" />
                  <XAxis dataKey="period" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "10px" }} />
                  <Legend wrapperStyle={{ color: "#9ca3af" }} />
                  <Line type="monotone" dataKey="Engineering" stroke="#38bdf8" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="Medicine" stroke="#fb7185" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="Pharmacy" stroke="#fde68a" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="Business" stroke="#34d399" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_0.7fr] gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Salary Projection</h2>
              <p className="text-sm text-gray-400">Projected base salaries across future career paths.</p>
            </div>
            <div className="rounded-3xl bg-white/5 px-3 py-2 text-xs text-gray-300">2028 outlook</div>
          </div>

          <div className="h-70">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryProjectionData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                <CartesianGrid stroke="#1f2937" strokeDasharray="4 4" />
                <XAxis dataKey="title" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value}k`} />
                <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "10px" }} formatter={(value) => [`${value}k`, "Salary"]} />
                <Bar dataKey="salary" fill="#7c3aed" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-2xl font-semibold mb-4">AI Insights</h2>
          <div className="space-y-4">
            {aiInsights.map((insight, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i, duration: 0.45 }} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-gray-200">{insight}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
