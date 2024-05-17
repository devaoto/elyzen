export interface HiAnimeEpisode {
  title: string;
  episodeId: string;
  number: number;
  isFiller: boolean;
}

export interface HiAnimeSeries {
  totalEpisodes: number;
  episodes: HiAnimeEpisode[];
}
