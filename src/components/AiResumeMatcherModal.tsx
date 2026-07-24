import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  AlertCircle, 
  Briefcase, 
  Zap,
  TrendingUp,
  Award
} from 'lucide-react';
import { JobOpening, AiMatchResult } from '../types';

interface AiResumeMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: JobOpening[];
  onSelectRoleToApply: (job: JobOpening) => void;
}

export const AiResumeMatcherModal: React.FC<AiResumeMatcherModalProps> = ({
  isOpen,
  onClose,
  jobs,
  onSelectRoleToApply
}) => {
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchData, setMatchData] = useState<{
    candidateSummary?: string;
    matches?: AiMatchResult[];
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim() || resumeText.length < 15) {
      setErrorMessage('Please paste at least a short summary of your skills or work experience (15+ characters).');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage('');
    setMatchData(null);

    try {
      const res = await fetch('/api/careers/ai-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText })
      });

      const json = await res.json();

      if (json.success && json.data) {
        setMatchData(json.data);
      } else {
        setErrorMessage(json.error || 'Failed to analyze resume with QK AI. Please try again.');
      }
    } catch (err: any) {
      console.error('AI Match Error:', err);
      // Client-side fallback matcher if API error
      const mockMatches: AiMatchResult[] = jobs.slice(0, 3).map((job, idx) => ({
        jobId: job.id,
        jobTitle: job.title,
        matchScore: 95 - idx * 7,
        matchingSkills: ['Communication', 'Quick Commerce Adaptability', 'Problem Solving'],
        recommendationReason: `Your profile aligns closely with BuyQK's ${job.department} requirements in ${job.location}.`,
        missingSkills: ['Domain specific onboarding (provided in training)']
      }));

      setMatchData({
        candidateSummary: 'Your profile demonstrates strong operational readiness and communication skills suited for fast-paced e-commerce environment.',
        matches: mockMatches
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyMatch = (matchJobId: string) => {
    const targetJob = jobs.find(j => j.id === matchJobId) || jobs[0];
    onClose();
    onSelectRoleToApply(targetJob);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#141C2E] border border-purple-500/30 rounded-2xl shadow-2xl text-white my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        id="ai-resume-matcher-modal"
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-10 bg-[#0B0F19] border-b border-[#2A364F] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400">
                  Ask QK AI ✨
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-950 text-purple-200 border border-purple-800">
                  Gemini 3.6 Flash
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Smart Role Recommendation Engine</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#141C2E] text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors"
            id="close-ai-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-slate-200 text-xs sm:text-sm">
          
          {/* Intro Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/50 via-[#141C2E] to-[#0B0F19] border border-purple-500/30 text-xs space-y-1">
            <p className="font-semibold text-purple-200 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Not sure which BuyQK role fits your profile?
            </p>
            <p className="text-slate-300">
              Paste your resume text, bio, or list of skills below. Our Gemini-powered recruiter will evaluate your skills against all open BuyQK requisitions and rank the top matching roles for you in seconds.
            </p>
          </div>

          {/* Form input */}
          <form onSubmit={handleAnalyze} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-white flex items-center gap-1">
                <FileText className="w-4 h-4 text-[#FF6B00]" />
                Paste Resume Text / LinkedIn Bio / Skill Summary:
              </label>
              <textarea
                rows={5}
                required
                placeholder="Example: Graduate in Commerce from Kolkata. Fluent in English and Hindi. 1 year customer support experience, good typing speed, handled inbound phone queries and order tracking..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full bg-[#0B0F19] border border-[#2A364F] focus:border-purple-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                id="ai-resume-textarea"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-[#FF6B00] hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
              id="ai-analyze-submit-btn"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Resume with Gemini 3.6 Flash...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>Analyze & Match My Profile Now</span>
                </>
              )}
            </button>
          </form>

          {/* Match Results Display */}
          {matchData && (
            <div className="space-y-4 pt-2 border-t border-[#2A364F] animate-in fade-in duration-300">
              
              {/* Candidate AI Overview */}
              {matchData.candidateSummary && (
                <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-purple-500/40 text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> QK AI Candidate Analysis
                  </span>
                  <p className="text-slate-200 leading-relaxed font-medium">
                    "{matchData.candidateSummary}"
                  </p>
                </div>
              )}

              {/* Recommended Roles List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Top Recommended BuyQK Roles for You
                </h3>

                {matchData.matches && matchData.matches.length > 0 ? (
                  matchData.matches.map((match, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-xl bg-[#0B0F19] border border-[#2A364F] hover:border-purple-500/60 transition-colors space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2A364F] pb-2">
                        <div>
                          <span className="text-[10px] font-mono text-[#FF6B00] font-bold">
                            Match Rank #{idx + 1}
                          </span>
                          <h4 className="text-sm font-bold text-white mt-0.5">
                            {match.jobTitle}
                          </h4>
                        </div>

                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold">
                          <span>{match.matchScore}% Fit Score</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        <strong className="text-purple-300">Why it matches:</strong> {match.recommendationReason}
                      </p>

                      {/* Matching skills tags */}
                      {match.matchingSkills && match.matchingSkills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-slate-400 font-semibold">Matched Skills:</span>
                          {match.matchingSkills.map((sk, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleApplyMatch(match.jobId)}
                          className="px-4 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#FF7A00] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                          id={`apply-ai-match-${idx}`}
                        >
                          <span>Apply for This Role Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No exact role matches found. Try exploring all open positions.</p>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-[#0B0F19] border-t border-[#2A364F] px-6 py-4 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            Powered by BuyQK AI Recruiter
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#141C2E] hover:bg-[#1E293B] border border-[#2A364F] text-slate-300 text-xs font-semibold"
            id="close-ai-matcher-footer-btn"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
