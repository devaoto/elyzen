import { use } from 'react';
import { getAuthSession } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Image } from '@nextui-org/react';
import { getRelativeTime } from '@/lib/utils';
import dynamic from 'next/dynamic';

const SideBar = dynamic(() => import('@/components/SideBar'), { ssr: false });

export default function Profile() {
  const profile = use(getAuthSession());

  if (!profile || !profile.user) redirect('/');

  console.log(profile.user);

  const { name, image, createdAt, bannerImage } = profile.user as unknown as {
    name: string;
    image: { large: string; medium: string };
    bannerImage?: string;
    createdAt: number;
  };
  const profilePicture = image?.large || image?.medium || null;

  return (
    <>
      <div className='absolute top-0 h-screen w-[50px] bg-background'>
        <SideBar />
      </div>

      <div className='min-h-screen bg-background text-foreground'>
        {bannerImage ? (
          <Image
            radius='none'
            className='h-56 w-full object-cover sm:h-72 md:h-96'
            src={bannerImage}
            draggable={false}
            alt={`Banner image ${name}`}
          />
        ) : (
          <>
            <div className='h-56 w-full bg-[#00FF7F] object-cover sm:h-72 md:h-96' />
          </>
        )}
        <div className='flex flex-col items-center p-6'>
          {profilePicture && (
            <img
              src={profilePicture}
              alt={`Profile picture of ${name}`}
              className='-mt-16 h-32 w-32 rounded-full border-4 border-white dark:border-gray-900 sm:h-40 sm:w-40 md:h-48 md:w-48'
            />
          )}
          <h1 className='mt-4 text-2xl font-semibold sm:text-3xl md:text-4xl'>
            {name}
          </h1>
          <p className='mt-2 text-sm text-gray-600 dark:text-gray-400 sm:text-base md:text-lg'>
            Joined {getRelativeTime(createdAt)}
          </p>
        </div>
      </div>
    </>
  );
}
