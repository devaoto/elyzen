import { cache } from './cache';
import { Provider } from '@/types/api';
import {
  ResponseData,
  ReturnData,
  UpcomingSeasonalResponse,
  UpcomingSeasonalReturnData,
} from '@/types/animeData';

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

export const getTrendingAnime = async (
  page = 1,
  perPage = 24
): Promise<ReturnData> => {
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
        studios(isMain: true) {
          edges {
            isMain
            node {
              id
              name
              isAnimationStudio
            }
          }
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
  }`;

  const variables = {
    isAdult: false,
    page,
    size: perPage,
    type: 'ANIME',
  };

  try {
    const response = (await await FetchDataAndCache(
      `https://graphql.anilist.co`,
      'trendingNow',
      'POST',
      {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      JSON.stringify({ query, variables })
    )) as { data: ResponseData };

    const res: ReturnData = {
      currentPage: response.data.Page.pageInfo.currentPage,
      hasNextPage: response.data.Page.pageInfo.hasNextPage,
      total: response.data.Page.pageInfo.total,
      lastPage: response.data.Page.pageInfo.lastPage,
      results: response.data.Page.media
        .filter((item) => item.status !== 'NOT_YET_RELEASED')
        .map((item) => ({
          id: item.id.toString(),
          malId: item.idMal,
          title: item.title,
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
          startDate: item.startDate,
          color: item.coverImage?.color,
          genres: item.genres,
          totalEpisodes: isNaN(item.episodes)
            ? 0
            : item.episodes ?? item.nextAiringEpisode?.episode! - 1 ?? 0,
          duration: item.duration,
          format: item.format,
          type: item.type,
          studios: item.studios.edges.map((studio) => studio.node.name),
          season: item.season,
          year: item.seasonYear,
          nextAiringEpisode: item.nextAiringEpisode,
        })),
    };

    return res;
  } catch (error) {
    console.error(error);
    return {
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      results: [],
    };
  }
};

export const getAllTimePopularAnime = async (): Promise<ReturnData> => {
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
        studios(isMain: true) {
          edges {
            isMain
            node {
              id
              name
              isAnimationStudio
            }
          }
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
  }`;

  const variables = {
    isAdult: false,
    page: 1,
    size: 35,
    type: 'ANIME',
    isMain: true,
  };

  try {
    const response = (await await FetchDataAndCache(
      `https://graphql.anilist.co`,
      'allTimePopularAnime',
      'POST',
      {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      JSON.stringify({ query, variables })
    )) as { data: ResponseData };

    const res: ReturnData = {
      currentPage: response.data.Page.pageInfo.currentPage,
      hasNextPage: response.data.Page.pageInfo.hasNextPage,
      total: response.data.Page.pageInfo.total,
      lastPage: response.data.Page.pageInfo.lastPage,
      results: response.data.Page.media
        .filter((item) => item.status !== 'NOT_YET_RELEASED')
        .map((item) => ({
          id: item.id.toString(),
          malId: item.idMal,
          title: item.title,
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
          startDate: item.startDate,
          color: item.coverImage?.color,
          studios: item.studios.edges.map((studio) => studio.node.name),
          genres: item.genres,
          totalEpisodes: isNaN(item.episodes)
            ? 0
            : item.episodes ?? item.nextAiringEpisode?.episode! - 1 ?? 0,
          duration: item.duration,
          format: item.format,
          type: item.type,
          season: item.season,
          year: item.seasonYear,
          nextAiringEpisode: item.nextAiringEpisode,
        })),
    };

    return res;
  } catch (error) {
    console.error(error);
    return {
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      results: [],
    };
  }
};

export const getAllTimePopularMovies = async (): Promise<ReturnData> => {
  const query = `query ($page: Int, $perPage: Int, $sort: [MediaSort], $format: MediaFormat) {
  Page(page: $page, perPage: $perPage) {
    media(sort: $sort, format: $format) {
      siteUrl
      title {
        english
        native
        romaji
        userPreferred
      }
      description
      averageScore
      bannerImage
      countryOfOrigin
      coverImage {
        extraLarge
        large
        medium
        color
      }
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
      popularity
      nextAiringEpisode {
        id
        airingAt
        timeUntilAiring
        episode
        mediaId
      }
      season
      startDate {
        year
        month
        day
      }
      synonyms
      status
      studios {
        edges {
          isMain
          id
          node {
            id
            favourites
            isAnimationStudio
            name
          }
        }
      }
      trailer {
        id
        site
        thumbnail
      }
      trending
      type
      updatedAt
      meanScore
      favourites
    }
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
  }
}`;

  const variables = {
    page: 1,
    size: 35,
    format: 'MOVIE',
    sort: ['POPULARITY_DESC', 'SCORE_DESC'],
  };

  try {
    const response = (await await FetchDataAndCache(
      `https://graphql.anilist.co`,
      'allTimePopularMovies',
      'POST',
      {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      JSON.stringify({ query, variables })
    )) as { data: ResponseData };

    const res: ReturnData = {
      currentPage: response.data.Page.pageInfo.currentPage,
      hasNextPage: response.data.Page.pageInfo.hasNextPage,
      total: response.data.Page.pageInfo.total,
      lastPage: response.data.Page.pageInfo.lastPage,
      results: response.data.Page.media
        .filter((item) => item.status !== 'NOT_YET_RELEASED')
        .map((item) => ({
          id: item.id.toString(),
          malId: item.idMal,
          title: item.title,
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
          startDate: item.startDate,
          color: item.coverImage?.color,
          studios: item.studios.edges
            .filter((studio) => studio.isMain)
            .map((studio) => studio.node.name),
          genres: item.genres,
          totalEpisodes: isNaN(item.episodes)
            ? 0
            : item.episodes ?? item.nextAiringEpisode?.episode! - 1 ?? 0,
          duration: item.duration,
          format: item.format,
          type: item.type,
          season: item.season,
          year: item.seasonYear,
          nextAiringEpisode: item.nextAiringEpisode,
        })),
    };

    return res;
  } catch (error) {
    console.error(error);
    return {
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      results: [],
    };
  }
};

export const getPopularThisSeasonAnime = async (): Promise<ReturnData> => {
  const query = `query ($page: Int, $isAdult: Boolean = false, $size: Int, $sort: [MediaSort] = [POPULARITY_DESC], $type: MediaType, $season: MediaSeason = ${getCurrentSeason().toUpperCase()}, $seasonYear: Int = ${new Date().getFullYear()}) {
    Page(page: $page, perPage: $size) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(season: $season, seasonYear: $seasonYear, isAdult: $isAdult, sort: $sort, type: $type) {
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
        studios(isMain: true) {
          edges {
            isMain
            node {
              id
              name
              isAnimationStudio
            }
          }
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
  }`;

  const variables = {
    isAdult: false,
    page: 1,
    size: 35,
    type: 'ANIME',
  };

  try {
    const response = (await await FetchDataAndCache(
      `https://graphql.anilist.co`,
      'popularThisSeasonAnime',
      'POST',
      {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      JSON.stringify({ query, variables })
    )) as { data: ResponseData };

    const res: ReturnData = {
      currentPage: response.data.Page.pageInfo.currentPage,
      hasNextPage: response.data.Page.pageInfo.hasNextPage,
      total: response.data.Page.pageInfo.total,
      lastPage: response.data.Page.pageInfo.lastPage,
      results: response.data.Page.media
        .filter((item) => item.status !== 'NOT_YET_RELEASED')
        .map((item) => ({
          id: item.id.toString(),
          malId: item.idMal,
          title: item.title,
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
          startDate: item.startDate,
          color: item.coverImage?.color,
          genres: item.genres,
          studios: item.studios.edges.map((studio) => studio.node.name),

          totalEpisodes: isNaN(item.episodes)
            ? 0
            : item.episodes ?? item.nextAiringEpisode?.episode! - 1 ?? 0,
          duration: item.duration,
          format: item.format,
          type: item.type,
          season: item.season,
          year: item.seasonYear,
          nextAiringEpisode: item.nextAiringEpisode,
        })),
    };

    return res;
  } catch (error) {
    console.error(error);
    return {
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      results: [],
    };
  }
};

export const getUpcomingNextSeason = async (
  page: number = 1,
  perPage: number = 24
): Promise<UpcomingSeasonalReturnData> => {
  try {
    const query = `query Query($season: MediaSeason, $seasonYear: Int, $sort: [MediaSort], $isAdult: Boolean, $type: MediaType, $isMain: Boolean, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(season: $season, seasonYear: $seasonYear, sort: $sort, isAdult: $isAdult, type: $type) {
          title {
            romaji
            english
            native
            userPreferred
          }
          countryOfOrigin
          nextAiringEpisode {
            airingAt
            episode
            id
            mediaId
            timeUntilAiring
          }
          coverImage {
            extraLarge
            large
            medium
            color
          }
          id
          idMal
          season
          seasonYear
          isAdult
          genres
          format
          studios(isMain: $isMain) {
            edges {
              isMain
              node {
                id
                name
                isAnimationStudio
              }
            }
          }
        }
        pageInfo {
          currentPage
          hasNextPage
          lastPage
          perPage
          total
        }
      }
    }`;

    const variables = {
      sort: ['POPULARITY_DESC'],
      isAdult: false,
      type: 'ANIME',
      season: getCurrentSeason(new Date().getMonth() + 1).toUpperCase(),
      seasonYear: 2024,
      isMain: true,
      page: page,
      perPage: perPage,
    };

    const data = (await await FetchDataAndCache(
      'https://graphql.anilist.co',
      'upcomingNxtSeason',
      'POST',
      {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      JSON.stringify({ query, variables })
    )) as { data: UpcomingSeasonalResponse };

    const res = {
      currentPage: data.data.Page.pageInfo.currentPage,
      hasNextPage: data.data.Page.pageInfo.hasNextPage,
      total: data.data.Page.pageInfo.total,
      lastPage: data.data.Page.pageInfo.lastPage,
      results: data.data.Page.media.map((item) => ({
        id: item.id.toString(),
        malId: item.idMal,
        title: item.title,
        coverImage:
          item.coverImage.extraLarge ??
          item.coverImage.large ??
          item.coverImage.medium,
        color: item.coverImage?.color,
        studios: item.studios.edges.map((studio) => studio.node.name),
        season: item.season,
        year: item.seasonYear,
        genres: item.genres,
        format: item.format,
        nextAiringEpisode: item.nextAiringEpisode,
      })),
    };

    return res;
  } catch (error) {
    console.error(error);

    return {
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      results: [],
    };
  }
};

export const top100Anime = async (): Promise<ReturnData> => {
  try {
    const query = `query ($page: Int, $perPage: Int, $sort: [MediaSort], $type: MediaType, $isAdult: Boolean) {
  Page(page: $page, perPage: $perPage) {
    media(sort: $sort, type: $type, isAdult: $isAdult) {
      id
      idMal
      title {
        romaji
        english
        native
        userPreferred
      }
      description
      coverImage {
        extraLarge
        large
        medium
        color
      }
      bannerImage
      averageScore
      countryOfOrigin
      duration
      endDate {
        year
        month
        day
      }
      airingSchedule {
        edges {
          node {
            airingAt
            episode
            id
            mediaId
            timeUntilAiring
          }
        }
      }
      episodes
      favourites
      format
      genres
      hashtag
      isAdult
      meanScore
      popularity
      nextAiringEpisode {
        id
        airingAt
        timeUntilAiring
        episode
        mediaId
      }
      season
      seasonYear
      startDate {
        year
        month
        day
      }
      trailer {
        id
        site
        thumbnail
      }
      type
      updatedAt
      studios {
        edges {
          isMain
          node {
            id
            favourites
            isAnimationStudio
            isFavourite
            name
            siteUrl
          }
          id
        }
      }
    }
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
  }
}`;

    const variables = {
      type: 'ANIME',
      page: 1,
      perPage: 10,
      sort: 'SCORE_DESC',
      isAdult: false,
    };

    const response = (await await FetchDataAndCache(
      `https://graphql.anilist.co`,
      'top100Anime',
      'POST',
      {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      JSON.stringify({ query, variables })
    )) as { data: ResponseData };

    const res: ReturnData = {
      currentPage: response.data.Page.pageInfo.currentPage,
      hasNextPage: response.data.Page.pageInfo.hasNextPage,
      total: response.data.Page.pageInfo.total,
      lastPage: response.data.Page.pageInfo.lastPage,
      results: response.data.Page.media
        .filter((item) => item.status !== 'NOT_YET_RELEASED')
        .map((item) => ({
          id: item.id.toString(),
          malId: item.idMal,
          title: item.title,
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
          startDate: item.startDate,
          color: item.coverImage?.color,
          genres: item.genres,
          studios: item.studios.edges
            .filter((studio) => studio.isMain)
            .map((studio) => studio.node.name),

          totalEpisodes: isNaN(item.episodes)
            ? 0
            : item.episodes ?? item.nextAiringEpisode?.episode! - 1 ?? 0,
          duration: item.duration,
          format: item.format,
          type: item.type,
          season: item.season,
          year: item.seasonYear,
          nextAiringEpisode: item.nextAiringEpisode,
        })),
    };

    return res;
  } catch (error) {
    console.error(error);
    return {
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      results: [],
    };
  }
};

export const advancedSearch = async (
  sort: string[] = ['POPULARITY_DESC'],
  query: string = '',
  rating: number = 0,
  status: string = '',
  format: string = '',
  type: string = '',
  year: number = 0,
  season: string = '',
  genres: string[] = [],
  page: number = 1,
  perPage: number = 24
) => {
  const graphQuery = `query ($page: Int, $perPage: Int, $sort: [MediaSort], $query: String, $rating: Int, $status: MediaStatus, $format: MediaFormat, $type: MediaType, $year: Int, $season: MediaSeason, $genres: [String]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(sort: $sort, search: $query, averageScore_greater: $rating, status: $status, format: $format, type: $type, seasonYear: $year, season: $season, genre_in: $genres) {
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
        studios(isMain: true) {
          edges {
            isMain
            node {
              id
              name
              isAnimationStudio
            }
          }
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
  }`;

  const variables = {
    page,
    perPage,
    sort,
    query,
    rating,
    status,
    format,
    type,
    year,
    season,
    genres,
  };

  try {
    const response = (await await FetchDataAndCache(
      `https://graphql.anilist.co`,
      `advancedSearchResult:${query}:${sort}:${rating}:${status}:${format}:${type}:${year}:${season}:${genres}:${page}:${perPage}`,
      'POST',
      {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      JSON.stringify({ graphQuery, variables })
    )) as { data: ResponseData };

    const res: ReturnData = {
      currentPage: response.data.Page.pageInfo.currentPage,
      hasNextPage: response.data.Page.pageInfo.hasNextPage,
      total: response.data.Page.pageInfo.total,
      lastPage: response.data.Page.pageInfo.lastPage,
      results: response.data.Page.media
        .filter((item) => item.status !== 'NOT_YET_RELEASED')
        .map((item) => ({
          id: item.id.toString(),
          malId: item.idMal,
          title: item.title,
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
          startDate: item.startDate,
          color: item.coverImage?.color,
          studios: item.studios.edges.map((studio) => studio.node.name),
          genres: item.genres,
          totalEpisodes: isNaN(item.episodes)
            ? 0
            : item.episodes ?? item.nextAiringEpisode?.episode! - 1 ?? 0,
          duration: item.duration,
          format: item.format,
          type: item.type,
          season: item.season,
          year: item.seasonYear,
          nextAiringEpisode: item.nextAiringEpisode,
        })),
    };

    return res;
  } catch (error) {
    console.error(error);
    return {
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      results: [],
    };
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
