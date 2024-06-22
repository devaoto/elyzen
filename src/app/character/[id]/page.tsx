import { getCharacterInfo } from '@/lib/info';
import { Image, Link } from '@nextui-org/react';
import { use } from 'react';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { CharacterAnimeSlider } from '@/components/character/Slider';

const SideBar = dynamic(() => import('@/components/SideBar'), { ssr: false });

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const characterInfo = await getCharacterInfo(params.id);

  return {
    title:
      characterInfo.name.full ??
      characterInfo.name.userPreferred ??
      characterInfo.name.first,
    description: characterInfo.description,
  };
};

export default function CharacterPage({ params }: { params: { id: string } }) {
  const characterInfo = use(getCharacterInfo(params.id));

  return (
    <>
      <div className='absolute top-0'>
        <SideBar />
      </div>
      <div className='ml-0 overflow-x-hidden md:ml-16 lg:ml-16 xl:ml-16 2xl:ml-16'>
        <div className='flex flex-col items-center gap-2 md:flex-row'>
          <Image
            radius='full'
            className='max-h-[300px] min-h-[300px] min-w-[300px] max-w-[300px] object-cover'
            height={300}
            width={300}
            isBlurred
            alt={characterInfo.name.full ?? 'Character image'}
            src={characterInfo.image.large! ?? characterInfo.image.medium!}
          />
          <div>
            <h1 className='text-5xl font-bold'>
              {characterInfo.name.full ?? characterInfo.name.first}
            </h1>
            <div className='text-xl font-semibold'>
              {characterInfo.age && <>Age: {characterInfo.age}</>}{' '}
              {characterInfo.bloodType && (
                <>| Blood Type: {characterInfo.bloodType}</>
              )}
            </div>
          </div>
        </div>
        <div className='mt-10'>
          <div className='flex flex-col items-center justify-between gap-8 md:flex-row'>
            <div className='rounded-lg bg-black/50 p-8'>
              <h1 className='text-3xl font-bold'>Additional Information</h1>
              <div className='grid grid-cols-2 gap-8 md:grid-cols-3'>
                <div>
                  <h2 className='font-bold'>Age</h2>
                  <div>{characterInfo.age ?? 'N/A'}</div>
                </div>
                <div>
                  <h2 className='font-bold'>Birthday</h2>
                  <div>
                    {characterInfo.dateOfBirth?.day &&
                    characterInfo.dateOfBirth.month
                      ? `${characterInfo.dateOfBirth.day}/${characterInfo.dateOfBirth.month}${`${characterInfo.dateOfBirth.year ? '/'.concat(String(characterInfo.dateOfBirth.year)) : ''}`}`
                      : 'N/A'}
                  </div>
                </div>
                <div>
                  <h2 className='font-bold'>Gender</h2>
                  <div>{characterInfo.gender ?? 'N/A'}</div>
                </div>
                <div>
                  <h2 className='font-bold'>Blood Type</h2>
                  <div>{characterInfo.bloodType ?? 'N/A'}</div>
                </div>
                <div>
                  <h2 className='font-bold'>Native name</h2>
                  <div>{characterInfo.name.native ?? 'N/A'}</div>
                </div>
                <div>
                  <h2 className='font-bold'>Alternative Names</h2>
                  <div>
                    {characterInfo.name.alternative?.join(', ') ?? 'N/A'}
                  </div>
                </div>
              </div>
            </div>
            <div className='max-w-xl rounded-lg bg-black/50 p-8'>
              <h1 className='text-3xl font-bold'>Description</h1>
              <div
                dangerouslySetInnerHTML={{ __html: characterInfo.description! }}
              />
            </div>
          </div>
        </div>
        <div className='mt-10'>
          <h1 className='text-3xl font-bold'>Voice Actors</h1>
          <div className='flex gap-2'>
            {characterInfo.media.edges[0].voiceActors.map((voiceActor) => (
              <div key={voiceActor.id}>
                <Image
                  isBlurred
                  radius='sm'
                  className='max-h-[185px] min-h-[185px] min-w-[125px] max-w-[125px] object-cover md:max-h-[265px] md:min-h-[265px] md:min-w-[185px] md:max-w-[185px] lg:max-h-[265px] lg:min-h-[265px] lg:min-w-[185px] lg:max-w-[185px] xl:max-h-[265px] xl:min-h-[265px] xl:min-w-[185px] xl:max-w-[185px]'
                  src={voiceActor.image.large! ?? voiceActor.image.medium!}
                  alt={voiceActor.name.full ?? 'Voice Actor Image'}
                />
                <div className='line-clamp-1 min-w-[125px] max-w-[125px] text-lg font-bold md:min-w-[185px] md:max-w-[185px] lg:min-w-[185px] lg:max-w-[185px] xl:max-h-[265px] xl:min-w-[185px] xl:max-w-[185px]'>
                  {voiceActor.name.full ??
                    voiceActor.name.userPreferred ??
                    voiceActor.name.first}
                </div>
                <div className='line-clamp-1'>{voiceActor.languageV2}</div>
              </div>
            ))}
          </div>
        </div>
        <div className='mt-10'>
          <h1 className='text-3xl font-bold'>Anime</h1>
          <div className='flex gap-2'>
            <CharacterAnimeSlider animes={characterInfo.media.edges} />
          </div>
        </div>
      </div>
    </>
  );
}
