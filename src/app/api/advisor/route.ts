import { NextResponse } from "next/server";
import { generateCareerAdvice } from "@/lib/aiAdvisor";

export async function GET() {
  return NextResponse.json({ status: "ok" });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { mode, prompt, resumeText } = body as {
    mode?: string;
    prompt?: string;
    resumeText?: string;
  };

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
  }

  if (mode !== "chat" && mode !== "resume") {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  try {
    const result = await generateCareerAdvice({
      prompt,
      type: mode as "chat" | "resume",
      resumeText: typeof resumeText === "string" ? resumeText : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
