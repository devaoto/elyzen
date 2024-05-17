'use client';

import { Media, ReturnData } from '@/types/api';
import { Button } from '../ui/button';
import Image from 'next/image';
import React from 'react';
import { getRandomElement, numberToMonth } from '@/lib/utils';
import RenderVideo from './Video';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

export const Hero = ({ data }: { data: ReturnData }) => {
  const [randomElement, setRandomElement] = React.useState<Media | null>(null);
  const [trailer, setTrailer] = React.useState<any>(null);

  React.useEffect(() => {
    setRandomElement(
      getRandomElement(
        data.results.filter(
          (a) => a.status !== 'NOT_YET_RELEASED' && a.trailer && a.bannerImage
        ) as Media[]
      ) as Media
    );
  }, [data.results]);

  React.useEffect(() => {
    async function fetchTrailer(trailerId: string) {
      try {
        const response = await fetch(
          `https://pipedapi.kavin.rocks/streams/${trailerId.split('?v=')[1]}`
        );
        const { videoStreams } = await response.json();
        const item = videoStreams.find(
          (i: any) => i.quality === '1080p' && i.format === 'WEBM'
        );

        setTrailer(item);
      } catch (error) {
        console.error('Error fetching trailer:', error);
        setTrailer(undefined);
      }
    }

    if (randomElement?.trailer) {
      fetchTrailer(randomElement.trailer);
    }
  }, [randomElement?.trailer]);

  return (
    <div>
      {randomElement ? (
        <>
          <div className='relative'>
            {trailer && trailer.url ? (
              <RenderVideo trailer={trailer.url} />
            ) : (
              <>
                {randomElement?.bannerImage ? (
                  <Image
                    draggable={false}
                    src={randomElement.bannerImage!}
                    alt={
                      randomElement?.title?.english ??
                      randomElement?.title.romaji
                    }
                    width={1920}
                    height={920}
                  />
                ) : (
                  <Image
                    draggable={false}
                    src={randomElement.coverImage!}
                    alt={
                      randomElement?.title?.english ??
                      randomElement?.title.romaji
                    }
                    width={1920}
                    height={920}
                    className='aspect-video h-[300px] min-w-[500px] rounded-lg object-cover md:h-[350px] md:min-w-[1000px] lg:h-[600px] lg:min-w-[2000px]'
                  />
                )}
              </>
            )}
            <div className='absolute inset-0 bg-gradient-to-r from-transparent from-[80%] to-background'></div>
            <div className='absolute inset-0 bg-gradient-to-l from-transparent from-[80%] to-background'></div>
            <div className='absolute inset-0 bg-gradient-to-t from-transparent from-[80%] to-background'></div>
            <div className='absolute inset-0 bg-gradient-to-b from-transparent to-background'>
              <div className='ml-5 flex h-full flex-col justify-end gap-8'>
                <div>
                  <div className='flex gap-3'>
                    <h3
                      style={{ color: randomElement.color ?? 'pink' }}
                      className='line-clamp-1 max-w-[15%]'
                    >
                      {randomElement?.title.native}
                    </h3>
                    <div>•</div>
                    <h3
                      className='className="line-clamp-1 max-w-[15%]"
'
                    >
                      {randomElement?.title.romaji}
                    </h3>
                  </div>
                  <h1 className='line-clamp-2 max-w-[70%] text-3xl font-bold lg:max-w-[55%] lg:text-7xl'>
                    {randomElement?.title.english ??
                      randomElement?.title.romaji}
                  </h1>
                </div>
                <div>
                  <div className='flex items-center gap-3 font-semibold'>
                    <h1>{randomElement.format}</h1>
                    <div className='size-[5px] rounded-full bg-white font-bold'></div>
                    <h1>
                      {randomElement.startDate?.day}{' '}
                      {numberToMonth(randomElement.startDate?.month!)}{' '}
                      {randomElement.startDate?.year}
                    </h1>
                    <div className='size-[5px] rounded-full bg-white font-bold'></div>
                    <h1 style={{ color: randomElement.color ?? 'pink' }}>
                      {randomElement.status}
                    </h1>
                  </div>
                  <div
                    className='hidden max-w-[50%] md:line-clamp-2 lg:line-clamp-4 xl:line-clamp-4 2xl:line-clamp-4'
                    dangerouslySetInnerHTML={{
                      __html: randomElement.description!.replace(/<br>/g, ''),
                    }}
                  />
                </div>
                <div className='flex justify-start'>
                  <TooltipProvider>
                    <Tooltip disableHoverableContent delayDuration={0}>
                      <TooltipTrigger className='cursor-no-drop'>
                        <Button className='max-w-[100px]' disabled>
                          Watch Now
                        </Button>
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
        </>
      ) : null}
    </div>
  );
};
