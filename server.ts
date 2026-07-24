import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { INITIAL_JOBS } from "./src/data/jobsData.js";
import { JobApplication } from "./src/types.js";

// In-memory application store
const storedApplications: JobApplication[] = [
  {
    id: "app-demo-001",
    regId: "BUYQK-2026-REG-88192",
    jobId: "bqk-job-001",
    jobTitle: "Customer Experience Specialist - Customer Trust & Partner Support",
    reqId: "BUYQK-2026-CTPS-101",
    department: "Customer Trust & Partner Support",
    fullName: "Ananya Roy",
    email: "ananya.roy@example.com",
    phone: "+91 98301 23456",
    city: "Kolkata",
    state: "West Bengal",
    pinCode: "700001",
    gender: "Female",
    highestQualification: "Graduate / Any Bachelor Degree",
    experienceYears: "Fresher (0 yrs)",
    currentCompany: "N/A - Fresh Graduate",
    skills: ["Customer Communication", "Hindi & English Fluency", "Fast Typing (35 WPM)", "Problem Solving"],
    preferredShift: "Rotational (24/7)",
    preferredLocation: "Kolkata",
    hasLaptopAndWifi: true,
    noticePeriod: "Immediate Joiner",
    expectedCtc: "3.5 LPA",
    resumeFileName: "Ananya_Roy_CV.pdf",
    resumeText: "B.A. Graduate from Kolkata University with fluent verbal & written English, Hindi, Bengali skills. Customer support internship experience.",
    status: "Resume Screened",
    appliedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

// Initialize Google GenAI
const getAi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Routes
  // 1. Get all job openings
  app.get("/api/careers/jobs", (_req, res) => {
    res.json({ success: true, count: INITIAL_JOBS.length, jobs: INITIAL_JOBS });
  });

  // 2. Submit new job application
  app.post("/api/careers/apply", (req, res) => {
    try {
      const body = req.body;
      if (!body.jobId || !body.fullName || !body.email || !body.phone) {
        return res.status(400).json({
          success: false,
          error: "Please fill in all required fields (Full Name, Email, Phone, Job Role)."
        });
      }

      // Generate unique registration ID
      const regId = `BUYQK-2026-REG-${Math.floor(100000 + Math.random() * 900000)}`;
      const newApp: JobApplication = {
        id: `app-${Date.now()}`,
        regId,
        jobId: body.jobId,
        jobTitle: body.jobTitle || "BuyQK Position",
        reqId: body.reqId || "BUYQK-2026-GEN",
        department: body.department || "General",
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        city: body.city || "Not Specified",
        state: body.state || "",
        pinCode: body.pinCode || "",
        gender: body.gender || "Prefer not to say",
        highestQualification: body.highestQualification || "Graduate",
        experienceYears: body.experienceYears || "Fresher (0 yrs)",
        currentCompany: body.currentCompany || "",
        skills: Array.isArray(body.skills) ? body.skills : (body.skills ? body.skills.split(",").map((s: string) => s.trim()) : []),
        preferredShift: body.preferredShift || "Rotational (24/7)",
        preferredLocation: body.preferredLocation || "Kolkata",
        hasLaptopAndWifi: Boolean(body.hasLaptopAndWifi),
        noticePeriod: body.noticePeriod || "Immediate Joiner",
        expectedCtc: body.expectedCtc || "",
        resumeFileName: body.resumeFileName || "Candidate_Resume.pdf",
        resumeText: body.resumeText || "",
        status: "Submitted",
        appliedAt: new Date().toISOString()
      };

      storedApplications.unshift(newApp);

      return res.json({
        success: true,
        message: "Application registered successfully!",
        application: newApp
      });
    } catch (err: any) {
      console.error("Apply Error:", err);
      return res.status(500).json({ success: false, error: "Failed to submit application. Please try again." });
    }
  });

  // 3. Search / Get applications for tracking
  app.get("/api/careers/applications", (req, res) => {
    const query = (req.query.query as string || "").toLowerCase().trim();
    if (!query) {
      return res.json({ success: true, applications: storedApplications });
    }
    const filtered = storedApplications.filter(
      app => app.email.toLowerCase().includes(query) ||
             app.phone.includes(query) ||
             app.regId.toLowerCase().includes(query) ||
             app.fullName.toLowerCase().includes(query)
    );
    res.json({ success: true, applications: filtered });
  });

  // 4. AI Resume Matching with Gemini 3.6 Flash
  app.post("/api/careers/ai-match", async (req, res) => {
    try {
      const { resumeText } = req.body;
      if (!resumeText || typeof resumeText !== "string" || !resumeText.trim()) {
        return res.status(400).json({ success: false, error: "Please enter your skills or resume summary text." });
      }

      const ai = getAi();
      if (!ai) {
        return res.status(503).json({
          success: false,
          error: "AI Resume Matcher is currently offline (Missing API key). Please browse jobs manually."
        });
      }

      const jobsContext = INITIAL_JOBS.map(j => ({
        id: j.id,
        reqId: j.reqId,
        title: j.title,
        department: j.department,
        location: j.location,
        workMode: j.workMode,
        shiftType: j.shiftType,
        experience: j.experience,
        requirements: j.requirements.join("; ")
      }));

      const prompt = `You are the Lead Talent Acquisition AI Specialist for BuyQK ("Everything. Delivered." quick commerce & ecommerce).
Analyze the following candidate resume text or skill summary and match it against our active job openings.
Pick the top 3 best-fitting job openings from our open jobs list.

Candidate Resume / Bio:
"""
${resumeText.slice(0, 3000)}
"""

BuyQK Open Job Positions:
${JSON.stringify(jobsContext, null, 2)}

Respond with a JSON object containing:
1. "candidateSummary": A crisp 2-sentence summary of the candidate's core strengths and career suitability.
2. "matches": Array of top 3 job match objects with properties:
   - "jobId": matching job's id (e.g. "bqk-job-001")
   - "jobTitle": matching job's title
   - "matchScore": integer percentage 0 to 100
   - "matchingSkills": array of matching candidate skills
   - "recommendationReason": 1-2 sentences explaining why this position is a great match for them
   - "missingSkills": array of 1-2 skills they can learn on the job`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "{}";
      const parsedData = JSON.parse(responseText);

      return res.json({
        success: true,
        data: parsedData
      });
    } catch (err: any) {
      console.error("AI Match Error:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to analyze resume with QK AI. Please check back shortly."
      });
    }
  });

  // Vite middleware or Static files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BuyQK Careers Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
