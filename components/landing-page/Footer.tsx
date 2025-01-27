"use client";

import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-[#142D42] text-white py-12 border-t border-gray-200">
      <div className="container max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-20 justify-center">
        {/* Info Column */}
        <div className="flex flex-col items-center text-center">
          <Image
            src="/logo/png/White logo - no background.png"
            alt="Mr Investar"
            width={200}
            height={67}
            className="mb-6"
          />
          <p className="text-sm"> 2025 Mr Investar - All rights reserved.</p>
        </div>

        {/* Where we are Column */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold mb-2 text-white">Where we are</h3>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-white">Via Gaetano Donizetti 1/A</p>
            <p className="text-sm text-white">20122 MILANO (MI)</p>
            <p className="text-sm text-white">info@mrinvestar.it</p>
          </div>
        </div>

        {/* Links Column */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold mb-2 text-white">Links</h3>
          <div className="flex flex-col gap-2">
            <Link href="/brand" className="text-sm text-white hover:text-gray-300">Brand</Link>
            <Link href="/our-process" className="text-sm text-white hover:text-gray-300">Our process</Link>
            <Link href="/business-partner" className="text-sm text-white hover:text-gray-300">Business Partners</Link>
            <Link href="/about-us" className="text-sm text-white hover:text-gray-300">About Us</Link>
            <Link href="/tv-format" className="text-sm text-white hover:text-gray-300">TV Format</Link>
            <Link href="/admin/auth/signin" className="text-sm text-white hover:text-gray-300">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
