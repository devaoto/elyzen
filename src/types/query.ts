export interface QueryResponse {
  Page: {
    media: Media[];
    pageInfo: {
      total: number;
      perPage: number;
      currentPage: number;
      lastPage: number;
      hasNextPage: boolean;
    };
  };
}

export interface Media {
  volumes: number;
  updatedAt: string;
  type: string;
  trending: number;
  trailer?: {
    id: string;
    site: string;
    thumbnail: string;
  };
  averageScore: number;
  bannerImage: string;
  countryOfOrigin: string;
  coverImage: {
    extraLarge: string;
    large: string;
    medium: string;
    color: string;
  };
  description: string;
  duration: number;
  endDate?: {
    year: number;
    month: number;
    day: number;
  };
  episodes: number;
  externalLinks: ExternalLink[];
  favourites: number;
  format: string;
  genres: string[];
  hashtag: string;
  id: number;
  idMal?: number;
  isAdult: boolean;
  isLicensed: boolean;
  meanScore: number;
  popularity: number;
  season?: string;
  seasonYear?: number;
  siteUrl: string;
  startDate?: {
    year: number;
    month: number;
    day: number;
  };
  stats: {
    statusDistribution: {
      amount: number;
      status: string;
    }[];
    scoreDistribution: {
      score: number;
      amount: number;
    }[];
  };
  status: string;
  synonyms: string[];
  tags: Tag[];
  title: {
    romaji?: string;
    english?: string;
    native?: string;
    userPreferred: string;
  };
}

export interface ExternalLink {
  id: number;
  url: string;
  site: string;
  siteId: string;
  type: string;
  language?: string;
  color?: string;
  icon?: string;
  notes?: string;
  isDisabled?: boolean;
}

export interface Tag {
  id: number;
  name: string;
  description: string;
  category: string;
  rank: number;
  isGeneralSpoiler: boolean;
  isMediaSpoiler: boolean;
  isAdult: boolean;
  userId: number;
}
