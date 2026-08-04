import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Heart, 
  Zap, 
  ArrowRight
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
import { AuthPage } from './components/AuthPage';
import { AdminPanelPage } from './components/AdminPanelPage';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';

import { INITIAL_JOBS } from './data/jobsData';
import { JobOpening, JobApplication, FilterState, UserAccount } from './types';

export default function App() {
  const [jobs, setJobs] = useState<JobOpening[]>(() => {
    const saved = localStorage.getItem('buyqk_jobs');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_JOBS;
  });

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    department: 'All Departments',
    location: 'All Locations',
    experience: 'All Experience Levels',
    workMode: 'All Work Modes',
    shiftType: 'All Shifts'
  });

  const [activeTab, setActiveTab] = useState<'openings' | 'culture' | 'faqs'>('openings');

  // Page Navigation State ('jobs' | 'auth' | 'admin')
  const [currentView, setCurrentView] = useState<'jobs' | 'auth' | 'admin'>('jobs');

  // User Auth State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('buyqk_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return null;
  });

  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register' | 'admin'>('register');
  const [pendingJobToApply, setPendingJobToApply] = useState<JobOpening | null>(null);

  // Modals state
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<JobOpening | null>(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobOpening | null>(null);
  const [submittedApplication, setSubmittedApplication] = useState<JobApplication | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  // Applications tracker state
  const [myApplications, setMyApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('buyqk_applications');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  // Registered Candidates list state
  const [candidates, setCandidates] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('buyqk_candidates');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Save state updates to localStorage
  useEffect(() => {
    localStorage.setItem('buyqk_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('buyqk_applications', JSON.stringify(myApplications));
  }, [myApplications]);

  useEffect(() => {
    localStorage.setItem('buyqk_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('buyqk_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('buyqk_current_user');
    }
  }, [currentUser]);

  // Handle Apply Now click across all components
  const handleApplyNow = (job: JobOpening) => {
    if (!currentUser) {
      // User is NOT logged in -> Navigate to dedicated Auth Page
      setPendingJobToApply(job);
      setAuthInitialMode('register');
      setCurrentView('auth');
      showToast('Please create an account or log in to submit your application.');
    } else {
      // User IS logged in -> Open Application Form
      setSelectedJobForApply(job);
    }
  };

  // Handle successful auth from AuthPage
  const handleAuthSuccess = (user: UserAccount, targetJob?: JobOpening | null) => {
    setCurrentUser(user);
    if (user.role === 'candidate') {
      setCandidates(prev => {
        if (!prev.some(c => c.id === user.id || c.email === user.email)) {
          return [user, ...prev];
        }
        return prev;
      });
    }

    if (user.role === 'admin') {
      showToast(`Welcome to Recruiter Portal, ${user.fullName}`);
      setCurrentView('admin');
    } else {
      showToast(`Welcome, ${user.fullName}! Your profile is ready.`);
      if (targetJob) {
        setSelectedJobForApply(targetJob);
        setPendingJobToApply(null);
      }
      setCurrentView('jobs');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('jobs');
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

      if (filters.department !== 'All Departments' && job.department !== filters.department) {
        return false;
      }

      if (filters.location !== 'All Locations') {
        if (filters.location === 'Remote / WFH') {
          if (job.workMode !== 'Virtual / WFH') return false;
        } else if (!job.location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      if (filters.experience !== 'All Experience Levels' && job.experience !== filters.experience) {
        return false;
      }

      if (filters.workMode !== 'All Work Modes' && job.workMode !== filters.workMode) {
        return false;
      }

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
    showToast(`Application submitted! Registration ID: ${newApp.regId}`);
  };

  // Admin status update handler
  const handleUpdateApplicationStatus = (appId: string, newStatus: JobApplication['status'], notes?: string) => {
    setMyApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return { ...a, status: newStatus, recruiterNotes: notes || a.recruiterNotes };
      }
      return a;
    }));
    showToast(`Updated application status to ${newStatus}`);
  };

  // Search applications handler
  const handleSearchApplications = (query: string) => {
    if (query.trim()) {
      const q = query.toLowerCase();
      const saved = localStorage.getItem('buyqk_applications');
      const allApps: JobApplication[] = saved ? JSON.parse(saved) : myApplications;
      setMyApplications(allApps.filter(a => 
        a.email.toLowerCase().includes(q) || 
        a.regId.toLowerCase().includes(q) ||
        a.fullName.toLowerCase().includes(q)
      ));
    } else {
      const saved = localStorage.getItem('buyqk_applications');
      if (saved) setMyApplications(JSON.parse(saved));
    }
  };

  // Render Auth Page view
  if (currentView === 'auth') {
    return (
      <AuthPage
        onBackToJobs={() => setCurrentView('jobs')}
        onAuthSuccess={handleAuthSuccess}
        pendingJobToApply={pendingJobToApply}
        initialMode={authInitialMode}
      />
    );
  }

  // Render Admin Panel Page view
  if (currentView === 'admin') {
    return (
      <AdminPanelPage
        onBackToJobs={() => setCurrentView('jobs')}
        jobs={jobs}
        onJobsUpdated={() => {
          const saved = localStorage.getItem('buyqk_jobs');
          if (saved) setJobs(JSON.parse(saved));
        }}
        applications={myApplications}
        onUpdateApplicationStatus={handleUpdateApplicationStatus}
        candidates={candidates}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans flex flex-col selection:bg-[#FF6B00] selection:text-white">
      
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#141C2E] border border-emerald-500/60 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Header Bar */}
      <Header
        selectedLocation={filters.location}
        onSelectLocation={(loc) => handleFilterChange('location', loc)}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => handleFilterChange('searchQuery', q)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        applicationsCount={myApplications.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onNavigateAuth={(mode) => {
          setAuthInitialMode(mode || 'register');
          setPendingJobToApply(null);
          setCurrentView('auth');
        }}
        onNavigateAdminPanel={() => setCurrentView('admin')}
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
          onCreateAccountClick={() => {
            setAuthInitialMode('register');
            setCurrentView('auth');
          }}
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
                    className="px-5 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF7A00] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
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
                We are building India's fastest quick commerce ecosystem. Here's why team members and partner leads love working at BuyQK.
              </p>
            </div>

            {/* Culture Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-2xl bg-[#141C2E] border border-[#2A364F] space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Fast & Scalable Infrastructure</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We run real-time order dispatching and intelligent inventory routing for 10-minute quick commerce across major Indian hubs.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#141C2E] border border-[#2A364F] space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">People & Partner Care</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Comprehensive health insurance for family, generous shift allowances, and flexible remote & rotational shift benefits.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#141C2E] border border-[#2A364F] space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Rapid Career Growth</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fast-track internal progression for top performers from Customer Support Specialist to Operations Lead & Hub Director.
                </p>
              </div>

            </div>

            {/* Featured Team Banner */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-[#141C2E] via-[#0D111D] to-[#141C2E] border border-[#2A364F] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider">Kolkata CTPS Drive</span>
                <h3 className="text-xl font-bold text-white">Join 150+ Customer Experience Specialists</h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Become the voice of BuyQK. Support customers and merchant partners with 24/7 rotational shift benefits and full training.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('openings');
                  handleFilterChange('department', 'Customer Trust & Partner Support');
                }}
                className="px-6 py-3 rounded-full bg-[#FF6B00] hover:bg-[#FF7A00] text-white font-bold text-xs shadow-lg flex items-center gap-2 whitespace-nowrap cursor-pointer"
                id="culture-apply-ctps-btn"
              >
                <span>View Open CTPS Roles</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* Tab 3: Virtual Hiring FAQs View */}
        {activeTab === 'faqs' && <FaqSection />}

      </main>

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

      {/* Footer */}
      <Footer />

    </div>
  );
}
