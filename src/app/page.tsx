import { use } from 'react';
import { Hero } from '@/components/shared/Hero';
import Image from 'next/image';
import { getTrendingAnime, getPopularAnime } from '@/lib/anime';
import { Slider } from '@/components/shared/Slider';

export default function Home() {
  const trending = use(getTrendingAnime(1, 69));
  const popular = use(getPopularAnime());

  return (
    <>
      <Hero data={trending} />
      <div className="mt-20">
        <h1 className="font-bold text-3xl">Trending Now</h1>
        <Slider data={trending} title="trending" />
      </div>
      <div className="mt-20">
        <h1 className="font-bold text-3xl">All Time Popular</h1>
        <Slider data={popular} title="popular" />
      </div>
    </>
  );
}
