import AnimeInfoCard from "@/components/AnimeInfoCard";
import { fetchAnime } from "@/utils";
import React from "react";

const page = async ({ params }: { params: { animeId: string } }) => {
  const infoAnime = await fetchAnime(params.animeId);
  return (
    <div className="bg-[#0F1117] ">
      <AnimeInfoCard anime={infoAnime} />
    </div>
  );
};

export default page;
