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

  return (
    <>
      <div className='grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {slicedAnimeArray.map((anime) => (
          <Card anime={anime} key={anime.id} />
        ))}
      </div>
    </>
  );
};
