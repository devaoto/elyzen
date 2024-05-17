"use client";
import { useDraggable } from "react-use-draggable-scroll";
import React, { useRef, useState } from "react";
import { ReturnData } from "@/types/api";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";

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
      cont.classList.add("scroll-smooth");
      container.scrollLeft += amount;

      setTimeout(() => {
        cont.classList.remove("scroll-smooth");
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
    <div className="relative">
      <div className="group">
        <ArrowLeft
          onClick={scrollLeft}
          style={{ opacity: 1 }}
          className="absolute w-[30px] flex items-center h-full z-[69420] bg-gradient-to-r from-transparent-gr to-transparent-gr group-hover:from-[#000000] group-hover:to-gradient-rgba cursor-pointer duration-500 ease-out transition-all"
        />
      </div>
      <div className="group">
        <ArrowRight
          onClick={scrollRight}
          style={{ opacity: 1 }}
          className="absolute w-[30px] flex items-center h-full z-[69420] bg-gradient-to-l from-transparent-gr to-transparent-gr group-hover:from-[#000000] group-hover:to-gradient-rgba to-gradient-rgba cursor-pointer duration-500 ease-out transition-all right-0"
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
            (anime) => anime.status !== "NOT_YET_RELEASED" && anime.coverImage
          )
          .map((anime) => (
              <div
                key={anime.id}
                className="min-w-[200px] max-h-full transition-all duration-500 ease-in-out hover:scale-105 rounded-xl shadow-lg "
              >
                <div className="flex-none relative overflow-hidden rounded-t-xl">
                  <Link href={`/info/${anime.id}`}>
                    <Image
                      src={anime.coverImage!}
                      alt={anime.title.english ?? anime.title.romaji}
                      height={300}
                      width={200}
                      className="object-cover min-h-[285px] max-h-[285px] min-w-[200px]"
                    />
                  </Link>
                </div>
                <div className="p-4">
                  <h1 className="text-white truncate text-lg font-semibold max-w-[200px]">
                    {anime.title.english ?? anime.title.romaji}
                  </h1>
                  <p className="font-bold text-xs text-gray-600 mt-1">
                    {anime.format} | {anime.status} | {anime.season}
                  </p>
                </div>
              </div>
          ))}
      </div>
    </div>
  );
};
