import Tesseract from "tesseract.js";
import pdf from "pdf-poppler";
import path from "path";
import fs from "fs";

export async function extractTextFromImage(pdfPath) {
  const outputDir = path.dirname(pdfPath);

  const opts = {
    format: "png",
    out_dir: outputDir,
    out_prefix: "page",
    page: 1
  };

  // ✅ Convert PDF → PNG
  await pdf.convert(pdfPath, opts);

  const imagePath = path.join(outputDir, "page-1.png");

  // ✅ OCR image
  const result = await Tesseract.recognize(imagePath, "eng");

  // cleanup image
  fs.unlink(imagePath, () => {});

  return result.data.text;
}