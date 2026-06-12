"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { searchAnime, getAnimeTitle } from "@/utils";
import { SearchResult } from "@/types";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchAnime(value, 1, 8);
        setResults(data);
        setShowDropdown(true);
      } catch {
        setResults([]);
      }
      setSearching(false);
    }, 400);
  };

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
            <Link
              href="/search"
              className="text-gray-300 hover:text-red-400 px-3 py-1.5 rounded-lg text-sm font-medium transition"
            >
              Catalogue
            </Link>
          </div>
        </div>

        <div className="flex-1 max-w-md relative" ref={dropdownRef}>
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
              ref={inputRef}
              type="search"
              placeholder="Rechercher un anime..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => results.length > 0 && setShowDropdown(true)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition"
            />
            {searching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-red-400 rounded-full animate-spin" />
              </div>
            )}
          </div>

          {showDropdown && results.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-slate-900 border border-white/10 rounded-xl shadow-xl shadow-black/40 overflow-hidden z-50">
              {results.map((anime) => {
                const animeTitle = anime.title.english || anime.title.romaji || "Unknown";
                return (
                  <Link
                    key={anime.id}
                    href={`/info/${anime.id}`}
                    onClick={() => {
                      setShowDropdown(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition border-b border-white/5 last:border-0"
                  >
                    <div className="relative w-10 h-14 flex-shrink-0">
                      <Image
                        src={anime.coverImage.large}
                        alt={animeTitle}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium line-clamp-1">
                        {animeTitle}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {anime.format} {anime.episodes ? `| ${anime.episodes} ep.` : ""}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
