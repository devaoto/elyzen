export interface QueryVariables {
  page?: number;
  perPage?: number;
  notYetAired?: boolean;
  episode?: number;
}

export interface PageInfo {
  currentPage: number;
  hasNextPage: boolean;
  lastPage: number;
  perPage: number;
  total: number;
}

export interface Image {
  extraLarge?: string;
  large?: string;
  medium?: string;
  color?: string;
}

export interface Date {
  year?: number;
  month?: number;
  day?: number;
}

export interface Title {
  romaji?: string;
  english?: string;
  native?: string;
  userPreferred?: string;
}

export interface Trailer {
  id?: string;
  site?: string;
  thumbnail?: string;
}

export interface Media {
  bannerImage?: string;
  averageScore?: number;
  countryOfOrigin?: string;
  coverImage?: Image;
  description?: string;
  duration?: number;
  endDate?: Date;
  episodes?: number;
  format?: string;
  genres?: string[];
  hashtag?: string;
  id: number;
  idMal?: number;
  isAdult?: boolean;
  meanScore?: number;
  popularity?: number;
  season?: string;
  seasonYear?: number;
  startDate?: Date;
  status?: string;
  synonyms?: string[];
  title?: Title;
  trailer?: Trailer;
  trending?: number;
  type?: string;
}

export interface AiringSchedule {
  media: Media;
}

export interface Page {
  pageInfo: PageInfo;
  airingSchedules: AiringSchedule[];
}

export interface QueryResponse {
  Page: Page;
}
