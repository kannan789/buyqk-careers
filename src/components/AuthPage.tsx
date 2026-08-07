import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  ShieldCheck, 
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Briefcase,
  Upload,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { UserAccount, JobOpening } from '../types';

interface AuthPageProps {
  onBackToJobs: () => void;
  onAuthSuccess: (user: UserAccount, targetJob?: JobOpening | null) => void;
  pendingJobToApply?: JobOpening | null;
  initialMode?: 'login' | 'register' | 'admin';
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onBackToJobs,
  onAuthSuccess,
  pendingJobToApply,
  initialMode = 'register'
}) => {
  const [activeMode, setActiveMode] = useState<'register' | 'login' | 'admin'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Clean initial form state - NO autofills/pre-populated values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [highestQualification, setHighestQualification] = useState('Graduate / Bachelor Degree');
  const [experienceYears, setExperienceYears] = useState('Fresher (0 yrs)');
  const [currentCompany, setCurrentCompany] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [preferredShift, setPreferredShift] = useState('Rotational (24/7)');
  const [hasLaptopAndWifi, setHasLaptopAndWifi] = useState(true);

  // Resume Upload State
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFileName(file.name);
    }
  };

  // Client-side authentication and account creation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (!password.trim() || password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      if (activeMode === 'register') {
        if (!fullName.trim()) {
          setErrorMessage('Please enter your full name.');
          setLoading(false);
          return;
        }

        const newUser: UserAccount = {
          id: `usr-${Date.now()}`,
          email: email.trim().toLowerCase(),
          fullName: fullName.trim(),
          phone: phone.trim(),
          city: city.trim() || 'Kolkata',
          highestQualification,
          experienceYears,
          currentCompany,
          skills: skillsText ? skillsText.split(',').map(s => s.trim()).filter(Boolean) : [],
          preferredShift,
          hasLaptopAndWifi,
          resumeFileName: resumeFileName || undefined,
          resumeText: resumeText || undefined,
          role: 'candidate',
          createdAt: new Date().toISOString()
        };

        setLoading(false);
        onAuthSuccess(newUser, pendingJobToApply);
      } else if (activeMode === 'admin') {
        // Admin Login
        const adminUser: UserAccount = {
          id: 'admin-01',
          email: email.trim().toLowerCase(),
          fullName: 'Recruiter Admin',
          role: 'admin',
          createdAt: new Date().toISOString()
        };

        setLoading(false);
        onAuthSuccess(adminUser, pendingJobToApply);
      } else {
        // Candidate Login
        const candidateUser: UserAccount = {
          id: `usr-${Date.now()}`,
          email: email.trim().toLowerCase(),
          fullName: fullName.trim() || email.split('@')[0],
          role: 'candidate',
          createdAt: new Date().toISOString()
        };

        setLoading(false);
        onAuthSuccess(candidateUser, pendingJobToApply);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header Row with Back Navigation */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between mb-8">
        <button
          onClick={onBackToJobs}
          className="flex items-center gap-2 text-slate-300 hover:text-white bg-[#141C2E] border border-[#2A364F] px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer"
          id="back-to-jobs-btn"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF6B00]" />
          <span>Back to Job Openings</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-white">Buy</span>
          <span className="text-xl font-black text-[#FF6B00] italic font-serif">QK</span>
          <span className="text-xs bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30 px-2 py-0.5 rounded font-bold uppercase ml-1">
            Careers
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-2xl mx-auto w-full bg-[#141C2E] border border-[#2A364F] rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Banner if redirected from Apply */}
        {pendingJobToApply && (
          <div className="p-4 bg-[#FF6B00]/15 border-b border-[#FF6B00]/30 px-6 flex items-center gap-3 text-xs text-amber-200 font-medium">
            <Briefcase className="w-4 h-4 text-[#FF6B00] shrink-0" />
            <span>
              Create an account or log in to submit your application for <strong>{pendingJobToApply.title}</strong>
            </span>
          </div>
        )}

        {/* Page View Title Header */}
        <div className="bg-[#0B0F19] border-b border-[#2A364F] px-6 py-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-1">
            {activeMode === 'register' && 'Create Candidate Account'}
            {activeMode === 'login' && 'Candidate Log In'}
            {activeMode === 'admin' && 'Recruiter Admin Portal'}
          </h1>
          <p className="text-xs text-slate-400">
            {activeMode === 'register' && 'Set up your BuyQK profile to track applications and get hired fast.'}
            {activeMode === 'login' && 'Sign in to manage your applications and check selection status.'}
            {activeMode === 'admin' && 'Secure access for BuyQK hiring leads & HR managers.'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 bg-[#0B0F19] border-b border-[#2A364F] text-xs font-bold">
          <button
            onClick={() => {
              setActiveMode('register');
              setErrorMessage('');
            }}
            className={`py-3.5 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'register'
                ? 'border-[#FF6B00] text-[#FF6B00] bg-[#141C2E]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            id="page-tab-register"
          >
            <User className="w-4 h-4" />
            <span>Create Account</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('login');
              setErrorMessage('');
            }}
            className={`py-3.5 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'login'
                ? 'border-[#FF6B00] text-[#FF6B00] bg-[#141C2E]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            id="page-tab-login"
          >
            <Lock className="w-4 h-4" />
            <span>Candidate Log In</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('admin');
              setErrorMessage('');
            }}
            className={`py-3.5 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'admin'
                ? 'border-purple-500 text-purple-400 bg-[#141C2E]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            id="page-tab-admin"
          >
            <Sh
            ieldCheck className="w-4 h-4" />
            <span>Recruiter Admin</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 text-xs text-slate-200">
          
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Credentials Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#FF6B00]" /> Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. candidate@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-[#FF6B00] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  id="auth-page-email"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#FF6B00]" /> Password <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-[#FF6B00] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  id="auth-page-password"
                />
              </div>
            </div>

            {/* Profile Fields when Creating Account */}
            {activeMode === 'register' && (
              <div className="space-y-4 pt-3 border-t border-[#2A364F]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] flex items-center gap-1.5">
                  <User className="w-4 h-4" /> Personal & Qualification Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-[#FF6B00] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                      id="auth-page-fullname"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-[#FF6B00] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none"
                        id="auth-page-phone"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kolkata"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-[#FF6B00] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                      id="auth-page-city"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Highest Qualification *</label>
                    <select
                      value={highestQualification}
                      onChange={(e) => setHighestQualification(e.target.value)}
                      className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-[#FF6B00] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                      id="auth-page-qualification"
                    >
                      <option value="Graduate / Bachelor Degree">Graduate / Bachelor Degree</option>
                      <option value="Post Graduate / Master Degree">Post Graduate / Master Degree</option>
                      <option value="Diploma / 12th Pass">Diploma / 12th Pass</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Total Experience *</label>
                    <select
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-[#FF6B00] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                      id="auth-page-experience"
                    >
                      <option value="Fresher (0 yrs)">Fresher (0 yrs)</option>
                      <option value="1 - 3 Yrs">1 - 3 Yrs Experience</option>
                      <option value="3 - 5 Yrs">3 - 5 Yrs Experience</option>
                      <option value="5+ Yrs">5+ Yrs Senior Experience</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Preferred Shift *</label>
                    <select
                      value={preferredShift}
                      onChange={(e) => setPreferredShift(e.target.value)}
                      className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-[#FF6B00] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                      id="auth-page-shift"
                    >
                      <option value="Rotational (24/7)">Rotational 24/7</option>
                      <option value="Day Shift">Day Shift Only</option>
                      <option value="Night Shift">Night Shift Only</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Core Skills (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Customer Service, English, Hindi, React"
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-[#FF6B00] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    id="auth-page-skills"
                  />
                </div>

                {/* Resume Upload Field */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Upload Resume / CV (Optional)</span>
                  </label>

                  <div 
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        setResumeFileName(e.dataTransfer.files[0].name);
                      }
                    }}
                    className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer relative ${
                      isDragOver 
                        ? 'border-[#FF6B00] bg-[#FF6B00]/10' 
                        : resumeFileName 
                          ? 'border-emerald-500/50 bg-emerald-950/20' 
                          : 'border-[#2A364F] hover:border-[#FF6B00]/50 bg-[#0B0F19]'
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      id="auth-page-resume-input"
                    />

                    <div className="flex items-center justify-center gap-2 pointer-events-none">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        resumeFileName ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#141C2E] text-[#FF6B00]'
                      }`}>
                        {resumeFileName ? <CheckCircle2 className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                      </div>

                      {resumeFileName ? (
                        <div className="text-left">
                          <p className="text-xs font-bold text-emerald-300">
                            {resumeFileName}
                          </p>
                          <p className="text-[10px] text-slate-400">Click or drop a new file to replace</p>
                        </div>
                      ) : (
                        <div className="text-left">
                          <p className="text-xs font-bold text-white">
                            Drag & Drop Resume or <span className="text-[#FF6B00]">Browse File</span>
                          </p>
                          <p className="text-[10px] text-slate-400">Supports PDF, DOCX, TXT</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Brief bio or cover summary (Optional)..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-[#FF6B00] rounded-xl p-2.5 text-xs text-white focus:outline-none placeholder-slate-500"
                    id="auth-page-resume-text"
                  />
                </div>

              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl font-bold text-xs text-white transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  activeMode === 'admin'
                    ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30'
                    : 'bg-[#FF6B00] hover:bg-[#FF7A00] shadow-[#FF6B00]/30'
                }`}
                id="auth-page-submit-btn"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : activeMode === 'register' ? (
                  <>
                    <span>Create Account & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : activeMode === 'admin' ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Log In to Recruiter Portal</span>
                  </>
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

        {/* Footer */}
        <div className="bg-[#0B0F19] border-t border-[#2A364F] px-6 py-4 flex items-center justify-between text-[11px] text-slate-400">
          <span>BuyQK Hiring Portal</span>
          <button
            onClick={onBackToJobs}
            className="hover:text-white underline cursor-pointer"
            id="auth-page-cancel-btn"
          >
            Return to Careers
          </button>
        </div>

      </div>
    </div>
  );
};
