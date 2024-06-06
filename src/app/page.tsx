import { use } from 'react';
import {
  getTrendingAnime,
  getAllTimePopularAnime,
  getUpcomingNextSeason,
  getPopularThisSeasonAnime,
} from '@/lib/anime';
import { ReturnData } from '@/types/animeData';
import dynamic from 'next/dynamic';

const HomeComp = dynamic(() => import('./home'), { ssr: false });

export const revalidate = 3600;

export default function Home() {
  const [trending, popular, upcomingNxt, popularThis] = use(
    Promise.all([
      getTrendingAnime(),
      getAllTimePopularAnime(),
      getUpcomingNextSeason(),
      getPopularThisSeasonAnime(),
    ])
  ) as [ReturnData, ReturnData, ReturnData, ReturnData];

  return (
    <HomeComp
      trending={trending}
      popular={popular}
      upcomingNxt={upcomingNxt}
      popularThis={popularThis}
    />
  );
}
