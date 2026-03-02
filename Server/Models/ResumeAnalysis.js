import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
   resumeText: {
        type: String,
        required: true
    },
    Atsscore: {
        type: Number,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    missingSkills: {
        type: [String],
        required: true
    },
    suggestions: {
        type: [String],
        required: true
    },
    summary: {
        type: String,
        required: true
    }
}, {
    timestamps: true
}); 


export default mongoose.model("ResumeAnalysis", resumeAnalysisSchema);