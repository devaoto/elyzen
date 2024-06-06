'use client';

import { AnilistInfo } from '@/lib/info';
import { Provider } from '@/types/api';
import AnimeViewer from '../shared/EpisodeList';
import { Slider } from '../shared/Slider';
import { Card } from '../shared/Card';
import { Tabs as UITabs, Tab } from '@nextui-org/react';
import { SeasonalMedia } from '@/types/animeData';

export default function Tabs({
  info,
  episodes,
  id,
}: {
  info: AnilistInfo;
  episodes: Provider[];
  id: string;
}) {
  const calculateTimeRemaining = (airingAt: number) => {
    const currentTime = Date.now();
    const timeRemaining = airingAt * 1000 - currentTime;
    return timeRemaining;
  };

  const getDays = (time: number) =>
    `${isNaN(Math.floor(time / (1000 * 60 * 60 * 24))) ? 'unknown' : Math.floor(time / (1000 * 60 * 60 * 24))} days`;

  return (
    <>
      <div className='min-w-full'>
        <UITabs variant={'underlined'} aria-label='Information'>
          <Tab key='episodes' title='Episodes'>
            <AnimeViewer animeData={episodes} info={info} id={id} />
          </Tab>
          <Tab key='relations' title='Relations'>
            <div className='flex gap-2'>
              {info.relations
                ?.filter(
                  (r) => !['ALTERNATIVE', 'ADAPTATION'].includes(r.relationType)
                )
                .map((relation) => (
                  <div key={relation.id} className='max-w-[190px]'>
                    <Card
                      anime={relation as unknown as SeasonalMedia}
                      getDays={getDays}
                      calculateTimeRemaining={calculateTimeRemaining}
                    />
                  </div>
                ))}
            </div>
          </Tab>
        </UITabs>
      </div>
    </>
  );
}
