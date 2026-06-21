import clientPromise from "@/components/lib/mongodb";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_CHAT_MODEL = process.env.OPENAI_MODEL_CHAT ?? "gpt-4o-mini";
const OPENAI_EMBEDDING_MODEL = process.env.OPENAI_MODEL_EMBEDDING ?? "text-embedding-3-large";

type KnowledgeDoc = {
  title: string;
  category: string;
  tags: string[];
  content: string;
  embedding?: number[];
};

const SAMPLE_KNOWLEDGE: Omit<KnowledgeDoc, "embedding">[] = [
  {
    title: "Software Engineering Career Growth",
    category: "Engineering",
    tags: ["software", "cloud", "devops"],
    content:
      "Modern software engineering careers emphasize cloud-native architecture, product-focused delivery, and continuous learning. High-demand skills include TypeScript, React, Node.js, Kubernetes, machine learning fundamentals, and system design. Recommended certifications include AWS Certified Developer, Google Professional Cloud Developer, and Certified Kubernetes Application Developer. Build portfolio projects around scalable APIs, data pipelines, and automation to demonstrate impact.",
  },
  {
    title: "Medicine & Healthcare Demand Drivers",
    category: "Medicine",
    tags: ["medicine", "telehealth", "patient-care"],
    content:
      "Medicine careers are shaped by telehealth, digital diagnostics, and preventative care. Key competencies include clinical reasoning, patient communication, evidence-based treatment planning, and familiarity with digital health systems. Certifications such as ACLS, BLS, and specialty board preparation remain important. Emerging demand is strong for physicians and nurses who combine clinical expertise with digital workflow optimization and cross-disciplinary collaboration.",
  },
  {
    title: "Pharmacy Career Path and Specialization",
    category: "Pharmacy",
    tags: ["pharmacy", "clinical-pharmacy", "compliance"],
    content:
      "Pharmacy careers are evolving toward clinical pharmacy, medication therapy management, and biotech collaboration. Pharmacists should build strengths in regulatory compliance, drug safety, clinical consultation, and patient counseling. Certifications such as BCPS, CDE, and immunization certification help differentiate candidates. Demand is increasing for pharmacists in specialty care, population health, and pharmaceutical research support roles.",
  },
  {
    title: "Business and Strategy Career Roadmap",
    category: "Business",
    tags: ["strategy", "analytics", "leadership"],
    content:
      "Business careers benefit from strong analytical ability, strategic decision-making, and cross-functional collaboration. High-value skills include financial modeling, marketing analytics, product management, and stakeholder communication. Certifications like PMP, CBAP, and Google Data Analytics can help position professionals for roles in operations, consulting, and product leadership. Emerging demand is centered on digital transformation, ESG strategy, and data-driven growth.",
  },
];

function assertOpenAIKey() {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured. Set it in .env.");
  }
}

async function openAIRequest<T>(path: string, body: unknown): Promise<T> {
  assertOpenAIKey();

  const response = await fetch(`https://api.openai.com/v1${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errorText}`);
  }

  return response.json() as Promise<T>;
}

export async function getOpenAIEmbedding(text: string): Promise<number[]> {
  const payload = {
    model: OPENAI_EMBEDDING_MODEL,
    input: text,
  };

  const result = await openAIRequest<{ data: { embedding: number[] }[] }>("/embeddings", payload);
  return result.data[0].embedding;
}

export async function getOpenAIChatCompletion(messages: { role: string; content: string }[]): Promise<string> {
  const payload = {
    model: OPENAI_CHAT_MODEL,
    messages,
    max_tokens: 500,
    temperature: 0.3,
  };

  const result = await openAIRequest<{
    choices: { message: { content: string } }[];
  }>("/chat/completions", payload);

  return result.choices[0]?.message?.content?.trim() ?? "";
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, value, index) => sum + value * (b[index] ?? 0), 0);
  const magA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
  const magB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}

async function seedKnowledgeBase(collection: any): Promise<void> {
  const docsWithEmbeddings = await Promise.all(
    SAMPLE_KNOWLEDGE.map(async (doc) => ({
      ...doc,
      embedding: await getOpenAIEmbedding(`${doc.title}\n${doc.content}`),
    }))
  );

  await collection.insertMany(docsWithEmbeddings);
}

export async function retrieveRelevantDocuments(query: string, limit = 3): Promise<KnowledgeDoc[]> {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("career_knowledge");

  const documentCount = await collection.countDocuments();
  if (documentCount === 0) {
    await seedKnowledgeBase(collection);
  }

  const queryEmbedding = await getOpenAIEmbedding(query);
  const docs = await collection.find({ embedding: { $exists: true } }).toArray();

  const scored = docs
    .map((doc) => {
      const embedding = (doc as any).embedding || [];
      const score = embedding.length > 0 ? cosineSimilarity(queryEmbedding, embedding) : 0;
      return { ...doc, score };
    })
    .sort((a, b) => (b as any).score - (a as any).score)
    .slice(0, limit);

  return scored as any;
}

export async function generateCareerAdvice(options: {
  prompt: string;
  type: "chat" | "resume";
  resumeText?: string;
}): Promise<{ answer: string; sources: { title: string; category: string; excerpt: string }[] }> {
  const userQuery = options.type === "resume" ? options.resumeText?.trim() ?? options.prompt : options.prompt;
  const docs = await retrieveRelevantDocuments(userQuery, 3);

  const contextText = docs
    .map((doc, index) => `Source ${index + 1} (${doc.category})\nTitle: ${doc.title}\n${doc.content}`)
    .join("\n\n");

  const systemPrompt =
    "You are a trusted AI Career Advisor. Provide practical guidance for skills, certifications, projects, career roadmaps, and future demand trends. Always build answers on the context from the career knowledge base when available.";

  const userPrompt =
    options.type === "resume"
      ? `Analyze the following resume text for strengths, skill gaps, roadmap recommendations, certification suggestions, and future career demand. Respond with a clear, actionable summary.\n\nResume:\n${options.resumeText?.trim()}`
      : `Please answer this career question with market-aware advice, skill recommendations, certifications, project ideas, and future demand observations.\n\nQuestion:\n${options.prompt}`;

  const messages = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `${userPrompt}\n\nRelevant knowledge base context:\n${contextText}`,
    },
  ];

  const answer = await getOpenAIChatCompletion(messages);

  return {
    answer,
    sources: docs.map((doc) => ({
      title: doc.title,
      category: doc.category,
      excerpt: doc.content.slice(0, 240),
    })),
  };
}
