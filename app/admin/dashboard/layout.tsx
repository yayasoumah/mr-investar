"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { signOut } from "@/lib/auth";
import { AdminMenu } from "./components/admin-menu";

function AdminDashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut(true); // Pass true to indicate admin sign-out
  };

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-header w-[95%] max-w-7xl">
        <div className="bg-white/95 backdrop-blur-sm rounded-full border border-grey-200">
          <div className="h-14 flex items-center justify-between px-8">
            <div className="flex items-center">
              <Link 
                href="/admin/dashboard" 
                className="text-secondary font-medium text-2xl tracking-tight hover:text-primary transition-colors"
              >
                MR. INVESTAR ADMIN
              </Link>
              <div className="hidden md:flex items-center gap-8 ml-8">
                <Link
                  href="/admin/dashboard"
                  className="text-secondary/80 hover:text-primary transition-colors text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/dashboard/opportunities"
                  className="text-secondary/80 hover:text-primary transition-colors text-sm font-medium"
                >
                  Opportunities
                </Link>
                <Link
                  href="/admin/dashboard/users"
                  className="text-secondary/80 hover:text-primary transition-colors text-sm font-medium"
                >
                  Users
                </Link>
                <Link
                  href="/admin/dashboard/preview"
                  className="text-secondary/80 hover:text-primary transition-colors text-sm font-medium"
                >
                  Preview
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                <AdminMenu />
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
                href="/admin/dashboard"
                className="text-white text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/dashboard/opportunities"
                className="text-white text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Opportunities
              </Link>
              <Link
                href="/admin/dashboard/users"
                className="text-white text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Users
              </Link>
              <Link
                href="/admin/dashboard/preview"
                className="text-white text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Preview
              </Link>
              {/* Mobile Sign Out */}
              <button 
                onClick={handleSignOut}
                className="text-white text-lg font-medium text-left"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboardHeader />
      
      {/* Main Content - Adjusted to account for fixed navbar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
        {children}
      </main>
    </div>
  );
}