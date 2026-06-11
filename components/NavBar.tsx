"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0F1117]/95 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-[#0F1117]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="logo" width={36} height={36} />
            <span className="hidden sm:block font-bold text-white text-lg">
              Anime
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="text-gray-300 hover:text-red-400 px-3 py-1.5 rounded-lg text-sm font-medium transition"
            >
              Accueil
            </Link>
            <Link
              href="#trend"
              className="text-red-400 bg-red-400/10 px-3 py-1.5 rounded-lg text-sm font-medium"
            >
              Tendances
            </Link>
          </div>
        </div>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              placeholder="Rechercher un anime..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
