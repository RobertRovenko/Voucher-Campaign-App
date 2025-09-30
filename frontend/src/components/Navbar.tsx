"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-8xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Title */}
        <Link
          href="/"
          className="text-2xl font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Voucher Manager
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-lg font-medium">
          <Link
            href="/"
            className="relative px-2 py-1 transition-transform duration-200 transform hover:scale-105 group"
          >
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/campaigns/create"
            className="relative px-2 py-1 transition-transform duration-200 transform hover:scale-105 group"
          >
            Create Campaign
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none text-2xl text-black"
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-6 py-3 space-y-3">
          <Link
            href="/"
            className="block text-black font-medium px-2 py-1 transition-transform duration-200 transform hover:scale-105 relative group"
            onClick={() => setIsOpen(false)}
          >
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/campaigns/create"
            className="block text-black font-medium px-2 py-1 transition-transform duration-200 transform hover:scale-105 relative group"
            onClick={() => setIsOpen(false)}
          >
            Create Campaign
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
      )}
    </nav>
  );
}
