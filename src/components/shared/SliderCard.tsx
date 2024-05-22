'use client';

import { Media } from '@/types/api';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';

export const SliderCard = ({ anime }: { anime: Media }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className='relative cursor-pointer'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isHovered ? 0.5 : 1 }}
        transition={{ duration: 0.3 }}
        className='overflow-hidden
        rounded-2xl'
      >
        <Image
          src={anime.coverImage!}
          alt={
            anime.title.userPreferred ??
            anime.title.english ??
            anime.title.romaji ??
            anime.title.native
          }
          height={400}
          width={300}
          className='max-h-[285px] min-h-[285px] min-w-[220px] object-cover'
        />
      </motion.div>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className='absolute inset-0 flex items-center justify-center gap-4'
        >
          <Link className='relative z-[69999]' href={`/info/${anime.id}`}>
            <Button className='cursor-pointer'>Info</Button>
          </Link>
          <Link className='relative z-[69999]' href={`/info/${anime.id}#watch`}>
            <Button className='cursor-pointer' variant={'secondary'}>
              Watch
            </Button>
          </Link>
        </motion.div>
      )}
      <div className='absolute inset-0 top-0'>
        <div className='flex justify-between'>
          <Badge>{anime.status}</Badge>
          <Badge variant={'secondary'}>{anime.format}</Badge>
        </div>
      </div>
      <motion.h1 className='max-w-[220px] truncate font-semibold'>
        {anime.title.english ??
          anime.title.userPreferred ??
          anime.title.romaji ??
          anime.title.native ??
          ''}
      </motion.h1>
      <div className='flex gap-2 text-xs font-bold'>
        <p>{anime.totalEpisodes}</p> <div className='h-4 w-[1px] bg-gray-400' />
        <p>{anime.season}</p>
        <div className='h-4 w-[1px] bg-gray-400' />
        <p>{anime.type}</p>
      </div>
    </div>
  );
};
