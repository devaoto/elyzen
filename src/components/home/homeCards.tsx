'use client';

import {
  Result,
  ReturnData,
  SeasonalMedia,
  UpcomingSeasonalReturnData,
} from '@/types/animeData';
import useDeviceDetector from '@/hooks/useDeviceDetector';
import { useEffect, useState } from 'react';
import { Card } from '../shared/Card';

type CardProps = {
  animeData: ReturnData | UpcomingSeasonalReturnData;
};

export const HomeCards = ({ animeData }: Readonly<CardProps>) => {
  const deviceType = useDeviceDetector();
  const [device, setDevice] = useState<'desktop' | 'mobile' | 'tab'>('desktop');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDevice(deviceType);
    }
  }, [deviceType]);

  const slicedAnimeArray = animeData.results.slice(
    0,
    device === 'mobile' ? 2 : device === 'tab' ? 3 : 5
  ) as Result[] | SeasonalMedia[];
  const calculateTimeRemaining = (airingAt: number) => {
    const currentTime = Date.now();
    const timeRemaining = airingAt * 1000 - currentTime;
    return timeRemaining;
  };

  const getDays = (time: number) =>
    `${isNaN(Math.floor(time / (1000 * 60 * 60 * 24))) ? 'unknown' : Math.floor(time / (1000 * 60 * 60 * 24))} days`;

  return (
    <>
      <div className='grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {slicedAnimeArray.map((anime) => (
          <Card anime={anime} getDays={getDays} calculateTimeRemaining={calculateTimeRemaining} key={anime.id}/>
        ))}
      </div>
    </>
  );
};
