import Image from "next/image";
import { Prop } from "@/types";

function AnimeCard({ anime }: Prop) {
  return (
    <section key={anime.id} className="max-w-sm rounded relative w-full">
      <div className="relative w-full h-[37vh]">
        <Image
          src={anime.image.length < 1 ? "/missing_original.webp" : anime.image}
          alt={anime.title}
          fill
          className="rounded-xl object-fill"
        />
      </div>

      <div className="py-4 flex flex-col gap-3">
        <div className="flex justify-between items-center gap-1">
          <h2 className="font-bold text-white text-xl line-clamp-2 w-full">
            {anime.title}
          </h2>
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
              {anime.sub} episodes
            </p>
            {/* <div className="flex flex-row gap-2 items-center">
              <Image
                src="./icons8-clock.svg"
                alt="clock"
                width={18}
                height={18}
                className="object-contain"
              />
              <p className="text-base font-bold text-[#FFAD49]">
                {anime.duration}
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AnimeCard;
