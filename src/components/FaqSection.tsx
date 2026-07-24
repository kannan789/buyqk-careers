import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Laptop, Clock, Headphones } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does BuyQK's 100% Virtual Hiring Process work?",
      answer: "Our virtual hiring process is designed to be fast, transparent, and candidate-friendly. After submitting your web application form, your profile is screened. Eligible candidates receive an automated link for an online language & typing assessment, followed by a virtual 1-on-1 interview with the Operations Manager. Selected candidates receive an immediate digital Offer Letter within 2-3 business days.",
      icon: <HelpCircle className="w-4 h-4 text-[#FF6B00]" />
    },
    {
      question: "What are the eligibility criteria for Customer Experience Specialist roles (Kolkata / WFH)?",
      answer: "Candidates must hold a Graduation degree in any discipline (final year candidates awaiting results are also eligible). You need good verbal and written communication skills in English and Hindi (knowledge of Bengali or other regional languages is an added advantage). Typing speed of 30+ WPM is preferred.",
      icon: <Headphones className="w-4 h-4 text-purple-400" />
    },
    {
      question: "What system requirements are needed for Work From Home (WFH) positions?",
      answer: "For WFH roles, candidates require a personal laptop or desktop computer with Windows 10/11 operating system, minimum 8GB RAM, a working headset with microphone, and a stable broadband Wi-Fi connection (minimum 50 Mbps). High-performing employees receive company-issued devices post-training.",
      icon: <Laptop className="w-4 h-4 text-blue-400" />
    },
    {
      question: "What are the shift timings and work-week policies?",
      answer: "Customer Trust & Darkstore Operations roles run on a 24x7 rotational shift model with 5 working days per week and 2 rotational off days. Night shifts include additional attractive Night Allowances over and above base CTC.",
      icon: <Clock className="w-4 h-4 text-emerald-400" />
    },
    {
      question: "Is there any fee charged at any stage of BuyQK recruitment?",
      answer: "No! BuyQK NEVER charges any registration fee, security deposit, or payment from job applicants. All training, assessments, and onboarding are 100% free. Beware of fake job offers or scam calls claiming to represent BuyQK.",
      icon: <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
    }
  ];

  return (
    <div className="bg-[#0B0F19] py-12 border-t border-[#1E293B] text-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-[#141C2E] border border-[#FF6B00]/30 text-xs font-extrabold uppercase tracking-widest text-[#FF6B00]">
            Candidate Assistance
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Everything you need to know about BuyQK virtual hiring, shift policies, and WFH setup.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div 
                key={idx}
                className="rounded-2xl bg-[#141C2E] border border-[#2A364F] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-[#FF6B00] transition-colors"
                  id={`faq-toggle-${idx}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#0B0F19] border border-[#2A364F] shrink-0">
                      {faq.icon}
                    </div>
                    <span>{faq.question}</span>
                  </div>

                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#FF6B00]' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-slate-300 leading-relaxed border-t border-[#2A364F]/50 pt-3 bg-[#0D111D]/60 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
