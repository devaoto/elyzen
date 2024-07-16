import ky from 'ky';
import _ from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

import { Anime } from '@/types/episodes';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const bky = ky.extend({
  timeout: 11000,
});

export interface HiAnimeEpisode {
  title: string;
  episodeId: string;
  number: number;
  isFiller: boolean;
}

export interface HiAnimeEpisodesData {
  totalEpisodes: number;
  episodes: HiAnimeEpisode[];
}

interface EpisodeTitle {
  ja: string;
  en: string;
  'x-jat': string;
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
  finaleType?: string;
}

interface Episodes {
  [key: string]: Episode;
}

interface GogoAnimeInfo {
  id: string;
  title: string;
  url: string;
  genres: string[];
  totalEpisodes: number;
  image: string;
  releaseDate: string;
  description: string;
  subOrDub: string;
  type: string;
  status: string;
  otherName: string;
  episodes: GogoEpisode[];
}

interface GogoEpisode {
  id: string;
  number: number;
  url: string;
}

interface ConsumetEpisode {
  id: string;
  title: string | null;
  image: string | null;
  imageHash: string;
  number: number;
  createdAt: string | null;
  description: null;
  url: string;
}

interface ProviderEpisodes {
  sub: Omit<ConsumetEpisode, 'imageHash'>[];
  dub: Omit<ConsumetEpisode, 'imageHash'>[];
}

export interface ProviderData {
  providerId: string;
  episodes: ProviderEpisodes;
}

const getConsumet = async (id: string): Promise<ProviderData[]> => {
  const fetchGogoData = async (i: string, dub = false) => {
    try {
      const res = await bky.get(
        `${process.env.CONSUMET_API}/meta/anilist/episodes/${i}${
          dub ? '?dub=true' : ''
        }`
      );
      const data = await res.json<ConsumetEpisode[]>();

      if (data.length < 1) return [];

      return data.map((d) =>
        _.omit(d, ['image', 'imageHash', 'description', 'createdAt'])
      );
    } catch (error) {
      return [];
    }
  };

  try {
    const [dub, sub] = await Promise.all([
      fetchGogoData(id, true),
      fetchGogoData(id),
    ]);

    return [
      {
        providerId: 'gogoanime',
        episodes: {
          sub: (sub ?? []) as _.Omit<ConsumetEpisode, 'imageHash'>[],
          dub: (dub ?? []) as _.Omit<ConsumetEpisode, 'imageHash'>[],
        },
      },
    ];
  } catch (error) {
    return [
      {
        providerId: 'gogoanime',
        episodes: {
          sub: [],
          dub: [],
        },
      },
      {
        providerId: 'hianime',
        episodes: {
          sub: [],
          dub: [],
        },
      },
    ];
  }
};

const getMadaraMappings = async (id: string) => {
  try {
    const res = await bky.get(
      process.env.MADARA_MAPPINGS_API_KEY
        ? `https://api-mappings.madara.live/anime/${id}?api_key=${process.env.MADARA_MAPPINGS_API_KEY}`
        : `https://api-mappings.madara.live/anime/${id}`
    );
    const data = await res.json<Anime>();

    const malSync = data.mappings.malSync;

    let subUrl = '';
    let dubUrl = '';
    let hianimeUrl = '';

    if (malSync.Sites?.Gogoanime) {
      for (const key in malSync.Sites.Gogoanime) {
        const siteDetail =
          malSync.Sites.Gogoanime[key as keyof typeof malSync.Sites.Gogoanime];
        const cleanedUrl = siteDetail.url.replace(
          /https?:\/\/[^/]+\/category\//,
          ''
        );

        if (!siteDetail.title.includes('Dub') && !key.includes('dub')) {
          subUrl = cleanedUrl;
        }

        if (siteDetail.title.includes('(Dub)') || key.includes('dub')) {
          dubUrl = cleanedUrl;
        }
      }
    }

    if (malSync.Sites?.Zoro) {
      for (const key in malSync.Sites?.Zoro) {
        const siteDetail =
          malSync.Sites.Zoro[key as keyof typeof malSync.Sites.Zoro];

        const cleanedUrl = siteDetail.url.replace(/https?:\/\/[^/]+\//, '');

        hianimeUrl = cleanedUrl;
      }
    }

    const malsync = { sub: subUrl, dub: dubUrl, hianime: hianimeUrl };

    const aniZip = data.mappings.anizip;
    let anizip = {};

    if (!aniZip || !aniZip.episodes) anizip = {};
    anizip = aniZip.episodes;

    return {
      malsync,
      anizip,
    };
  } catch (error) {
    return {
      malsync: {
        sub: '',
        dub: '',
        hianime: '',
      },
      anizip: {},
    };
  }
};

const getGogoAnime = async (id: string) => {
  try {
    const res = await bky.get(
      `${process.env.CONSUMET_API}/anime/gogoanime/info/${id}`
    );
    const data = await res.json<GogoAnimeInfo>();

    if (!data || !data.episodes) return [];

    return data.episodes;
  } catch (error) {
    return [];
  }
};

const getHiAnime = async (id: string) => {
  try {
    const res = await bky.get(
      `${process.env.HIANIME_API}/anime/episodes/${id}`
    );

    const data = await res.json<HiAnimeEpisodesData>();

    return data.episodes;
  } catch {
    return [];
  }
};

const combineMetadataAndEpisodes = (
  consumetResponse: ProviderData[],
  metadataResponse: Episodes,
  combinedSubAndDub: ProviderData[]
): ProviderData[] => {
  if (consumetResponse.length < 1) {
    return [];
  }

  const gogoAnimeIndex = consumetResponse.findIndex(
    (provider) => provider.providerId === 'gogoanime'
  );

  if (gogoAnimeIndex !== -1) {
    consumetResponse[gogoAnimeIndex] = combinedSubAndDub[0];
  }

  _.forEach(consumetResponse, (provider) => {
    _.forEach(['sub', 'dub'], (type) => {
      // @ts-ignore
      provider.episodes[type as 'sub' | 'dub'] = _.map(
        provider.episodes[type as 'sub' | 'dub'],
        (episode: _.Omit<ConsumetEpisode, 'imageHash'>) => {
          const metadataEpisode = metadataResponse[episode.number];

          if (metadataEpisode) {
            const title =
              metadataEpisode.title.en ||
              metadataEpisode.title['x-jat'] ||
              metadataEpisode.title.ja;

            return {
              ...episode,
              id:
                episode.id || (episode as unknown as HiAnimeEpisode).episodeId,
              title: title,
              image: metadataEpisode.image,
              description: metadataEpisode.overview ?? null,
              rating: Number(metadataEpisode.rating),
              season: metadataEpisode.seasonNumber,
              createdAt: metadataEpisode.airDateUtc,
            };
          } else {
            return {
              ...episode,
              title: null,
              image: null,
              description: null,
              rating: null,
            };
          }
        }
      ) as {
        title: string;
        image: string | null;
        description: string | null;
        rating: string;
        createdAt: string;
        number: number;
        id: string;
        url: string;
      }[];
    });
  });

  return consumetResponse;
};

const getEpisodes = async (id: string) => {
  const [consumet, madara] = await Promise.all([
    getConsumet(id),
    getMadaraMappings(id),
  ]);

  const malsync = madara.malsync;
  const meta = madara.anizip;

  const [sub, dub, hianime] = await Promise.all([
    malsync.sub !== '' ? getGogoAnime(malsync.sub) : Promise.resolve([]),
    malsync.dub !== '' ? getGogoAnime(malsync.dub) : Promise.resolve([]),
    malsync.hianime !== '' ? getHiAnime(malsync.hianime) : Promise.resolve([]),
  ]);

  const combinedSubAndDub: ProviderData[] = [
    {
      providerId: 'gogoanime',
      episodes: {
        sub: [...sub] as _.Omit<ConsumetEpisode, 'imageHash'>[],
        dub: [...dub] as _.Omit<ConsumetEpisode, 'imageHash'>[],
      },
    },
  ];

  const combinedHiAnime: ProviderData = {
    providerId: 'hianime',
    episodes: {
      sub: [...hianime] as unknown as _.Omit<ConsumetEpisode, 'imageHash'>[],
      dub:
        dub.length > 0
          ? ([...hianime] as unknown as _.Omit<ConsumetEpisode, 'imageHash'>[])
          : ([] as _.Omit<ConsumetEpisode, 'imageHash'>[]),
    },
  };

  return combineMetadataAndEpisodes(
    [...consumet, combinedHiAnime],
    meta,
    combinedSubAndDub
  );
};

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const res = await getEpisodes(params.id);

  return NextResponse.json(res);
};
