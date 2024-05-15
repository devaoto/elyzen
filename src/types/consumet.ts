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
