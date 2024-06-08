import { ResponseData, ReturnData } from '@/types/animeData';
import { NextRequest, NextResponse } from 'next/server';

function constructSearchQuery(url: URL) {
  const params = url.searchParams;

  const query = params.get('query');
  const type = params.get('type');
  const page = params.get('page');
  const perPage = params.get('perPage');
  const season = params.get('season');
  const format = params.get('format');
  const sort = params.getAll('sort');
  const genres = params.getAll('genres');
  const id = params.get('id');
  const year = params.get('year');
  const status = params.get('status');

  let searchParams = new URLSearchParams();

  if (query) searchParams.set('query', query);
  if (type) searchParams.set('type', type);
  if (page) searchParams.set('page', page);
  if (perPage) searchParams.set('perPage', perPage);
  if (season) searchParams.set('season', season);
  if (format) searchParams.set('format', format);
  if (sort && sort.length > 0) {
    const validSort = sort.filter((item) => item);
    if (validSort.length > 0)
      searchParams.set('sort', JSON.stringify(validSort));
  }
  if (genres && genres.length > 0) {
    const validGenres = genres.filter((genre) => genre);
    if (validGenres.length > 0)
      searchParams.set('genres', JSON.stringify(validGenres));
  }
  if (id) searchParams.set('id', id);
  if (year) searchParams.set('year', year);
  if (status) searchParams.set('status', status);

  return searchParams.toString();
}

const advancedSearch = async (
  query?: string,
  type: string = 'ANIME',
  page: number = 1,
  perPage: number = 20,
  format?: string,
  sort?: string[],
  genres?: string[],
  id?: string | number,
  year?: number,
  status?: string,
  season?: string
) => {
  const graphQuery = `query ($page: Int, $id: Int, $type: MediaType, $isAdult: Boolean = false, $search: String, $format: [MediaFormat], $status: MediaStatus, $size: Int, $countryOfOrigin: CountryCode, $source: MediaSource, $season: MediaSeason, $seasonYear: Int, $year: String, $onList: Boolean, $yearLesser: FuzzyDateInt, $yearGreater: FuzzyDateInt, $episodeLesser: Int, $episodeGreater: Int, $durationLesser: Int, $durationGreater: Int, $chapterLesser: Int, $chapterGreater: Int, $volumeLesser: Int, $volumeGreater: Int, $licensedBy: [String], $isLicensed: Boolean, $genres: [String], $excludedGenres: [String], $tags: [String], $excludedTags: [String], $minimumTagRank: Int, $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]) { Page(page: $page, perPage: $size) { pageInfo { total perPage currentPage lastPage hasNextPage } media(id: $id, type: $type, season: $season, format_in: $format, status: $status, countryOfOrigin: $countryOfOrigin, source: $source, search: $search, onList: $onList, seasonYear: $seasonYear, startDate_like: $year, startDate_lesser: $yearLesser, startDate_greater: $yearGreater, episodes_lesser: $episodeLesser, episodes_greater: $episodeGreater, duration_lesser: $durationLesser, duration_greater: $durationGreater, chapters_lesser: $chapterLesser, chapters_greater: $chapterGreater, volumes_lesser: $volumeLesser, volumes_greater: $volumeGreater, licensedBy_in: $licensedBy, isLicensed: $isLicensed, genre_in: $genres, genre_not_in: $excludedGenres, tag_in: $tags, tag_not_in: $excludedTags, minimumTagRank: $minimumTagRank, sort: $sort, isAdult: $isAdult) {  id idMal status(version: 2) title { userPreferred romaji english native } bannerImage coverImage{ extraLarge large medium color } episodes season popularity description format seasonYear genres averageScore countryOfOrigin nextAiringEpisode { airingAt timeUntilAiring episode }
  synonyms
  type
  studios {
    edges {
      isMain
      id
      node {
        id
        favourites
        isAnimationStudio
        isFavourite
        name
      }
    }
  }
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
  trailer {
    id
    site
    thumbnail
  }
} } }`;

  const variables = {
    search: query,
    type: type,
    page: page,
    size: perPage,
    format: format,
    sort: sort,
    genres: genres,
    id: id,
    year: year ? `${year}%` : undefined,
    status: status,
    season: season,
  };

  try {
    const response = await fetch(`https://graphql.anilist.co`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query: graphQuery, variables }),
    });

    const jsonResponse = await response.json();
    const data: ResponseData = jsonResponse.data;

    const res: ReturnData = {
      currentPage: data.Page.pageInfo.currentPage,
      hasNextPage: data.Page.pageInfo.hasNextPage,
      total: data.Page.pageInfo.total,
      lastPage: data.Page.pageInfo.lastPage,
      results: data.Page.media
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

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const params = constructSearchQuery(url);
  const searchParams = new URLSearchParams(params);
  const sort = JSON.parse(searchParams.get('sort')!) || ['POPULARITY_DESC'];
  const query = searchParams.get('query') ?? undefined;
  const status = searchParams.get('status') ?? undefined;
  const format = searchParams.get('format') ?? undefined;
  const type = searchParams.get('type') ?? undefined;
  const year = Number(searchParams.get('year')) ?? undefined;
  const season = searchParams.get('season') ?? undefined;
  const genres = searchParams.get('genres')
    ? JSON.parse(searchParams.get('genres')!)
    : undefined;
  const page = Number(searchParams.get('page')) || 1;
  const perPage = Number(searchParams.get('perPage')) || 24;

  const data = await advancedSearch(
    query,
    type,
    page,
    perPage,
    format,
    sort,
    genres,
    undefined,
    year,
    status,
    season
  );

  return NextResponse.json(data);
};
