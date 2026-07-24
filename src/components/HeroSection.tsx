import React from 'react';
import { Sparkles, Users, Zap, ShieldCheck, ArrowRight, Building } from 'lucide-react';

interface HeroSectionProps {
  totalJobsCount: number;
  onExploreClick: () => void;
  onAiMatchClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  totalJobsCount,
  onExploreClick,
  onAiMatchClick
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0B0F19] via-[#0F172A] to-[#0B0F19] text-white py-10 md:py-16 border-b border-[#1E293B]">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141C2E] border border-[#FF6B00]/30 text-xs font-semibold text-slate-200 shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-[#FF6B00] animate-ping"></span>
              <span className="text-[#FF6B00] font-bold">BuyQK Virtual Hiring Portal</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-300">Customer Trust & Quick Commerce Roles</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              One Team. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-amber-400 to-[#FF8A00]">Infinite Possibilities.</span> <br className="hidden sm:inline" />
              Build the Future with Us.
            </h1>

            {/* Sub-headline */}
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              From street food to sofa sets, from freelancers to darkstores — BuyQK delivers everything in 10 minutes. 
              We are hiring passionate <strong className="text-white">Customer Experience Specialists (Kolkata & Remote)</strong>, 
              Logistics Leads, Software Engineers, and Operations Hub Managers across India.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF6B00] hover:bg-[#FF7A00] text-white font-bold text-sm shadow-lg shadow-[#FF6B00]/25 transition-all hover:scale-105 active:scale-95"
                id="hero-explore-jobs-btn"
              >
                <span>Browse {totalJobsCount}+ Openings</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onAiMatchClick}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#141C2E] hover:bg-[#1E293B] border border-purple-500/40 text-purple-200 font-bold text-sm shadow-md transition-all hover:border-purple-400"
                id="hero-ai-match-btn"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>AI Resume Matcher</span>
              </button>
            </div>

            {/* Quick Metrics Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
              <div className="p-3 rounded-xl bg-[#141C2E]/80 border border-[#2A364F] backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-[#FF6B00] font-bold text-lg">
                  <Users className="w-4 h-4" />
                  <span>10M+</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">Happy Customers</div>
              </div>

              <div className="p-3 rounded-xl bg-[#141C2E]/80 border border-[#2A364F] backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-lg">
                  <Building className="w-4 h-4" />
                  <span>15+</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">Hub Cities in India</div>
              </div>

              <div className="p-3 rounded-xl bg-[#141C2E]/80 border border-[#2A364F] backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-lg">
                  <Zap className="w-4 h-4" />
                  <span>10-Min</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">Quick Commerce Speed</div>
              </div>

              <div className="p-3 rounded-xl bg-[#141C2E]/80 border border-[#2A364F] backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-purple-400 font-bold text-lg">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100%</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">Virtual Hiring Portal</div>
              </div>
            </div>

          </div>

          {/* Right Highlight Box - Virtual Hiring Notice Card */}
          <div className="lg:col-span-5">
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#141C2E] to-[#0D111D] border border-[#2A364F] shadow-2xl space-y-4 overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FF6B00]/20 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between border-b border-[#2A364F] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                    Featured Hiring Drive
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF6B00]/20 text-[#FF6B00]">
                  Kolkata & Pan-India
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Customer Trust & Partner Support (CTPS)</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Now hiring 150+ Customer Experience Specialists in Kolkata & Remote. Work with cutting-edge AI tools, support partner merchants, and enjoy 24/7 rotational shift benefits with night allowances.
                </p>
              </div>

              <div className="space-y-2 bg-[#0B0F19]/60 p-3 rounded-xl border border-[#1E293B] text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Target Role:</span>
                  <span className="font-semibold text-white">Customer Experience Specialist</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-semibold text-[#FF6B00]">Kolkata / Virtual WFH</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Qualifications:</span>
                  <span className="font-semibold text-white">Any Graduate (Fresher Eligible)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Compensation:</span>
                  <span className="font-semibold text-emerald-400">₹3.5 - ₹4.8 LPA + Shift Bonus</span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-xs text-slate-400">
                <span>⚡ Fast 2-Day Virtual Selection</span>
                <span className="text-[#FF6B00] font-semibold hover:underline cursor-pointer" onClick={onExploreClick}>
                  Apply in 2 Mins &rarr;
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
