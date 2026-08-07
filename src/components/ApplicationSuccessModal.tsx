import React from 'react';
import { 
  CheckCircle2, 
  Copy, 
  FileCheck, 
  Printer, 
  ArrowRight, 
  Calendar, 
  Building, 
  User, 
  Mail, 
  Phone,
  Sparkles
} from 'lucide-react';
import { JobApplication } from '../types';

interface ApplicationSuccessModalProps {
  application: JobApplication | null;
  onClose: () => void;
  onViewTracker: () => void;
}

export const ApplicationSuccessModal: React.FC<ApplicationSuccessModalProps> = ({
  application,
  onClose,
  onViewTracker
}) => {
  if (!application) return null;

  const handleCopyRegId = () => {
    navigator.clipboard.writeText(application.regId);
    alert(`Registration ID ${application.regId} copied to clipboard!`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#141C2E] border border-[#2A364F] rounded-2xl shadow-2xl text-white my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        id="application-success-modal"
      >
        {/* Top Celebration Graphic Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-[#FF6B00] px-6 py-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="mx-auto w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xl mb-3 border border-white/30 animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Application Registered Successfully!
          </h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-md mx-auto">
            Thank you for applying to BuyQK. Your application has been logged in our virtual recruitment engine.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-slate-200 text-xs sm:text-sm">
          
          {/* Registration ID Banner */}
          <div className="p-4 rounded-xl bg-[#0B0F19] border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Official BuyQK Registration ID
              </span>
              <div className="text-xl font-mono font-extrabold text-white tracking-wider mt-0.5">
                {application.regId}
              </div>
            </div>

            <button
              onClick={handleCopyRegId}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141C2E] hover:bg-[#1E293B] border border-[#2A364F] text-xs text-slate-200 font-semibold transition-colors"
              id="copy-regid-btn"
            >
              <Copy className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Copy Registration ID</span>
            </button>
          </div>

          {/* Application Summary Receipt Card */}
          <div className="space-y-3 p-4 rounded-xl bg-[#0B0F19] border border-[#2A364F]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] flex items-center justify-between border-b border-[#2A364F] pb-2">
              <span className="flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" /> Application Details
              </span>
              <span className="text-[11px] text-slate-400 font-normal flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(application.appliedAt).toLocaleDateString()}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span><strong className="text-white">Applicant:</strong> {application.fullName}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span><strong className="text-white">Role:</strong> {application.jobTitle}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span><strong className="text-white">Email:</strong> {application.email}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span><strong className="text-white">Phone:</strong> {application.phone}</span>
              </div>
            </div>
          </div>

          {/* Virtual Hiring Timeline Steps */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> What Happens Next?
            </h3>

            <div className="relative pl-6 space-y-4 border-l-2 border-emerald-500/40 ml-2 pt-1 text-xs">
              <div className="relative">
                <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#141C2E]"></span>
                <p className="font-bold text-white">Step 1: Automated Resume & Qualification Screening (In Progress)</p>
                <p className="text-[11px] text-slate-400">Our HR algorithm verifies your shift preferences and contact details.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#2A364F] border-2 border-[#141C2E]"></span>
                <p className="font-semibold text-slate-300">Step 2: Virtual Communication Assessment Link</p>
                <p className="text-[11px] text-slate-400">An invitation link will be sent to {application.email} within 24 hours.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#2A364F] border-2 border-[#141C2E]"></span>
                <p className="font-semibold text-slate-300">Step 3: Operations Round & Documentation Verification</p>
                <p className="text-[11px] text-slate-400">Virtual 1-on-1 discussion with the BuyQK hiring lead.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="bg-[#0B0F19] border-t border-[#2A364F] px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#141C2E] hover:bg-[#1E293B] border border-[#2A364F] text-slate-300 text-xs font-semibold"
            id="print-receipt-btn"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>

          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
            <button
              onClick={() => {
                onClose();
                onViewTracker();
              }}
              className="px-4 py-2.5 rounded-xl bg-[#141C2E] hover:bg-[#1E293B] border border-[#2A364F] text-slate-200 text-xs font-semibold flex items-center gap-1.5"
              id="track-status-modal-btn"
            >
              <FileCheck className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Track Application Status</span>
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF7A00] text-white text-xs font-bold shadow-lg shadow-[#FF6B00]/25 transition-all flex items-center gap-1.5"
              id="close-success-btn"
            >
              <span>Done</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
