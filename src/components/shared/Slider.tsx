'use client';
import { useDraggable } from 'react-use-draggable-scroll';
import React, { useRef, useState } from 'react';
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

  function handleScroll() {
    const container = slider.current;
    const scrollPosition = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    setIsLeftArrowActive(scrollPosition > 30);
    setIsRightArrowActive(scrollPosition < maxScroll - 30);
  }

  const smoothScroll = (amount: number) => {
    const container = slider.current;
    const cont = document.getElementById(`anime-${title}-card`);

    if (cont && container) {
      cont.classList.add('scroll-smooth');
      container.scrollLeft += amount;

      setTimeout(() => {
        cont.classList.remove('scroll-smooth');
      }, 300);
    }
  };

  const variants = {
    initial: {
      opacity: 0,
    },

    animate: {
      opacity: 1,
    },

    exit: {
      opacity: 0,
    },
  };

  function scrollLeft() {
    smoothScroll(-650);
  }

  function scrollRight() {
    smoothScroll(+650);
  }

  return (
    <div className='relative'>
      <div className='group'>
        <ArrowLeft
          onClick={scrollLeft}
          style={{ opacity: 1 }}
          className='absolute z-[69420] flex h-full w-[30px] cursor-pointer items-center bg-gradient-to-r from-transparent-gr to-transparent-gr transition-all duration-500 ease-out group-hover:from-[#000000] group-hover:to-gradient-rgba'
        />
      </div>
      <div className='group'>
        <ArrowRight
          onClick={scrollRight}
          style={{ opacity: 1 }}
          className='absolute right-0 z-[69420] flex h-full w-[30px] cursor-pointer items-center bg-gradient-to-l from-transparent-gr to-gradient-rgba to-transparent-gr transition-all duration-500 ease-out group-hover:from-[#000000] group-hover:to-gradient-rgba'
        />
      </div>
      <div
        id={`anime-${title}-card`}
        className='relative flex max-w-full flex-nowrap items-center gap-[10px] overflow-y-hidden overflow-x-scroll scrollbar-hide'
        {...events}
        ref={slider}
        onScroll={handleScroll}
      >
        {data.results
          .filter(
            (anime) => anime.status !== 'NOT_YET_RELEASED' && anime.coverImage
          )
          .map((anime) => (
            <div
              key={anime.id}
              className='max-h-full min-w-[200px] rounded-xl shadow-lg transition-all duration-500 ease-in-out hover:scale-105 '
            >
              <div className='relative flex-none overflow-hidden rounded-t-xl'>
                <Link href={`/info/${anime.id}`}>
                  <Image
                    src={anime.coverImage!}
                    alt={anime.title.english ?? anime.title.romaji}
                    height={300}
                    width={200}
                    className='max-h-[285px] min-h-[285px] min-w-[200px] object-cover'
                  />
                </Link>
              </div>
              <div className='p-4'>
                <h1 className='max-w-[200px] truncate text-lg font-semibold text-white'>
                  {anime.title.english ?? anime.title.romaji}
                </h1>
                <p className='mt-1 text-xs font-bold text-gray-600'>
                  {anime.format} | {anime.status} | {anime.season}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
