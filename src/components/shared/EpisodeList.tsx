'use client';

import React, { useState, useMemo } from 'react';
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
import _, { List } from 'lodash';
import { Input } from '../ui/input';
import { AnilistInfo } from '@/lib/info';

interface Props {
  animeData: Provider[];
  id: string;
  info: AnilistInfo;
}

const AnimeViewer: React.FC<Props> = ({ animeData, info, id }) => {
  const [selectedProvider, setSelectedProvider] = useState<
    Provider | undefined
  >(animeData.find((p) => p.providerId === 'zoro') || animeData[0]);
  const [language, setLanguage] = useState<'sub' | 'dub'>('sub');
  const [episodePage, setEpisodePage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleProviderChange = (providerId: string) => {
    const provider = animeData.find((p) => p.providerId === providerId);
    setSelectedProvider(provider);
    setEpisodePage(0);
  };

  const episodes = useMemo(() => {
    return selectedProvider?.providerId === 'gogoanime'
      ? selectedProvider.episodes[language] || []
      : selectedProvider?.episodes || [];
  }, [selectedProvider, language]);

  const filteredEpisodes = useMemo(() => {
    return (episodes as Episode[]).filter(
      (episode) =>
        (episode.title ?? `Episode ${episode.number}`)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        String(episode.number).includes(searchQuery)
    );
  }, [searchQuery, episodes]);

  const episodeChunks = useMemo(
    () => _.chunk(filteredEpisodes as List<Episode>, 100),
    [filteredEpisodes]
  );
  const currentEpisodes = episodeChunks[episodePage] || [];

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
                  key={
                    provider.providerId === 'zoro'
                      ? 'hianime'
                      : provider.providerId
                  }
                  value={provider.providerId}
                >
                  {provider.providerId === 'zoro'
                    ? 'hianime'
                    : provider.providerId}
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
        {episodeChunks.length > 1 && (
          <Select
            onValueChange={(e) => setEpisodePage(Number(e))}
            value={String(episodePage)}
          >
            <SelectTrigger className='w-[130px]'>
              <SelectValue
                placeholder={`${episodePage * 100 + 1}-${(episodePage + 1) * 100}`}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {episodeChunks.map((_, index) => (
                  <SelectItem key={index} value={String(index)}>
                    {index * 100 + 1}-{(index + 1) * 100}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
        <Input
          type='text'
          placeholder='Search episodes...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className='mt-20'>
        <ScrollArea className='h-[600px]'>
          {currentEpisodes.map((episode) => (
            <EpisodeCard
              info={info}
              key={episode.id || episode.episodeId}
              episode={episode}
              provider={selectedProvider?.providerId!}
              id={id}
              type={language}
            />
          ))}
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
  info: AnilistInfo;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  provider,
  type,
  id,
  info,
}) => {
  const episodeId = episode.id || episode.episodeId;
  return (
    <a
      href={`/watch/${id}?episodeId=${encodeURIComponent(episodeId!)}&provider=${provider}&type=${type}&number=${episode.number}`}
      className='mb-4 flex flex-col rounded border p-4 duration-300 hover:bg-gray-100 dark:hover:bg-gray-700/55 md:flex-row lg:flex-row xl:flex-row 2xl:flex-row'
    >
      <Image
        src={
          episode.img
            ? episode.img!
            : info.bannerImage
              ? info.bannerImage!
              : info.coverImage!
        }
        alt={episode.title ? episode.title : `Episode ${episode.number}`}
        width={1600}
        height={1600}
        className='mr-4 object-cover md:h-auto md:max-h-[150px] md:w-1/4 md:min-w-[20%] md:max-w-[20%] lg:h-auto lg:max-h-[150px] lg:min-h-[150px] lg:w-1/4 lg:min-w-[20%] lg:max-w-[20%] xl:h-auto xl:max-h-[150px] xl:min-h-[150px]  xl:w-1/4 xl:min-w-[20%] xl:max-w-[20%] 2xl:h-auto 2xl:max-h-[150px] 2xl:min-h-[150px] 2xl:w-1/4 2xl:min-w-[20%]  2xl:max-w-[20%]'
      />
      <div className='flex flex-col justify-center'>
        <h2 className='text-xl font-bold'>
          {episode.number} -{' '}
          {episode.title ? episode.title : `Episode ${episode.number}`}
        </h2>
        <p className='line-clamp-5'>
          {episode.description
            ? episode.description
            : `Episode ${episode.number} of ${info.title.english ?? info.title.userPreferred ?? info.title.romaji ?? info.title.native}`}
        </p>
      </div>
    </a>
  );
};

export default AnimeViewer;
