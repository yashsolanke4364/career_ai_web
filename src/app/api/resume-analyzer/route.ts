import { NextResponse } from "next/server";
import { extractTextFromPDF, analyzeResumeText } from "@/lib/resumeAnalyzer";

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/pdf")) {
    const arrayBuffer = await req.arrayBuffer();
    const text = await extractTextFromPDF(arrayBuffer);
    const analysis = await analyzeResumeText(text);
    return NextResponse.json(analysis);
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.resumeText !== "string") {
    return NextResponse.json({ error: "Missing resumeText" }, { status: 400 });
  }

  const analysis = await analyzeResumeText(body.resumeText);
  return NextResponse.json(analysis);
}
