'use client';

import { Episode } from '@/types/api';
import { useRouter } from 'next-nprogress-bar';
import { Chip, Tooltip } from '@nextui-org/react';

export default function ProviderSwitch({
  params,
  gogoanimeEpisode,
  zoroEpisode,
  searchParams,
}: {
  params: any;
  gogoanimeEpisode: Episode;
  zoroEpisode?: Episode;
  searchParams: any;
}) {
  const router = useRouter();

  const handleProviderSwitch = (provider: string) => {
    const newProvider = provider;
    const newEpisodeId =
      newProvider === 'gogoanime'
        ? gogoanimeEpisode?.id
        : zoroEpisode?.episodeId;
    router.push(
      `/watch/${params.id}?number=${searchParams.number}&type=${searchParams.type}&episodeId=${newEpisodeId}&provider=${newProvider}`
    );
  };

  return (
    <>
      <div className='flex gap-3'>
        <p>Providers:</p>
      <div className='flex gap-2'>
      <Tooltip content='Change to Gogoanime' placement='top'>
        <Chip
          radius='sm'
          size='sm'
          className='cursor-pointer'
          color='success'
          onClick={() => handleProviderSwitch('gogoanime')}
          variant={searchParams.provider === 'gogoanime' ? 'solid' : 'bordered'}
        >
          Gogoanime
        </Chip>
      </Tooltip>
      {zoroEpisode ? (
        <Tooltip content='Change to Zoro' placement='top'>
          <Chip
            radius='sm'
            size='sm'
            className='cursor-pointer'
            color='success'
            onClick={() => handleProviderSwitch('zoro')}
            variant={searchParams.provider === 'zoro' ? 'solid' : 'bordered'}
          >
            Zoro
          </Chip>
        </Tooltip>
      ) : null}
      </div>
      </div>
    </>
  );
}
