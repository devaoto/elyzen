'use client';

import { AnilistInfo } from '@/lib/info';
import { Provider } from '@/types/api';
import { Accordion, AccordionItem, Image } from '@nextui-org/react';
import AnimeViewer from '../shared/EpisodeList';
import { Slider } from '../shared/Slider';

export default function InformationAccordions({
  info,
  episodes,
  id,
}: {
  info: AnilistInfo;
  episodes: Provider[];
  id: string;
}) {
  return (
    <>
      <Accordion defaultExpandedKeys={['1', '2']}>
        <AccordionItem key='1' aria-label='Episodes' title='Episodes'>
          <AnimeViewer animeData={episodes} info={info} id={id} />
        </AccordionItem>
        <AccordionItem key='2' aria-label='Relations' title='Relations'>
          <div>
            <Slider data={info.relations!} title='relations' type='Relations' />
          </div>
        </AccordionItem>
      </Accordion>
    </>
  );
}
