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
    <div className="p-4">
      <div className="mb-4 flex gap-3">
        <Select onValueChange={(e) => handleProviderChange(e)}>
          <SelectTrigger
            className="w-[130px]"
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
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder={language} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="sub">Sub</SelectItem>
                <SelectItem value="dub">Dub</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>
      <div>
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
                  type="sub" // default type for zoro since it doesn't differentiate
                />
              )
            )}
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
      className="flex flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row mb-4 border p-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700/55 duration-300"
    >
      <Image
        src={episode.img}
        alt={episode.title}
        width={1600}
        height={1600}
        className="md:w-1/4 md:h-auto lg:w-1/4 lg:h-auto xl:w-1/4 xl:h-auto 2xl:w-1/4 2xl:h-auto mr-4 object-cover"
      />
      <div className="flex flex-col justify-center">
        <h2 className="text-xl font-bold">{episode.title}</h2>
        <p>{episode.description}</p>
      </div>
    </a>
  );
};

export default AnimeViewer;
