export interface Media {
  id: number;
  idMal: number | null;
  isAdult: boolean | null;
  isLicensed: boolean | null;
  site: string | null;
  title: {
    english: string;
    romaji: string;
    native: string;
    userPreferred: string;
  };
  nextAiringEpisode: {
    airingAt: number;
    timeUntilAiring: number;
    episode: number;
  } | null;
  description: string | null;
  coverImage: string | null;
  color: string | null;
  synonyms: string[] | null;
  trailer: string | null;
  trailerThumbnail: string | null;
  bannerImage: string | null;
  season: string | null;
  status: string | null;
  format: string | null;
  type: string | null;
  tags: string[] | null;
  year: number | null;
  externalLinks: Record<string, string>[] | null;
  startDate: { day: number; month: number; year: number } | null;
  endDate: { day: number; month: number; year: number } | null;
  genres: string[] | null;
  country: string | null;
  totalEpisodes: number | null;
  meanScore: number | null;
  averageScore: number | null;
  popularity: number | null;
  hashtag: string | null;
  scoreDistribution: Record<string, number> | null;
  statusDistribution: Record<string, number> | null;
  duration: number | null;
}

export interface ReturnData {
  totalResults: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  results: Media[];
}

export interface Episode {
  id?: string;
  episodeId?: string;
  number: number;
  url?: string;
  img: string;
  title: string;
  description: string;
  isFiller?: boolean;
}

export interface Provider {
  consumet?: boolean;
  providerId: string;
  episodes: {
    sub: Episode[];
    [key: string]: Episode[];
  };
}
