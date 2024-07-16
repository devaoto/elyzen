export interface AnifyTitle {
  native: string;
  romaji: string;
  english: string;
}

export interface AnifyMapping {
  id: string;
  providerId: string;
  similarity: number;
  providerType: string;
}

export interface AnifyRating {
  tmdb?: number;
  kitsu?: number;
  anilist?: number;
}

export interface AnifyPopularity {
  tmdb?: number;
  anilist?: number;
}

export interface AnifyRelationTitle {
  native: string;
  romaji: string;
  english: string;
}

export interface AnifyRelation {
  id: string;
  type: string;
  title: AnifyRelationTitle;
  format: string;
  relationType: string;
}

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

export interface AnifyEpisodesProvider {
  episodes: AnifyEpisode[];
  providerId: string;
}

export interface AnifyEpisodesData {
  data: AnifyEpisodesProvider[];
  latest: {
    updatedAt: number;
    latestTitle: string;
    latestEpisode: number;
  };
}

export interface AnifyArtwork {
  img: string;
  type: string;
  providerId: string;
}

export interface AnifyVoiceActor {
  name: string;
  image: string;
}

export interface AnifyCharacter {
  name: string;
  image: string;
  voiceActor: AnifyVoiceActor;
}

export interface AnifyAnime {
  id: string;
  slug: string;
  coverImage: string;
  bannerImage: string;
  trailer: string;
  status: string;
  season: string;
  title: AnifyTitle;
  currentEpisode: number;
  mappings: AnifyMapping[];
  synonyms: string[];
  countryOfOrigin: string;
  description: string;
  duration: number;
  color: string;
  year: number;
  rating: AnifyRating;
  popularity: AnifyPopularity;
  type: string;
  format: string;
  relations: AnifyRelation[];
  totalEpisodes: number;
  genres: string[];
  tags: string[];
  episodes: AnifyEpisodesData;
  averageRating: number;
  averagePopularity: number;
  artwork: AnifyArtwork[];
  characters: AnifyCharacter[];
}

interface MediaCoverImage {
  extraLarge: string;
  large: string;
  medium: string;
  color: string;
  _id: string;
}

interface MediaEndDate {
  year: number | null;
  month: number | null;
  day: number | null;
  _id: string;
}

interface MediaMappings {
  anilistId: string;
  fribb: {
    livechart_id: number;
    thetvdb_id: number;
    anime_planet_id: string;
    imdb_id: string;
    anisearch_id: number;
    themoviedb_id: number;
    anidb_id: number;
    kitsu_id: number;
    mal_id: number;
    type: string;
    notify_moe_id: string;
    anilist_id: string;
  };
  thetvdb: {
    seriesId: string;
    status: string;
    firstAired: string;
    recent: string;
    airs: string;
    studio: string;
    network: string[];
    averageRuntime: string;
    genres: string[];
    originalCountry: string;
    originalLanguage: string;
    geographicLocation: string[];
    subGenre: string[];
    supernaturalBeings: string[];
    imdbLink: string;
    officialWebsite: string | null;
    redditLink: string;
    tvMazeLink: string | null;
    theMovieDBLink: string;
    twitterLink: string;
    wikidataLink: string;
    wikipediaLink: string;
    trailerLink: string;
    favoritedCount: number;
    created: {
      date: {
        day: number;
        month: string;
        year: number;
        monthNum: number;
      };
      by: string;
    };
    modified: {
      date: {
        day: number;
        month: string;
        year: number;
        monthNum: number;
      };
      by: string;
    };
    artworks: {
      backgrounds: string[];
      banners: string[];
      clearArt: string[];
      clearLogo: string[];
      icons: string[];
      posters: string[];
    };
  };
}

interface MediaStudioNode {
  id: number;
  isAnimationStudio: boolean;
  favourites: number;
  name: string;
  siteUrl: string;
  _id: string;
}

interface MediaStudioEdge {
  id: number;
  isMain: boolean;
  node: MediaStudioNode;
  _id: string;
}

interface MediaTitle {
  romaji: string;
  english: string;
  native: string;
  userPreferred: string;
  _id: string;
}

interface MediaTrailer {
  id: string;
  site: string;
  thumbnail: string;
  _id: string;
}

interface MediaNextAiringEpisode {
  id: number;
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
  mediaId: number;
  _id: string;
}

export interface Media {
  _id: string;
  id: number;
  __v: number;
  averageScore: number;
  bannerImage: string;
  countryOfOrigin: string;
  coverImage: MediaCoverImage;
  description: string;
  duration: number;
  endDate: MediaEndDate;
  episodes: number;
  favourites: number;
  format: string;
  genres: string[];
  idMal: number;
  mappings: MediaMappings;
  meanScore: number;
  nextAiringEpisode: MediaNextAiringEpisode;
  season: string;
  seasonYear: number;
  status: string;
  studios: {
    edges: MediaStudioEdge[];
    _id: string;
  };
  synonyms: string[];
  title: MediaTitle;
  trailer: MediaTrailer;
  type: string;
}

interface Response {
  media: Media[];
}

interface Image {
  extraLarge: string;
  large: string;
  medium: string;
  color: string;
}

interface Title {
  romaji: string;
  english: string;
  native: string;
  userPreferred: string;
}

interface StudioNode {
  favourites: number;
  id: number;
  isAnimationStudio: boolean;
  isFavourite: boolean;
  name: string;
  siteUrl: string;
}

interface StudioEdge {
  isMain: boolean;
  id: number;
  node: StudioNode;
}

interface Studios {
  edges: StudioEdge[];
}

interface Trailer {
  id: string;
  site: string;
  thumbnail: string;
}

interface Date {
  year: number;
  month: number;
  day: number;
  _id: string;
}

interface EpisodeTitle {
  ja: string;
  en: string;
  x_jat: string;
}

interface Episode {
  tvdbShowId: number;
  tvdbId: number;
  seasonNumber: number;
  episodeNumber: number;
  absoluteEpisodeNumber: number;
  title: EpisodeTitle;
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

interface Anizip {
  titles: {
    x_jat: string;
    ja: string;
    en: string;
  };
  episodes: {
    [key: number]: Episode;
  };
  episodeCount: number;
  specialCount: number;
  images: {
    coverType: string;
    url: string;
  }[];
  mappings: {
    animeplanet_id: string;
    kitsu_id: number;
    mal_id: number;
    type: string;
    anilist_id: number;
    anisearch_id: number;
    anidb_id: number;
    notifymoe_id: string;
    livechart_id: number;
    thetvdb_id: number;
    imdb_id: string;
    themoviedb_id: number;
  };
}

export interface SiteDetail {
  identifier: string | number;
  image: string;
  malId: number;
  aniId: number;
  page: string;
  title: string;
  type: string;
  url: string;
  external?: boolean;
}

export interface Sites {
  [key: string]: {
    [key: string]: SiteDetail;
  };
}

interface Mappings {
  anilistId: string;
  anizip: Anizip;
  fribb: {
    livechart_id: number;
    thetvdb_id: number;
    anime_planet_id: string;
    imdb_id: string;
    anisearch_id: number;
    themoviedb_id: number;
    anidb_id: number;
    kitsu_id: number;
    mal_id: number;
    type: string;
    notify_moe_id: string;
    anilist_id: number;
  };
  gogoanime: {
    id: string;
    title: string;
    url: string;
    image: string;
    releaseDate: string;
    subOrDub: string;
  };
  thetvdb: {
    seriesId: string;
    status: string;
    firstAired: string;
    recent: string;
    airs: string;
    studio: string;
    network: string[];
    averageRuntime: string;
    genres: string[];
    originalCountry: string;
    originalLanguage: string;
    geographicLocation: string[];
    subGenre: string[];
    supernaturalBeings: string[];
    imdbLink: string;
    officialWebsite: string | null;
    redditLink: string;
    tvMazeLink: string | null;
    theMovieDBLink: string;
    twitterLink: string;
    wikidataLink: string;
    wikipediaLink: string;
    trailerLink: string;
    favoritedCount: number;
    created: {
      date: {
        day: number;
        month: string;
        year: number;
        monthNum: number;
      };
      by: string;
    };
    modified: {
      date: {
        day: number;
        month: string;
        year: number;
        monthNum: number;
      };
      by: string;
    };
    artworks: {
      backgrounds: string[];
      banners: string[];
      clearArt: string[];
      clearLogo: string[];
      icons: string[];
      posters: string[];
    };
  };
  kitsu: {
    id: string;
    type: string;
    links: {
      self: string;
    };
    attributes: {
      createdAt: string;
      updatedAt: string;
      slug: string;
      synopsis: string;
      description: string;
      coverImageTopOffset: number;
      titles: {
        en: string;
        en_jp: string;
        ja_jp: string;
        th_th: string;
      };
      canonicalTitle: string;
      abbreviatedTitles: string[];
      averageRating: string;
      ratingFrequencies: {
        [key: string]: string;
      };
      userCount: number;
      favoritesCount: number;
      startDate: string;
      endDate: string;
      nextRelease: string | null;
      popularityRank: number;
      ratingRank: number;
      ageRating: string;
      ageRatingGuide: string;
      subtype: string;
      status: string;
      tba: string | null;
      posterImage: {
        tiny: string;
        large: string;
        small: string;
        medium: string;
        original: string;
        meta: {
          dimensions: {
            tiny: {
              width: number;
              height: number;
            };
            large: {
              width: number;
              height: number;
            };
            small: {
              width: number;
              height: number;
            };
            medium: {
              width: number;
              height: number;
            };
          };
        };
      };
      coverImage: {
        tiny: string;
        large: string;
        small: string;
        original: string;
        meta: {
          dimensions: {
            tiny: {
              width: number;
              height: number;
            };
            large: {
              width: number;
              height: number;
            };
            small: {
              width: number;
              height: number;
            };
          };
        };
      };
      episodeCount: number;
      episodeLength: number;
      totalLength: number | null;
      youtubeVideoId: string;
      showType: string;
      nsfw: boolean;
    };
    relationships: {
      genres: {
        links: {
          self: string;
          related: string;
        };
      };
      categories: {
        links: {
          self: string;
          related: string;
        };
      };
      castings: {
        links: {
          self: string;
          related: string;
        };
      };
      installments: {
        links: {
          self: string;
          related: string;
        };
      };
      mappings: {
        links: {
          self: string;
          related: string;
        };
      };
      reviews: {
        links: {
          self: string;
          related: string;
        };
      };
      mediaRelationships: {
        links: {
          self: string;
          related: string;
        };
      };
      characters: {
        links: {
          self: string;
          related: string;
        };
      };
      staff: {
        links: {
          self: string;
          related: string;
        };
      };
      productions: {
        links: {
          self: string;
          related: string;
        };
      };
      quotes: {
        links: {
          self: string;
          related: string;
        };
      };
      episodes: {
        links: {
          self: string;
          related: string;
        };
      };
      streamingLinks: {
        links: {
          self: string;
          related: string;
        };
      };
      animeProductions: {
        links: {
          self: string;
          related: string;
        };
      };
      animeCharacters: {
        links: {
          self: string;
          related: string;
        };
      };
      animeStaff: {
        links: {
          self: string;
          related: string;
        };
      };
    };
  };
  malSync: {
    id: number;
    type: string;
    title: string;
    url: string;
    total: number;
    image: string;
    malId: number;
    Sites: Sites;
  };
}

export interface Anime {
  _id: string;
  bannerImage: string;
  averageScore: number;
  coverImage: Image;
  title: Title;
  format: string;
  type: string;
  season: string;
  seasonYear: number;
  id: number;
  idMal: number;
  color: string;
  status: string;
  episodes: number;
  duration: number;
  description: string;
  studios: Studios;
  trailer: Trailer;
  startDate: Date;
  endDate: Date;
  synonyms: string[];
  countryOfOrigin: string;
  isAdult: boolean;
  mappings: Mappings;
}
