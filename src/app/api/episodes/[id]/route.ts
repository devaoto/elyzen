import axios from 'axios';
import { cache } from '@/lib/cache';
import { NextRequest, NextResponse } from 'next/server';
import { mergeEpisodeMetadata } from '@/lib/episode';
import { ConsumetAnimeEpisode } from '@/types/consumet';
import { AnifyEpisodesResponse } from '@/types/anify';
import { MalSyncAnime, MalSyncSiteDetails } from '@/types/malSync';
import { GogoAnimeAnime } from '@/types/gogo';
import { HiAnimeSeries } from '@/types/hianime';
import { AniZipData } from '@/types/anizip';

axios.interceptors.request.use((config) => {
  config.timeout = 9000;
  return config;
});

const fetchCData = async (id: string, dub: boolean) => {
  const res = await axios.get(
    `${process.env.CONSUMET_API}/meta/anilist/episodes/${id}${
      dub ? '?dub=true' : ''
    }`
  );
  const data = res.data as ConsumetAnimeEpisode[] | { message: string };

  if (
    (data as { message: string })?.message === 'Anime not found' &&
    (data as ConsumetAnimeEpisode[])?.length < 1
  ) {
    return [];
  }
  return data as ConsumetAnimeEpisode[];
};

async function fetchConsumet(id: string) {
  try {
    const [subData, dubData] = await Promise.all([
      fetchCData(id, false),
      fetchCData(id, true),
    ]);

    const array = [
      {
        consumet: true,
        providerId: 'gogoanime',
        episodes: {
          ...(subData && subData.length > 0 && { sub: subData }),
          ...(dubData && dubData.length > 0 && { dub: dubData }),
        },
      },
    ];

    return array;
  } catch (error) {
    console.error('Error fetching consumet:', error);
    return [];
  }
}

async function fetchAnify(id: string) {
  try {
    const res = await axios.get(
      `https://api.anify.tv/info/${id}?fields=[episodes]`
    );
    const data = res.data as AnifyEpisodesResponse;

    if (!data || !data?.episodes?.data) {
      return [];
    }
    const epData = data?.episodes?.data;

    const filteredData = epData?.filter(
      (episodes) => episodes.providerId !== '9anime'
    );
    const mappedData = filteredData?.map((i) => {
      if (i?.providerId === 'gogoanime') {
        return {
          episodes: i.episodes,
          providerId: 'gogobackup',
        };
      }
      return i;
    });
    return mappedData;
  } catch (error) {
    console.error('Error fetching anify:', error);
    return [];
  }
}

async function malSync(id: string) {
  try {
    const response = await axios.get(`${process.env.MALSYNC_URI}${id}`);

    const data = response?.data as MalSyncAnime;
    const sites = Object.keys(data.Sites).map((providerId) => ({
      providerId: providerId.toLowerCase(),
      data: Object.values(data.Sites[providerId]),
    })) as {
      providerId: string;
      data: MalSyncSiteDetails[];
    }[];
    const newData = sites.filter(
      (site) => site.providerId === 'gogoanime' || site.providerId === 'zoro'
    );
    const finalData: any = [];
    console.log(newData);
    newData.forEach((item) => {
      const { providerId, data } = item;
      if (providerId === 'gogoanime') {
        const remove1 = 'https://anitaku.so/category/';
        const remove2 = 'https://anitaku.to/category/';

        const dub = data.find((item: any) =>
          item.title.toLowerCase().endsWith(' (dub)')
        );
        const dubUrl = dub?.url?.replace(
          dub.url.includes('https://anitaku.to/') ? remove2 : remove1,
          ''
        );

        const subItem = data.find((item: any) =>
          item.title.toLowerCase().includes(' (uncensored)')
        );
        const subUrl = subItem
          ? subItem.url.replace(
              subItem.url.includes('https://anitaku.to/') ? remove2 : remove1,
              ''
            )
          : null;

        const nonDubNonUncensoredItem = data.find(
          (item: any) =>
            !item.title.toLowerCase().includes(')') && item.url !== dub?.url
        );
        const nonDubNonUncensoredUrl = nonDubNonUncensoredItem
          ? nonDubNonUncensoredItem.url.replace(
              nonDubNonUncensoredItem.url.includes('https://anitaku.to/')
                ? remove2
                : remove1,
              ''
            )
          : null;

        const sub =
          subUrl ??
          data
            .find((item: any) => item.url === dub?.url?.replace(/-dub$/, ''))
            ?.url.replace(
              dub?.url?.includes('https://anitaku.to/') ? remove2 : remove1,
              ''
            ) ??
          nonDubNonUncensoredUrl;

        finalData.push({ providerId, sub: sub || '', dub: dubUrl || '' });
      } else {
        const remove = 'https://hianime.to/';
        const sub = data[0]?.url?.replace(remove, '');
        finalData.push({ providerId, sub: sub || '' });
      }
    });
    return finalData as { providerId?: string; sub?: string; dub?: string }[];
  } catch (error) {
    console.error('Error fetching data from Malsync:', error);
    return null;
  }
}

const fetchDData = async (id: string) => {
  const res = await axios.get(
    `${process.env.CONSUMET_API}/anime/gogoanime/info/${id}`
  );
  const data = res.data as GogoAnimeAnime | { message: string };

  if (
    (data as { message: string })?.message === 'Anime not found' &&
    (data as GogoAnimeAnime)?.episodes?.length < 1
  ) {
    return [];
  }
  return (data as GogoAnimeAnime)?.episodes;
};

async function fetchGogoanime(sub: string, dub: string) {
  try {
    const [subData, dubData] = await Promise.all([
      sub !== '' ? fetchDData(sub) : Promise.resolve([]),
      dub !== '' ? fetchDData(dub) : Promise.resolve([]),
    ]);

    const array = [
      {
        consumet: true,
        providerId: 'gogoanime',
        episodes: {
          ...(subData && subData.length > 0 && { sub: subData }),
          ...(dubData && dubData.length > 0 && { dub: dubData }),
        },
      },
    ];

    return array;
  } catch (error) {
    console.error('Error fetching consumet gogoanime:', error);
    return [];
  }
}

async function fetchHIAnime(id: string) {
  try {
    const res = await axios.get(
      `${process.env.HIANIME_API}/anime/episodes/${id}`
    );

    const data = res.data as HiAnimeSeries;
    if (!data?.episodes) return [];

    const array = [
      {
        providerId: 'zoro',
        episodes: data?.episodes,
      },
    ];

    return array;
  } catch (error) {
    console.error('Error fetching hianime:', error);
    return [];
  }
}

async function fetchEpisodeMeta(id: string, available = false) {
  try {
    if (available) {
      return null;
    }
    const data = await axios.get(
      `https://api.ani.zip/mappings?anilist_id=${id}`
    );
    const episodesArray = Object.values((data?.data as AniZipData)?.episodes);

    if (!episodesArray) {
      return [];
    }
    return episodesArray;
  } catch (error) {
    console.error('Error fetching and processing meta:', error);
    return [];
  }
}

/**
 * Asynchronously fetches and caches data based on the provided parameters.
 *
 * @param {string} id - The ID used to fetch the data.
 * @param {any} meta - The metadata associated with the data.
 * @param {any} cacheTime - The time to cache the data.
 * @param {any} refresh - Flag indicating whether to refresh the cache.
 * @return {Promise<any>} The combined and processed data after caching and merging.
 */
const fetchAndCacheData = async (
  id: string,
  meta: any,
  cacheTime: any,
  refresh: any
): Promise<any> => {
  let malsync;
  if (id) {
    malsync = await malSync(id);
  }
  const promises = [];

  if (malsync) {
    const gogoAnimeProvider = malsync.find((i) => i.providerId === 'gogoanime');
    const hiAnimeProvider = malsync.find((i) => i.providerId === 'zoro');

    if (gogoAnimeProvider) {
      promises.push(
        fetchGogoanime(gogoAnimeProvider.sub!, gogoAnimeProvider.dub!)
      );
    } else {
      promises.push(Promise.resolve([]));
    }

    if (hiAnimeProvider) {
      promises.push(fetchHIAnime(hiAnimeProvider.sub!));
    } else {
      promises.push(Promise.resolve([]));
    }
    promises.push(fetchEpisodeMeta(id, !refresh));
  } else {
    promises.push(fetchConsumet(id));
    promises.push(fetchAnify(id));
    promises.push(fetchEpisodeMeta(id, !refresh));
  }
  const [consumet, anify, cover] = await Promise.all(promises);

  // Check if cache is available
  if (cache) {
    if (consumet?.length! > 0 || anify?.length! > 0) {
      await cache.set(
        `episodeEData:${id}`,
        JSON.stringify(consumet && anify ? [...consumet, ...anify] : []),
        cacheTime
      );
    }

    const combinedData = [...(consumet ?? []), ...(anify ?? [])];
    let data = combinedData;
    if (refresh) {
      if (cover && cover?.length > 0) {
        try {
          await cache.set(`metaEData:${id}`, JSON.stringify(cover), cacheTime);
          data = await mergeEpisodeMetadata(combinedData, cover);
        } catch (error) {
          console.error('Error serializing cover:', error);
        }
      } else if (meta) {
        data = await mergeEpisodeMetadata(combinedData, JSON.parse(meta));
      }
    } else if (meta) {
      data = await mergeEpisodeMetadata(combinedData, JSON.parse(meta));
    }

    return data;
  } else {
    console.error('cache URL not provided. Caching not possible.');
    return [...(consumet ?? []), ...(anify ?? [])];
  }
};

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const url = new URL(req.url);
  const id = params.id;
  const releasing = url.searchParams.get('releasing') || false;
  const refresh = url.searchParams.get('refresh') === 'true' || false;

  let cacheTime = null;
  if (releasing === 'true') {
    cacheTime = 60 * 60 * 3;
  } else if (releasing === 'false') {
    cacheTime = 60 * 60 * 24 * 45;
  }

  let meta: any = null;
  let cached: string | null = null;

  if (cache) {
    try {
      meta = await cache.get(`metaEData:${id}`);
      if (JSON.parse(meta)?.length === 0) {
        await cache.del(`metaEData:${id}`);
        meta = null;
      }
      cached = await cache.get(`episodeEData:${id}`);
      if (JSON.parse(cached!)?.length === 0) {
        await cache.del(`episodeEData:${id}`);
        cached = null;
      }
      let data: any[] | any = null;
      if (refresh) {
        data = await fetchAndCacheData(id, meta, cacheTime, refresh);
      }
      if (data?.length > 0) {
        return NextResponse.json(data);
      }
    } catch (error) {
      console.error('Error checking cache cache:', error);
    }
  }

  if (cached) {
    try {
      let cachedData = JSON.parse(cached);
      if (meta) {
        cachedData = await mergeEpisodeMetadata(cachedData, JSON.parse(meta));
      }
      return NextResponse.json(cachedData);
    } catch (error) {
      console.error('Error parsing cached data:', error);
    }
  } else {
    const fetchedData = await fetchAndCacheData(id, meta, cacheTime, !refresh);
    return NextResponse.json(fetchedData);
  }
};
