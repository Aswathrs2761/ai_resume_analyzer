import express from "express";
import {  getResumeAnalysisById, getResumeHistory, getUserAnalyses, uploadResume } from "../Controllers/resumeController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";




const ResumeRouter = express.Router();

ResumeRouter.post("/uploadresume", authMiddleware , upload.single("resume") , uploadResume)
ResumeRouter.get("/getanalysis/:id", authMiddleware , getResumeAnalysisById)
ResumeRouter.get("/history", authMiddleware, getResumeHistory)
ResumeRouter.get("/analysis", authMiddleware, getUserAnalyses)

export default ResumeRouter;
