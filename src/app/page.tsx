import { use } from 'react';
import {
  getTrendingAnime,
  getAllTimePopularAnime,
  getUpcomingNextSeason,
  getPopularThisSeasonAnime,
  top100Anime,
} from '@/lib/anime';
import { ReturnData } from '@/types/animeData';
import dynamic from 'next/dynamic';

const HomeComp = dynamic(() => import('./home'), { ssr: false });

export const revalidate = 3600;

export default function Home() {
  const [trending, popular, upcomingNxt, popularThis, top100] = use(
    Promise.all([
      getTrendingAnime(),
      getAllTimePopularAnime(),
      getUpcomingNextSeason(),
      getPopularThisSeasonAnime(),
      top100Anime(),
    ])
  ) as [ReturnData, ReturnData, ReturnData, ReturnData, ReturnData];

  return (
    <HomeComp
      trending={trending}
      popular={popular}
      upcomingNxt={upcomingNxt}
      popularThis={popularThis}
      top100={top100}
    />
  );
}
