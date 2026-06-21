import pdfParse from "pdf-parse";

const SKILL_KEYWORDS = [
  "javascript",
  "typescript",
  "react",
  "node.js",
  "node",
  "python",
  "sql",
  "aws",
  "azure",
  "gcp",
  "docker",
  "kubernetes",
  "jira",
  "git",
  "rest",
  "graphql",
  "machine learning",
  "data analysis",
  "excel",
  "tableau",
  "power bi",
  "linux",
  "project management",
  "communication",
  "team leadership",
  "clinical",
  "pharmacy",
  "patient care",
  "regulatory",
  "compliance",
  "product management",
  "business analysis",
  "presentation",
  "budgeting",
  "analytics",
  "statistical analysis",
  "research",
  "architecture",
  "system design",
  "devops",
  "automation",
  "cloud",
  "cybersecurity",
  "seo",
  "marketing",
];

const CAREER_PROFILES = [
  {
    title: "Software Engineer",
    keywords: ["javascript", "typescript", "react", "node", "docker", "kubernetes", "aws", "graphql", "rest", "system design", "architecture", "git"],
    courses: [
      "Advanced React and TypeScript architecture",
      "Scalable Node.js API development",
      "Cloud-native microservices with Docker and Kubernetes",
    ],
  },
  {
    title: "Data Analyst",
    keywords: ["python", "sql", "excel", "tableau", "power bi", "data analysis", "statistics", "analytics", "visualization"],
    courses: [
      "Data analysis with Python and SQL",
      "Tableau visualization for business stakeholders",
      "Statistics and predictive analytics fundamentals",
    ],
  },
  {
    title: "Product Manager",
    keywords: ["product management", "roadmap", "stakeholder", "user research", "agile", "communication", "strategy", "analytics", "business analysis"],
    courses: [
      "Product strategy and roadmap planning",
      "Customer research for product innovation",
      "Agile project management for product teams",
    ],
  },
  {
    title: "Healthcare Professional",
    keywords: ["patient care", "clinical", "medical", "healthcare", "telehealth", "diagnostics", "treatment planning", "collaboration"],
    courses: [
      "Clinical best practices and patient communication",
      "Telehealth workflow and digital care delivery",
      "Healthcare compliance and quality improvement",
    ],
  },
  {
    title: "Pharmacy Professional",
    keywords: ["pharmacy", "medication", "regulatory", "clinical pharmacy", "compliance", "patient counseling", "drug safety"],
    courses: [
      "Clinical pharmacy and medication therapy management",
      "Pharmacy regulatory standards and compliance",
      "Pharmaceutical research and evidence-based care",
    ],
  },
  {
    title: "Business Analyst",
    keywords: ["business analysis", "financial modeling", "stakeholder", "requirements", "process improvement", "data analytics", "strategy"],
    courses: [
      "Business analysis and process improvement",
      "Financial modeling and decision-making",
      "Stakeholder communication and requirements gathering",
    ],
  },
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findSkills(text: string) {
  const normalized = normalize(text);
  const found = new Set<string>();

  SKILL_KEYWORDS.forEach((skill) => {
    const normalizedSkill = normalize(skill);
    const pattern = new RegExp(`\\b${normalizedSkill.replace(/\\s+/g, "\\s+") }\\b`, "i");
    if (pattern.test(normalized)) {
      found.add(skill);
    }
  });

  return Array.from(found).sort();
}

function scoreCareerMatch(text: string) {
  const normalized = normalize(text);

  const matches = CAREER_PROFILES.map((profile) => {
    const count = profile.keywords.reduce((sum, keyword) => {
      const pattern = new RegExp(`\\b${normalize(keyword).replace(/\\s+/g, "\\s+")}\\b`, "i");
      return pattern.test(normalized) ? sum + 1 : sum;
    }, 0);
    return {
      ...profile,
      matchCount: count,
      score: Math.round((count / profile.keywords.length) * 100),
    };
  });

  const sorted = matches.sort((a, b) => b.score - a.score || b.matchCount - a.matchCount);
  return sorted;
}

export function calculateAtsScore(text: string, skills: string[]) {
  const normalized = normalize(text);
  const requiredSections = ["experience", "education", "skills", "projects", "certifications", "summary", "objective"];
  const sectionCount = requiredSections.reduce((count, section) => (normalized.includes(section) ? count + 1 : count), 0);
  const skillDensity = Math.min(skills.length, 10);
  const lengthScore = Math.min(20, Math.max(0, Math.floor(normalized.split(" ").length / 20) - 5));

  let score = 50 + sectionCount * 7 + skillDensity * 3 + lengthScore;
  if (normalized.split(" ").length < 150) score -= 10;
  if (normalized.split(" ").length > 700) score += 5;
  if (skills.length === 0) score -= 20;

  return Math.max(0, Math.min(100, score));
}

function buildSkillGapAnalysis(foundSkills: string[], topCareer: typeof CAREER_PROFILES[number]) {
  const missing = topCareer.keywords.filter((keyword) => {
    const normalizedKeyword = normalize(keyword);
    return !foundSkills.some((skill) => normalize(skill) === normalizedKeyword);
  });

  if (missing.length === 0) {
    return `Your resume strongly aligns with the ${topCareer.title} profile. Key abilities and domain terms are well represented.`;
  }

  const gapSummary = missing.slice(0, 5).map((skill) => `• ${skill}`).join("\n");
  return `To improve your match for ${topCareer.title}, consider adding or emphasizing:
${gapSummary}`;
}

function buildCourseRecommendations(topCareer: typeof CAREER_PROFILES[number], missingSkills: string[]) {
  const recommendations = [...topCareer.courses];

  if (missingSkills.length) {
    missingSkills.slice(0, 3).forEach((skill) => {
      recommendations.push(`Learn more about ${skill} through a targeted online course or certification.`);
    });
  }

  return recommendations;
}

export async function extractTextFromPDF(fileBuffer: ArrayBuffer) {
  const data = await pdfParse(Buffer.from(fileBuffer));
  return data.text || "";
}

export async function analyzeResumeText(resumeText: string) {
  const cleanedText = resumeText.trim();
  const extractedSkills = findSkills(cleanedText);
  const careerMatches = scoreCareerMatch(cleanedText);
  const topCareer = careerMatches[0];
  const atsScore = calculateAtsScore(cleanedText, extractedSkills);
  const careerMatchScore = Math.max(0, Math.min(100, Math.round((topCareer.score * 0.65) + Math.min(20, extractedSkills.length * 2))));
  const missingSkills = topCareer.keywords.filter((keyword) => !extractedSkills.some((skill) => normalize(skill) === normalize(keyword)));
  const skillGapAnalysis = buildSkillGapAnalysis(extractedSkills, topCareer);
  const courseRecommendations = buildCourseRecommendations(topCareer, missingSkills);

  return {
    extractedSkills,
    atsScore,
    careerMatchScore,
    careerMatches: careerMatches.slice(0, 3).map((profile) => ({
      title: profile.title,
      score: profile.score,
    })),
    skillGapAnalysis,
    courseRecommendations,
    topCareer: topCareer.title,
    textSummary: cleanedText.slice(0, 1200),
  };
}
