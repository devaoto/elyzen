'use client';

import { Hero } from '@/components/shared/Hero';
import dynamic from 'next/dynamic';
import { Flame, Star } from 'lucide-react';
import { ColumnCard } from '@/components/shared/ColumnCard';
import { motion } from 'framer-motion';
import { ReturnData, UpcomingSeasonalReturnData } from '@/types/animeData';
import { HomeCards } from '@/components/home/homeCards';

const SideBar = dynamic(() => import('@/components/SideBar'), { ssr: false });
const ContinueWatching = dynamic(
  () => import('@/components/shared/ContinueWatching'),
  { ssr: false }
);

export default function Home({
  trending,
  popular,
  popularThis,
  upcomingNxt,
}: {
  trending: ReturnData;
  popular: ReturnData;
  popularThis: ReturnData;
  upcomingNxt: UpcomingSeasonalReturnData;
}) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <div className='absolute top-0'>
        <SideBar />
      </div>
      <div className='ml-0 md:ml-16 lg:ml-16 xl:ml-16 2xl:ml-16'>
        {/* @ts-ignore */}
        <Hero data={trending} />

        <motion.div
          className='container mt-20 pr-4'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <ContinueWatching />
          <h1 className='mb-4 flex gap-1 text-3xl font-bold'>
            <Flame className='size-9' /> <span>Trending Now</span>
          </h1>
          <HomeCards animeData={trending} />
        </motion.div>

        <motion.div
          className='container mt-20 pr-4'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h1 className='mb-4 flex gap-1 text-3xl font-bold'>
            Upcoming Next Season
          </h1>
          <HomeCards animeData={upcomingNxt} />
        </motion.div>

        <motion.div
          className='container mt-20 pr-4'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h1 className='mb-4 flex gap-1 text-3xl font-bold'>
            Popular This Season
          </h1>
          <HomeCards animeData={popularThis} />
        </motion.div>

        <motion.div
          className='container mt-20 pr-4'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h1 className='mb-4 flex gap-1 text-3xl font-bold'>
            <Star className='size-9' /> All Time Popular
          </h1>
          <HomeCards animeData={popular} />
        </motion.div>
      </div>
    </>
  );
}
