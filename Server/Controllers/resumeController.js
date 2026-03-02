import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import analyzeResume from "../services/aiService.js";
import ResumeAnalysis from "../Models/ResumeAnalysis.js";

export const uploadResume = async (req, res) => {
  let filePath;

  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    filePath = file.path;

    const buffer = await fs.promises.readFile(filePath);

    // Load PDF
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer)
    });

    const pdf = await loadingTask.promise;

    let text = "";

    // Extract text from PDF
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const pageText = content.items.map(item => item.str).join(" ");
      text += pageText + "\n";
    }

    // console.log("📄 Extracted text length:", text.length);

    // OCR fallback if needed
    if (!text || text.trim().length < 50) {
      // console.log("⚠️ No text found — using OCR fallback");

      const { extractTextFromImage } = await import("../utils/ocr.js");

      text = await extractTextFromImage(filePath);
    }

    // console.log("📄 Final text length:", text.length);

    // Prevent empty resume
    if (!text || text.trim().length < 50) {
      return res.status(400).json({
        error: "Unable to extract text from resume."
      });
    }

    // AI call
    let aiResult;

    try {
      aiResult = await analyzeResume(text);
    } catch (err) {
      console.error("AI error:", err.response?.data || err.message);

      if (err.response?.status === 429) {
        return res.status(429).json({
          error: "AI service busy. Try again later."
        });
      }

      return res.status(500).json({
        error: "AI processing failed"
      });
    }

    let analysis;

    try {
      analysis = JSON.parse(aiResult);
      // console.log("AI ANALYSIS OBJECT:", analysis);
// console.log("ATS SCORE VALUE:", analysis.score);
    } catch (e) {
      console.error("AI returned invalid JSON:", aiResult);
      return res.status(500).json({
        error: "AI returned invalid format"
      });
    }

    if (Array.isArray(analysis.summary)) {
  analysis.summary = analysis.summary.join(" ");
}

    const savedResume = await ResumeAnalysis.create({
      user: req.user._id,     // ✅ MATCHES SCHEMA
      fileName: file.filename,
      resumeText: text,
      Atsscore: analysis.Atsscore,
      skills: analysis.skills,
      missingSkills: analysis.missingSkills,
      suggestions: analysis.suggestions,
      summary: analysis.summary
    });
    // console.log(savedResume);
    
    return res.status(200).json(savedResume);
    

  } catch (error) {
    console.error("🔥 FULL ERROR:", error.response?.data || error.message || error);
    return res.status(500).json({ error: "Failed to process resume" });
  } finally {
    if (filePath) fs.unlink(filePath, () => { });
  }
};


//get resume analysis by id

export const getResumeAnalysisById = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({ _id: req.params.id, user: req.user._id });
    if (!analysis) {
      return res.status(404).json({ error: "Resume analysis not found" });
    }
    res.status(200).json(analysis);
  } catch (error) {
    console.error("Error fetching resume analysis:", error);
    res.status(500).json({ error: "Failed to fetch resume analysis" });
  }
};

//
export const getUserAnalyses = async (req, res) => {
  try {
    const analyses = await ResumeAnalysis
      .find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(analyses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch analyses" });
  }
};

// get resume history for user

export const getResumeHistory = async (req, res) => {
  try {
    const history = await ResumeAnalysis.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching resume history:", error);
    res.status(500).json({ error: "Failed to fetch resume history" });
  }
};
