import React, { useState } from 'react';
import { 
  X, 
  Search, 
  FileCheck, 
  Clock, 
  MapPin, 
  Building, 
  Calendar, 
  CheckCircle2, 
  User,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { JobApplication } from '../types';

interface MyApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: JobApplication[];
  onSearchApplications: (query: string) => void;
  onApplyNewRole: () => void;
}

export const MyApplicationsModal: React.FC<MyApplicationsModalProps> = ({
  isOpen,
  onClose,
  applications,
  onSearchApplications,
  onApplyNewRole
}) => {
  const [queryInput, setQueryInput] = useState('');

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchApplications(queryInput);
  };

  const getStatusBadge = (status: JobApplication['status']) => {
    switch (status) {
      case 'Submitted':
        return <span className="px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold">Submitted</span>;
      case 'Resume Screened':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">Resume Screened</span>;
      case 'Virtual Assessment':
        return <span className="px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">Virtual Assessment</span>;
      case 'Interview Scheduled':
        return <span className="px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold">Interview Scheduled</span>;
      case 'Offer Extended':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">Offer Extended</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#141C2E] border border-[#2A364F] rounded-2xl shadow-2xl text-white my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        id="applications-tracker-modal"
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-10 bg-[#0B0F19] border-b border-[#2A364F] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/15 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00]">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">My Application Tracker</h2>
              <p className="text-xs text-slate-400">Track your registered BuyQK job applications</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#141C2E] text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors"
            id="close-tracker-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-slate-200 text-xs sm:text-sm">
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Email, Reg ID (e.g. BUYQK-2026-REG-88192) or Name..."
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                className="w-full bg-[#0B0F19] border border-[#2A364F] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                id="tracker-search-input"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF7A00] text-white text-xs font-bold transition-colors"
              id="tracker-search-btn"
            >
              Search
            </button>
          </form>

          {/* Applications List */}
          {applications.length === 0 ? (
            <div className="p-8 text-center bg-[#0B0F19] rounded-2xl border border-[#2A364F] space-y-3">
              <FileCheck className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">No Registered Applications Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No job applications match your search query or you haven't submitted any applications yet.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onApplyNewRole();
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#FF7A00] text-white text-xs font-bold shadow-md"
                id="browse-openings-empty-btn"
              >
                <span>Browse Open Roles</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div 
                  key={app.id} 
                  className="p-5 rounded-2xl bg-[#0B0F19] border border-[#2A364F] space-y-4 shadow-lg hover:border-[#FF6B00]/40 transition-colors"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#2A364F] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-[#141C2E] border border-[#2A364F] text-[10px] font-mono font-extrabold text-[#FF6B00]">
                          {app.regId}
                        </span>
                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mt-1">
                        {app.jobTitle}
                      </h3>
                    </div>

                    <div>
                      {getStatusBadge(app.status)}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Applicant Name</span>
                      <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3 text-slate-400" /> {app.fullName}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">Location</span>
                      <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#FF6B00]" /> {app.city}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">Shift Preference</span>
                      <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-emerald-400" /> {app.preferredShift}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">Department</span>
                      <span className="font-semibold text-white flex items-center gap-1 mt-0.5 truncate">
                        <Building className="w-3 h-3 text-blue-400 shrink-0" /> {app.department}
                      </span>
                    </div>
                  </div>

                  {/* Progress Pipeline */}
                  <div className="bg-[#141C2E] p-3 rounded-xl border border-[#2A364F]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Application Stage Timeline
                    </span>

                    <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-medium">
                      <div className="p-1.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                        1. Submitted ✓
                      </div>
                      <div className={`p-1.5 rounded ${app.status !== 'Submitted' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' : 'bg-[#0B0F19] text-amber-300 border border-amber-500/30'}`}>
                        2. Screening
                      </div>
                      <div className={`p-1.5 rounded ${['Virtual Assessment', 'Interview Scheduled', 'Offer Extended'].includes(app.status) ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' : 'bg-[#0B0F19] text-slate-500'}`}>
                        3. Assessment
                      </div>
                      <div className={`p-1.5 rounded ${app.status === 'Offer Extended' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' : 'bg-[#0B0F19] text-slate-500'}`}>
                        4. Final Offer
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-[#0B0F19] border-t border-[#2A364F] px-6 py-4 flex justify-between items-center">
          <div className="text-xs text-slate-400">
            Need help? Contact <span className="text-[#FF6B00]">careers-support@buyqk.com</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#141C2E] hover:bg-[#1E293B] border border-[#2A364F] text-slate-300 text-xs font-semibold"
            id="close-applications-tracker-btn"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
