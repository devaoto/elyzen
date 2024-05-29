export interface Title {
  romaji: string;
  english: string;
  native: string;
  userPreferred: string;
}

export interface Trailer {
  id?: string;
  site?: string;
  thumbnail?: string;
  thumbnailHash?: string;
}

export interface Anime {
  id: string;
  malId: number;
  title: Title;
  image: string;
  imageHash: string;
  trailer: Trailer;
  description: string;
  status: string;
  cover: string;
  coverHash: string;
  rating: number;
  releaseDate: number;
  color: string;
  genres: string[];
  totalEpisodes: number;
  duration: number;
  type: string;
}

export interface AnimeListResponse {
  currentPage: number;
  hasNextPage: boolean;
  results: Anime[];
}

export interface ConsumetAnimeEpisode {
  id: string;
  title: string | null;
  image: string;
  imageHash: string;
  number: number;
  createdAt: string | null;
  description: string | null;
  url: string;
}

export interface ConsumetSearchResult {
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
  totalResults: number;
  results: {
    id: string;
    malId: number;
    title: {
      english: string;
      native: string;
      romaji: string;
    };
    status: string;
    image: string;
    imageHash: string;
    cover: string;
    coverHash: string;
    popularity: number;
    totalEpisodes: number;
    currentEpisode: number | null;
    countryOfOrigin: string;
    description: string;
    genres: string[];
    rating: number;
    color: string;
    type: string;
    releaseDate: number;
  }[];
}

export interface ConsumetAnime {
  id: string;
  malId: number;
  title: {
    romaji: string;
    english: string;
    native: string;
    userPreferred: string;
  };
  image: string;
  imageHash: string;
  trailer: {
    id: string;
    site: string;
    thumbnail: string;
    thumbnailHash: string;
  };
  description: string;
  status: string;
  cover: string;
  coverHash: string;
  rating: number;
  releaseDate: number;
  color: string;
  genres: string[];
  totalEpisodes: number;
  duration: number;
  startDate: {
    year: number;
    day: number;
    month: any;
  };
  type: string;
}

export interface ConsumetAnimePage {
  currentPage: number;
  hasNextPage: boolean;
  results: ConsumetAnime[];
}
