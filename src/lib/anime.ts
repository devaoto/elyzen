import { QueryResponse } from '@/types/query';
import { cache } from './cache';
import { ReturnData } from '@/types/api';

const fetchAndCache = async (
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

export const fetchPopularAnime = async (page = 1, perPage = 34) => {
  const query = `query Query($page: Int, $perPage: Int, $isAdult: Boolean, $sort: [MediaSort], $type: MediaType) {
        Page(page: $page, perPage: $perPage) {
          media(isAdult: $isAdult, sort: $sort, type: $type) {
            volumes
            updatedAt
            type
            trending
            trailer {
              id
              site
              thumbnail
            }
            averageScore
            bannerImage
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
            externalLinks {
              id
              url
              site
              siteId
              type
              language
              color
              icon
              notes
              isDisabled
            }
            favourites
            format
            genres
            hashtag
            id
            idMal
            isAdult
            isLicensed
            meanScore
            popularity
            season
            seasonYear
            siteUrl
            startDate {
              year
              month
              day
            }
            stats {
              statusDistribution {
                amount
                status
              }
              scoreDistribution {
                score
                amount
              }
            }
            status
            synonyms
            tags {
              id
              name
              description
              category
              rank
              isGeneralSpoiler
              isMediaSpoiler
              isAdult
              userId
            }
            title {
              romaji
              english
              native
              userPreferred
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
    page: Number(page),
    perPage: Number(perPage),
    isAdult: false,
    sort: ['POPULARITY_DESC'],
    type: 'ANIME',
  };

  const res = (
    await await fetchAndCache(
      'https://graphql.anilist.co',
      'popular',
      'POST',
      { 'Content-Type': 'application/json', Accept: 'application/json' },
      JSON.stringify({ variables, query })
    )
  ).data as QueryResponse;

  const animeData = {
    totalResults: res.Page.pageInfo.total,
    perPage: res.Page.pageInfo.perPage,
    currentPage: res.Page.pageInfo.currentPage,
    lastPage: res.Page.pageInfo.lastPage,
    hasNextPage: res.Page.pageInfo.hasNextPage,
    results: res.Page.media.map((media) => ({
      id: media.id,
      idMal: media.idMal ?? null,
      isAdult: media.isAdult ?? null,
      isLicensed: media.isLicensed ?? null,
      site: media.siteUrl ?? null,
      title: media.title ?? null,
      description: media.description ?? null,
      coverImage:
        media.coverImage.extraLarge ??
        media.coverImage.large ??
        media.coverImage.medium ??
        null,
      color: media.coverImage.color ?? null,
      synonyms: media.synonyms ?? null,
      trailer: media.trailer?.id
        ? `https://www.youtube.com/watch?v=${media.trailer.id}`
        : null,
      trailerThumbnail: media.trailer?.thumbnail ?? null,
      bannerImage: media.bannerImage ?? null,
      season: media.season ?? null,
      status: media.status ?? null,
      format: media.format ?? null,
      type: media.type ?? null,
      tags: media.tags ?? null,
      year: media.seasonYear ?? null,
      externalLinks: media.externalLinks ?? null,
      startDate: media.startDate ?? null,
      endDate: media.endDate ?? null,
      genres: media.genres ?? null,
      country: media.countryOfOrigin ?? null,
      totalEpisodes: media.episodes ?? null,
      meanScore: media.meanScore ?? null,
      averageScore: media.averageScore ?? null,
      popularity: media.popularity ?? null,
      hashtag: media.hashtag ?? null,
      scoreDistribution: media.stats.scoreDistribution ?? null,
      statusDistribution: media.stats.statusDistribution ?? null,
      duration: media.duration ?? null,
    })),
  };
  return animeData as unknown as ReturnData;
};

export const fetchTrendingAnime = async (page = 1, perPage = 34) => {
  const query = `query Query($page: Int, $perPage: Int, $isAdult: Boolean, $sort: [MediaSort], $type: MediaType) {
        Page(page: $page, perPage: $perPage) {
          media(isAdult: $isAdult, sort: $sort, type: $type) {
            volumes
            updatedAt
            type
            trending
            trailer {
              id
              site
              thumbnail
            }
            averageScore
            bannerImage
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
            externalLinks {
              id
              url
              site
              siteId
              type
              language
              color
              icon
              notes
              isDisabled
            }
            favourites
            format
            genres
            hashtag
            id
            idMal
            isAdult
            isLicensed
            meanScore
            popularity
            season
            seasonYear
            siteUrl
            startDate {
              year
              month
              day
            }
            stats {
              statusDistribution {
                amount
                status
              }
              scoreDistribution {
                score
                amount
              }
            }
            status
            synonyms
            tags {
              id
              name
              description
              category
              rank
              isGeneralSpoiler
              isMediaSpoiler
              isAdult
              userId
            }
            title {
              romaji
              english
              native
              userPreferred
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
    page: Number(page),
    perPage: Number(perPage),
    isAdult: false,
    sort: ['TRENDING_DESC', 'POPULARITY_DESC'],
    type: 'ANIME',
  };

  const res = (
    await await fetchAndCache(
      'https://graphql.anilist.co',
      'popular',
      'POST',
      { 'Content-Type': 'application/json', Accept: 'application/json' },
      JSON.stringify({ variables, query })
    )
  ).data as QueryResponse;

  const animeData = {
    totalResults: res.Page.pageInfo.total,
    perPage: res.Page.pageInfo.perPage,
    currentPage: res.Page.pageInfo.currentPage,
    lastPage: res.Page.pageInfo.lastPage,
    hasNextPage: res.Page.pageInfo.hasNextPage,
    results: res.Page.media.map((media) => ({
      id: media.id,
      idMal: media.idMal ?? null,
      isAdult: media.isAdult ?? null,
      isLicensed: media.isLicensed ?? null,
      site: media.siteUrl ?? null,
      title: media.title ?? null,
      description: media.description ?? null,
      coverImage:
        media.coverImage.extraLarge ??
        media.coverImage.large ??
        media.coverImage.medium ??
        null,
      color: media.coverImage.color ?? null,
      synonyms: media.synonyms ?? null,
      trailer: media.trailer?.id
        ? `https://www.youtube.com/watch?v=${media.trailer.id}`
        : null,
      trailerThumbnail: media.trailer?.thumbnail ?? null,
      bannerImage: media.bannerImage ?? null,
      season: media.season ?? null,
      status: media.status ?? null,
      format: media.format ?? null,
      type: media.type ?? null,
      tags: media.tags ?? null,
      year: media.seasonYear ?? null,
      externalLinks: media.externalLinks ?? null,
      startDate: media.startDate ?? null,
      endDate: media.endDate ?? null,
      genres: media.genres ?? null,
      country: media.countryOfOrigin ?? null,
      totalEpisodes: media.episodes ?? null,
      meanScore: media.meanScore ?? null,
      averageScore: media.averageScore ?? null,
      popularity: media.popularity ?? null,
      hashtag: media.hashtag ?? null,
      scoreDistribution: media.stats.scoreDistribution ?? null,
      statusDistribution: media.stats.statusDistribution ?? null,
      duration: media.duration ?? null,
    })),
  };

  return animeData as unknown as ReturnData;
};
