'use client';

import React, { useState } from 'react';
import { Provider, Episode } from '@/types/api';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';

interface Props {
  animeData: Provider[];
  id: string;
}

const AnimeViewer: React.FC<Props> = ({ animeData, id }) => {
  console.log(animeData);
  const [selectedProvider, setSelectedProvider] = useState<
    Provider | undefined
  >(animeData.find((p) => p.providerId === 'zoro') || animeData[0]);
  const [language, setLanguage] = useState<'sub' | 'dub'>('sub');

  const handleProviderChange = (providerId: string) => {
    const provider = animeData.find((p) => p.providerId === providerId);
    setSelectedProvider(provider);
  };

  return (
    <div className='p-4'>
      <div className='mb-4 flex gap-3'>
        <Select onValueChange={(e) => handleProviderChange(e)}>
          <SelectTrigger
            className='w-[130px]'
            value={selectedProvider?.providerId}
          >
            <SelectValue placeholder={selectedProvider?.providerId} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {animeData.map((provider) => (
                <SelectItem
                  key={provider.providerId}
                  value={provider.providerId}
                >
                  {provider.providerId}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {selectedProvider?.providerId === 'gogoanime' && (
          <Select
            onValueChange={(e) => setLanguage(e as 'sub' | 'dub')}
            value={language}
          >
            <SelectTrigger className='w-[130px]'>
              <SelectValue placeholder={language} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='sub'>Sub</SelectItem>
                <SelectItem value='dub'>Dub</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>
      <div className='mt-20'>
        <ScrollArea>
          {selectedProvider?.providerId === 'gogoanime'
            ? selectedProvider.episodes[language]?.map((episode) => (
                <EpisodeCard
                  key={episode.id || episode.episodeId}
                  episode={episode}
                  provider={selectedProvider.providerId}
                  type={language}
                  id={id}
                />
              ))
            : (selectedProvider?.episodes as unknown as Episode[])?.map(
                (episode) => (
                  <EpisodeCard
                    key={episode.id || episode.episodeId}
                    episode={episode}
                    provider={selectedProvider?.providerId!}
                    id={id}
                    type='sub' // default type for zoro since it doesn't differentiate
                  />
                )
              )}
        </ScrollArea>
      </div>
    </div>
  );
};

interface EpisodeCardProps {
  episode: Episode;
  provider: string;
  type: 'sub' | 'dub';
  id: string;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  provider,
  type,
  id,
}) => {
  const episodeId = episode.id || episode.episodeId;
  return (
    <a
      href={`/watch/${id}?episodeId=${encodeURIComponent(
        episodeId!
      )}&provider=${provider}&type=${type}`}
      className='mb-4 flex flex-col rounded border p-4 duration-300 hover:bg-gray-100 dark:hover:bg-gray-700/55 md:flex-row lg:flex-row xl:flex-row 2xl:flex-row'
    >
      <Image
        src={episode.img}
        alt={episode.title}
        width={1600}
        height={1600}
        className='mr-4 object-cover md:h-auto md:w-1/4 lg:h-auto lg:w-1/4 xl:h-auto xl:w-1/4 2xl:h-auto 2xl:w-1/4'
      />
      <div className='flex flex-col justify-center'>
        <h2 className='text-xl font-bold'>{episode.title}</h2>
        <p>{episode.description}</p>
      </div>
    </a>
  );
};

export default AnimeViewer;
