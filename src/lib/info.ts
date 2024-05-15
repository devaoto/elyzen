import {
  type AnimeData as MappingData,
  convertMappingsToArray,
  MappingItem,
} from '@/types/anizip';
import { cache } from './cache';

interface Prms {
  id: string;
}

interface VoiceActor {
  name: string;
  image: string;
}

interface ConsumetName {
  first: string;
  last: string;
  full: string;
  native: string | null;
  userPreferred: string;
}

interface ConsumetVoiceActor {
  id: number;
  language: string;
  name: ConsumetName;
  image: string;
  imageHash: string;
}

interface ConsumetCharacter {
  id: number;
  role: string;
  name: ConsumetName;
  image: string;
  imageHash: string;
  voiceActors: ConsumetVoiceActor[];
}

interface Character {
  name: string;
  image: string;
  voiceActor: VoiceActor;
}

export interface AnilistInfo {
  id: string;
  malId?: number | null;
  title: {
    english: string | null;
    native: string | null;
    romaji: string | null;
    userPreferred: string | null;
  };
  synonyms?: string[] | null;
  isLicensed?: boolean | null;
  isAdult?: boolean | null;
  countryOfOrigin?: string | null;
  trailer?: {
    id: string;
    site: string | null;
    thumbnail: string | null;
  } | null;
  coverImage: string | null;
  popularity?: number | null;
  color?: string | null;
  bannerImage?: string | null;
  description?: string | null;
  status: string;
  releaseDate?: number | null;
  startDate: {
    day?: number | null;
    month?: number | null;
    year?: number | null;
  };
  year: number | null;
  endDate: {
    day?: number | null;
    month?: number | null;
    year?: number | null;
  };
  averageRating?: number | null;
  nextAiringEpisode?: {
    airingTime: number | null;
    timeUntilAiring: number | null;
    episode: number | null;
  } | null;
  totalEpisodes: number | null;
  currentEpisode: number | null;
  rating?: number | null;
  duration?: number | null;
  genres?: string[] | null;
  season?: string | null;
  studios?: string[] | null;
  format: 'TV' | 'TV_SHORT' | 'MOVIE' | 'ONA' | 'OVA' | 'UNKNOWN';
  studiosInfo?:
    | {
        name: string;
        id: string;
        isMain: boolean;
      }[]
    | null;
  type?: string | null;
  mappings?: MappingItem[] | null;
  characters?: Character[] | null;
  recommendations?:
    | {
        id: string | null;
        malId: number | null;
        title: {
          romaji: string | null;
          english: string | null;
          native: string | null;
          userPreferred: string | null;
        };
        status: string;
        episodes?: number | null;
        image: string | null;
        cover: string | null;
        rating?: number | null;
        type: string | null;
      }[]
    | null;
  relations?:
    | {
        id: string;
        relationType: string;
        malId?: number | null;
        title: {
          romaji: string | null;
          english: string | null;
          native: string | null;
          userPreferred: string | null;
        };
        status: string;
        episodes?: number | null;
        image: string | null;
        color?: string | null;
        type: string | null;
        cover: string | null;
        rating?: number | null;
      }[]
    | null;
}

function convertToVoiceActor(
  consumetVoiceActor: ConsumetVoiceActor
): VoiceActor {
  return {
    name: consumetVoiceActor.name.first + ' ' + consumetVoiceActor.name.last,
    image: consumetVoiceActor.image,
  };
}

export function convertToCharacter(
  consumetCharacter: ConsumetCharacter
): Character | null {
  const originalVoiceActor = consumetCharacter.voiceActors.find(
    (vo) => vo.language === 'Japanese'
  );
  if (!originalVoiceActor) return null;

  return {
    name: consumetCharacter.name.first + ' ' + consumetCharacter.name.last,
    image: consumetCharacter.image,
    voiceActor: convertToVoiceActor(originalVoiceActor),
  };
}

const defaultResponse: AnilistInfo = {
  id: '',
  title: {
    native: null,
    romaji: null,
    english: null,
    userPreferred: null,
  },
  coverImage: null,
  bannerImage: null,
  trailer: null,
  status: 'UNKNOWN',
  season: null,
  studios: null,
  currentEpisode: null,
  mappings: null,
  synonyms: null,
  countryOfOrigin: null,
  description: null,
  startDate: {
    day: new Date().getDay(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  },
  endDate: {
    day: new Date().getDay(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  },
  duration: null,
  color: null,
  year: null,
  recommendations: null,
  rating: null,
  popularity: null,
  type: null,
  format: 'UNKNOWN',
  relations: null,
  totalEpisodes: null,
  genres: null,
  averageRating: null,
  characters: null,
};

export const fetchAnilistInfo = async (params: Prms): Promise<AnilistInfo> => {
  let cachedData = await cache.get(`info:${params.id}`);

  if (!cachedData) {
    try {
      const query = `query ($id: Int) {
            Media(id: $id) {
              id
              idMal
              title {
                english
                native
                romaji
                userPreferred
              }
              synonyms
              countryOfOrigin
              isLicensed
              isAdult
              externalLinks {
                url
                site
                type
                language
              }
              coverImage {
                extraLarge
                large
                color
              }
              bannerImage
              season
              seasonYear
              description
              type
              format
              status(version: 2)
              episodes
              duration
              chapters
              volumes
              trailer {
                id
                site
                thumbnail
              }
              genres
              source
              averageScore
              popularity
              meanScore
              nextAiringEpisode {
                airingAt
                timeUntilAiring
                episode
              }
              characters(sort: ROLE) {
                edges {
                  role
                  node {
                    id
                    name {
                      first
                      middle
                      last
                      full
                      native
                      userPreferred
                    }
                    image {
                      large
                      medium
                    }
                  }
                  voiceActors {
                    image {
                      large
                      medium
                    }
                    name {
                      first
                      middle
                      last
                      full
                      native
                      alternative
                      userPreferred
                    }
                  }
                }
              }
              recommendations {
                edges {
                  node {
                    id
                    mediaRecommendation {
                      id
                      idMal
                      title {
                        romaji
                        english
                        native
                        userPreferred
                      }
                      status(version: 2)
                      episodes
                      coverImage {
                        extraLarge
                        large
                        medium
                        color
                      }
                      bannerImage
                      format
                      chapters
                      meanScore
                      nextAiringEpisode {
                        episode
                        timeUntilAiring
                        airingAt
                      }
                    }
                  }
                }
              }
              relations {
                edges {
                  id
                  relationType
                  node {
                    id
                    idMal
                    status(version: 2)
                    coverImage {
                      extraLarge
                      large
                      medium
                      color
                    }
                    bannerImage
                    title {
                      romaji
                      english
                      native
                      userPreferred
                    }
                    episodes
                    chapters
                    format
                    nextAiringEpisode {
                      airingAt
                      timeUntilAiring
                      episode
                    }
                    meanScore
                  }
                }
              }
              studios {
                edges {
                  isMain
                  node {
                    id
                    name
                  }
                }
              }
            }
          }`;

      const [mediaResponse, mappingsResponse] = await Promise.all([
        fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query, variables: { id: Number(params.id) } }),
        }),
        fetch(`https://api.ani.zip/mappings?anilist_id=${params.id}`),
      ]);

      const { data } = await mediaResponse.json();
      if (data) {
      }
      const mappingsData = (await mappingsResponse.json()) as MappingData;

      const animeInfo = {
        id: params.id,
        malId: await data.Media?.idMal,
        title: { ...(await data.Media.title) },
        synonyms: await data.Media?.synonyms,
        year: await data.Media?.seasonYear,
        format: await data.Media?.format,
        isLicensed: (await data.Media?.isLicensed) ?? undefined,
        isAdult: (await data.Media?.isAdult) ?? undefined,
        countryOfOrigin: (await data.Media?.countryOfOrigin) ?? undefined,
        trailer: (await data.Media?.trailer)
          ? {
              id: await data.Media.trailer.id,
              site: await data.Media.trailer?.site,
              thumbnail: await data.Media.trailer?.thumbnail,
            }
          : undefined,
        coverImage:
          (await data.Media?.coverImage?.extraLarge) ??
          (await data.Media?.coverImage?.large) ??
          (await data.Media?.coverImage?.medium),
        popularity: await data.Media?.popularity,
        color: await data.Media?.coverImage?.color,
        bannerImage: await data.Media?.bannerImage,
        description: await data.Media?.description,
        status:
          (await data.Media?.status) === 'HIATUS'
            ? 'HIATUS'
            : (await data.Media?.status) ?? 'UNKNOWN',
        releaseDate: await data.Media?.startDate?.year,
        startDate: { ...(await data.Media.startDate) },
        endDate: { ...(await data.Media.endDate) },
        averageRating: await data.Media?.averageScore,
        nextAiringEpisode: (await data.Media?.nextAiringEpisode)
          ? {
              airingTime: await data.Media.nextAiringEpisode?.airingAt,
              timeUntilAiring: await data.Media.nextAiringEpisode
                ?.timeUntilAiring,
              episode: await data.Media.nextAiringEpisode?.episode,
            }
          : undefined,
        totalEpisodes:
          (await data.Media?.episodes) ??
          (await data.Media.nextAiringEpisode?.episode) - 1,
        currentEpisode:
          (await data.Media?.nextAiringEpisode?.episode) - 1 ??
          data.Media?.episodes,
        rating: await data.Media?.averageScore,
        duration: await data.Media?.duration,
        genres: await data.Media?.genres,
        season: await data.Media?.season,
        studios: await data.Media?.studios.edges.map(
          (item: any) => item.node.name
        ),
        studiosInfo: await data.Media?.studios.edges.map(async (item: any) => ({
          name: await item.node.name,
          id: await item.node.id,
          isMain: await item.isMain,
        })),
        type: await data.Media?.format,
        mappings: await convertMappingsToArray(await mappingsData.mappings),
        characters: await data.Media?.characters?.edges?.map(
          async (item: any) => ({
            id: await item.node?.id,
            role: await item.role,
            name: { ...(await item.node.name) },
            image:
              (await item.node.image.large) ?? (await item.node.image.medium),
            voiceActors: await item.voiceActors.map(
              async (voiceActor: any) => ({
                id: await voiceActor.id,
                language: await voiceActor.languageV2,
                name: { ...(await voiceActor.name) },
                image:
                  (await voiceActor.image.large) ??
                  (await voiceActor.image.medium),
              })
            ),
          })
        ),
        recommendations: await data.Media?.recommendations?.edges?.map(
          async (item: any) => ({
            id: await item.node.mediaRecommendation?.id,
            malId: await item.node.mediaRecommendation?.idMal,
            title: { ...(await item.node.mediaRecommendation?.title) },
            status:
              (await item.node.mediaRecommendation?.status) === 'HIATUS'
                ? 'HIATUS'
                : (await item.node.mediaRecommendation?.status) ?? 'UNKNOWN',
            episodes: await item.node.mediaRecommendation?.episodes,
            image:
              (await item.node.mediaRecommendation?.coverImage?.extraLarge) ??
              (await item.node.mediaRecommendation?.coverImage?.large) ??
              (await item.node.mediaRecommendation?.coverImage?.medium),
            cover:
              (await item.node.mediaRecommendation?.bannerImage) ??
              (await item.node.mediaRecommendation?.coverImage?.extraLarge) ??
              (await item.node.mediaRecommendation?.coverImage?.large) ??
              (await item.node.mediaRecommendation?.coverImage?.medium),
            rating: await item.node.mediaRecommendation?.meanScore,
            type: await item.node.mediaRecommendation?.format,
          })
        ),
        relations: data.Media?.relations?.edges?.map(async (item: any) => ({
          id: await item.node.id,
          relationType: await item.relationType,
          malId: await item.node.idMal,
          title: { ...(await item.node.title) },
          status:
            (await item.node.status) === 'HIATUS'
              ? 'HIATUS'
              : (await item.node.status) ?? 'UNKNOWN',
          episodes: await item.node.episodes,
          image:
            (await item.node.coverImage.extraLarge) ??
            (await item.node.coverImage.large) ??
            (await item.node.coverImage.medium),
          color: await item.node.coverImage?.color,
          type: await item.node.format,
          cover:
            (await item.node.bannerImage) ??
            (await item.node.coverImage.extraLarge) ??
            (await item.node.coverImage.large) ??
            (await item.node.coverImage.medium),
          rating: await item.node.meanScore,
        })),
      };

      cachedData = animeInfo;
      await cache.set(`info:${params.id}`, JSON.stringify(animeInfo), 5 * 3600);
    } catch (error) {
      console.error(error);
      cachedData = defaultResponse;
    }
  } else {
    cachedData = JSON.parse(cachedData);
  }

  return cachedData;
};
