import { getEpisodes, getSources } from '@/lib/anime';
import { fetchAnilistInfo } from '@/lib/info';
import { Episode } from '@/types/api';
import { use } from 'react';
import dynamic from 'next/dynamic';

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

  if (searchParams.provider === 'zoro') {
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
      <div className='fixed -top-1'>
        <SideBar />
      </div>
      <div className='ml-0 mt-16 md:ml-16 lg:ml-16 xl:ml-16 2xl:ml-16'>
        <div className='flex flex-col gap-2 lg:flex-row'>
          <div className='max-w-[950px] flex-grow'>
            <Player
              title={currentEpisode?.title!}
              cover={currentEpisode?.img!}
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
          </div>
          <div className='max-h-[509px] max-w-lg overflow-x-hidden overflow-y-scroll scrollbar-hide'>
            <AnimeViewer
              currentlyWatching={currentEpisode?.number!}
              animeData={episodes}
              id={params.id}
            />
          </div>
        </div>
      </div>
    </>
  );
}
