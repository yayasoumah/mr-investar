"use client";

import Link from "next/link";
import { UserMenu } from "@/components/user/user-menu";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-header w-[95%] max-w-7xl">
        <div className="bg-white/95 backdrop-blur-sm rounded-full border border-grey-200">
          <div className="h-14 flex items-center justify-between px-8">
            <div className="flex items-center">
              <Link 
                href="/dashboard" 
                className="text-secondary font-medium text-2xl tracking-tight hover:text-primary transition-colors"
              >
                MR. INVESTAR
              </Link>
              <div className="hidden md:flex items-center gap-8 ml-8">
                {/* Opportunities link */}
                <Link
                  href="/dashboard"
                  className="text-secondary/80 hover:text-primary transition-colors text-sm font-medium"
                >
                  Opportunities
                </Link>

                {/* NEW: “Shared” link */}
                <Link
                  href="/dashboard/shared"
                  className="text-secondary/80 hover:text-primary transition-colors text-sm font-medium"
                >
                  Shared
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                <UserMenu />
              </div>
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-secondary hover:text-primary transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-secondary/90 backdrop-blur-md transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu Content */}
        <div 
          className={`absolute inset-x-0 top-0 min-h-screen bg-transparent transform transition-transform duration-300 ease-out flex flex-col ${
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="flex-1 pt-28 px-6">
            {/* Navigation Links */}
            <nav className="flex flex-col space-y-6">
              <Link
                href="/dashboard"
                className="text-[2rem] font-medium text-white/90 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Opportunities
              </Link>

              {/* NEW: “Shared” link (mobile) */}
              <Link
                href="/dashboard/shared"
                className="text-[2rem] font-medium text-white/90 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Shared
              </Link>
            </nav>
          </div>

          {/* Mobile Actions */}
          <div className="px-6 pb-8">
            <div className="w-full">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
