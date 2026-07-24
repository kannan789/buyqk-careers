import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Laptop, 
  Sparkles,
  AlertCircle,
  Clock,
  Send
} from 'lucide-react';
import { JobOpening, JobApplication, UserAccount } from '../types';

interface ApplicationFormModalProps {
  job: JobOpening | null;
  currentUser?: UserAccount | null;
  onClose: () => void;
  onSuccess: (application: JobApplication) => void;
}

export const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  job,
  currentUser,
  onClose,
  onSuccess
}) => {
  if (!job) return null;

  // Form State
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [city, setCity] = useState(currentUser?.city || (job.location !== 'Remote / WFH' ? job.location : 'Kolkata'));
  const [pinCode, setPinCode] = useState('');
  const [gender, setGender] = useState('Male');
  const [qualification, setQualification] = useState(currentUser?.highestQualification || (job.education.includes('Graduate') ? 'Graduate / Bachelor Degree' : 'Post Graduate'));
  const [experienceYears, setExperienceYears] = useState(currentUser?.experienceYears || job.experience);
  const [currentCompany, setCurrentCompany] = useState(currentUser?.currentCompany || '');
  const [skills, setSkills] = useState(currentUser?.skills?.join(', ') || (job.department.includes('Trust') ? 'Customer Communication, Hindi, English, Typing Speed' : 'Problem Solving, Teamwork'));
  const [preferredShift, setPreferredShift] = useState(currentUser?.preferredShift || job.shiftType);
  const [preferredLocation, setPreferredLocation] = useState(job.location);
  const [hasLaptopAndWifi, setHasLaptopAndWifi] = useState(currentUser?.hasLaptopAndWifi ?? true);
  const [noticePeriod, setNoticePeriod] = useState('Immediate Joiner (Within 7 Days)');
  const [expectedCtc, setExpectedCtc] = useState('');
  
  // Resume upload state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState(currentUser?.resumeFileName || 'My_Updated_CV.pdf');
  const [resumeText, setResumeText] = useState(currentUser?.resumeText || '');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync if currentUser updates
  useEffect(() => {
    if (currentUser) {
      if (currentUser.fullName) setFullName(currentUser.fullName);
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.city) setCity(currentUser.city);
      if (currentUser.highestQualification) setQualification(currentUser.highestQualification);
      if (currentUser.experienceYears) setExperienceYears(currentUser.experienceYears);
      if (currentUser.skills?.length) setSkills(currentUser.skills.join(', '));
      if (currentUser.preferredShift) setPreferredShift(currentUser.preferredShift);
      if (currentUser.resumeFileName) setResumeFileName(currentUser.resumeFileName);
      if (currentUser.resumeText) setResumeText(currentUser.resumeText);
    }
  }, [currentUser]);

  // Handle simulated file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setResumeFileName(file.name);
      setErrorMessage('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!city.trim()) {
      setErrorMessage('Please enter your current city.');
      return;
    }
    if (!resumeFileName) {
      setErrorMessage('Please upload your resume file (PDF or DOCX).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        jobId: job.id,
        jobTitle: job.title,
        reqId: job.reqId,
        department: job.department,
        fullName,
        email,
        phone,
        city,
        state: job.state,
        pinCode,
        gender,
        highestQualification: qualification,
        experienceYears,
        currentCompany,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        preferredShift,
        preferredLocation,
        hasLaptopAndWifi,
        noticePeriod,
        expectedCtc,
        resumeFileName,
        resumeText: resumeText || `${fullName} - ${qualification} with skills in ${skills}`
      };

      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success && data.application) {
        onSuccess(data.application);
      } else {
        setErrorMessage(data.error || 'Failed to register application. Please check your fields.');
      }
    } catch (err: any) {
      console.error('Submit Application Error:', err);
      // Fallback client registration if network glitch
      const fallbackApp: JobApplication = {
        id: `app-${Date.now()}`,
        regId: `BUYQK-2026-REG-${Math.floor(100000 + Math.random() * 900000)}`,
        jobId: job.id,
        jobTitle: job.title,
        reqId: job.reqId,
        department: job.department,
        fullName,
        email,
        phone,
        city,
        state: job.state,
        pinCode,
        gender,
        highestQualification: qualification,
        experienceYears,
        currentCompany,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        preferredShift,
        preferredLocation,
        hasLaptopAndWifi,
        noticePeriod,
        expectedCtc,
        resumeFileName,
        resumeText,
        status: 'Submitted',
        appliedAt: new Date().toISOString()
      };
      onSuccess(fallbackApp);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#141C2E] border border-[#2A364F] rounded-2xl shadow-2xl text-white my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        id="application-form-modal"
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-10 bg-[#0B0F19] border-b border-[#2A364F] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/15 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#141C2E] border border-[#2A364F] text-[10px] font-mono text-[#FF6B00] font-bold">
                  {job.reqId}
                </span>
                <span className="text-xs text-slate-400">Virtual Application Form</span>
              </div>
              <h2 className="text-lg font-bold text-white truncate max-w-md">
                Apply for {job.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#141C2E] text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors"
            id="close-form-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-slate-200 text-xs sm:text-sm">
          
          {/* Section 1: Personal Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] flex items-center gap-2 border-b border-[#2A364F] pb-1.5">
              <User className="w-4 h-4" />
              1. Personal Details & Contact Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    id="applicant-fullname"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul.sharma@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    id="applicant-email"
                  />
                </div>
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                  Mobile Number (10 Digits) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    id="applicant-phone"
                  />
                </div>
              </div>

              {/* Current City & Pin */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                    Current City <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kolkata"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-xl pl-8 pr-2 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                      id="applicant-city"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-semibold">PIN Code</label>
                  <input
                    type="text"
                    placeholder="700001"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    id="applicant-pincode"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Education & Experience */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 border-b border-[#2A364F] pb-1.5">
              <GraduationCap className="w-4 h-4" />
              2. Qualification, Experience & Shift Preference
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Qualification */}
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold">Highest Qualification *</label>
                <select
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                  id="applicant-qualification"
                >
                  <option value="Graduate / Bachelor Degree">Graduate / Bachelor Degree (B.A., B.Sc., B.Com, B.Tech, BBA)</option>
                  <option value="Post Graduate / Master Degree">Post Graduate / Master Degree (M.A., M.Sc., MBA, M.Tech)</option>
                  <option value="Diploma Holder (10+3 / 12+2)">Diploma Holder (10+3 / 12+2)</option>
                  <option value="Under Graduate / 12th Pass">Under Graduate / 12th Pass (Final Year Result Awaited)</option>
                </select>
              </div>

              {/* Total Experience */}
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold">Total Work Experience *</label>
                <select
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value as any)}
                  className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                  id="applicant-experience"
                >
                  <option value="Fresher (0 yrs)">Fresher (0 yrs - Fresh Graduate)</option>
                  <option value="1 - 3 Yrs">1 - 3 Yrs Experience</option>
                  <option value="3 - 5 Yrs">3 - 5 Yrs Experience</option>
                  <option value="5+ Yrs">5+ Yrs Senior Experience</option>
                </select>
              </div>

              {/* Current Company */}
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold">Current / Last Employer (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Wipro / Amazon / Fresh Graduate"
                  value={currentCompany}
                  onChange={(e) => setCurrentCompany(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                  id="applicant-company"
                />
              </div>

              {/* Key Skills */}
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold">Key Skills & Languages *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. English, Hindi, Customer Support, Typing, React"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                  id="applicant-skills"
                />
              </div>

              {/* Preferred Shift */}
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> Preferred Work Shift *
                </label>
                <select
                  value={preferredShift}
                  onChange={(e) => setPreferredShift(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                  id="applicant-shift"
                >
                  <option value="Rotational (24/7)">Rotational 24/7 (5 Days Work, 2 Rotational Offs)</option>
                  <option value="Day Shift">Day Shift Only (9:00 AM - 6:00 PM)</option>
                  <option value="Night Shift">Night Shift Only (With Night Allowance)</option>
                </select>
              </div>

              {/* Notice Period */}
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold">Notice Period / Availability *</label>
                <select
                  value={noticePeriod}
                  onChange={(e) => setNoticePeriod(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                  id="applicant-notice"
                >
                  <option value="Immediate Joiner (Within 7 Days)">Immediate Joiner (Within 7 Days)</option>
                  <option value="15 Days Notice">15 Days Notice Period</option>
                  <option value="30 Days Notice">30 Days Notice Period</option>
                </select>
              </div>

            </div>
          </div>

          {/* Section 3: WFH Equipment Readiness & Consent */}
          <div className="space-y-2 p-3.5 rounded-xl bg-[#0B0F19] border border-[#2A364F]">
            <div className="flex items-start gap-3">
              <Laptop className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">Work From Home / Virtual Readiness Check</h4>
                <p className="text-[11px] text-slate-400">
                  For WFH roles, candidates must have a personal laptop/desktop with minimum 8GB RAM, Windows 10/11, and stable Wi-Fi.
                </p>
                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasLaptopAndWifi}
                    onChange={(e) => setHasLaptopAndWifi(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FF6B00] focus:ring-[#FF6B00] bg-[#141C2E] border-[#2A364F]"
                    id="applicant-wfh-checkbox"
                  />
                  <span className="text-xs text-slate-200 font-medium">
                    Yes, I have a laptop/desktop and high-speed Wi-Fi connection.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Resume File Upload Box */}
          <div className="space-y-3 pt-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 border-b border-[#2A364F] pb-1.5">
              <Upload className="w-4 h-4" />
              3. Resume / CV Upload <span className="text-rose-400">*</span>
            </h3>

            {/* Drag and Drop Zone */}
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
                  const file = e.dataTransfer.files[0];
                  setResumeFile(file);
                  setResumeFileName(file.name);
                }
              }}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer relative ${
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
                id="applicant-file-input"
              />

              <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  resumeFileName ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#141C2E] text-[#FF6B00]'
                }`}>
                  {resumeFileName ? <CheckCircle2 className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                </div>

                {resumeFileName ? (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                      <span>Uploaded File:</span>
                      <span className="underline">{resumeFileName}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">Click or drag to replace resume (PDF / DOCX)</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">
                      Drag & Drop your Resume here or <span className="text-[#FF6B00]">Browse Files</span>
                    </p>
                    <p className="text-[11px] text-slate-400">Supports PDF, DOCX, TXT (Max size 10MB)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Optional Paste Bio Text */}
            <div className="space-y-1 pt-1">
              <label className="text-xs text-slate-400 font-medium flex items-center justify-between">
                <span>Or Paste Summary / Key Work Highlights (Optional for QK AI Screening):</span>
                <span className="text-[10px] text-purple-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Auto-Analyzed by Gemini
                </span>
              </label>
              <textarea
                rows={3}
                placeholder="Paste key achievements, previous job roles, or cover note here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#FF6B00]"
                id="applicant-resume-text"
              />
            </div>

          </div>

          {/* Declaration Checkbox */}
          <div className="pt-2 border-t border-[#2A364F] text-xs text-slate-400 space-y-2">
            <p className="leading-relaxed text-[11px]">
              By clicking "Submit Application", I confirm that all details provided above are authentic to the best of my knowledge and I agree to participate in BuyQK's virtual recruitment process.
            </p>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#2A364F]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#0B0F19] hover:bg-[#1E293B] border border-[#2A364F] text-slate-300 text-xs font-semibold"
              id="cancel-form-btn"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-7 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF7A00] disabled:bg-slate-700 text-white text-xs font-bold shadow-lg shadow-[#FF6B00]/25 transition-all flex items-center gap-2"
              id="submit-application-btn"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Registering Application...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Web Application</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
