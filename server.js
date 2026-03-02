import express, { Router } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './Server/Config/db.js';
import router from './Server/routes/authRoutes.js';
import ResumeRouter from './Server/routes/resumeRoutes.js';





dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to the AI Resume Analyzer API!');
});

app.use("/api/auth", router)
app.use("/api/resume", ResumeRouter)


const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});











