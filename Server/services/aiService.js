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
        content: `You are an advanced ATS (Applicant Tracking System) resume analyzer used by recruiters and hiring managers.

STRICT OUTPUT RULES:

* Return ONLY valid JSON.
* Do NOT include markdown.
* Do NOT include explanations.
* Do NOT include headings.
* Do NOT include extra text.
* Follow the JSON structure EXACTLY.

Your task is to evaluate the resume using ATS standards used by modern recruiting systems.

---

ATS SCORING CRITERIA (TOTAL = 100)

1. Skills Strength — 30 points
   Evaluate the strength and relevance of technical skills in the resume.

Higher score if the resume clearly lists:

* Programming languages
* Frameworks
* Tools
* Databases
* Cloud technologies
* DevOps tools

Skills should be clearly listed in a dedicated skills section or naturally within experience/projects.

2. Experience Quality — 25 points
   Evaluate the quality of work experience or projects.

Consider:

* Real-world project complexity
* Technology usage
* Problem solving
* Relevance of work

3. Impact & Achievements — 20 points
   Check whether the resume contains measurable achievements such as:

* Percent improvements
* Performance gains
* User growth
* Revenue impact
* Metrics or numbers

Higher score for quantified achievements and strong action verbs.

4. Resume Structure — 15 points
   Evaluate whether the resume is ATS friendly.

Check for:

* Clear section headings
* Bullet points instead of long paragraphs
* Professional summary
* Logical organization
* Clean formatting

5. Completeness — 10 points
   Check whether the resume contains key sections:

* Skills
* Projects or Experience
* Education
* Certifications (optional)

---

SKILL EXTRACTION RULES

Extract technical skills ONLY from the resume.

Skills may include:

* Programming languages
* Frameworks
* Libraries
* Tools
* Databases
* Cloud platforms
* DevOps tools

Do NOT invent skills.

Normalize skill names where possible.

Examples:
ReactJS → React
NodeJS → Node.js
NextJS → Next.js

---

MISSING SKILLS RULES

Since no Job Description is provided, identify commonly expected industry skills that are missing for a strong technical resume.

Focus on widely used technologies such as:

* Cloud platforms (AWS, Azure, GCP)
* DevOps tools (Docker, Kubernetes)
* Databases
* Testing frameworks
* Version control tools
* CI/CD tools

Only include skills that would realistically strengthen the resume.

Limit missingSkills to the most impactful improvements.

---

SUGGESTION RULES

Suggestions must be specific and actionable.

Suggestions should focus on:

* Adding measurable achievements
* Improving ATS keyword density
* Adding missing industry-standard tools or technologies
* Improving professional summary
* Strengthening project descriptions

Avoid generic advice.

Each suggestion should clearly improve the ATS score.

---

SUMMARY RULES

Write a short recruiter-style evaluation (2–3 sentences).

Include:

* Overall ATS score evaluation
* Key strengths of the resume
* Main improvements needed

---

OUTPUT STRUCTURE (STRICT)

{
"Atsscore": number,
"skills": string[],
"missingSkills": string[],
"suggestions": string[],
"summary": string
}

---

RESUME:
${text}
`
      }
    ]
  });

  return response.choices[0].message.content;
}