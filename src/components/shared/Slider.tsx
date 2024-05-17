'use client';
import { useDraggable } from 'react-use-draggable-scroll';
import React, { useRef, useState, useEffect } from 'react';
import { ReturnData } from '@/types/api';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const Slider = ({
  data,
  title,
}: {
  data: ReturnData;
  title: string;
}) => {
  const slider =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events } = useDraggable(slider, { applyRubberBandEffect: true });
  const [isLeftArrowActive, setIsLeftArrowActive] = useState(false);
  const [isRightArrowActive, setIsRightArrowActive] = useState(false);

  useEffect(() => {
    const container = slider.current;

    const handleScroll = () => {
      const scrollPosition = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;

      setIsLeftArrowActive(scrollPosition > 30);
      setIsRightArrowActive(scrollPosition < maxScroll - 30);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const smoothScroll = (amount: number) => {
    const container = slider.current;
    if (container) {
      container.scrollBy({
        left: amount,
        behavior: 'smooth',
      });
    }
  };

  const scrollLeft = () => {
    smoothScroll(-650);
  };

  const scrollRight = () => {
    smoothScroll(650);
  };

  return (
    <div className='relative'>
      <div className='group'>
        <ArrowLeft
          onClick={scrollLeft}
          style={{ opacity: isLeftArrowActive ? 1 : 0 }}
          className='absolute z-[69420] flex h-full w-[30px] cursor-pointer items-center bg-gradient-to-r from-transparent-gr to-transparent-gr transition-all duration-500 ease-out group-hover:from-[#000000] group-hover:to-gradient-rgba'
        />
      </div>
      <div className='group'>
        <ArrowRight
          onClick={scrollRight}
          style={{ opacity: isRightArrowActive ? 1 : 0 }}
          className='absolute right-0 z-[69420] flex h-full w-[30px] cursor-pointer items-center bg-gradient-to-l from-transparent-gr to-gradient-rgba transition-all duration-500 ease-out group-hover:from-[#000000] group-hover:to-gradient-rgba'
        />
      </div>
      <div
        id={`anime-${title}-card`}
        className='relative flex max-w-full flex-nowrap items-center gap-[10px] overflow-y-hidden overflow-x-scroll pl-2 pt-2 scrollbar-hide'
        {...events}
        ref={slider}
      >
        {data.results
          .filter(
            (anime) =>
              anime.status !== 'NOT_YET_RELEASED' &&
              ['FINISHED', 'RELEASING'].includes(anime.status || '') &&
              anime.coverImage
          )
          .map((anime) => (
            <div
              key={anime.id}
              className='duration-[0.5s] mb-6 max-h-full min-w-[250px] rounded-xl pb-6 shadow-lg shadow-zinc-900 transition-transform ease-in-out hover:scale-105'
            >
              <div className='relative flex-none overflow-hidden rounded-t-xl'>
                <Link href={`/info/${anime.id}`}>
                  <Image
                    src={anime.coverImage!}
                    alt={anime.title.english ?? anime.title.romaji}
                    height={300}
                    width={200}
                    className='max-h-[285px] min-h-[285px] min-w-[250px] object-cover'
                  />
                </Link>
              </div>
              <div className='px-4 pt-4'>
                <h1 className='max-w-[250px] truncate text-lg font-semibold'>
                  {anime.title.english ?? anime.title.romaji}
                </h1>
                <p className='mt-1 text-xs font-bold text-gray-600 dark:text-gray-300'>
                  {anime.format} |
                  <span
                    className={
                      anime.status === 'FINISHED'
                        ? 'text-blue-600'
                        : 'text-green-600'
                    }
                  >
                    {' '}
                    {anime.status}{' '}
                  </span>
                  | {anime.season}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
