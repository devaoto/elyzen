import { use } from 'react';
import { Hero } from '@/components/shared/Hero';
import Image from 'next/image';
import { fetchPopularAnime, fetchTrendingAnime } from '@/lib/anime';
import { Slider } from '@/components/shared/Slider';

export default function Home() {
  const trending = use(fetchTrendingAnime(1, 69));
  const popular = use(fetchPopularAnime(1, 69));

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
