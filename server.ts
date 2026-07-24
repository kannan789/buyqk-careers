import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { INITIAL_JOBS } from "./src/data/jobsData.js";
import { JobApplication, UserAccount, JobOpening } from "./src/types.js";

// Mutable In-memory jobs store
let activeJobs: JobOpening[] = [...INITIAL_JOBS];

// In-memory User accounts store (Candidates & Admin)
const userAccounts: (UserAccount & { password?: string })[] = [
  {
    id: "usr-admin-001",
    email: "admin@buyqk.com",
    password: "admin",
    fullName: "BuyQK Talent Acquisition Lead",
    phone: "+91 80 4900 2899",
    role: "admin",
    city: "Bengaluru",
    state: "Karnataka",
    pinCode: "560034",
    highestQualification: "MBA HR",
    experienceYears: "5+ Yrs",
    skills: ["Talent Acquisition", "Technical Recruiting", "Operations Management"],
    preferredShift: "Day Shift",
    preferredLocation: "Bengaluru",
    hasLaptopAndWifi: true,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
  },
  {
    id: "usr-cand-001",
    email: "ananya.roy@example.com",
    password: "password123",
    fullName: "Ananya Roy",
    phone: "+91 98301 23456",
    role: "candidate",
    city: "Kolkata",
    state: "West Bengal",
    pinCode: "700001",
    highestQualification: "Graduate / Any Bachelor Degree",
    experienceYears: "Fresher (0 yrs)",
    currentCompany: "N/A - Fresh Graduate",
    skills: ["Customer Communication", "Hindi & English Fluency", "Fast Typing (35 WPM)", "Problem Solving"],
    preferredShift: "Rotational (24/7)",
    preferredLocation: "Kolkata",
    hasLaptopAndWifi: true,
    resumeFileName: "Ananya_Roy_CV.pdf",
    resumeText: "B.A. Graduate from Kolkata University with fluent verbal & written English, Hindi, Bengali skills. Customer support internship experience.",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

// In-memory application store
const storedApplications: JobApplication[] = [
  {
    id: "app-demo-001",
    regId: "BUYQK-2026-REG-88192",
    candidateId: "usr-cand-001",
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
    recruiterNotes: "Strong communication skills, verified laptop and broadband connection.",
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

  // --- AUTH ROUTES ---
  // Register new candidate account
  app.post("/api/auth/register", (req, res) => {
    try {
      const { 
        email, password, fullName, phone, city, state, pinCode,
        highestQualification, experienceYears, currentCompany, skills,
        preferredShift, preferredLocation, hasLaptopAndWifi,
        resumeFileName, resumeText
      } = req.body;

      if (!email || !password || !fullName || !phone) {
        return res.status(400).json({
          success: false,
          error: "Please fill in all mandatory fields (Email, Password, Full Name, Phone)."
        });
      }

      const existing = userAccounts.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
      if (existing) {
        return res.status(400).json({
          success: false,
          error: "An account with this email address already exists. Please log in instead."
        });
      }

      const newUser: UserAccount & { password?: string } = {
        id: `usr-${Date.now()}`,
        email: email.toLowerCase().trim(),
        password,
        fullName,
        phone,
        role: "candidate",
        city: city || "Kolkata",
        state: state || "West Bengal",
        pinCode: pinCode || "700001",
        highestQualification: highestQualification || "Graduate / Any Bachelor Degree",
        experienceYears: experienceYears || "Fresher (0 yrs)",
        currentCompany: currentCompany || "",
        skills: Array.isArray(skills) ? skills : (skills ? skills.split(",").map((s: string) => s.trim()) : ["Communication"]),
        preferredShift: preferredShift || "Rotational (24/7)",
        preferredLocation: preferredLocation || "Kolkata",
        hasLaptopAndWifi: Boolean(hasLaptopAndWifi),
        resumeFileName: resumeFileName || "Candidate_Resume.pdf",
        resumeText: resumeText || "",
        createdAt: new Date().toISOString()
      };

      userAccounts.push(newUser);

      // Return sanitized user object without password
      const { password: _, ...userSafe } = newUser;
      return res.json({
        success: true,
        message: "Account created successfully!",
        user: userSafe
      });
    } catch (err: any) {
      console.error("Register Error:", err);
      return res.status(500).json({ success: false, error: "Failed to create account. Please try again." });
    }
  });

  // Login (Candidate or Admin)
  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, password, rolePreference } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Email and password are required." });
      }

      const user = userAccounts.find(
        u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Invalid email or password. Please check your credentials or create a new account."
        });
      }

      // If user logs in with admin preference or is admin
      if (rolePreference === 'admin' && user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: "Account does not have recruiter/admin privileges."
        });
      }

      const { password: _, ...userSafe } = user;
      return res.json({
        success: true,
        message: `Welcome back, ${user.fullName}!`,
        user: userSafe
      });
    } catch (err: any) {
      console.error("Login Error:", err);
      return res.status(500).json({ success: false, error: "Login failed." });
    }
  });

  // --- JOBS & APPLICATIONS ROUTES ---
  // 1. Get all job openings
  app.get("/api/careers/jobs", (_req, res) => {
    res.json({ success: true, count: activeJobs.length, jobs: activeJobs });
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

      // Check if user account exists or create candidate profile record
      let candidateId = body.candidateId;
      if (!candidateId) {
        const foundUser = userAccounts.find(u => u.email.toLowerCase() === body.email.toLowerCase().trim());
        if (foundUser) {
          candidateId = foundUser.id;
        }
      }

      // Generate unique registration ID
      const regId = `BUYQK-2026-REG-${Math.floor(100000 + Math.random() * 900000)}`;
      const newApp: JobApplication = {
        id: `app-${Date.now()}`,
        regId,
        candidateId,
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

  // 3. Search / Get applications
  app.get("/api/careers/applications", (req, res) => {
    const query = (req.query.query as string || "").toLowerCase().trim();
    const candidateId = req.query.candidateId as string;

    let list = [...storedApplications];
    if (candidateId) {
      list = list.filter(a => a.candidateId === candidateId || a.email.toLowerCase() === req.query.email?.toString().toLowerCase());
    }

    if (query) {
      list = list.filter(
        app => app.email.toLowerCase().includes(query) ||
               app.phone.includes(query) ||
               app.regId.toLowerCase().includes(query) ||
               app.fullName.toLowerCase().includes(query)
      );
    }
    res.json({ success: true, applications: list });
  });

  // --- ADMIN PANEL API ENDPOINTS ---
  // Get all candidate accounts
  app.get("/api/admin/candidates", (_req, res) => {
    const candidates = userAccounts
      .filter(u => u.role === "candidate")
      .map(({ password: _, ...u }) => u);
    res.json({ success: true, candidates });
  });

  // Get all applications for admin
  app.get("/api/admin/applications", (_req, res) => {
    res.json({ success: true, applications: storedApplications });
  });

  // Update application status & recruiter notes
  app.patch("/api/admin/applications/:id", (req, res) => {
    const { id } = req.params;
    const { status, recruiterNotes } = req.body;

    const appIndex = storedApplications.findIndex(a => a.id === id);
    if (appIndex === -1) {
      return res.status(404).json({ success: false, error: "Application not found." });
    }

    if (status) storedApplications[appIndex].status = status;
    if (recruiterNotes !== undefined) storedApplications[appIndex].recruiterNotes = recruiterNotes;

    return res.json({
      success: true,
      message: "Application updated successfully!",
      application: storedApplications[appIndex]
    });
  });

  // Create new Job Opening (Admin)
  app.post("/api/admin/jobs", (req, res) => {
    try {
      const jobData = req.body;
      const newJob: JobOpening = {
        id: `bqk-job-${Date.now()}`,
        reqId: jobData.reqId || `BUYQK-2026-REQ-${Math.floor(100 + Math.random() * 900)}`,
        title: jobData.title,
        department: jobData.department,
        location: jobData.location,
        state: jobData.state || "Pan India",
        workMode: jobData.workMode || "Virtual / WFH",
        shiftType: jobData.shiftType || "Rotational (24/7)",
        experience: jobData.experience || "Fresher (0 yrs)",
        education: jobData.education || "Graduate",
        salary: jobData.salary || "Competitive CTC",
        tags: jobData.tags || ["Hiring Now"],
        isHot: Boolean(jobData.isHot),
        isUrgent: Boolean(jobData.isUrgent),
        postedDate: new Date().toISOString().split("T")[0],
        description: jobData.description || "",
        responsibilities: jobData.responsibilities || ["Execute operational tasks"],
        requirements: jobData.requirements || ["Good communication skills"],
        benefits: jobData.benefits || ["Health Insurance", "Night Allowance"],
        hiringProcess: jobData.hiringProcess || ["1. Resume Screening", "2. Virtual Interview", "3. Offer"],
        openingsCount: Number(jobData.openingsCount) || 5
      };

      activeJobs.unshift(newJob);
      return res.json({ success: true, message: "Job opening published!", job: newJob });
    } catch (err: any) {
      console.error("Create Job Error:", err);
      return res.status(500).json({ success: false, error: "Failed to publish job opening." });
    }
  });

  // Delete Job Opening (Admin)
  app.delete("/api/admin/jobs/:id", (req, res) => {
    const { id } = req.params;
    activeJobs = activeJobs.filter(j => j.id !== id);
    res.json({ success: true, message: "Job opening closed successfully." });
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

      const jobsContext = activeJobs.map(j => ({
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

