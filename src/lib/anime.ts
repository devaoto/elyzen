import { QueryResponse } from '@/types/upcoming';
import { QueryResponse as SeasonQueryResponse } from '@/types/seasonal';
import { cache } from './cache';
import { Provider, ReturnData } from '@/types/api';

import { getCurrentSeason } from './utils';

const FetchDataAndCache = async (
  url: string,
  id: string,
  method?: string,
  headers?: Record<string, string>,
  body?: any
) => {
  try {
    let isCached = false;
    let cacheKey = `${url}:${id}`;
    let data: any = await cache.get(cacheKey);

    if (!data) {
      const options: RequestInit = {
        cache: 'no-cache',
        method: method ? method : 'GET',
        headers: headers ? new Headers(headers) : undefined,
        body: body ? body : undefined,
      };

      data = await (await fetch(url, options)).json();

      if (!data.errors) {
        await cache.set(cacheKey, JSON.stringify(data), 5 * 60 * 60);
        isCached = true;
      }
    } else {
      data = JSON.parse(data);
      if (data.errors) {
        await cache.del(cacheKey);
        isCached = false;
      } else {
        isCached = true;
      }
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

    console.log(response);

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
          nextAiringEpisode: item.nextAiringEpisode,
        })),
    };

    return res as ReturnData;
  } catch (error) {
    try {
      console.log(
        'There was an error fetching trending from anilist. Using consumet....'
      );
      response = await fetch(
        `${process.env.CONSUMET_API}/meta/anilist/trending?perPage=${perPage}&page=${page}`
      );

      return await response.json();
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
          nextAiringEpisode: item.nextAiringEpisode,
        })),
    };

    return res as ReturnData;
  } catch (error) {
    try {
      console.error(error);
      console.log(
        'There was an error fetching popular from anilist. Using consumet....'
      );

      response = await fetch(
        `${process.env.CONSUMET_API}/meta/anilist/popular?perPage=24`
      );
      return await response.json();
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
    response = (await (
      await FetchDataAndCache(
        `https://graphql.anilist.co`,
        'seasonalAnime',
        'POST',
        {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        JSON.stringify({ query, variables })
      )
    ).data) as SeasonQueryResponse;

    const res = {
      currentPage: response.Page.pageInfo.currentPage,
      hasNextPage: response.Page.pageInfo.hasNextPage,
      results: response.Page.media.map((item) => ({
        id: item.id.toString(),
        malId: item.idMal,
        season: item.season,
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
        trailer: {
          id: item.trailer?.id,
          site: item.trailer?.site,
          thumbnail: item.trailer?.thumbnail,
        },
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
        color: item.coverImage?.color,
        genres: item.genres,
        totalEpisodes: isNaN(item.episodes)
          ? 0
          : item.episodes ?? item.nextAiringEpisode?.episode! - 1 ?? 0,
        duration: item.duration,
        type: item.format,
        nextAiringEpisode: item.nextAiringEpisode,
        startDate: item.startDate,
        endDate: item.endDate,
      })),
    };

    console.log(res);

    return res;
  } catch (error) {
    try {
      console.log(
        'There was an error fetching seasonal from anilist. Using consumet....'
      );

      response = await fetch(
        `${
          process.env.CONSUMET_API
        }/meta/anilist/advanced-search?perPage=24&season=${getCurrentSeason()}&year=${new Date().getFullYear()}`
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }
};

export async function getEpisodes(
  id: string,
  releasing = false
): Promise<Provider[]> {
  try {
    const response = await FetchDataAndCache(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/episodes/${id}?releasing=${releasing}`,
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
      `episode:src:${id}:${episodeId}`
    );

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getUpcomingAnime = async (): Promise<ReturnData | undefined> => {
  const query = `query Query($page: Int, $perPage: Int, $notYetAired: Boolean, $episode: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        hasNextPage
        lastPage
        perPage
        total
      }
      airingSchedules(notYetAired: $notYetAired, episode: $episode) {
        media {
          bannerImage
          averageScore
          countryOfOrigin
          coverImage {
            extraLarge
            large
            medium
            color
          }
          description
          duration
          endDate {
            year
            month
            day
          }
          episodes
          format
          genres
          hashtag
          id
          idMal
          isAdult
          meanScore
          popularity
          season
          seasonYear
          startDate {
            year
            month
            day
          }
          status
          synonyms
          title {
            romaji
            english
            native
            userPreferred
          }
          trailer {
            id
            site
            thumbnail
          }
          trending
          type
        }
      }
    }
  }`;

  const variables = {
    page: 1,
    perPage: 2000,
    notYetAired: true,
    episode: 1,
  };

  let response;

  try {
    response = (await (
      await FetchDataAndCache(
        `https://graphql.anilist.co`,
        'upcomin',
        'POST',
        {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        JSON.stringify({ query, variables })
      )
    ).data) as QueryResponse;

    const res: any = {
      currentPage: response.Page.pageInfo.currentPage,
      hasNextPage: response.Page.pageInfo.hasNextPage,
      results: response.Page.airingSchedules
        .filter(
          (item) =>
            item?.media?.status === 'NOT_YET_RELEASED' && !item?.media?.isAdult
        )
        .map((item) => ({
          id: item?.media?.id.toString(),
          malId: item?.media?.idMal,
          title:
            {
              romaji: item?.media?.title?.romaji,
              english: item?.media?.title?.english,
              native: item?.media?.title?.native,
              userPreferred: item?.media?.title?.userPreferred,
            } || item?.media?.title?.romaji,
          coverImage:
            item?.media?.coverImage?.extraLarge ??
            item?.media?.coverImage?.large ??
            item?.media?.coverImage?.medium,
          trailer: item?.media?.trailer?.id
            ? `https://www.youtube.com/watch?v=${item?.media?.trailer?.id}`
            : null,
          description: item?.media?.description,
          status: item?.media?.status,
          bannerImage:
            item?.media?.bannerImage ??
            item?.media?.coverImage?.extraLarge ??
            item?.media?.coverImage?.large ??
            item?.media?.coverImage?.medium,
          rating: item?.media?.averageScore,
          meanScore: item?.media?.meanScore,
          releaseDate: item?.media?.seasonYear,
          startDate: {
            year: item?.media?.startDate?.year,
            month: item?.media?.startDate?.month,
            day: item?.media?.startDate?.day,
          },
          color: item?.media?.coverImage?.color,
          genres: item?.media?.genres,
          totalEpisodes: item?.media?.episodes,
          duration: item?.media?.duration,
          format: item?.media?.format,
          type: item?.media?.type,
          season: item?.media?.season,
        })),
    };

    return res as ReturnData;
  } catch (error) {
    try {
      console.error(error);
      console.log(
        'There was an error fetching popular from anilist. Using consumet....'
      );

      response = await fetch(
        `${process.env.CONSUMET_API}/meta/anilist/popular?perPage=24`
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }
};
