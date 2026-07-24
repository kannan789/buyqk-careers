import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Laptop,
  AlertCircle,
  Building2
} from 'lucide-react';
import { UserAccount, JobOpening } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserAccount, targetJob?: JobOpening | null) => void;
  pendingJobToApply?: JobOpening | null;
  initialMode?: 'login' | 'register' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  pendingJobToApply,
  initialMode = 'register'
}) => {
  const [activeMode, setActiveMode] = useState<'register' | 'login' | 'admin'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Kolkata');
  const [highestQualification, setHighestQualification] = useState('Graduate / Any Bachelor Degree');
  const [experienceYears, setExperienceYears] = useState('Fresher (0 yrs)');
  const [currentCompany, setCurrentCompany] = useState('');
  const [skillsText, setSkillsText] = useState('Customer Support, English, Hindi, Typing (35+ WPM)');
  const [preferredShift, setPreferredShift] = useState('Rotational (24/7)');
  const [hasLaptopAndWifi, setHasLaptopAndWifi] = useState(true);
  const [resumeText, setResumeText] = useState('');

  if (!isOpen) return null;

  // Fill Quick Demo Data
  const handleQuickDemoCandidate = () => {
    setEmail('ananya.roy@example.com');
    setPassword('password123');
    setFullName('Ananya Roy');
    setPhone('+91 98301 23456');
    setCity('Kolkata');
    setErrorMessage('');
  };

  const handleQuickDemoAdmin = () => {
    setEmail('admin@buyqk.com');
    setPassword('admin');
    setErrorMessage('');
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      if (activeMode === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            fullName,
            phone,
            city,
            highestQualification,
            experienceYears,
            currentCompany,
            skills: skillsText.split(',').map(s => s.trim()).filter(Boolean),
            preferredShift,
            hasLaptopAndWifi,
            resumeFileName: `${fullName.replace(/\s+/g, '_')}_Resume.pdf`,
            resumeText
          })
        });

        const json = await res.json();
        if (json.success && json.user) {
          onAuthSuccess(json.user, pendingJobToApply);
          onClose();
        } else {
          setErrorMessage(json.error || 'Registration failed. Please try again.');
        }
      } else {
        // Login or Admin Login
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            rolePreference: activeMode === 'admin' ? 'admin' : 'candidate'
          })
        });

        const json = await res.json();
        if (json.success && json.user) {
          onAuthSuccess(json.user, pendingJobToApply);
          onClose();
        } else {
          setErrorMessage(json.error || 'Login failed. Please check your credentials.');
        }
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      setErrorMessage('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#141C2E] border border-[#2A364F] rounded-2xl shadow-2xl text-white my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        id="auth-modal"
      >
        {/* Modal Banner Header */}
        <div className="bg-[#0B0F19] border-b border-[#2A364F] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center text-2xl font-black tracking-tight font-sans">
              <span className="text-white">Buy</span>
              <span className="text-[#FF6B00] italic font-serif ml-0.5 tracking-wide">QK</span>
              <span className="text-xs font-mono font-bold bg-[#141C2E] text-slate-300 border border-[#2A364F] px-2 py-0.5 rounded-full ml-2">
                Careers Portal
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#141C2E] text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors"
            id="close-auth-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Banner if redirected from Apply Button */}
        {pendingJobToApply && (
          <div className="p-3.5 bg-[#FF6B00]/15 border-b border-[#FF6B00]/30 px-6 flex items-center justify-between text-xs text-amber-200 font-semibold">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF6B00] shrink-0 animate-pulse" />
              <span>
                Please Create an Account or Log In to apply for <strong>{pendingJobToApply.title}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-3 bg-[#0B0F19] border-b border-[#2A364F] text-xs font-bold">
          <button
            onClick={() => {
              setActiveMode('register');
              setErrorMessage('');
            }}
            className={`py-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeMode === 'register'
                ? 'border-[#FF6B00] text-[#FF6B00] bg-[#141C2E]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            id="tab-create-account"
          >
            <User className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('login');
              setErrorMessage('');
            }}
            className={`py-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeMode === 'login'
                ? 'border-[#FF6B00] text-[#FF6B00] bg-[#141C2E]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            id="tab-candidate-login"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Candidate Login</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('admin');
              setErrorMessage('');
            }}
            className={`py-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeMode === 'admin'
                ? 'border-purple-500 text-purple-400 bg-[#141C2E]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            id="tab-admin-login"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin / Recruiter</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-xs text-slate-200">

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Quick Demo Button Bar */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0F19] border border-[#2A364F]">
              <span className="text-[11px] text-slate-400 font-semibold">
                {activeMode === 'admin' ? 'Recruiter Demo Account:' : '1-Click Demo Fill:'}
              </span>
              {activeMode === 'admin' ? (
                <button
                  type="button"
                  onClick={handleQuickDemoAdmin}
                  className="px-3 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-[11px] font-bold"
                  id="fill-admin-demo-btn"
                >
                  Fill Admin Credentials (admin@buyqk.com)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleQuickDemoCandidate}
                  className="px-3 py-1 rounded-lg bg-[#FF6B00]/20 hover:bg-[#FF6B00]/30 text-[#FF6B00] border border-[#FF6B00]/40 text-[11px] font-bold"
                  id="fill-candidate-demo-btn"
                >
                  Fill Demo Candidate (Ananya Roy)
                </button>
              )}
            </div>

            {/* Credentials Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#FF6B00]" /> Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. candidate@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-[#FF6B00] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  id="auth-email-input"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#FF6B00]" /> Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-[#FF6B00] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  id="auth-password-input"
                />
              </div>
            </div>

            {/* Extra fields for Registering Candidate Account */}
            {activeMode === 'register' && (
              <>
                <div className="border-t border-[#2A364F] pt-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] mb-3 flex items-center gap-1.5">
                    <User className="w-4 h-4" /> Candidate Profile & Qualification Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-[#FF6B00] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        id="reg-fullname-input"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-[#FF6B00] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        id="reg-phone-input"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">City *</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-[#FF6B00] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        id="reg-city-select"
                      >
                        <option value="Kolkata">Kolkata</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi NCR">Delhi NCR</option>
                        <option value="Other / WFH">Other Location</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">Highest Qualification *</label>
                      <select
                        value={highestQualification}
                        onChange={(e) => setHighestQualification(e.target.value)}
                        className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-[#FF6B00] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        id="reg-qualification-select"
                      >
                        <option value="Graduate / Any Bachelor Degree">Graduate / Bachelor Degree</option>
                        <option value="Post Graduate / Master Degree">Post Graduate / Master Degree</option>
                        <option value="Diploma / Higher Secondary (10+2)">Diploma / 12th Pass</option>
                        <option value="Engineering / B.Tech">Engineering / B.Tech</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">Total Experience *</label>
                      <select
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-[#FF6B00] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        id="reg-experience-select"
                      >
                        <option value="Fresher (0 yrs)">Fresher (0 yrs)</option>
                        <option value="1 - 3 Yrs">1 - 3 Yrs</option>
                        <option value="3 - 5 Yrs">3 - 5 Yrs</option>
                        <option value="5+ Yrs">5+ Yrs</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">Preferred Shift *</label>
                      <select
                        value={preferredShift}
                        onChange={(e) => setPreferredShift(e.target.value)}
                        className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-[#FF6B00] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        id="reg-shift-select"
                      >
                        <option value="Rotational (24/7)">Rotational (24/7)</option>
                        <option value="Day Shift">Day Shift Only</option>
                        <option value="Night Shift">Night Shift Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1 mt-3">
                    <label className="text-[11px] font-bold text-slate-300">Core Skills (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Customer Communication, English & Hindi, Fast Typing, Excel"
                      value={skillsText}
                      onChange={(e) => setSkillsText(e.target.value)}
                      className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-[#FF6B00] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      id="reg-skills-input"
                    />
                  </div>

                  {/* WFH Checkbox */}
                  <div className="p-3 bg-[#0B0F19] border border-[#2A364F] rounded-xl mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-[#FF6B00]" />
                      <div>
                        <p className="font-bold text-white text-[11px]">WFH Readiness Setup</p>
                        <p className="text-[10px] text-slate-400">Do you have a personal laptop/PC with high-speed internet?</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={hasLaptopAndWifi}
                      onChange={(e) => setHasLaptopAndWifi(e.target.checked)}
                      className="w-4 h-4 accent-[#FF6B00]"
                      id="reg-wfh-checkbox"
                    />
                  </div>

                  {/* Resume summary */}
                  <div className="space-y-1 mt-3">
                    <label className="text-[11px] font-bold text-slate-300">Resume / Skills Overview (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="Briefly describe your experience or background for BuyQK recruiters..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-[#FF6B00] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                      id="reg-resume-textarea"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-xs text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
                activeMode === 'admin'
                  ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30'
                  : 'bg-[#FF6B00] hover:bg-[#FF7A00] shadow-[#FF6B00]/30'
              }`}
              id="auth-submit-btn"
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
                  <span>Log In as Recruiter Admin</span>
                </>
              ) : (
                <>
                  <span>Log In to Candidate Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

        </div>

        {/* Modal Footer */}
        <div className="bg-[#0B0F19] border-t border-[#2A364F] px-6 py-4 flex items-center justify-between text-[11px] text-slate-400">
          <span>BuyQK Equal Opportunity Recruitment</span>
          <button
            onClick={onClose}
            className="hover:text-white"
            id="close-auth-footer-btn"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
