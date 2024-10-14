import { NextRequest, NextResponse } from 'next/server';
import { ANIME, ITitle, META, IAnimeResult } from '@consumet/extensions';
import { HiAnime } from 'aniwatch';
import { findBestMatchedAnime } from '@/lib/title';
import { safeAwait } from '@/lib/promise';
import { ANIFY_URL } from '@/lib/constants';

const h = new HiAnime.Scraper();

const getAnimeEpisodes = h.getEpisodes;

export const revalidate = 0;

export interface Titles {
  'x-jat': string;
  ja: string;
  en: string;
  'zh-Hant': string;
  'zh-Hans': string;
}

export interface EpisodeTitle {
  ja: string;
  en: string;
  'x-jat': string;
}

export interface Episode {
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

export interface Episodes {
  [key: string]: Episode;
}

export interface Image {
  coverType: string;
  url: string;
}

export interface Mappings {
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
  themoviedb_id: string;
}

export interface Data {
  titles: Titles;
  episodes: Episodes;
  episodeCount: number;
  specialCount: number;
  images: Image[];
  mappings: Mappings;
}

export interface MalSiteDetail {
  identifier: string;
  image: string;
  malId: number;
  aniId: number;
  page: string;
  title: string;
  type: string;
  url: string;
  external?: boolean;
}

export interface MalSites {
  [key: string]: {
    [key: string]: MalSiteDetail;
  };
}

export interface MalAnime {
  id: number;
  type: string;
  title: string;
  url: string;
  total: number;
  image: string;
  malId: number;
  Sites?: MalSites;
}

export interface AnifyEpisode {
  id: string;
  img: string | null;
  title: string | null;
  hasDub: boolean | null;
  rating: string | null;
  isFiller: boolean | null;
  updatedAt: number;
  description: string | null;
}

export interface AnifyEpisodes {
  providerId: string;
  episodes: AnifyEpisode[];
}

export interface EpisodeData {
  episodeId: string;
  id: string;
  isFiller: boolean | null;
  img?: string;
  image?: string;
  duration?: number;
}

export interface AnimeEpisodes {
  providerId: string;
  sub: EpisodeData[];
  dub: EpisodeData[];
}

export interface EpisodeReturn {
  id: string;
  title: string;
  number: number;
  description: string;
  isFiller: boolean;
  thumbnail: string;
  rating: number;
  season: number;
  released: string;
  tvdbId: number;
  duration: number;
}

export interface EpisodeReturnType {
  providerId: string;
  episodes: {
    sub: EpisodeReturn[];
    dub: EpisodeReturn[];
  };
}

const anilist = new META.Anilist();

const formatTitle = (
  title: ITitle,
  toReplace: string[],
  value: string
): Partial<ITitle> => {
  return {
    english: title.english?.toLowerCase().replaceAll(toReplace[0], value),
    romaji: title.romaji?.toLowerCase().replaceAll(toReplace[1], value),
    native: title.native?.toLowerCase().replaceAll(toReplace[2], value),
    userPreferred: title.userPreferred
      ?.toLowerCase()
      .replaceAll(toReplace[3], value),
  };
};

const searchGogoanime = async (title: string) => {
  const gogo = new ANIME.Gogoanime('anitaku.pe');
  const [search, searchError] = await safeAwait(gogo.search(title));

  if (searchError) {
    console.error(searchError);
    return null;
  }

  return search?.results;
};

const searchZoro = async (title: string) => {
  const zoro = new ANIME.Zoro();

  const [search, searchError] = await safeAwait(zoro.search(title));

  if (searchError) {
    console.error(searchError);
    return null;
  }

  return search?.results;
};

const filterResults = (results: IAnimeResult[], isDub: boolean) => {
  return results.filter((result) =>
    isDub
      ? (result.title as string).includes('(Dub)')
      : !(result.title as string).includes('(Dub)')
  );
};

const getGogoanimeMapping = async (
  id: string
): Promise<{ sub: string; dub: string }> => {
  const [info, error] = await safeAwait(anilist.fetchAnimeInfo(id));

  if (error) {
    console.error(error);
    return { sub: '', dub: '' };
  }

  const title = formatTitle(
    info?.title as ITitle,
    [
      'tower of god season 2',
      'kami no tou: tower of god - ouji no kikan',
      '神之塔 -tower of god- 王子の帰還',
      'kami no tou: tower of god - ouji no kikan',
    ],
    'Kami no Tou: Ouji no Kikan'
  );
  const searchResults = await searchGogoanime(title.english || title.romaji!);

  if (!searchResults) {
    return { sub: '', dub: '' };
  }

  const subResult = filterResults(searchResults, false);
  const dubResult = filterResults(searchResults, true);

  // @ts-ignore
  const bestSubMatch = findBestMatchedAnime(title, subResult);
  // @ts-ignore
  const bestDubMatch = findBestMatchedAnime(title, dubResult);

  return {
    sub: bestSubMatch?.bestMatch.id || '',
    dub: bestDubMatch?.bestMatch.id || '',
  };
};

const getZoro = async (id: string): Promise<{ id: string }> => {
  const [info, error] = await safeAwait(anilist.fetchAnimeInfo(id));

  if (error) {
    console.error(error);
    return { id: '' };
  }

  const title = formatTitle(
    info?.title as ITitle,
    ['oshi no ko', 'oshi no ko', 'oshi no ko', 'oshi no ko'],
    'My Star'
  );
  const searchResults = await searchZoro(title.english || title.romaji!);

  if (!searchResults) {
    return { id: '' };
  }

  // @ts-ignore
  const best = findBestMatchedAnime(title, searchResults);

  return {
    id: best?.bestMatch.id || '',
  };
};

const getMappings = async (
  id: string
): Promise<{ subId: string; dubId: string; hianime: string }> => {
  if (id === '20455') {
    return {
      subId: 'super-sonico-animation',
      dubId: 'soniani-super-sonico-the-animation-dub',
      hianime: '',
    };
  }

  const googMapPromise = safeAwait(getGogoanimeMapping(id));
  const zoroMapPromise = safeAwait(getZoro(id));

  const [[gogo, gogoError], [zoro, zoroError]] = await Promise.all([
    googMapPromise,
    zoroMapPromise,
  ]);

  if (gogoError) {
    gogo!.dub ??= '';
    gogo!.sub ??= '';
  }

  if (zoroError) {
    zoro!.id ??= '';
  }

  return {
    subId: gogo?.sub || '',
    dubId: gogo?.dub || '',
    hianime: zoro?.id || '',
  };
};

async function fetchEpisodeData(animeId: string) {
  const [response, error] = await safeAwait(
    fetch(`https://api.ani.zip/mappings?anilist_id=${animeId}`)
  );

  if (error) {
    return [] as Episode[];
  }

  const [data, parseError] = await safeAwait(response?.json() as Promise<Data>);

  if (parseError) {
    return [] as Episode[];
  }

  return Object.values(data?.episodes as Episodes) as Episode[];
}

const gogoProvider = new ANIME.Gogoanime();

async function fetchAnimeEpisodes(animeId: string): Promise<AnimeEpisodes[]> {
  try {
    const { subId, dubId, hianime } = await getMappings(animeId);

    const fetchEpisodes = async (gogoId: string): Promise<EpisodeData[]> => {
      const [response, error] = await safeAwait(
        gogoProvider.fetchAnimeInfo(gogoId)
      );

      if (error || !response) {
        return [];
      }

      return response.episodes?.map((ep) => ({
        id: ep.id,
        isFiller: ep.isFiller ?? false,
      })) as EpisodeData[];
    };

    const [subEpisodes, dubEpisodes, hiAnimeEpisodes] = await Promise.all([
      subId ? fetchEpisodes(subId) : Promise.resolve([]),
      dubId ? fetchEpisodes(dubId) : Promise.resolve([]),
      hianime
        ? (await safeAwait(getAnimeEpisodes(hianime)))?.[0]?.episodes.map(
            (ep) => ({
              id: ep.episodeId,
              isFiller: ep.isFiller ?? false,
            })
          ) || []
        : Promise.resolve([]),
    ]);

    return [
      {
        providerId: 'gogoanime',
        sub: subEpisodes,
        dub: dubEpisodes,
      },
      {
        providerId: 'hianime',
        sub: hiAnimeEpisodes as EpisodeData[],
        dub:
          dubEpisodes.length > 0
            ? (hiAnimeEpisodes.slice(0, dubEpisodes.length) as EpisodeData[])
            : ([] as EpisodeData[]),
      },
    ];
  } catch (error) {
    console.error(error);
    return [
      { providerId: 'gogoanime', sub: [], dub: [] },
      { providerId: 'hianime', sub: [], dub: [] },
    ];
  }
}

async function fetchAnifyEpisodes(animeId: string) {
  const [response, fetchError] = await safeAwait(
    fetch(`${ANIFY_URL}/episodes/${animeId}`)
  );

  if (fetchError || !response) {
    return {
      animepahe: { providerId: 'animepahe', episodes: [] } as
        | AnifyEpisodes
        | undefined,
    };
  }

  const [anifyData, jsonError] = await safeAwait(
    response.json() as Promise<AnifyEpisodes[]>
  );

  if (jsonError || !anifyData) {
    return {
      animepahe: { providerId: 'animepahe', episodes: [] } as
        | AnifyEpisodes
        | undefined,
    };
  }

  return {
    animepahe: anifyData.find(
      (provider) => provider.providerId === 'animepahe'
    ),
  };
}

interface AnifyTMDBEpisode {
  id: string;
  description: string;
  hasDub: boolean;
  img: string;
  isFiller: boolean;
  number: number;
  title: string;
  updatedAt: number;
  rating: number;
}

interface AnifyTMDBMetadata {
  providerId: string;
  data: AnifyTMDBEpisode[];
}

async function fetchAnifyTMDBMetadata(
  animeId: string
): Promise<AnifyTMDBMetadata[]> {
  const [response, error] = await safeAwait(
    fetch(`${ANIFY_URL}/content-metadata/${animeId}`)
  );

  if (error || !response) {
    return [];
  }

  const [data, parseError] = await safeAwait(
    response.json() as Promise<AnifyTMDBMetadata[]>
  );

  if (parseError || !data) {
    return [];
  }

  return data;
}

// eslint-disable-next-line consistent-return
function getMetaInfo(
  episodeIndex: number,
  metadata: Episode[],
  anifyTMDBMetadata: AnifyTMDBMetadata[]
) {
  const aniZipMeta = metadata.find(
    (metaItem) => metaItem.episodeNumber === episodeIndex + 1
  );

  if (aniZipMeta) {
    return aniZipMeta;
  }

  const tmdbMeta = anifyTMDBMetadata
    .find((provider) => provider.providerId === 'tmdb')
    ?.data.find((episode) => episode.number === episodeIndex + 1);

  if (tmdbMeta) {
    return {
      title: { en: tmdbMeta.title },
      summary: tmdbMeta.description,
      image: tmdbMeta.img,
      rating: tmdbMeta.rating.toString(),
      length: 0,
      airDateUtc: new Date(tmdbMeta.updatedAt).toISOString(),
      seasonNumber: 1,
      tvdbId: 0,
    } as Episode;
  }
}

function getEpisodeTitle(meta: Episode | undefined, index: number): string {
  return (
    meta?.title?.en ||
    meta?.title?.['x-jat'] ||
    meta?.title?.ja ||
    `Episode ${index + 1}`
  );
}

function getEpisodeDescription(meta: Episode | undefined): string {
  return meta?.summary ?? meta?.overview ?? 'No Description';
}

function getThumbnail(episode: EpisodeData, meta: Episode | undefined): string {
  return meta?.image ?? episode.img ?? episode.image ?? '';
}

async function mergeEpisodesWithMetadata(
  episodeData: Episode[],
  providerEpisodes: {
    providerId: string;
    sub: EpisodeData[];
    dub: EpisodeData[];
  }[],
  anifyTMDBMetadata: AnifyTMDBMetadata[]
) {
  function mapSingleEpisode(
    episode: EpisodeData,
    index: number,
    meta: Episode | undefined
  ) {
    return {
      id: episode.id || episode.episodeId,
      number: index + 1,
      description: getEpisodeDescription(meta),
      isFiller: episode.isFiller || false,
      released: meta?.airDateUtc ?? '',
      rating: meta?.rating ?? 0,
      thumbnail: getThumbnail(episode, meta),
      title: getEpisodeTitle(meta, index),
      duration: meta?.length ?? episode.duration ?? 0,
      season: meta?.seasonNumber ?? 1,
      tvdbId: meta?.tvdbId ?? 0,
    };
  }

  function mapEpisodes(episodes: EpisodeData[], metadata: Episode[]) {
    return episodes.map((episode, index) =>
      mapSingleEpisode(
        episode,
        index,
        getMetaInfo(index, metadata, anifyTMDBMetadata)
      )
    );
  }

  return providerEpisodes.map((providerData) => ({
    providerId: providerData.providerId,
    episodes: {
      sub: mapEpisodes(providerData.sub, episodeData),
      dub: mapEpisodes(providerData.dub, episodeData),
    },
  }));
}

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<EpisodeReturnType[]>> => {
  const animeEpisodesPromise = safeAwait(fetchAnimeEpisodes(params.id));
  const metadataPromise = safeAwait(fetchEpisodeData(params.id));
  const anifyEpisodesPromise = safeAwait(fetchAnifyEpisodes(params.id));
  const anifyTMDBMetadataPromise = safeAwait(fetchAnifyTMDBMetadata(params.id));

  const [[episodes], [episodeData], [anifyEpisodes], [anifyTMDBMetadata]] =
    await Promise.all([
      animeEpisodesPromise,
      metadataPromise,
      anifyEpisodesPromise,
      anifyTMDBMetadataPromise,
    ]);

  const anifyFormattedEpisodes = [
    {
      providerId: 'animepahe',
      sub: anifyEpisodes?.animepahe?.episodes || [],
      dub:
        episodes?.find((p) => p.providerId === 'gogoanime')?.dub?.length !==
          undefined &&
        (episodes.find((p) => p.providerId === 'gogoanime')?.dub
          ?.length as number) > 0
          ? anifyEpisodes?.animepahe?.episodes.slice(
              0,
              episodes.find((p) => p.providerId === 'gogoanime')?.dub?.length ||
                0
            ) || []
          : [],
    },
  ];

  const [finalEpisodes] = await safeAwait(
    mergeEpisodesWithMetadata(
      episodeData as Episode[],
      [...(episodes as any), ...(anifyFormattedEpisodes as any)],
      anifyTMDBMetadata as AnifyTMDBMetadata[]
    )
  );

  return NextResponse.json(finalEpisodes) as NextResponse<EpisodeReturnType[]>;
};
