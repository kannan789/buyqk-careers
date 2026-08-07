import React from 'react';
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  ChevronRight, 
  Flame, 
  Sparkles,
  Users,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { JobOpening } from '../types';

interface JobCardProps {
  job: JobOpening;
  onViewDetails: (job: JobOpening) => void;
  onApply: (job: JobOpening) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails, onApply }) => {
  return (
    <div 
      className="group relative bg-[#141C2E] hover:bg-[#1A243B] border border-[#2A364F] hover:border-[#FF6B00]/60 rounded-2xl p-5 md:p-6 shadow-lg transition-all duration-300 flex flex-col justify-between"
      id={`job-card-${job.id}`}
    >
      {/* Top Requisition Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#0B0F19] text-[11px] font-mono font-semibold text-slate-300 border border-[#2A364F]">
              Req ID: {job.reqId}
            </span>

            {job.isHot && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-bold">
                <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
                <span>HOT ROLE</span>
              </span>
            )}

            {job.isUrgent && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>URGENT HIRING</span>
              </span>
            )}
          </div>

          <span className="text-[11px] text-slate-400 font-medium">
            Posted {job.postedDate}
          </span>
        </div>

        {/* Job Title & Department */}
        <div className="mb-3">
          <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-[#FF6B00] transition-colors leading-snug">
            {job.title}
          </h3>
          <div className="text-xs font-semibold text-[#FF6B00] mt-1">
            {job.department}
          </div>
        </div>

        {/* Key Attributes Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 bg-[#0B0F19]/60 px-2.5 py-1.5 rounded-lg border border-[#1E293B]">
            <MapPin className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
            <span className="truncate">{job.location} ({job.workMode})</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 bg-[#0B0F19]/60 px-2.5 py-1.5 rounded-lg border border-[#1E293B]">
            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{job.shiftType}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 bg-[#0B0F19]/60 px-2.5 py-1.5 rounded-lg border border-[#1E293B] col-span-2 sm:col-span-1">
            <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{job.experience}</span>
          </div>
        </div>

        {/* Requirements Bullet Points Summary */}
        <div className="space-y-1.5 my-3">
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {job.description}
          </p>
          <div className="pt-1 space-y-1">
            {job.requirements.slice(0, 2).map((req, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-1.5 my-4">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30">
            <DollarSign className="w-3 h-3" />
            {job.salary}
          </span>

          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <Users className="w-3 h-3" />
            {job.openingsCount} Openings
          </span>

          {job.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#0B0F19] text-slate-300 border border-[#2A364F]">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-[#2A364F]/80 flex items-center gap-3">
        <button
          onClick={() => onViewDetails(job)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-[#0B0F19] hover:bg-[#1E293B] border border-[#2A364F] text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
          id={`view-details-${job.id}`}
        >
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          onClick={() => onApply(job)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-[#FF6B00] hover:bg-[#FF7A00] text-white text-xs font-bold transition-all shadow-md shadow-[#FF6B00]/20 hover:scale-102 active:scale-98 flex items-center justify-center gap-1.5"
          id={`apply-now-${job.id}`}
        >
          <span>Apply Now</span>
          <ChevronRight className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  );
};
