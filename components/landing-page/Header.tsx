"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { label: "Brand", href: "/brand" },
  { label: "Our Process", href: "/our-process" },
  { label: "Business Partner", href: "/business-partner" },
  { label: "TV Format", href: "/tv-format" },
  { label: "About Us", href: "/about-us" }
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-6 left-1/2 -translate-x-1/2 z-header w-[98%] max-w-7xl transition-all duration-300",
          isScrolled ? "" : "bg-transparent"
        )}
      >
        <div className={cn(
          "rounded-full transition-all duration-300",
          isScrolled || isMenuOpen ? "bg-white/95 backdrop-blur-sm shadow-lg border border-grey-200 hover:shadow-xl" : "bg-transparent"
        )}>
          <div className="h-14 flex items-center justify-between">
            <Link 
              href="/" 
              className={cn(
                "transition-colors md:pl-8 flex justify-center md:justify-start w-full md:w-auto",
                isScrolled || isMenuOpen ? "text-secondary hover:text-primary" : "text-white hover:text-white/80"
              )}
            >
              <img
                src="/logo/mr.investar-logo.PNG"
                alt="Mr. Investar Logo"
                className="w-[250px] h-[70px] object-contain"
              />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-base font-black tracking-wide transition-colors",
                    pathname === item.href 
                      ? "text-[#37B6B6]" 
                      : isScrolled 
                        ? "text-secondary/80 hover:text-[#37B6B6]" 
                        : "text-white hover:text-white/80"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2 pl-4 pr-1.5">
              <Link href="/auth/signin" target="_blank" rel="noopener noreferrer">
                <Button 
                  variant={isScrolled ? "ghost" : "outline"}
                  size="default"
                  className={cn(
                    "rounded-full text-sm font-semibold",
                    isScrolled 
                      ? "hover:bg-grey-100/50 text-secondary" 
                      : "text-white border-white hover:bg-white/10"
                  )}
                >
                  Sign In
                </Button>
              </Link>

              <Link href="/auth/signup">
                <Button 
                  variant="primary"
                  size="default"
                  className="rounded-full hover:shadow-md transition-all text-sm font-semibold"
                >
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "md:hidden mr-6 transition-colors",
                isScrolled || isMenuOpen ? "text-secondary hover:text-primary" : "text-white hover:text-white/80"
              )}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Dark overlay */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu content */}
          <div className="relative h-screen flex flex-col pt-28">
            <div className="flex-1 px-6">
              {/* Navigation Links */}
              <nav className="flex flex-col space-y-6">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-2xl font-medium transition-colors",
                      pathname === item.href 
                        ? "text-[#37B6B6]" 
                        : "text-white hover:text-[#37B6B6]"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Mobile Actions */}
            <div className="px-6 pb-8 space-y-4 mt-auto">
              <Link href="/auth/signin" target="_blank" rel="noopener noreferrer" className="block">
                <Button 
                  variant="outline"
                  className="w-full h-12 rounded-full border-white text-white hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" className="block">
                <Button 
                  variant="primary"
                  className="w-full h-12 rounded-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}