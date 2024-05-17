import { AnilistInfo, fetchAnilistInfo } from '@/lib/info';
import { use } from 'react';
import Image from 'next/image';
import { darkHexColor, numberToMonth } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
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

const SideBar = dynamic(() => import('@/components/SideBar'), { ssr: false });

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

export default function Information({ params }: { params: { id: string } }) {
  const infoPromise = fetchAnilistInfo(params) as Promise<AnilistInfo>;
  const episodesPromise = getEpisodes(params.id) as Promise<Provider[]>;

  const [info, episodes] = use(Promise.all([infoPromise, episodesPromise]));

  return (
    <>
      <SideBar />
      <div className='ml-0 md:ml-16 lg:ml-16 xl:ml-16 2xl:ml-16'>
        {
          <div className='overflow-x-hidden'>
            <div className='relative'>
              <div
                style={{
                  backgroundColor:
                    darkHexColor(info?.color ? info?.color : '#00FF7F', 80) ??
                    'springgreen',
                }}
                className='h-[620px] w-[1920px] overflow-x-hidden'
              ></div>
              <div className='absolute inset-0 z-[1] overflow-x-hidden'>
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
                        <Badge>EP {info.totalEpisodes}</Badge>
                        <Badge variant={'outline'}>{info.format}</Badge>
                        <Badge variant={'outline'}>{info.season}</Badge>
                        <Badge variant={'outline'}>
                          <div className='flex gap-1'>
                            <span>{info.startDate.day}</span>
                            <span>{numberToMonth(info.startDate.month!)}</span>
                            <span>{info.startDate.year}</span>
                          </div>
                        </Badge>
                      </div>
                      <div className='mt-2 max-w-xl'>
                        <p>By: {info.studios?.join(', ')}</p>
                      </div>
                      <Dialog>
                        <DialogTrigger>
                          <div
                            className='-ml-2 mt-2 line-clamp-4 max-w-xl select-none rounded-lg px-2 py-5 text-left text-sm duration-300 hover:bg-black/20'
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
                          <Badge variant={'outline'} key={g + i}>
                            {g}
                          </Badge>
                        ))}
                      </div>
                      <div className='mt-2 flex justify-center md:justify-start lg:justify-start xl:justify-start'>
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild className='cursor-no-drop'>
                              <div>
                                <Button variant='outline' disabled>
                                  Watch Now
                                </Button>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Not yet implemented</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        <div>
          <AnimeViewer animeData={episodes} id={params.id} />
        </div>
      </div>
    </>
  );
}
