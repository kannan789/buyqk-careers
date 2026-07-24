import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Briefcase, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Building2, 
  Users, 
  Heart, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Headphones,
  Laptop
} from 'lucide-react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryTabs } from './components/CategoryTabs';
import { FilterBar } from './components/FilterBar';
import { JobCard } from './components/JobCard';
import { JobDetailsModal } from './components/JobDetailsModal';
import { ApplicationFormModal } from './components/ApplicationFormModal';
import { ApplicationSuccessModal } from './components/ApplicationSuccessModal';
import { MyApplicationsModal } from './components/MyApplicationsModal';
import { AiResumeMatcherModal } from './components/AiResumeMatcherModal';
import { AuthModal } from './components/AuthModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';

import { INITIAL_JOBS } from './data/jobsData';
import { JobOpening, JobApplication, FilterState, UserAccount } from './types';

export default function App() {
  const [jobs, setJobs] = useState<JobOpening[]>(INITIAL_JOBS);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    department: 'All Departments',
    location: 'All Locations',
    experience: 'All Experience Levels',
    workMode: 'All Work Modes',
    shiftType: 'All Shifts'
  });

  const [activeTab, setActiveTab] = useState<'openings' | 'culture' | 'faqs'>('openings');

  // User Auth State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register' | 'admin'>('register');
  const [pendingJobToApply, setPendingJobToApply] = useState<JobOpening | null>(null);

  // Admin Dashboard State
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Modals state
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<JobOpening | null>(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobOpening | null>(null);
  const [submittedApplication, setSubmittedApplication] = useState<JobApplication | null>(null);
  const [isAiMatcherOpen, setIsAiMatcherOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  // Applications tracker state
  const [myApplications, setMyApplications] = useState<JobApplication[]>([]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch jobs function
  const fetchJobs = () => {
    fetch('/api/careers/jobs')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.jobs) {
          setJobs(data.jobs);
        }
      })
      .catch(() => {
        setJobs(INITIAL_JOBS);
      });
  };

  // Fetch jobs and stored applications on mount
  useEffect(() => {
    fetchJobs();

    fetch('/api/careers/applications')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.applications) {
          setMyApplications(data.applications);
        }
      })
      .catch(() => {});
  }, []);

  // Handle Apply Now click across all components
  const handleApplyNow = (job: JobOpening) => {
    if (!currentUser) {
      // User is NOT logged in -> Redirect to Create Account / Login Modal
      setPendingJobToApply(job);
      setAuthInitialMode('register');
      setIsAuthModalOpen(true);
      showToast('Please Create an Account or Log In to apply.');
    } else {
      // User IS logged in -> Open Application Form with pre-filled candidate profile
      setSelectedJobForApply(job);
    }
  };

  // Handle successful auth
  const handleAuthSuccess = (user: UserAccount, targetJob?: JobOpening | null) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      showToast(`Welcome Recruiter Admin (${user.fullName})`);
      setIsAdminPanelOpen(true);
    } else {
      showToast(`Welcome, ${user.fullName}! Account Active.`);
      if (targetJob) {
        // Open pre-filled apply modal
        setSelectedJobForApply(targetJob);
        setPendingJobToApply(null);
      }
    }
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Logged out successfully.');
  };

  // Filter handlers
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      department: 'All Departments',
      location: 'All Locations',
      experience: 'All Experience Levels',
      workMode: 'All Work Modes',
      shiftType: 'All Shifts'
    });
  };

  // Compute filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesReq = job.reqId.toLowerCase().includes(q);
        const matchesDept = job.department.toLowerCase().includes(q);
        const matchesLoc = job.location.toLowerCase().includes(q);
        const matchesTags = job.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesReq && !matchesDept && !matchesLoc && !matchesTags) {
          return false;
        }
      }

      // Department filter
      if (filters.department !== 'All Departments' && job.department !== filters.department) {
        return false;
      }

      // Location filter
      if (filters.location !== 'All Locations') {
        if (filters.location === 'Remote / WFH') {
          if (job.workMode !== 'Virtual / WFH') return false;
        } else if (!job.location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // Experience filter
      if (filters.experience !== 'All Experience Levels' && job.experience !== filters.experience) {
        return false;
      }

      // Work Mode filter
      if (filters.workMode !== 'All Work Modes' && job.workMode !== filters.workMode) {
        return false;
      }

      // Shift Type filter
      if (filters.shiftType !== 'All Shifts' && job.shiftType !== filters.shiftType) {
        return false;
      }

      return true;
    });
  }, [jobs, filters]);

  // Count helper for category tabs
  const getDeptCount = (dept: string) => {
    if (dept === 'All Departments') return jobs.length;
    return jobs.filter(j => j.department === dept).length;
  };

  // Application Success Handler
  const handleApplicationSuccess = (newApp: JobApplication) => {
    setSelectedJobForApply(null);
    setSubmittedApplication(newApp);
    setMyApplications(prev => [newApp, ...prev.filter(a => a.id !== newApp.id)]);
    showToast(`Application submitted! Reg ID: ${newApp.regId}`);
  };

  // Search applications handler
  const handleSearchApplications = async (query: string) => {
    try {
      const res = await fetch(`/api/careers/applications?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success && data.applications) {
        setMyApplications(data.applications);
      }
    } catch {
      // Local filter fallback
      if (query.trim()) {
        const q = query.toLowerCase();
        setMyApplications(prev => prev.filter(a => 
          a.email.toLowerCase().includes(q) || 
          a.regId.toLowerCase().includes(q) ||
          a.fullName.toLowerCase().includes(q)
        ));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans flex flex-col selection:bg-[#FF6B00] selection:text-white">
      
      {/* Toast Popup Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#141C2E] border border-emerald-500/60 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <Header
        selectedLocation={filters.location}
        onSelectLocation={(loc) => handleFilterChange('location', loc)}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => handleFilterChange('searchQuery', q)}
        onOpenAiMatcher={() => setIsAiMatcherOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        applicationsCount={myApplications.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthInitialMode(mode || 'register');
          setPendingJobToApply(null);
          setIsAuthModalOpen(true);
        }}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Top Hero Section */}
        <HeroSection
          totalJobsCount={jobs.length}
          onExploreClick={() => {
            setActiveTab('openings');
            const el = document.getElementById('openings-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onAiMatchClick={() => setIsAiMatcherOpen(true)}
        />

        {/* Tab 1: Job Openings View */}
        {activeTab === 'openings' && (
          <div id="openings-section" className="scroll-mt-20">
            
            {/* Category Filter Tabs */}
            <CategoryTabs
              selectedDepartment={filters.department}
              onSelectDepartment={(dept) => handleFilterChange('department', dept)}
              getDeptCount={getDeptCount}
            />

            {/* Filter Bar & Openings Listing */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              
              <FilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                activeCount={filteredJobs.length}
              />

              {/* Jobs Grid */}
              {filteredJobs.length === 0 ? (
                <div className="text-center py-16 bg-[#141C2E] rounded-2xl border border-[#2A364F] space-y-4 my-6">
                  <div className="w-16 h-16 rounded-full bg-[#0B0F19] border border-[#2A364F] flex items-center justify-center mx-auto text-slate-400">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">No Matching Requisitions Found</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Try adjusting your location, department, or shift filters to discover open roles.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF7A00] text-white text-xs font-bold transition-all shadow-md"
                    id="no-jobs-reset-btn"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onViewDetails={(j) => setSelectedJobForDetails(j)}
                      onApply={(j) => handleApplyNow(j)}
                    />
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* Tab 2: Life at BuyQK / Culture View */}
        {activeTab === 'culture' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            
            <div className="text-center space-y-3">
              <span className="px-3 py-1 rounded-full bg-[#141C2E] border border-[#FF6B00]/30 text-xs font-bold text-[#FF6B00] uppercase tracking-wider">
                Life at BuyQK
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Everything. Delivered. Powered by People.
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl mx-auto">
                We are building India's fastest quick commerce ecosystem. Here's why 10,000+ team members and partner captains love working at BuyQK.
              </p>
            </div>

            {/* Culture Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-2xl bg-[#141C2E] border border-[#2A364F] space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Innovation First</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We deploy cutting-edge AI (Ask QK AI) for real-time order dispatch, intelligent demand forecasting, and seamless customer resolution.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#141C2E] border border-[#2A364F] space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">People & Partner Care</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Comprehensive health insurance for family, generous shift allowances, safety gear for delivery captains, and flexible WFH setups.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#141C2E] border border-[#2A364F] space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Rapid Career Growth</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fast-track internal progression for top performers from Customer Experience Specialist to Hub Manager & Operations Lead.
                </p>
              </div>

            </div>

            {/* Featured Team Banner */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-[#141C2E] via-[#0D111D] to-[#141C2E] border border-[#2A364F] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider">Kolkata CTPS Drive</span>
                <h3 className="text-xl font-bold text-white">Join 150+ Customer Experience Specialists</h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Become the voice of BuyQK across India. Handle real-time customer and partner merchant queries with night shift allowances and full WFH support.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('openings');
                  handleFilterChange('department', 'Customer Trust & Partner Support');
                }}
                className="px-6 py-3 rounded-full bg-[#FF6B00] hover:bg-[#FF7A00] text-white font-bold text-xs shadow-lg flex items-center gap-2 whitespace-nowrap"
                id="culture-apply-ctps-btn"
              >
                <span>View CTPS Roles</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* Tab 3: Virtual Hiring FAQs View */}
        {activeTab === 'faqs' && <FaqSection />}

      </main>

      {/* Auth Modal (Create Account / Login / Admin Login) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        pendingJobToApply={pendingJobToApply}
        initialMode={authInitialMode}
      />

      {/* Admin Control Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        jobs={jobs}
        onJobsUpdated={fetchJobs}
      />

      {/* Job Modals Collection */}
      <JobDetailsModal
        job={selectedJobForDetails}
        onClose={() => setSelectedJobForDetails(null)}
        onApply={(j) => handleApplyNow(j)}
      />

      <ApplicationFormModal
        job={selectedJobForApply}
        currentUser={currentUser}
        onClose={() => setSelectedJobForApply(null)}
        onSuccess={handleApplicationSuccess}
      />

      <ApplicationSuccessModal
        application={submittedApplication}
        onClose={() => setSubmittedApplication(null)}
        onViewTracker={() => setIsTrackerOpen(true)}
      />

      <MyApplicationsModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        applications={myApplications}
        onSearchApplications={handleSearchApplications}
        onApplyNewRole={() => {
          setActiveTab('openings');
          const el = document.getElementById('openings-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <AiResumeMatcherModal
        isOpen={isAiMatcherOpen}
        onClose={() => setIsAiMatcherOpen(false)}
        jobs={jobs}
        onSelectRoleToApply={(j) => handleApplyNow(j)}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}

