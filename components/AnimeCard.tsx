import Image from "next/image";
import { AnimeProp } from "@/types";
import { getAnimeTitle, getAnimeImage } from "@/utils";

function AnimeCard({ anime }: { anime: AnimeProp }) {
  const title = getAnimeTitle(anime);
  const image = getAnimeImage(anime);

  return (
    <section className="group rounded relative w-full cursor-pointer">
      <div className="relative w-full h-[30vh] rounded-xl overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <polygon points="6,3 20,12 6,21" />
            </svg>
          </div>
        </div>
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className="bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            {anime.format || "TV"}
          </span>
          {anime.nextAiringEpisode && (
            <span className="bg-green-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              Ep {anime.nextAiringEpisode.episode}
            </span>
          )}
        </div>
        {anime.averageScore && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
            {anime.averageScore}%
          </div>
        )}
      </div>

      <div className="py-2.5 flex flex-col gap-1">
        <h2 className="font-bold text-white text-sm line-clamp-2 w-full group-hover:text-red-400 transition">
          {title}
        </h2>
        <div className="flex gap-2 items-center text-xs text-gray-400">
          {anime.episodes && (
            <span>{anime.episodes} ep.</span>
          )}
          {anime.duration && (
            <span>{anime.duration}min</span>
          )}
          {anime.genres?.slice(0, 2).map((g) => (
            <span key={g} className="text-gray-500">{g}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AnimeCard;
