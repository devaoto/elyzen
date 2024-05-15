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

  function scrollLeft() {
    smoothScroll(-650);
  }

  function scrollRight() {
    smoothScroll(+650);
  }

  return (
    <div className="relative">
      <div className="group">
        <ArrowLeft
          onClick={scrollLeft}
          style={{ opacity: isLeftArrowActive ? 1 : 0.5 }}
          className="absolute w-[20px] flex items-center h-full z-[69420] bg-gradient-to-r from-transparent-gr to-transparent-gr group-hover:from-[#000000] group-hover:to-gradient-rgba cursor-pointer duration-500 ease-out transition-all"
        />
      </div>
      <div className="group">
        <ArrowRight
          onClick={scrollRight}
          style={{ opacity: isRightArrowActive ? 1 : 0.5 }}
          className="absolute w-[20px] flex items-center h-full z-[69420] bg-gradient-to-l from-transparent-gr to-transparent-gr group-hover:from-[#000000] group-hover:to-gradient-rgba cursor-pointer duration-500 ease-out transition-all right-0"
        />
      </div>
      <div
        id={`anime-${title}-card`}
        className="flex flex-nowrap gap-[10px] overflow-y-hidden relative items-center max-w-full overflow-x-scroll scrollbar-hide"
        {...events}
        ref={slider}
        onScroll={handleScroll}
      >
        {data.results
          .filter(
            (anime) => anime.status !== 'NOT_YET_RELEASED' && anime.coverImage
          )
          .map((anime) => (
            <div key={anime.id}>
              <div className="flex-none relative overflow-hidden">
                <Link href={`/info/${anime.id}`}>
                  <div className="transition-transform duration-300 ease-in-out hover:scale-[1.1] rounded-xl">
                    <Image
                      src={anime.coverImage!}
                      alt={anime.title.english ?? anime.title.romaji}
                      height={300}
                      width={200}
                      className="object-cover min-h-[285px] max-h-[285px] min-w-[200px]"
                    />
                  </div>
                </Link>
              </div>
              <div>
                <h1 className="truncate max-w-[200px]">
                  {anime.title.english ?? anime.title.romaji}
                </h1>
                <p className="font-bold text-xs">
                  {anime.format} | {anime.status} | {anime.season}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
