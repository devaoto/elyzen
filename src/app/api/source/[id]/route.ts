import { cache } from '@/lib/cache';
import { NextResponse, NextRequest } from 'next/server';

const fetchGogoAnime = async (episodeId: string) => {
  try {
    const response = await fetch(
      `${process.env.CONSUMET_API}/meta/anilist/watch/${episodeId}`
    );
    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
};

const fetchAnifyAnime = async (
  id: string,
  episodeId: string,
  episodeNumber: string,
  provider = 'zoro',
  subType = 'sub'
) => {
  try {
    const response = await fetch(
      `https://api.anify.tv/sources?providerId=${provider}&watchId=${encodeURIComponent(
        episodeId
      )}&episodeNumber=${episodeNumber}&id=${id}&subType=${subType}`
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const fetchZoroAnime = async (
  id: string,
  episodeId: string,
  episodeNumber: string,
  provider = 'zoro',
  subType = 'sub'
) => {
  try {
    const cleanEpisodeId = episodeId.replace(/\/watch\//g, '');
    const response = await fetch(
      `${process.env.HIANIME_API}/anime/episode-srcs?id=${cleanEpisodeId}&server=vidstreaming&category=${subType}`
    );
    const data = response.json();
    return data;
  } catch (error) {
    await fetchAnifyAnime(id, episodeId, episodeNumber, provider, subType);
  }
};

export async function GET(request: NextRequest, params: { id: string }) {
  const id = params.id;

  const url = new URL(request.url);

  const episodeId = url.searchParams.get('episodeId');
  const episodeNumber = url.searchParams.get('episodeNumber');
  const provider = url.searchParams.get('provider');
  const subType = url.searchParams.get('subType');
  const source = url.searchParams.get('source');

  const cacheTime = 5 * 60 * 30;
  const cachedData = await cache.get(`source:${id}:${episodeId}`);
  if (cachedData) {
    return NextResponse.json(JSON.parse(cachedData));
  }
  let data = null;
  if (provider === 'zoro' && source === 'anify') {
    data = await fetchZoroAnime(
      id,
      episodeId!,
      episodeNumber!,
      provider!,
      subType!
    );
  } else if (source === 'consumet') {
    data = await fetchGogoAnime(episodeId!);
  } else if (source === 'zoro') {
    data = await fetchZoroAnime(
      id,
      episodeId!,
      episodeNumber!,
      provider!,
      subType!
    );
  } else {
    data = await fetchAnifyAnime(
      id,
      episodeId!,
      episodeNumber!,
      provider!,
      subType!
    );
  }

  await cache.set(`source:${id}:${episodeId}`, JSON.stringify(data), cacheTime);
  return NextResponse.json(data);
}
