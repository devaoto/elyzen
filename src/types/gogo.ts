export interface GogoAnimeEpisode {
  id: string;
  number: number;
  url: string;
}

export interface GogoAnimeAnime {
  id: string;
  title: string;
  url: string;
  genres: string[];
  totalEpisodes: number;
  image: string;
  releaseDate: string;
  description: string;
  subOrDub: string;
  type: string;
  status: string;
  otherName: string;
  episodes: GogoAnimeEpisode[];
}
