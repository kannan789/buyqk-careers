import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  totalJobsCount: number;
  onExploreClick: () => void;
  onCreateAccountClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  totalJobsCount,
  onExploreClick,
  onCreateAccountClick
}) => {
  return (
    <div className="bg-[#0B0F19] text-white py-10 border-b border-[#1E293B]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141C2E] border border-[#FF6B00]/30 text-xs font-semibold text-[#FF6B00]">
          BuyQK Careers Portal
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Build the Future of Quick Commerce with BuyQK
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          We are hiring Customer Experience Specialists, Engineers, Operations Leads, and Logistics Managers across Kolkata and Pan-India.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onExploreClick}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF6B00] hover:bg-[#FF7A00] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            id="hero-explore-jobs-btn"
          >
            <span>Browse {totalJobsCount} Openings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onCreateAccountClick}
            className="px-5 py-2.5 rounded-full bg-[#141C2E] hover:bg-[#1E293B] border border-[#2A364F] text-slate-200 font-semibold text-xs transition-all cursor-pointer"
            id="hero-create-account-btn"
          >
            Create Candidate Account
          </button>
        </div>

      </div>
    </div>
  );
};
