import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import Tesseract from "tesseract.js";
import { fromPath } from "pdf2pic";

export async function extractResumeText(pdfPath) {
  try {

    // 1️⃣ Try normal PDF text extraction
    const buffer = fs.readFileSync(pdfPath);
    const pdfData = await pdf(buffer);

    const text = pdfData.text.trim();

    // If text exists → return immediately
    if (text.length > 100) {
      return text;
    }

    console.log("⚠️ No text found in PDF, running OCR...");

    // 2️⃣ Convert first page PDF → image
    const options = {
      density: 300,
      saveFilename: "page",
      savePath: path.dirname(pdfPath),
      format: "png",
      width: 1200,
      height: 1200
    };

    const convert = fromPath(pdfPath, options);
    const page = await convert(1);

    const imagePath = page.path;

    // 3️⃣ Run OCR
    const result = await Tesseract.recognize(imagePath, "eng");

    // cleanup
    fs.unlink(imagePath, () => {});

    return result.data.text;

  } catch (error) {
    console.error("Text extraction error:", error);
    throw error;
  }
}