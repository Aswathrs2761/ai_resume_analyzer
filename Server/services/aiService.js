import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export default async function analyzeResume(text) {
  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: `
You are an advanced ATS (Applicant Tracking System) resume evaluator used by recruiters and hiring managers.

STRICT RULES:
- Return ONLY valid JSON.
- No markdown.
- No explanations.
- No extra text.
- Follow structure EXACTLY.

You must evaluate the resume using ATS scoring logic based on the provided Job Description.

SCORING CRITERIA (Total = 100):

1. Keyword Match (40 points)
- Compare resume skills, tools, and technologies with job description keywords.

2. Experience Relevance (20 points)
- Role alignment
- Years of experience
- Domain relevance

3. Impact & Achievements (15 points)
- Quantified results (%, revenue, performance improvements)
- Action verbs

4. Resume Structure (15 points)
- Professional summary quality
- Bullet clarity
- Section organization

5. Completeness (10 points)
- Projects, certifications, education, skills sections

ANALYSIS REQUIREMENTS:
- Extract skills ONLY from resume.
- Missing skills MUST come from job description comparison.
- Analyze professional summary separately.
- Suggestions must be actionable and ATS-focused.
- Suggestions must be specific improvements, not generic advice.

Return EXACT structure:

{
  "Atsscore": number,
  "skills": string[],
  "missingSkills": string[],
  "suggestions": string[],
  "summary": string
}



RESUME:
${text}
`
      }
    ]
  });

  return response.choices[0].message.content;
}