import Image from "next/image";
import { Prop } from "@/types";

function AnimeCard({ anime }: Prop) {
  return (
    <section className="group rounded relative w-full cursor-pointer">
      <div className="relative w-full h-[35vh] rounded-xl overflow-hidden">
        <Image
          src={anime.image.length < 1 ? "/missing_original.webp" : anime.image}
          alt={anime.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <polygon points="6,3 20,12 6,21" />
            </svg>
          </div>
        </div>
        <div className="absolute top-2 left-2">
          <span className="bg-red-600/90 text-white text-xs font-bold px-2 py-0.5 rounded">
            {anime.type || "TV"}
          </span>
        </div>
      </div>

      <div className="py-3 flex flex-col gap-1.5">
        <h2 className="font-bold text-white text-base line-clamp-2 w-full group-hover:text-red-400 transition">
          {anime.title}
        </h2>
        <div className="flex gap-3 items-center text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
              <line x1="7" y1="2" x2="7" y2="22" />
              <line x1="17" y1="2" x2="17" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="2" y1="7" x2="7" y2="7" />
              <line x1="2" y1="17" x2="7" y2="17" />
              <line x1="17" y1="7" x2="22" y2="7" />
              <line x1="17" y1="17" x2="22" y2="17" />
            </svg>
            {anime.sub} ep.
          </span>
          {anime.duration && (
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-400">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              {anime.duration}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

export default AnimeCard;
