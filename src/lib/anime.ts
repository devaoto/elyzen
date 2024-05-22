import { QueryResponse } from '@/types/query';
import { cache } from './cache';
import { Provider, ReturnData } from '@/types/api';
import { AnimeListResponse } from '@/types/consumet';

import { getCurrentSeason } from './utils';
import { AnilistInfo, fetchAnilistInfo } from './info';

const FetchDataAndCache = async (
  url: string,
  id: string,
  method?: string,
  headers?: Record<string, string>,
  body?: any
) => {
  try {
    let isCached = false;
    let data: any = await cache.get(`${url}:${id}`);

    if (!data) {
      const options: RequestInit = {
        cache: 'no-cache',
        method: method ? method : 'GET',
        headers: headers ? new Headers(headers) : undefined,
        body: body ? body : undefined,
      };

      data = await (await fetch(url, options)).json();
      await cache.set(`${url}i:${id}`, JSON.stringify(data), 5 * 60 * 60);
      isCached = true;
    } else {
      data = JSON.parse(data);
      isCached = true;
    }

    return { ...data, isCached };
  } catch (error) {
    return error;
  }
};

export const getTrendingAnime = async (page = 1, perPage = 24) => {
  const query = `query ($page: Int, $isAdult: Boolean = false, $size: Int, $sort: [MediaSort] = [TRENDING_DESC, POPULARITY_DESC], $type: MediaType) {
        Page(page: $page, perPage: $size) {
          pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
          }
          media(isAdult: $isAdult, sort: $sort, type: $type) {
            id
            idMal
            status(version: 2)
            title {
              userPreferred
              romaji
              english
              native
            }
            genres
            trailer {
              id
              site
              thumbnail
            }
            description
            format
            bannerImage
            coverImage {
              extraLarge
              large
              medium
              color
            }
            episodes
            meanScore
            duration
            season
            seasonYear
            averageScore
            nextAiringEpisode {
              airingAt
              timeUntilAiring
              episode
            }
            type
            startDate {
              year
              month
              day
            }
            endDate {
              year
              month
              day
            }
          }
        }
      }      
      `;

  const variables = {
    isAdult: false,
    page: page,
    size: perPage,
    type: 'ANIME',
  };

  let response;

  try {
    response = await FetchDataAndCache(
      `https://graphql.anilist.co`,
      'trending2',
      'POST',
      {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      JSON.stringify({ query, variables })
    );

    const res: any = {
      currentPage: response.data.Page.pageInfo.currentPage,
      hasNextPage: response.data.Page.pageInfo.hasNextPage,
      results: response.data.Page.media
        .filter((item: any) => item.status !== 'NOT_YET_RELEASED')
        .map((item: any) => ({
          id: item.id.toString(),
          malId: item.idMal,
          title:
            {
              romaji: item.title.romaji,
              english: item.title.english,
              native: item.title.native,
              userPreferred: item.title.userPreferred,
            } || item.title.romaji,
          coverImage:
            item.coverImage.extraLarge ??
            item.coverImage.large ??
            item.coverImage.medium,
          trailer: item.trailer?.id
            ? `https://www.youtube.com/watch?v=${item.trailer?.id}`
            : null,
          description: item.description,
          status: item.status,
          bannerImage:
            item.bannerImage ??
            item.coverImage.extraLarge ??
            item.coverImage.large ??
            item.coverImage.medium,
          rating: item.averageScore,
          meanScore: item.meanScore,
          releaseDate: item.seasonYear,
          startDate: {
            year: item.startDate.year,
            month: item.startDate.month,
            day: item.startDate.day,
          },
          color: item.coverImage?.color,
          genres: item.genres,
          totalEpisodes: isNaN(item.episodes)
            ? 0
            : item.episodes ?? item.nextAiringEpisode?.episode - 1 ?? 0,
          duration: item.duration,
          format: item.format,
          type: item.type,
          season: item.season,
        })),
    };

    return res as ReturnData;
  } catch (error) {
    try {
      console.log(
        'There was an error fetching trending from anilist. Using consumet....'
      );
      response = await FetchDataAndCache(
        `${process.env.NEXT_PUBLIC_CONSUMET_API}/meta/anilist/trending?perPage=${perPage}&page=${page}`,
        'trending3'
      );
      return await response;
    } catch (error) {
      console.error(error);
    }
  }
};

export const getPopularAnime = async () => {
  const query = `query ($page: Int, $isAdult: Boolean = false, $size: Int, $sort: [MediaSort] = [POPULARITY_DESC], $type: MediaType) {
        Page(page: $page, perPage: $size) {
          pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
          }
          media(isAdult: $isAdult, sort: $sort, type: $type) {
            id
            idMal
            status(version: 2)
            title {
              userPreferred
              romaji
              english
              native
            }
            genres
            trailer {
              id
              site
              thumbnail
            }
            description
            format
            bannerImage
            coverImage {
              extraLarge
              large
              medium
              color
            }
            episodes
            meanScore
            duration
            season
            seasonYear
            averageScore
            nextAiringEpisode {
              airingAt
              timeUntilAiring
              episode
            }
            type
            startDate {
              year
              month
              day
            }
            endDate {
              year
              month
              day
            }
          }
        }
      }      
      `;

  const variables = {
    isAdult: false,
    page: 1,
    size: 35,
    type: 'ANIME',
  };

  let response;

  try {
    response = await FetchDataAndCache(
      `https://graphql.anilist.co`,
      'popular2',
      'POST',
      {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      JSON.stringify({ query, variables })
    );
    const res: any = {
      currentPage: response.data.Page.pageInfo.currentPage,
      hasNextPage: response.data.Page.pageInfo.hasNextPage,
      results: response.data.Page.media
        .filter((item: any) => item.status !== 'NOT_YET_RELEASED')
        .map((item: any) => ({
          id: item.id.toString(),
          malId: item.idMal,
          title:
            {
              romaji: item.title.romaji,
              english: item.title.english,
              native: item.title.native,
              userPreferred: item.title.userPreferred,
            } || item.title.romaji,
          coverImage:
            item.coverImage.extraLarge ??
            item.coverImage.large ??
            item.coverImage.medium,
          trailer: item.trailer?.id
            ? `https://www.youtube.com/watch?v=${item.trailer?.id}`
            : null,
          description: item.description,
          status: item.status,
          bannerImage:
            item.bannerImage ??
            item.coverImage.extraLarge ??
            item.coverImage.large ??
            item.coverImage.medium,
          rating: item.averageScore,
          meanScore: item.meanScore,
          releaseDate: item.seasonYear,
          startDate: {
            year: item.startDate.year,
            month: item.startDate.month,
            day: item.startDate.day,
          },
          color: item.coverImage?.color,
          genres: item.genres,
          totalEpisodes: isNaN(item.episodes)
            ? 0
            : item.episodes ?? item.nextAiringEpisode?.episode - 1 ?? 0,
          duration: item.duration,
          format: item.format,
          type: item.type,
          season: item.season,
        })),
    };

    return res as ReturnData;
  } catch (error) {
    try {
      console.log(
        'There was an error fetching popular from anilist. Using consumet....'
      );

      response = await FetchDataAndCache(
        `${process.env.CONSUMET_API}/meta/anilist/popular?perPage=24`,
        'popular3'
      );
      return await response;
    } catch (error) {
      console.error(error);
    }
  }
};

export const getSeasonalAnime = async () => {
  const query = `query ($page: Int, $isAdult: Boolean = false, $size: Int, $type: MediaType, $season: MediaSeason, $seasonYear: Int) {
    Page(page: $page, perPage: $size) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(isAdult: $isAdult, type: $type, season: $season, seasonYear: $seasonYear) {
        id
        idMal
        status(version: 2)
        title {
          userPreferred
          romaji
          english
          native
        }
        genres
        trailer {
          id
          site
          thumbnail
        }
        description
        format
        bannerImage
        coverImage {
          extraLarge
          large
          medium
          color
        }
        episodes
        meanScore
        duration
        season
        seasonYear
        averageScore
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        type
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
      }
    }
  }    
      `;

  const variables = {
    isAdult: false,
    page: 1,
    size: 35,
    type: 'ANIME',
    season: getCurrentSeason(),
    seasonYear: new Date().getFullYear() ?? 2024,
  };

  let response;

  try {
    response = await FetchDataAndCache(
      `https://graphql.anilist.co`,
      'seasonal2',
      'POST',
      {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      JSON.stringify({ query, variables })
    );

    const res: any = {
      currentPage: response.data.Page.pageInfo.currentPage,
      hasNextPage: response.data.Page.pageInfo.hasNextPage,
      results: response.data.Page.media
        .filter((item: any) => item.status !== 'NOT_YET_RELEASED')
        .map((item: any) => ({
          id: item.id.toString(),
          malId: item.idMal,
          title:
            {
              romaji: item.title.romaji,
              english: item.title.english,
              native: item.title.native,
              userPreferred: item.title.userPreferred,
            } || item.title.romaji,
          image:
            item.coverImage.extraLarge ??
            item.coverImage.large ??
            item.coverImage.medium,
          trailer: {
            id: item.trailer?.id,
            site: item.trailer?.site,
            thumbnail: item.trailer?.thumbnail,
          },
          description: item.description,
          status: item.status,
          cover:
            item.bannerImage ??
            item.coverImage.extraLarge ??
            item.coverImage.large ??
            item.coverImage.medium,
          rating: item.averageScore,
          meanScore: item.meanScore,
          releaseDate: item.seasonYear,
          color: item.coverImage?.color,
          genres: item.genres,
          totalEpisodes: isNaN(item.episodes)
            ? 0
            : item.episodes ?? item.nextAiringEpisode?.episode - 1 ?? 0,
          duration: item.duration,
          type: item.format,
        })),
    };

    return res;
  } catch (error) {
    try {
      console.log(
        'There was an error fetching seasonal from anilist. Using consumet....'
      );

      response = await FetchDataAndCache(
        `${
          process.env.CONSUMET_API
        }/meta/anilist/advanced-search?perPage=24&season=${getCurrentSeason()}&year=${new Date().getFullYear()}`,
        'seasonal3'
      );
      return await response;
    } catch (error) {
      console.error(error);
    }
  }
};

export async function getEpisodes(id: string): Promise<Provider[]> {
  try {
    const response = await FetchDataAndCache(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/episodes/${id}`,
      `episode-${id}`
    );

    if (response && typeof response === 'object' && !Array.isArray(response)) {
      return Object.keys(response)
        .filter((key) => key !== 'isCached')
        .map((key) => {
          const provider = response[key];
          return {
            consumet: provider.consumet,
            providerId: provider.providerId,
            episodes: provider.episodes,
          } as Provider;
        });
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    throw error;
  }
}

type Params = {
  params: {
    id: string;
  };
};

interface Prms {
  id: string;
}

interface VoiceActor {
  name: string;
  image: string;
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
interface ConsumetName {
  first: string;
  last: string;
  full: string;
  native: string | null;
  userPreferred: string;
}

interface Character {
  name: string;
  image: string;
  voiceActor: VoiceActor;
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

export const getSources = async (
  id: string,
  episodeId: string,
  episodeNumber: number,
  provider: string,
  subType = 'sub',
  source = 'zoro'
) => {
  try {
    const response = await FetchDataAndCache(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/source/${id}?episodeId=${encodeURIComponent(episodeId)}&episodeNumber=${episodeNumber}&subType=${subType}&source=${source}&provider=${provider}`,
      `ep:src:${id}:${episodeId}`
    );

    return response;
  } catch (error) {
    console.error(error);
  }
};
