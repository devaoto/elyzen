'use client';

import { Media } from '@/types/api';
import { Image, Link } from '@nextui-org/react';
import { motion } from 'framer-motion';

export const ColumnCard = ({
  media,
  title,
}: {
  media: Media[];
  title?: string;
}) => {
  return (
    <>
      <h1 className='mt-20 text-4xl font-bold'>
        {title ? title : 'Upcoming Anime'}
      </h1>
      <div className='flex flex-col gap-4 py-6'>
        {media.map((anime, ind) => (
          <Link
            className='rounded-xl bg-neutral-800'
            href={`/info/${anime.id}`}
            key={anime.id}
          >
            <div className='px-3 py-2 duration-300'>
              <div className='flex items-center gap-4'>
                <h1
                  className='text-2xl font-bold'
                  style={{ color: anime.color ?? 'greenyellow' }}
                >
                  # {ind + 1}
                </h1>
                <Image
                  src={anime.coverImage!}
                  alt={anime.title.english! ?? anime.title.romaji!}
                  radius='none'
                  isBlurred
                  className='max-h-[62px] min-h-[62px] min-w-[50px] max-w-[50px] object-cover'
                  width={50}
                  height={100}
                />
                <div>
                  <motion.h1
                    whileHover={{ color: anime.color ?? 'greenyellow' }}
                  >
                    {anime.title.english! ?? anime.title.romaji!}
                  </motion.h1>
                  <div className='flex items-center gap-2'>
                    <span>{anime.season}</span>
                    <div className='h-4 w-[0.5px] bg-black dark:bg-white'></div>
                    <span>
                      {String(anime.startDate?.day).length >= 2
                        ? `${anime.startDate?.day}`
                        : `0${anime.startDate?.day}`}
                      /
                      {String(anime.startDate?.month).length >= 2
                        ? `${anime.startDate?.month}`
                        : `0${anime.startDate?.month}`}
                      /{anime.startDate?.year}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};
