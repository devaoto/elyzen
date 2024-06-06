import { getEpisodes, getSources } from '@/lib/anime';
import { AnilistInfo, fetchAnilistInfo } from '@/lib/info';
import { Episode } from '@/types/api';
import { use } from 'react';
import dynamic from 'next/dynamic';
import { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { TriangleAlert } from 'lucide-react';
import ProviderSwitch from './handleProviderSwitch';
import { Spinner } from '@nextui-org/react';

const Player = dynamic(() => import('@/components/Player/VidstackPlayer'), {
  ssr: false,
  loading: () => (
    <div className='flex h-[428px] w-[895px] items-center justify-center bg-white dark:bg-black'>
      <Spinner size='lg' />
    </div>
  ),
});
const SideBar = dynamic(() => import('@/components/SideBar'), { ssr: false });
const AnimeViewer = dynamic(
  () => import('@/components/shared/WatchEpisodeList'),
  {
    ssr: false,
  }
);

export const generateMetadata = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { number: number; provider: string };
}): Promise<Metadata> => {
  const info = (await fetchAnilistInfo(params)) as AnilistInfo;
  const episodes = await getEpisodes(params.id);

  let currentEpisode: Episode | undefined = undefined;

  if (searchParams.provider === 'gogoanime') {
    currentEpisode = episodes
      .find((p) => p.providerId === 'gogoanime')
      ?.episodes.sub.find(
        (episode) => Number(episode.number) === Number(searchParams.number)
      );
  } else {
    currentEpisode = (
      episodes.find((p) => p.providerId === 'zoro')
        ?.episodes as unknown as Episode[]
    ).find((episode) => Number(episode.number) === Number(searchParams.number));
  }

  return {
    title: currentEpisode?.title
      ? currentEpisode.title +
        ` - ${info.title.english ?? info.title.userPreferred ?? info.title.romaji ?? info.title.native}`
      : info.title.userPreferred
        ? `Episode ${currentEpisode?.number} of ${info.title.userPreferred}`
        : info.title.english
          ? `Episode ${currentEpisode?.number} of ${info.title.english}`
          : info.title.romaji
            ? `Episode ${currentEpisode?.number} of ${info.title.romaji}`
            : `Episode ${currentEpisode?.number} of ${info.title.native}`,
    description: currentEpisode?.description
      ? currentEpisode.description
      : info.description?.replace(/<br>/g, '').slice(0, 155),
    openGraph: {
      images: currentEpisode?.img
        ? currentEpisode.img
        : info.bannerImage
          ? info.bannerImage
          : info.coverImage ?? undefined,
    },
  };
};

export const generateViewport = async ({
  params,
}: {
  params: { id: string };
}): Promise<Viewport> => {
  const info = (await fetchAnilistInfo(params)) as AnilistInfo;

  return {
    themeColor: info.color ?? '#FFFFFF',
  };
};

export default function Watch({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    episodeId: string;
    provider: string;
    number: number;
    type: string;
  };
}) {
  const [info, sources, episodes] = use(
    Promise.all([
      fetchAnilistInfo(params),
      getSources(
        params.id,
        searchParams.episodeId,
        Number(searchParams.number),
        searchParams.provider,
        searchParams.type,
        searchParams.provider === 'gogoanime' ? 'consumet' : 'anify'
      ) as Promise<
        | { message: string; status: number }
        | {
            tracks: { kind: string; file: string; label: string }[];
            sources: { quality: string; url: string; isM3U8?: boolean }[];
          }
      >,
      getEpisodes(params.id),
    ])
  );

  let currentEpisode: Episode | undefined = undefined;
  let zoroEpisode: Episode | undefined = undefined;
  let gogoanimeEpisode: Episode | undefined = undefined;

  episodes.forEach((provider) => {
    if (provider.providerId === 'gogoanime') {
      gogoanimeEpisode = provider.episodes.sub.find(
        (episode) => Number(episode.number) === Number(searchParams.number)
      );
    } else if (provider.providerId === 'zoro') {
      zoroEpisode = (provider.episodes as unknown as Episode[]).find(
        (episode) => Number(episode.number) === Number(searchParams.number)
      );
    }
  });

  if (searchParams.provider === 'gogoanime') {
    currentEpisode = gogoanimeEpisode;
  } else {
    currentEpisode = zoroEpisode;
  }

  let hslURL: string | undefined = undefined;

  if (searchParams.provider === 'zoro') {
    if (
      (sources as { status: number }).status === 500 &&
      (sources as { message: string }).message ===
        "Couldn't find server. Try another server"
    ) {
      return (
        <div className='flex min-h-screen flex-col items-center justify-center'>
          <h1 className='flex items-center gap-1 text-7xl font-bold text-red-500'>
            <TriangleAlert className='size-[72px]' />
            <span>ERROR</span>
          </h1>
          <p>
            Couldn&apos;t find any sources in this server. Try using{' '}
            <Link
              className='text-blue-400'
              href={`/watch/${info.id}?provider=gogoanime&type=sub&episodeId=${encodeURIComponent((gogoanimeEpisode as unknown as Episode)?.id!)}&number=${(gogoanimeEpisode as unknown as Episode)?.number}`}
            >
              gogoanime
            </Link>
          </p>
        </div>
      );
    }
    if (
      (sources as { status: number }).status === 500 &&
      (sources as { message: string }).message.includes('final block length')
    ) {
      return (
        <div className='flex min-h-screen flex-col items-center justify-center'>
          <h1 className='flex items-center gap-1 text-7xl font-bold text-red-500'>
            <TriangleAlert className='size-[72px]' />
            <span>ERROR</span>
          </h1>
          <p>
            There was an encryption error. Try using{' '}
            <Link
              className='text-blue-400'
              href={`/watch/${info.id}?provider=gogoanime&type=sub&episodeId=${encodeURIComponent((gogoanimeEpisode as unknown as Episode)?.id!)}&number=${(gogoanimeEpisode as unknown as Episode)?.number}`}
            >
              gogoanime
            </Link>
          </p>
        </div>
      );
    }
    hslURL = (sources as { sources: { url: string }[] }).sources[0].url;
  } else {
    hslURL = (
      sources as {
        sources: { url: string; quality: string }[];
      }
    )?.sources?.find((source) => source.quality === 'default')?.url;
  }

  let thumbnails: { file: string; kind: string } | undefined = undefined;

  try {
    thumbnails = (
      sources as { tracks: { kind: string; file: string }[] }
    ).tracks.find(
      (track: { kind: string; file: string }) => track.kind === 'thumbnails'
    );
  } catch (error) {
    thumbnails = undefined;
  }

  return (
    <>
      <div className='absolute top-0'>
        <SideBar />
      </div>
      <div className='ml-0 mt-16 md:ml-16 lg:ml-16 xl:ml-16 2xl:ml-16'>
        <div className='flex flex-col gap-2 lg:flex-row'>
          <div className='max-w-[950px] flex-grow'>
            <Player
              title={
                (currentEpisode as unknown as Episode)?.title
                  ? (currentEpisode as unknown as Episode).title!
                  : `Episode ${(currentEpisode as unknown as Episode)?.number}`
              }
              cover={
                (currentEpisode as unknown as Episode)?.img
                  ? (currentEpisode as unknown as Episode).img!
                  : info.bannerImage
                    ? info.bannerImage!
                    : info.coverImage!
              }
              currentEp={(currentEpisode as unknown as Episode)?.number!}
              idMal={String(info.malId)}
              anId={params.id}
              hls={hslURL}
              subtitles={
                (
                  sources as {
                    tracks: { label: string; kind: string; file: string }[];
                  }
                ).tracks ?? undefined
              }
              animeTitle={
                info.title.english ??
                info.title.romaji ??
                info.title.userPreferred ??
                info.title.native!
              }
              epid={searchParams.episodeId}
              thumbnails={thumbnails}
            />
            <ProviderSwitch
              searchParams={searchParams}
              params={params}
              zoroEpisode={zoroEpisode as unknown as Episode}
              gogoanimeEpisode={gogoanimeEpisode as unknown as Episode}
            />
            <div>
              <h1 className='mb-0 max-w-[895px] text-2xl font-bold'>
                {(currentEpisode as unknown as Episode)?.title
                  ? (currentEpisode as unknown as Episode).title
                  : `Episode ${(currentEpisode as unknown as Episode)?.number}`}{' '}
                {(currentEpisode as unknown as Episode)?.title
                  ? `- Episode ${(currentEpisode as unknown as Episode)?.number}`
                  : ''}
              </h1>
              <p className='mt-0 text-gray-500'>
                {info.title.english ??
                  info.title.userPreferred ??
                  info.title.romaji ??
                  info.title.native}
              </p>
            </div>
          </div>
          <div className='max-h-[509px] max-w-lg overflow-x-hidden overflow-y-scroll scrollbar-hide'>
            <AnimeViewer
              currentlyWatching={
                (currentEpisode as unknown as Episode)?.number!
              }
              animeData={episodes}
              id={params.id}
              info={info}
              defaultLanguage={searchParams.type as 'sub' | 'dub'}
              defaultProvider={searchParams.provider}
            />
          </div>
        </div>
      </div>
    </>
  );
}
