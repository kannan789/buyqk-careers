import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  FileCheck, 
  Briefcase, 
  Search, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  Filter, 
  Building2, 
  MapPin, 
  Clock, 
  Award, 
  UserCheck, 
  MessageSquare,
  Sparkles,
  ChevronDown,
  Laptop
} from 'lucide-react';
import { JobApplication, UserAccount, JobOpening } from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: JobOpening[];
  onJobsUpdated: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  jobs,
  onJobsUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'candidates' | 'jobs'>('applications');
  
  // Data State
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [candidates, setCandidates] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Selected Application detail view / editing
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [recruiterNoteText, setRecruiterNoteText] = useState('');

  // Selected Candidate profile modal
  const [selectedCandidate, setSelectedCandidate] = useState<UserAccount | null>(null);

  // Create New Job Requisition Form Modal
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDepartment, setNewJobDepartment] = useState('Customer Trust & Partner Support');
  const [newJobLocation, setNewJobLocation] = useState('Kolkata');
  const [newJobWorkMode, setNewJobWorkMode] = useState<'Virtual / WFH' | 'On-site' | 'Hybrid'>('Virtual / WFH');
  const [newJobShiftType, setNewJobShiftType] = useState<'Rotational (24/7)' | 'Day Shift' | 'Night Shift'>('Rotational (24/7)');
  const [newJobExperience, setNewJobExperience] = useState<'Fresher (0 yrs)' | '1 - 3 Yrs' | '3 - 5 Yrs' | '5+ Yrs'>('Fresher (0 yrs)');
  const [newJobSalary, setNewJobSalary] = useState('₹ 3.5 - 4.8 LPA + Night Allowances');
  const [newJobOpeningsCount, setNewJobOpeningsCount] = useState(15);
  const [newJobRequirementsText, setNewJobRequirementsText] = useState('Good verbal and written communication in English and Hindi; Typing speed 35+ WPM; Graduate in any discipline.');

  // Load Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [appRes, candRes] = await Promise.all([
        fetch('/api/admin/applications'),
        fetch('/api/admin/candidates')
      ]);

      const appJson = await appRes.json();
      const candJson = await candRes.json();

      if (appJson.success) setApplications(appJson.applications || []);
      if (candJson.success) setCandidates(candJson.candidates || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

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

  // Application status update handler
  const handleUpdateStatus = async (appId: string, newStatus: JobApplication['status'], notes?: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, recruiterNotes: notes })
      });

      const json = await res.json();
      if (json.success && json.application) {
        setApplications(prev => prev.map(a => a.id === appId ? json.application : a));
        if (selectedApp?.id === appId) {
          setSelectedApp(json.application);
        }
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  // Create Job Opening Submit
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const reqId = `BUYQK-2026-${newJobDepartment.substring(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      const res = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reqId,
          title: newJobTitle,
          department: newJobDepartment,
          location: newJobLocation,
          workMode: newJobWorkMode,
          shiftType: newJobShiftType,
          experience: newJobExperience,
          salary: newJobSalary,
          openingsCount: newJobOpeningsCount,
          description: `BuyQK Requisition for ${newJobTitle} in ${newJobLocation}.`,
          requirements: newJobRequirementsText.split(';').map(r => r.trim()).filter(Boolean)
        })
      });

      const json = await res.json();
      if (json.success) {
        setIsNewJobModalOpen(false);
        setNewJobTitle('');
        onJobsUpdated();
      }
    } catch (err) {
      console.error('Create job error:', err);
    }
  };

  // Delete Job Requisition
  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to close this job requisition?')) return;
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        onJobsUpdated();
      }
    } catch (err) {
      console.error('Delete job error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-[#141C2E] border border-purple-500/40 rounded-2xl shadow-2xl text-white my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        id="admin-panel-modal"
      >
        {/* Top Admin Header */}
        <div className="bg-[#0B0F19] border-b border-[#2A364F] px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  BuyQK Talent Acquisition Dashboard
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  Admin Authorized
                </span>
              </div>
              <h2 className="text-lg font-black text-white">Recruiter Control & Management Panel</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#141C2E] text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors"
            id="close-admin-panel-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#0F172A] border-b border-[#2A364F] text-xs">
          <div className="p-3 rounded-xl bg-[#141C2E] border border-[#2A364F]">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Applications</span>
            <span className="text-xl font-extrabold text-white mt-0.5 block">{applications.length}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#141C2E] border border-[#2A364F]">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Registered Candidates</span>
            <span className="text-xl font-extrabold text-[#FF6B00] mt-0.5 block">{candidates.length}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#141C2E] border border-[#2A364F]">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Active Requisitions</span>
            <span className="text-xl font-extrabold text-emerald-400 mt-0.5 block">{jobs.length}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#141C2E] border border-[#2A364F]">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Shortlisted / Screened</span>
            <span className="text-xl font-extrabold text-purple-400 mt-0.5 block">
              {applications.filter(a => a.status !== 'Submitted' && a.status !== 'Rejected').length}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 bg-[#0B0F19] border-b border-[#2A364F] text-xs font-bold">
          <button
            onClick={() => setActiveTab('applications')}
            className={`py-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'applications'
                ? 'border-[#FF6B00] text-[#FF6B00] bg-[#141C2E]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            id="admin-tab-applications"
          >
            <FileCheck className="w-4 h-4" />
            <span>Applications ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('candidates')}
            className={`py-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'candidates'
                ? 'border-[#FF6B00] text-[#FF6B00] bg-[#141C2E]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            id="admin-tab-candidates"
          >
            <Users className="w-4 h-4" />
            <span>Candidate Profiles ({candidates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`py-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'jobs'
                ? 'border-[#FF6B00] text-[#FF6B00] bg-[#141C2E]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
            id="admin-tab-jobs"
          >
            <Briefcase className="w-4 h-4" />
            <span>Manage Job Requisitions ({jobs.length})</span>
          </button>
        </div>

        {/* Tab 1: Applications Management */}
        {activeTab === 'applications' && (
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto text-xs">
            
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by Candidate Name, Email, Reg ID, or Role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                  id="admin-search-apps-input"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#0B0F19] border border-[#2A364F] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                id="admin-status-filter-select"
              >
                <option value="All">All Pipeline Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Resume Screened">Resume Screened</option>
                <option value="Virtual Assessment">Virtual Assessment</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Offer Extended">Offer Extended</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Applications List */}
            {filteredApplications.length === 0 ? (
              <div className="p-8 text-center bg-[#0B0F19] rounded-xl border border-[#2A364F] text-slate-400">
                No job applications found matching your criteria.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredApplications.map((app) => (
                  <div 
                    key={app.id} 
                    className="p-4 rounded-xl bg-[#0B0F19] border border-[#2A364F] space-y-3 hover:border-purple-500/50 transition-colors"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#2A364F] pb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-[#FF6B00] font-extrabold bg-[#141C2E] px-2 py-0.5 rounded border border-[#2A364F]">
                            {app.regId}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Applied {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-1">
                          {app.fullName} — <span className="text-purple-300 font-normal">{app.jobTitle}</span>
                        </h3>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-semibold">Pipeline Stage:</span>
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app.id, e.target.value as JobApplication['status'])}
                          className="bg-[#141C2E] border border-[#2A364F] text-[#FF6B00] font-bold text-xs rounded-lg px-2.5 py-1 focus:outline-none"
                          id={`change-status-${app.id}`}
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

                    {/* Quick Candidate Summary Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
                      <div><strong className="text-white">Email:</strong> {app.email}</div>
                      <div><strong className="text-white">Phone:</strong> {app.phone}</div>
                      <div><strong className="text-white">City:</strong> {app.city}</div>
                      <div><strong className="text-white">Shift:</strong> {app.preferredShift}</div>
                      <div><strong className="text-white">Qualification:</strong> {app.highestQualification}</div>
                      <div><strong className="text-white">Experience:</strong> {app.experienceYears}</div>
                      <div><strong className="text-white">WFH Laptop:</strong> {app.hasLaptopAndWifi ? 'Yes ✓' : 'No ✗'}</div>
                      <div><strong className="text-white">Notice Period:</strong> {app.noticePeriod}</div>
                    </div>

                    {/* Resume Snippet & Action */}
                    {app.resumeText && (
                      <div className="p-2.5 rounded-lg bg-[#141C2E] text-[11px] text-slate-300 border border-[#2A364F]">
                        <strong className="text-purple-300 block mb-0.5">Resume / Candidate Summary:</strong>
                        <p className="line-clamp-2">{app.resumeText}</p>
                      </div>
                    )}

                    {app.recruiterNotes && (
                      <div className="text-[11px] text-emerald-300 font-medium">
                        <strong>Recruiter Note:</strong> {app.recruiterNotes}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Candidate Profiles Directory */}
        {activeTab === 'candidates' && (
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto text-xs">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search registered candidate profiles by name, email, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                id="admin-search-candidates-input"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCandidates.map((cand) => (
                <div key={cand.id} className="p-4 rounded-xl bg-[#0B0F19] border border-[#2A364F] space-y-2">
                  <div className="flex items-center justify-between border-b border-[#2A364F] pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-white">{cand.fullName}</h3>
                      <p className="text-[11px] text-slate-400">{cand.email} • {cand.phone}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/40">
                      Candidate
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-300">
                    <p><strong>City:</strong> {cand.city}, {cand.state}</p>
                    <p><strong>Education:</strong> {cand.highestQualification}</p>
                    <p><strong>Experience:</strong> {cand.experienceYears}</p>
                    <p><strong>Skills:</strong> {cand.skills?.join(', ')}</p>
                    <p><strong>Shift Pref:</strong> {cand.preferredShift}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Manage Job Openings */}
        {activeTab === 'jobs' && (
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto text-xs">
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white">Active BuyQK Job Requisitions</h3>
                <p className="text-[11px] text-slate-400">Publish new openings or close existing requisitions in real time.</p>
              </div>

              <button
                onClick={() => setIsNewJobModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#FF7A00] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                id="admin-add-job-btn"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Job Requisition</span>
              </button>
            </div>

            {/* Modal for Creating New Job */}
            {isNewJobModalOpen && (
              <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#FF6B00]/40 space-y-4 animate-in fade-in duration-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" /> Publish New Requisition Form
                </h4>

                <form onSubmit={handleCreateJob} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-300">Job Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Senior Darkstore Fleet Supervisor"
                        value={newJobTitle}
                        onChange={(e) => setNewJobTitle(e.target.value)}
                        className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                        id="newjob-title-input"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-300">Department *</label>
                      <select
                        value={newJobDepartment}
                        onChange={(e) => setNewJobDepartment(e.target.value)}
                        className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                        id="newjob-dept-select"
                      >
                        <option value="Customer Trust & Partner Support">Customer Trust & Partner Support</option>
                        <option value="Merchant & Delivery Operations">Merchant & Delivery Operations</option>
                        <option value="Darkstore Logistics">Darkstore Logistics</option>
                        <option value="Technology & Product">Technology & Product</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-300">Location *</label>
                      <input
                        type="text"
                        required
                        value={newJobLocation}
                        onChange={(e) => setNewJobLocation(e.target.value)}
                        className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                        id="newjob-location-input"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-300">Work Mode *</label>
                      <select
                        value={newJobWorkMode}
                        onChange={(e) => setNewJobWorkMode(e.target.value as any)}
                        className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                        id="newjob-workmode-select"
                      >
                        <option value="Virtual / WFH">Virtual / WFH</option>
                        <option value="On-site">On-site</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-300">Shift Type *</label>
                      <select
                        value={newJobShiftType}
                        onChange={(e) => setNewJobShiftType(e.target.value as any)}
                        className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                        id="newjob-shift-select"
                      >
                        <option value="Rotational (24/7)">Rotational (24/7)</option>
                        <option value="Day Shift">Day Shift</option>
                        <option value="Night Shift">Night Shift</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-300">Openings Count *</label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={newJobOpeningsCount}
                        onChange={(e) => setNewJobOpeningsCount(Number(e.target.value))}
                        className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                        id="newjob-openings-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-300">Requirements (Semicolon separated)</label>
                    <textarea
                      rows={2}
                      value={newJobRequirementsText}
                      onChange={(e) => setNewJobRequirementsText(e.target.value)}
                      className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-lg p-2 text-xs text-white focus:outline-none"
                      id="newjob-reqs-textarea"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsNewJobModalOpen(false)}
                      className="px-4 py-1.5 rounded-lg bg-[#141C2E] border border-[#2A364F] text-slate-300 text-xs"
                      id="cancel-newjob-btn"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-1.5 rounded-lg bg-[#FF6B00] hover:bg-[#FF7A00] text-white font-bold text-xs"
                      id="submit-newjob-btn"
                    >
                      Publish Requisition
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Jobs List */}
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

                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold flex items-center gap-1 shrink-0"
                    id={`delete-job-${job.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Close Requisition</span>
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Modal Footer */}
        <div className="bg-[#0B0F19] border-t border-[#2A364F] px-6 py-4 flex justify-between items-center text-xs text-slate-400">
          <span>BuyQK Internal HR Console</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#141C2E] hover:bg-[#1E293B] border border-[#2A364F] text-slate-300 font-semibold"
            id="close-admin-footer-btn"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
