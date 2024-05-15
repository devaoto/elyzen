export interface TitleTranslations {
  'x-jat': string;
  ja: string;
  en: string;
}

export interface EpisodeTitleTranslations {
  ja?: string;
  en?: string;
  'x-jat'?: string;
}

export interface Episode {
  tvdbShowId: number;
  tvdbId: number;
  seasonNumber: number;
  episodeNumber: number;
  absoluteEpisodeNumber: number;
  title: EpisodeTitleTranslations;
  airDate: string;
  airDateUtc: string;
  runtime: number;
  overview: string;
  image: string;
  episode: string;
  anidbEid: number;
  length: number;
  airdate: string;
  rating: string;
  summary: string;
}

export interface SpecialEpisode {
  episode: string;
  anidbEid: number;
  length: number;
  airdate: string;
  title: EpisodeTitleTranslations;
}

export interface Image {
  coverType: string;
  url: string;
}

export interface Mappings {
  [key: string]: string | number | null;
}

export interface MappingItem {
  id: string;
  providerId: string;
}

export interface AnimeData {
  titles: TitleTranslations;
  episodes: { [key: string]: Episode | SpecialEpisode };
  episodeCount: number;
  specialCount: number;
  images: Image[];
  mappings: Mappings;
}

export function convertMappingsToArray(mappings: Mappings): MappingItem[] {
  const mappingArray: MappingItem[] = [];

  for (const key in mappings) {
    if (mappings[key] !== null && key !== 'type') {
      const mappingItem: MappingItem = {
        id: key,
        providerId: mappings[key] as string,
      };
      mappingArray.push(mappingItem);
    }
  }

  return mappingArray;
}
