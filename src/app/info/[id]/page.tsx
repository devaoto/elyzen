import { AnilistInfo, fetchAnilistInfo } from '@/lib/info';
import { use } from 'react';
import { darkHexColor, numberToMonth } from '@/lib/utils';
import { Button, Image } from '@nextui-org/react';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import dynamic from 'next/dynamic';
import { Metadata, Viewport } from 'next';
import { getEpisodes } from '@/lib/anime';
import { Provider } from '@/types/api';
import AnimeViewer from '@/components/shared/EpisodeList';
import Link from 'next/link';
import { Chip } from '@nextui-org/react';
import Tabs from '@/components/info/Tabs';

const SideBar = dynamic(() => import('@/components/SideBar'), { ssr: false });
const Countdown = dynamic(() => import('@/components/shared/Countdown'), {
  ssr: false,
});

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const info = (await fetchAnilistInfo(params)) as AnilistInfo;
  return {
    title:
      info.title.userPreferred ??
      info.title.english ??
      info.title.romaji ??
      info.title.native,
    description: info.description?.replace(/<br>/g, '').slice(0, 155),
    openGraph: {
      images: info.bannerImage ?? info.coverImage ?? undefined,
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

export default function Information({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    releasing?: boolean;
  };
}) {
  const infoPromise = fetchAnilistInfo(params) as Promise<AnilistInfo>;
  const episodesPromise = getEpisodes(
    params.id,
    searchParams.releasing
  ) as Promise<Provider[]>;

  const [info, episodes] = use(Promise.all([infoPromise, episodesPromise]));

  return (
    <>
      <div className='absolute top-0'>
        <SideBar />
      </div>
      <div className='ml-0 md:ml-16 lg:ml-16 xl:ml-16 2xl:ml-16'>
        <div className='min-h-max overflow-x-hidden scrollbar-hide'>
          <div className='relative'>
            <div
              style={{
                backgroundColor:
                  darkHexColor(info?.color ? info?.color : '#00FF7F', 80) ??
                  'springgreen',
              }}
              className='h-[620px] w-[1920px] overflow-x-hidden scrollbar-hide'
            ></div>
            <div className='absolute inset-0 z-[1] overflow-x-hidden scrollbar-hide'>
              {info.bannerImage ? (
                <Image
                  src={info.bannerImage}
                  alt={info.color!}
                  width={1920}
                  height={900}
                  className='min-h-[620px] object-cover [clip-path:polygon(44%_0,100%_0%,100%_100%,31%_100%)]'
                />
              ) : info.coverImage ? (
                <Image
                  src={info.coverImage}
                  alt={info.color! ?? info.title.english ?? info.title.romaji}
                  width={1920}
                  height={900}
                  className='max-h-[620px] min-h-[620px] min-w-[1920px] object-cover [clip-path:polygon(44%_0,100%_0%,100%_100%,31%_100%)]'
                />
              ) : null}
            </div>
            <div className='absolute inset-0 z-[2] bg-gradient-to-r from-transparent from-[80%] to-background' />
            <div className='absolute inset-0 z-[2] bg-gradient-to-l from-transparent from-[80%] to-background' />
            <div className='absolute inset-0 z-[2] bg-gradient-to-t from-transparent from-[80%] to-background' />
            <div className='absolute inset-0 z-[5] bg-gradient-to-b from-transparent to-background'>
              <div className='ml-10 mt-40 flex h-full flex-col justify-center md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0'>
                <div className='flex flex-col items-center gap-4 md:flex-row lg:flex-row xl:flex-row'>
                  <Image
                    src={info.coverImage!}
                    className='max-h-[400px] rounded-xl object-cover'
                    alt={info.title.english! ?? info.title.romaji!}
                    width={300}
                    height={500}
                    isBlurred
                  />
                  <div>
                    <h1
                      style={{ color: info.color ?? 'pink' }}
                      className='text-center text-3xl font-bold md:text-left lg:text-left'
                    >
                      {info.title.english ?? info.title.romaji}
                    </h1>
                    <h2 className='text-center text-2xl font-semibold md:text-left lg:text-left'>
                      {info.title.romaji}
                    </h2>
                    <div className='mt-2 flex flex-wrap gap-3'>
                      <Chip>EP {info.totalEpisodes}</Chip>
                      <Chip color={'primary'} variant={'bordered'}>
                        {info.format}
                      </Chip>
                      <Chip color={'primary'} variant={'bordered'}>
                        {info.season}
                      </Chip>
                      <Chip color={'primary'} variant={'bordered'}>
                        <div className='flex gap-1'>
                          <span>{info.startDate.day}</span>
                          <span>{numberToMonth(info.startDate.month!)}</span>
                          <span>{info.startDate.year}</span>
                        </div>
                      </Chip>
                    </div>
                    <div className='mt-2 flex flex-wrap gap-3'>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Chip className='cursor-pointer'>
                              CEP{' '}
                              {Number.isNaN(info.currentEpisode)
                                ? info.totalEpisodes
                                : info.currentEpisode}
                            </Chip>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Currently Airing Episode</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Chip color={'primary'} variant={'bordered'}>
                        {info.duration}
                      </Chip>
                      <Chip color={'primary'} variant={'bordered'}>
                        {info.countryOfOrigin}
                      </Chip>
                      {info.endDate && info.endDate.day ? (
                        <Chip color={'primary'} variant={'bordered'}>
                          <div className='flex gap-1'>
                            <span>{info.endDate.day}</span>
                            <span>{numberToMonth(info.endDate.month!)}</span>
                            <span>{info.endDate.year}</span>
                          </div>
                        </Chip>
                      ) : null}
                    </div>
                    <div className='mt-2 max-w-xl'>
                      <Countdown
                        airingAt={info.nextAiringEpisode?.airingTime!}
                      />
                    </div>
                    <div className='mt-2 max-w-xl'>
                      <p>By: {info.studios?.join(', ')}</p>
                    </div>
                    <Dialog>
                      <DialogTrigger>
                        <div
                          className='-ml-2 mt-2 line-clamp-4 max-w-xl select-none rounded-lg px-2 text-left text-sm duration-300 hover:bg-black/20'
                          dangerouslySetInnerHTML={{
                            __html: info.description?.replace(/<br>/g, '')!,
                          }}
                        />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogDescription className='max-h-80 overflow-y-scroll text-lg scrollbar-hide'>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: info.description!,
                            }}
                          />
                        </DialogDescription>
                      </DialogContent>
                    </Dialog>
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {info.genres?.map((g, i) => (
                        <Chip variant={'light'} key={g + i}>
                          {g}
                        </Chip>
                      ))}
                    </div>
                    <div className='mt-2 flex justify-center md:justify-start lg:justify-start xl:justify-start'>
                      <Link
                        href={`${process.env.NEXT_PUBLIC_DOMAIN}/info/${params.id}#watch`}
                      >
                        <Button color='primary'>Watch Now</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Tabs info={info} episodes={episodes} id={params.id} />
      </div>
    </>
  );
}
