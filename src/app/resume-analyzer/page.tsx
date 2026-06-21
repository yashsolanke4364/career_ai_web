"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, CheckCircle, FileText } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

type ResumeAnalysis = {
  extractedSkills: string[];
  atsScore: number;
  careerMatchScore: number;
  careerMatches: { title: string; score: number }[];
  skillGapAnalysis: string;
  courseRecommendations: string[];
  topCareer: string;
};

export default function ResumeAnalyzer() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileDrop = (droppedFile: File) => {
    setFile(droppedFile);
    setError(null);
    setAnalysis(null);

    if (droppedFile.type.startsWith("text/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setResumeText(reader.result as string);
      };
      reader.readAsText(droppedFile);
    } else {
      setResumeText(`Resume uploaded: ${droppedFile.name}. Use the analyze button to extract content from PDF or paste a summary below.`);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() && !file) {
      setError("Please upload a PDF or paste your resume text before analyzing.");
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      let response: Response;

      if (file && file.type === "application/pdf") {
        const browserBuffer = await file.arrayBuffer();
        response = await fetch("/api/resume-analyzer", {
          method: "POST",
          headers: {
            "Content-Type": "application/pdf",
          },
          body: browserBuffer,
        });
      } else {
        response = await fetch("/api/resume-analyzer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resumeText }),
        });
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to analyze resume.");
      }

      setAnalysis(data as ResumeAnalysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto w-full flex flex-col items-center justify-start min-h-[calc(100vh-73px)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Resume Intelligence</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Upload your PDF resume or paste your resume text to get skill extraction, ATS scoring, career matching, and course recommendations.</p>
        </div>

        <GlassCard
          className={`border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center py-20 cursor-pointer
            ${isDragging ? "border-blue-400 bg-blue-500/10" : "border-white/20 hover:border-white/40"}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileDrop(e.dataTransfer.files[0]);
            }
          }}
        >
          {file ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-emerald-400">
              <CheckCircle size={64} className="mb-4" />
              <p className="text-xl font-medium">{file.name}</p>
              <p className="text-sm text-gray-400 mt-2">File ready for resume analysis.</p>
            </motion.div>
          ) : (
            <>
              <UploadCloud size={64} className="text-gray-400 mb-6" />
              <p className="text-xl font-medium mb-2">Drag and drop your resume</p>
              <p className="text-gray-500 text-sm">PDF upload supported. You can also paste text or a resume summary below.</p>
            </>
          )}
        </GlassCard>

        <GlassCard className="p-6 mt-8" hoverEffect={false}>
          <label className="block text-sm text-gray-400 mb-2">Resume summary or text</label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={10}
            className="w-full bg-background/80 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500 transition-colors"
            placeholder="Paste your resume or key experience summary here."
          />
        </GlassCard>

        {error ? <p className="text-sm text-red-400 mt-4">{error}</p> : null}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-4">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAnalyzing ? "Analyzing resume..." : "Analyze Resume"}
          </button>
          <p className="text-sm text-gray-400 max-w-2xl">The analyzer extracts skills, scores your resume for ATS, identifies skill gaps, and recommends career-aligned courses.</p>
        </div>

        {analysis ? (
          <div className="grid gap-6 mt-8 lg:grid-cols-[1.2fr_0.8fr]">
            <GlassCard className="p-6" hoverEffect={false}>
              <h2 className="text-2xl font-semibold mb-4">Resume Analysis Results</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-sm text-gray-400">ATS Score</p>
                  <p className="text-3xl font-bold mt-2">{analysis.atsScore}%</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-sm text-gray-400">Career Match Score</p>
                  <p className="text-3xl font-bold mt-2">{analysis.careerMatchScore}%</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Top career match</h3>
                <p className="text-gray-200">{analysis.topCareer}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Top skills found</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.extractedSkills.length ? analysis.extractedSkills.map((skill) => (
                    <span key={skill} className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-200">{skill}</span>
                  )) : <span className="text-sm text-gray-400">No skills detected yet.</span>}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Career match insights</h3>
                <ul className="space-y-2 text-gray-200">
                  {analysis.careerMatches.map((match) => (
                    <li key={match.title} className="rounded-2xl bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium">{match.title}</p>
                        <span className="text-sm text-gray-400">{match.score}%</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>

            <div className="space-y-6">
              <GlassCard className="p-6" hoverEffect={false}>
                <h3 className="text-xl font-semibold mb-3">Skill Gap Analysis</h3>
                <pre className="whitespace-pre-wrap text-gray-200">{analysis.skillGapAnalysis}</pre>
              </GlassCard>

              <GlassCard className="p-6" hoverEffect={false}>
                <h3 className="text-xl font-semibold mb-3">Course Recommendations</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-200">
                  {analysis.courseRecommendations.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
