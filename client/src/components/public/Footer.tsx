import React from 'react';
import { Dumbbell, Globe, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#05050b] border-t border-gray-900 pt-16 pb-12 text-[#B8B5C2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E91E63] to-[#571638] flex items-center justify-center text-white">
                <Dumbbell className="w-5 h-5" />
              </div>
              <span className="font-heading text-2xl font-bold tracking-wider text-white">
                DEMO<span className="text-[#E91E63]">FIT</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm mb-6">
              Complete Gym Website & Management System — Live Client Demo. Built for modern fitness clubs, CrossFit boxes, and athletic training facilities.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-lg bg-[#151522] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#E91E63] hover:border-[#E91E63] transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-lg bg-[#151522] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#E91E63] hover:border-[#E91E63] transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-lg bg-[#151522] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#E91E63] hover:border-[#E91E63] transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-base font-bold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/programs" className="hover:text-white transition-colors">Training Programs</Link></li>
              <li><Link to="/classes" className="hover:text-white transition-colors">Fitness Classes</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">All Services</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Membership Pricing</Link></li>
              <li><Link to="/trainers" className="hover:text-white transition-colors">Master Coaches</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact & Map</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-base font-bold text-white uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/services" className="hover:text-white transition-colors">Personal Training</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Bodybuilding Split</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Combat Conditioning</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Yoga & Fascia Mobility</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Diet & Nutrition Consultation</Link></li>
            </ul>
          </div>

          {/* Portals & Management */}
          <div>
            <h4 className="font-heading text-base font-bold text-white uppercase tracking-wider mb-4">
              Portals
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/login" className="hover:text-[#E91E63] transition-colors">Sign In</Link></li>
              <li><Link to="/portal" className="hover:text-[#E91E63] transition-colors">Member Portal</Link></li>
              <li><Link to="/trainer" className="hover:text-[#E91E63] transition-colors">Trainer Portal</Link></li>
              <li><Link to="/admin" className="hover:text-[#E91E63] transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 APEX ELITE FITNESS. All Rights Reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-400 cursor-pointer">Facility Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
