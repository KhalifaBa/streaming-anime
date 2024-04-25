import Image from "next/image";

export interface AnimeProp {
  anime: ResultElement;
}

export interface ResultElement {
  id: string;
  title: string;
  image: string;
  url: string;
  genres: string[];
  episodeId: string;
  episodeNumber: number;
}

function AnimeCard({ anime }: AnimeProp) {
  return (
    <div className="max-w-sm rounded relative w-full">
      <div className="relative w-full h-[37vh]">
        <Image
          src={anime.image}
          alt={anime.title}
          fill
          className="rounded-xl"
        />
      </div>
      <div className="py-4 flex flex-col gap-3">
        <div className="flex justify-between items-center gap-1">
          <h2 className="font-bold text-white text-xl line-clamp-1 w-full">
            {anime.title}
          </h2>
          <div className="py-1 px-2 bg-[#161921] rounded-sm">
            <p className="text-white text-sm font-bold capitalize">
              {anime.genres.map((genre) => genre).join(", ")}
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex flex-row gap-2 items-center">
            <Image
              src="./episodes.svg"
              alt="episodes"
              width={20}
              height={20}
              className="object-contain"
            />
            <p className="text-base text-white font-bold">
              {anime.episodeNumber}
            </p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Image
              src="./star.svg"
              alt="star"
              width={18}
              height={18}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimeCard;
