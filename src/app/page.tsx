import { use } from 'react';
import { Hero } from '@/components/shared/Hero';
import { getTrendingAnime, getPopularAnime } from '@/lib/anime';
import { Slider } from '@/components/shared/Slider';
import dynamic from 'next/dynamic';

const SideBar = dynamic(() => import('@/components/SideBar'), { ssr: false });

export const revalidate = 3600;

export default function Home() {
  const trending = use(getTrendingAnime(1, 69));
  const popular = use(getPopularAnime());

  return (
    <>
      <SideBar />
      <div className='ml-0 md:ml-16 lg:ml-16 xl:ml-16 2xl:ml-16'>
        <Hero data={trending} />
        <div className='mt-20'>
          <h1 className='mb-4 font-mono text-3xl'>TRENDING NOW</h1>
          <Slider data={trending} title='trending' />
        </div>
        <div className='mt-20'>
          <h1 className='mb-4 font-mono text-3xl'>ALL TIME POPULAR</h1>
          <Slider data={popular} title='popular' />
        </div>
      </div>
    </>
  );
}
