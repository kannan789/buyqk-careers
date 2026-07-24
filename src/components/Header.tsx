import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Sparkles, 
  Briefcase, 
  FileCheck, 
  ChevronDown, 
  Menu, 
  X,
  HelpCircle,
  Building2
} from 'lucide-react';
import { LOCATIONS } from '../data/jobsData';

interface HeaderProps {
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAiMatcher: () => void;
  onOpenTracker: () => void;
  applicationsCount: number;
  activeTab: 'openings' | 'culture' | 'faqs';
  setActiveTab: (tab: 'openings' | 'culture' | 'faqs') => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedLocation,
  onSelectLocation,
  searchQuery,
  onSearchChange,
  onOpenAiMatcher,
  onOpenTracker,
  applicationsCount,
  activeTab,
  setActiveTab
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/95 backdrop-blur-md border-b border-[#1E293B] text-white">
      {/* Top Banner Bar - Brand & Location Bar matching BuyQK UI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Location Header */}
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-2 group">
              <div className="flex flex-col">
                <div className="flex items-center text-2xl font-black tracking-tight font-sans">
                  <span className="text-white">Buy</span>
                  <span className="text-[#FF6B00] italic font-serif ml-0.5 tracking-wide drop-shadow-[0_0_10px_rgba(255,107,0,0.4)]">
                    QK
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium -mt-1">
                  Everything. Delivered.
                </span>
              </div>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-widest bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30 uppercase ml-2">
                Careers
              </span>
            </a>

            {/* Location Selector Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141C2E] border border-[#2A364F] text-xs text-slate-300 hover:border-[#FF6B00]/50 transition-colors cursor-pointer group">
              <MapPin className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
              <select
                value={selectedLocation}
                onChange={(e) => onSelectLocation(e.target.value)}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
                id="header-location-select"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc} className="bg-[#141C2E] text-slate-200">
                    {loc === 'All Locations' ? 'Koramangala, Bengaluru (All India)' : loc}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-white" />
            </div>
          </div>

          {/* Quick Search Input (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search openings by role, skill (e.g. Customer Support, React, Kolkata)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[#141C2E] border border-[#2A364F] rounded-full pl-10 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all"
                id="header-search-input"
              />
            </div>
          </div>

          {/* Action Pill Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ask QK AI Role Matcher Button */}
            <button
              onClick={onOpenAiMatcher}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white text-xs font-bold shadow-md hover:shadow-purple-500/25 transition-all hover:scale-105 active:scale-95"
              id="ask-qk-ai-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
              <span>Ask QK AI ✨</span>
              <span className="hidden sm:inline-block text-[10px] font-normal text-purple-100 bg-black/20 px-1.5 py-0.2 rounded-full">
                Match CV
              </span>
            </button>

            {/* My Applications Tracker Button */}
            <button
              onClick={onOpenTracker}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141C2E] border border-[#2A364F] text-slate-200 hover:text-white hover:border-[#FF6B00]/60 text-xs font-medium transition-all"
              id="my-applications-btn"
            >
              <FileCheck className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span className="hidden sm:inline">My Applications</span>
              {applicationsCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-[#FF6B00] text-white rounded-full">
                  {applicationsCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg bg-[#141C2E] border border-[#2A364F] text-slate-300 md:hidden"
              id="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar for Mobile/Tablet */}
        <div className="mt-2.5 lg:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search openings by role, department, or location..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#141C2E] border border-[#2A364F] rounded-full pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#FF6B00]"
              id="mobile-search-input"
            />
          </div>
        </div>

        {/* Secondary Navigation Bar */}
        <nav className="mt-3 pt-2 border-t border-[#1E293B] flex items-center justify-between text-xs overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-6 font-medium whitespace-nowrap">
            <button
              onClick={() => setActiveTab('openings')}
              className={`flex items-center gap-1.5 py-1 border-b-2 transition-colors ${
                activeTab === 'openings'
                  ? 'border-[#FF6B00] text-[#FF6B00] font-bold'
                  : 'border-transparent text-slate-300 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Job Openings</span>
            </button>

            <button
              onClick={() => setActiveTab('culture')}
              className={`flex items-center gap-1.5 py-1 border-b-2 transition-colors ${
                activeTab === 'culture'
                  ? 'border-[#FF6B00] text-[#FF6B00] font-bold'
                  : 'border-transparent text-slate-300 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Life at BuyQK</span>
            </button>

            <button
              onClick={() => setActiveTab('faqs')}
              className={`flex items-center gap-1.5 py-1 border-b-2 transition-colors ${
                activeTab === 'faqs'
                  ? 'border-[#FF6B00] text-[#FF6B00] font-bold'
                  : 'border-transparent text-slate-300 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Virtual Hiring & FAQs</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Virtual Hiring Active Across India
            </span>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0D111D] border-b border-[#1E293B] px-4 py-4 space-y-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#141C2E] text-slate-300 text-xs">
            <MapPin className="w-4 h-4 text-[#FF6B00]" />
            <span className="font-medium text-white">Location:</span>
            <select
              value={selectedLocation}
              onChange={(e) => {
                onSelectLocation(e.target.value);
                setIsMobileMenuOpen(false);
              }}
              className="bg-transparent text-slate-200 focus:outline-none flex-1"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc} className="bg-[#141C2E]">
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                onOpenAiMatcher();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs font-semibold"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Resume Matcher</span>
            </button>

            <button
              onClick={() => {
                onOpenTracker();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg bg-[#141C2E] border border-[#2A364F] text-slate-200 text-xs font-semibold"
            >
              <FileCheck className="w-4 h-4 text-[#FF6B00]" />
              <span>Track Applications</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
