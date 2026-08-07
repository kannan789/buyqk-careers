import React, { useState } from 'react';
import { 
  Users, 
  FileCheck, 
  Briefcase, 
  Search, 
  Plus, 
  Trash2, 
  UserCheck, 
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { JobApplication, UserAccount, JobOpening } from '../types';

interface AdminPanelPageProps {
  onBackToJobs: () => void;
  jobs: JobOpening[];
  onJobsUpdated: () => void;
  applications: JobApplication[];
  onUpdateApplicationStatus: (appId: string, newStatus: JobApplication['status'], notes?: string) => void;
  candidates: UserAccount[];
  onLogout: () => void;
}

export const AdminPanelPage: React.FC<AdminPanelPageProps> = ({
  onBackToJobs,
  jobs,
  onJobsUpdated,
  applications,
  onUpdateApplicationStatus,
  candidates,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'candidates' | 'jobs'>('applications');
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Create New Job Requisition Form State
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDepartment, setNewJobDepartment] = useState('Customer Trust & Partner Support');
  const [newJobLocation, setNewJobLocation] = useState('Kolkata');
  const [newJobWorkMode, setNewJobWorkMode] = useState<'Virtual / WFH' | 'On-site' | 'Hybrid'>('Virtual / WFH');
  const [newJobShiftType, setNewJobShiftType] = useState<'Rotational (24/7)' | 'Day Shift' | 'Night Shift'>('Rotational (24/7)');
  const [newJobExperience, setNewJobExperience] = useState<'Fresher (0 yrs)' | '1 - 3 Yrs' | '3 - 5 Yrs' | '5+ Yrs'>('Fresher (0 yrs)');
  const [newJobSalary, setNewJobSalary] = useState('₹ 3.5 - 4.8 LPA');
  const [newJobOpeningsCount, setNewJobOpeningsCount] = useState(15);
  const [newJobRequirementsText, setNewJobRequirementsText] = useState('Customer support experience; English & Hindi fluency; Graduation degree.');

  // Filter applications
  const filteredApplications = applications.filter(app => {
    if (statusFilter !== 'All' && app.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = app.fullName.toLowerCase().includes(q);
      const matchesEmail = app.email.toLowerCase().includes(q);
      const matchesReg = app.regId.toLowerCase().includes(q);
      const matchesJob = app.jobTitle.toLowerCase().includes(q);
      if (!matchesName && !matchesEmail && !matchesReg && !matchesJob) return false;
    }
    return true;
  });

  // Filter candidates
  const filteredCandidates = candidates.filter(c => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return c.fullName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col py-6 px-4 sm:px-6 lg:px-8">
      {/* Header Row */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between mb-6 pb-4 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToJobs}
            className="flex items-center gap-2 text-slate-300 hover:text-white bg-[#141C2E] border border-[#2A364F] px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors"
            id="admin-back-btn"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF6B00]" />
            <span>View Public Careers Site</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#141C2E] border border-purple-500/40 px-3 py-1 rounded-full text-xs text-purple-300 font-bold">
            <UserCheck className="w-4 h-4" />
            <span>Recruiter Admin Workspace</span>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold"
            id="admin-page-logout-btn"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto w-full bg-[#141C2E] border border-[#2A364F] rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 bg-[#0F172A] border-b border-[#2A364F] text-xs">
          <div className="p-3.5 rounded-xl bg-[#141C2E] border border-[#2A364F]">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Applications</span>
            <span className="text-2xl font-extrabold text-white mt-0.5 block">{applications.length}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141C2E] border border-[#2A364F]">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Registered Candidates</span>
            <span className="text-2xl font-extrabold text-[#FF6B00] mt-0.5 block">{candidates.length}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141C2E] border border-[#2A364F]">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Active Requisitions</span>
            <span className="text-2xl font-extrabold text-emerald-400 mt-0.5 block">{jobs.length}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141C2E] border border-[#2A364F]">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Shortlisted / In Progress</span>
            <span className="text-2xl font-extrabold text-purple-400 mt-0.5 block">
              {applications.filter(a => a.status !== 'Submitted' && a.status !== 'Rejected').length}
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 bg-[#0B0F19] border-b border-[#2A364F] text-xs font-bold">
          <button
            onClick={() => setActiveTab('applications')}
            className={`py-3.5 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'applications'
                ? 'border-[#FF6B00] text-[#FF6B00] bg-[#141C2E]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            id="admin-page-tab-apps"
          >
            <FileCheck className="w-4 h-4" />
            <span>Applications ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('candidates')}
            className={`py-3.5 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'candidates'
                ? 'border-[#FF6B00] text-[#FF6B00] bg-[#141C2E]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            id="admin-page-tab-candidates"
          >
            <Users className="w-4 h-4" />
            <span>Candidate Profiles ({candidates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`py-3.5 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'jobs'
                ? 'border-[#FF6B00] text-[#FF6B00] bg-[#141C2E]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            id="admin-page-tab-jobs"
          >
            <Briefcase className="w-4 h-4" />
            <span>Job Requisitions ({jobs.length})</span>
          </button>
        </div>

        {/* Tab 1: Applications View */}
        {activeTab === 'applications' && (
          <div className="p-6 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by candidate name, email, registration ID or job title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                  id="admin-page-search-apps"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#0B0F19] border border-[#2A364F] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                id="admin-page-status-filter"
              >
                <option value="All">All Pipeline Stages</option>
                <option value="Submitted">Submitted</option>
                <option value="Resume Screened">Resume Screened</option>
                <option value="Virtual Assessment">Virtual Assessment</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Offer Extended">Offer Extended</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {filteredApplications.length === 0 ? (
              <div className="p-8 text-center bg-[#0B0F19] rounded-xl border border-[#2A364F] text-slate-400">
                No applications matching your current filter.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredApplications.map((app) => (
                  <div key={app.id} className="p-4 rounded-xl bg-[#0B0F19] border border-[#2A364F] space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2A364F] pb-2">
                      <div>
                        <span className="font-mono text-[10px] text-[#FF6B00] font-extrabold bg-[#141C2E] px-2 py-0.5 rounded border border-[#2A364F] mr-2">
                          {app.regId}
                        </span>
                        <span className="text-sm font-bold text-white">{app.fullName}</span>
                        <span className="text-slate-400 text-xs ml-2">• {app.jobTitle}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">Pipeline Stage:</span>
                        <select
                          value={app.status}
                          onChange={(e) => onUpdateApplicationStatus(app.id, e.target.value as JobApplication['status'])}
                          className="bg-[#141C2E] border border-[#2A364F] text-[#FF6B00] font-bold text-xs rounded-lg px-3 py-1 focus:outline-none"
                          id={`app-status-select-${app.id}`}
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Resume Screened">Resume Screened</option>
                          <option value="Virtual Assessment">Virtual Assessment</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Offer Extended">Offer Extended</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
                      <div><strong className="text-white">Email:</strong> {app.email}</div>
                      <div><strong className="text-white">Phone:</strong> {app.phone}</div>
                      <div><strong className="text-white">City:</strong> {app.city}</div>
                      <div><strong className="text-white">Shift:</strong> {app.preferredShift}</div>
                      <div><strong className="text-white">Education:</strong> {app.highestQualification}</div>
                      <div><strong className="text-white">Experience:</strong> {app.experienceYears}</div>
                      <div><strong className="text-white">WFH Ready:</strong> {app.hasLaptopAndWifi ? 'Yes' : 'No'}</div>
                      <div><strong className="text-white">Applied Date:</strong> {new Date(app.appliedAt).toLocaleDateString()}</div>
                    </div>

                    {app.resumeFileName && (
                      <div className="p-2.5 rounded-lg bg-[#141C2E] text-[11px] text-slate-300 border border-[#2A364F]">
                        <span className="font-bold text-slate-200">Resume File: </span>
                        <span>{app.resumeFileName}</span>
                        {app.resumeText && <p className="mt-1 text-slate-400 line-clamp-2">{app.resumeText}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Candidate Directory View */}
        {activeTab === 'candidates' && (
          <div className="p-6 space-y-4 text-xs">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search registered candidates by name, email, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                id="admin-page-search-candidates"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCandidates.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-[#0B0F19] border border-[#2A364F] space-y-2">
                  <div className="flex justify-between items-center border-b border-[#2A364F] pb-2">
                    <h3 className="font-bold text-white text-sm">{c.fullName}</h3>
                    <span className="text-[10px] text-slate-400">{c.city}</span>
                  </div>
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <p><strong>Email:</strong> {c.email}</p>
                    <p><strong>Phone:</strong> {c.phone}</p>
                    <p><strong>Qualification:</strong> {c.highestQualification}</p>
                    <p><strong>Skills:</strong> {c.skills?.join(', ') || 'N/A'}</p>
                    {c.resumeFileName && (
                      <div className="mt-2 p-2 rounded bg-[#141C2E] border border-[#2A364F]">
                        <p className="font-bold text-[#FF6B00]">Resume: {c.resumeFileName}</p>
                        {c.resumeText && <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{c.resumeText}</p>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Manage Jobs Requisitions */}
        {activeTab === 'jobs' && (
          <div className="p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white">BuyQK Job Requisitions</h3>
                <p className="text-[11px] text-slate-400">Publish new openings to the live career site or manage current requisitions.</p>
              </div>

              <button
                onClick={() => setIsNewJobModalOpen(!isNewJobModalOpen)}
                className="px-4 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#FF7A00] text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                id="admin-page-add-job-btn"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Requisition</span>
              </button>
            </div>

            {/* Jobs list */}
            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 rounded-xl bg-[#0B0F19] border border-[#2A364F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[#FF6B00] font-bold">{job.reqId}</span>
                      <span className="text-[10px] text-slate-400">• {job.openingsCount} Openings</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-0.5">{job.title}</h4>
                    <p className="text-[11px] text-slate-400">{job.department} • {job.location} ({job.workMode})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
