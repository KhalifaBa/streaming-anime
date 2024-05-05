import { PropsAnimeInfo, Recommendation } from "@/types";
import Image from "next/image";
import React from "react";

const AnimeInfoCard = ({ anime }: PropsAnimeInfo) => {
  return (
    <section key={anime.id} className="bg-[#0F1117] mx-auto">
      <div className="anime-info-card bg-slate-900 p-10 shadow-md">
        <h2 className="text-2xl font-bold mb-10">{anime.title}</h2>
        <div className="flex items-center">
          <Image
            src={
              anime.image.length < 1 ? "/missing_original.webp" : anime.image
            }
            alt={anime.title}
            width={300}
            height={300}
            className="rounded-lg"
          />

          <p className="text-white ml-5">{anime.description}</p>
        </div>
        <p className="text-white mt-5">Episodes: {anime.totalEpisodes}</p>
        <p className="text-white">Type: {anime.type}</p>
        <h3 className="text-xl font-bold mt-10">Recommendation</h3>
        <div className="flex justify-between w-full grid-rows-5 gap-10 items-center">
          {anime.recommendations.map((recommendation: Recommendation) => (
            <div key={recommendation.id} className=" ">
              <a href={recommendation.id}>
                <div className="flex gap-4 items-center">
                  <img
                    src={recommendation.image}
                    alt={recommendation.title}
                    className="w-20 h-20 rounded-lg"
                  />
                  <div>
                    <h4 className="text-lg font-bold">
                      {recommendation.title}
                    </h4>
                    <p className="text-white">
                      Episodes :{" "}
                      {
                        (recommendation.episodes = 0
                          ? recommendation.episodes
                          : recommendation.sub)
                      }
                    </p>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimeInfoCard;
