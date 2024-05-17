export interface AnifyEpisode {
  id: string;
  img: string | null;
  title: string;
  hasDub: boolean;
  number: number;
  rating: number | null;
  isFiller: boolean;
  updatedAt: number;
  description: string | null;
}

export interface AnifyEpisodesData {
  episodes: AnifyEpisode[];
  providerId: string;
}

export interface AnifyLatest {
  updatedAt: number;
  latestTitle: string;
  latestEpisode: number;
}

export interface AnifyEpisodesResponse {
  episodes: {
    data: AnifyEpisodesData[];
    latest: AnifyLatest;
  };
}
