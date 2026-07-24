import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#080B13] border-t border-[#1E293B] text-slate-400 text-xs py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center text-2xl font-black tracking-tight font-sans">
              <span className="text-white">Buy</span>
              <span className="text-[#FF6B00] italic font-serif ml-0.5 tracking-wide">QK</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              BuyQK — Everything. Delivered. India's fastest multi-store e-commerce and 10-minute quick commerce delivery platform.
            </p>
            <div className="flex items-center gap-2 text-slate-300 font-semibold pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>100% Equal Opportunity Employer</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Popular Roles</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Customer Experience Specialist (Kolkata)</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Merchant Partner Onboarding Lead</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Darkstore Operations Hub Lead</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Frontend & AI Product Engineer</a></li>
            </ul>
          </div>

          {/* Locations */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Hiring Cities</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Kolkata (Customer Trust & Operations Hub)</li>
              <li>Bengaluru (Engineering & HQ)</li>
              <li>Hyderabad & Mumbai (Darkstore Networks)</li>
              <li>Delhi NCR & All India Remote WFH</li>
            </ul>
          </div>

          {/* Recruitment Support */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Recruitment Helpdesk</h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>careers-support@buyqk.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+91 (080) 4900-BUYQK</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>Koramangala, Bengaluru, 560034</span>
              </div>
            </div>
          </div>

        </div>

        {/* Anti-Fraud Banner */}
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#2A364F] flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FF6B00] shrink-0" />
            <span>
              <strong>Recruitment Security Warning:</strong> BuyQK never asks for money or registration fees for interviews.
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Official Portal: careers.buyqk.com</span>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © 2026 BuyQK Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
            <span>for BuyQK Careers</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
