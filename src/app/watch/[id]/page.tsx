import { getEpisodes, getSources } from '@/lib/anime';
import { AnilistInfo, fetchAnilistInfo } from '@/lib/info';
import { Episode } from '@/types/api';
import { use } from 'react';
import dynamic from 'next/dynamic';
import { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { TriangleAlert } from 'lucide-react';

const Player = dynamic(() => import('@/components/Player/VidstackPlayer'), {
  ssr: false,
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
        `- ${info.title.english ?? info.title.userPreferred ?? info.title.romaji ?? info.title.native}`
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
      ),
      getEpisodes(params.id),
    ])
  );

  let currentEpisode: Episode | undefined = undefined;
  let fallbackProvider: Episode | undefined = episodes
    .find((provider) => provider.providerId === 'gogoanime')
    ?.episodes.sub.find(
      (episode) => Number(episode.number) === Number(searchParams.number)
    );

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

  let hslURL: string | undefined = undefined;

  console.log(sources);
  if (searchParams.provider === 'zoro') {
    if (
      sources.status === 500 &&
      sources.message === "Couldn't find server. Try another server"
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
              href={`/watch/${info.id}?provider=gogoanime&type=sub&episodeId=${encodeURIComponent(fallbackProvider?.id!)}&number=${fallbackProvider?.number}`}
            >
              gogoanime
            </Link>
          </p>
        </div>
      );
    }
    hslURL = sources.sources[0].url;
  } else {
    hslURL = sources.sources.find(
      (source: { url: string; isM3U8: boolean; quality: string }) =>
        source.quality === 'default'
    ).url;
  }

  // const thumbnails = sources.tracks.find(
  //   (track: { kind: string; file: string }) => track.kind === 'thumbnails'
  // );

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
                currentEpisode?.title
                  ? currentEpisode.title!
                  : `Episode ${currentEpisode?.number}`
              }
              cover={
                currentEpisode?.img
                  ? currentEpisode.img!
                  : info.bannerImage
                    ? info.bannerImage!
                    : info.coverImage!
              }
              currentEp={currentEpisode?.number!}
              idMal={String(info.malId)}
              anId={params.id}
              hls={hslURL}
              subtitles={sources.tracks ?? undefined}
              animeTitle={
                info.title.english ??
                info.title.romaji ??
                info.title.userPreferred ??
                info.title.native!
              }
              epid={searchParams.episodeId}
              // thumbnails={thumbnails}
            />
            <div>
              <h1 className='mb-0 max-w-[895px] text-2xl font-bold'>
                {currentEpisode?.title
                  ? currentEpisode.title
                  : `Episode ${currentEpisode?.number}`}{' '}
                {currentEpisode?.title
                  ? `- Episode ${currentEpisode?.number}`
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
              currentlyWatching={currentEpisode?.number!}
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
