import { use } from 'react';
import { Hero } from '@/components/shared/Hero';
import {
  getTrendingAnime,
  getPopularAnime,
  getUpcomingAnime,
} from '@/lib/anime';
import { Slider } from '@/components/shared/Slider';
import dynamic from 'next/dynamic';
import { Flame, Star } from 'lucide-react';
import { ColumnCard } from '@/components/shared/ColumnCard';

const SideBar = dynamic(() => import('@/components/SideBar'), { ssr: false });
const ContinueWatching = dynamic(
  () => import('@/components/shared/ContinueWatching'),
  { ssr: false }
);

export const revalidate = 3600;

export default function Home() {
  const trending = use(getTrendingAnime(1, 69));
  const popular = use(getPopularAnime());
  const upcoming = use(getUpcomingAnime());

  return (
    <>
      <div className='absolute top-0'>
        <SideBar />
      </div>
      <div className='ml-0 md:ml-16 lg:ml-16 xl:ml-16 2xl:ml-16'>
        <Hero data={trending} />
        <div className='mt-20'>
          <ContinueWatching />
          <h1 className='mb-4 flex gap-1 text-4xl font-bold'>
            <Flame className='size-9' /> <span>Trending Now</span>
          </h1>
          <Slider data={trending} title='trending' />
        </div>
        <div className='mt-20'>
          <h1 className='mb-4 flex gap-1 text-4xl font-bold'>
            <Star className='size-9' /> All Time Popular
          </h1>
          <Slider data={popular} title='popular' />
        </div>
        <ColumnCard media={upcoming?.results?.slice(0, 10)!} />
      </div>
    </>
  );
}
