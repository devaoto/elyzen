export interface PageInfo {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
}

export interface MediaTitle {
  userPreferred: string;
  romaji: string;
  english: string;
  native: string;
}

export interface Trailer {
  id: string;
  site: string;
  thumbnail: string;
}

export interface CoverImage {
  extraLarge: string;
  large: string;
  medium: string;
  color: string | null;
}

export interface NextAiringEpisode {
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
}

export interface Date {
  year: number;
  month: number;
  day: number;
}

export interface Media {
  id: number;
  idMal: number;
  status: string;
  title: MediaTitle;
  genres: string[];
  trailer: Trailer | null;
  description: string;
  format: string;
  bannerImage: string;
  coverImage: CoverImage;
  episodes: number;
  meanScore: number;
  duration: number;
  season: string;
  seasonYear: number;
  averageScore: number;
  nextAiringEpisode: NextAiringEpisode | null;
  type: string;
  startDate: Date;
  endDate: Date | null;
}

export interface Page {
  pageInfo: PageInfo;
  media: Media[];
}

export interface QueryResponse {
  Page: Page;
}
