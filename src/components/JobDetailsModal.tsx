import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  Award, 
  ArrowRight,
  ShieldCheck,
  Building,
  HelpCircle
} from 'lucide-react';
import { JobOpening } from '../types';

interface JobDetailsModalProps {
  job: JobOpening | null;
  onClose: () => void;
  onApply: (job: JobOpening) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose, onApply }) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#141C2E] border border-[#2A364F] rounded-2xl shadow-2xl text-white my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        id="job-details-modal"
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-10 bg-[#0B0F19] border-b border-[#2A364F] px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-[#141C2E] border border-[#2A364F] text-[11px] font-mono text-[#FF6B00] font-bold">
                Req ID: {job.reqId}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {job.department}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {job.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#141C2E] text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors"
            id="close-details-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-slate-300 text-xs sm:text-sm">
          
          {/* Top Key Info Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#0B0F19] border border-[#2A364F]">
            <div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" /> Location
              </span>
              <p className="font-semibold text-white mt-0.5">{job.location} ({job.workMode})</p>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Shift Type
              </span>
              <p className="font-semibold text-white mt-0.5">{job.shiftType}</p>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" /> Experience
              </span>
              <p className="font-semibold text-white mt-0.5">{job.experience}</p>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" /> Education
              </span>
              <p className="font-semibold text-white mt-0.5 truncate">{job.education}</p>
            </div>
          </div>

          {/* Role Summary */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#FF6B00] flex items-center gap-1.5">
              <Building className="w-4 h-4" /> Role Overview
            </h3>
            <p className="leading-relaxed text-slate-200">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#FF6B00]">
              Key Responsibilities
            </h3>
            <ul className="space-y-2">
              {job.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Basic Requirements */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#FF6B00]">
              Basic Eligibility & Criteria
            </h3>
            <ul className="space-y-2">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Preferred Qualifications if present */}
          {job.preferredQualifications && job.preferredQualifications.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                Preferred Skills (Plus Points)
              </h3>
              <ul className="space-y-2">
                {job.preferredQualifications.map((pref, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-200">
                    <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{pref}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Compensation & Benefits */}
          <div className="space-y-2 bg-[#0B0F19] p-4 rounded-xl border border-[#2A364F]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
              <span>Pay & Employee Benefits</span>
              <span className="text-white font-extrabold text-base">{job.salary}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {job.benefits.map((ben, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{ben}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring Process Pipeline */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> Virtual Hiring Steps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {job.hiringProcess.map((step, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-[#0B0F19] border border-[#2A364F] text-xs font-medium text-slate-200">
                  {step}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Sticky Footer CTA */}
        <div className="sticky bottom-0 z-10 bg-[#0B0F19] border-t border-[#2A364F] px-6 py-4 flex items-center justify-between gap-4">
          <div className="hidden sm:block text-xs text-slate-400">
            Immediate joining available in <strong className="text-white">{job.location}</strong>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#141C2E] hover:bg-[#1E293B] border border-[#2A364F] text-slate-300 text-xs font-semibold"
              id="cancel-details-modal-btn"
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                onApply(job);
              }}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF7A00] text-white text-xs font-bold shadow-lg shadow-[#FF6B00]/25 transition-all flex items-center justify-center gap-2"
              id="modal-apply-btn"
            >
              <span>Apply for {job.reqId}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
