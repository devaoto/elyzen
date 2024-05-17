'use client';
import React from 'react';
import Link from 'next/link';
import { GithubIcon } from 'lucide-react';
import { DiscordLogoIcon } from '@radix-ui/react-icons';

function Footer() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();

  function getSeason(month: number) {
    if (month === 12 || month === 1 || month === 2) {
      return 'WINTER';
    } else if (month === 3 || month === 4 || month === 5) {
      return 'SPRING';
    } else if (month === 6 || month === 7 || month === 8) {
      return 'SUMMER';
    } else {
      return 'FALL';
    }
  }

  const format = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];

  function nextSeason(currentSeason: any) {
    const currentSeasonIndex = format.indexOf(currentSeason);
    const nextSeasonIndex = (currentSeasonIndex + 1) % format.length;
    return format[nextSeasonIndex];
  }

  return (
    <div>
      <footer className='mt-10 bg-[#151518]'>
        <div className='mx-auto w-full p-4 py-6 lg:max-w-[85%] lg:pb-3 lg:pt-8'>
          <div className='lg:flex lg:justify-between'>
            <div className='mb-6 lg:mb-0'>
              <Link href='/' className='flex w-fit items-center'>
                <p className='self-center whitespace-nowrap text-3xl font-medium dark:text-white'>
                  Elyzen
                </p>
              </Link>
              <p className='font-karla text-[0.7rem] text-[#ffffffb2] lg:w-[520px] lg:text-[0.8rem]'>
                This site does not store any files on our server, we are linked
                to the media which is hosted on 3rd party services.
              </p>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-2 sm:gap-6 lg:gap-16'>
              <div>
                <ul className='flex flex-col gap-2 text-[0.7rem] font-semibold text-[#ffffffb2] lg:text-[0.85rem] '>
                  <li className=''>
                    <Link
                      href={`/anime/catalog?season=${getSeason(month + 1)}&year=2024`}
                      className='hover:text-white'
                    >
                      This Season
                    </Link>
                  </li>
                  <li className=''>
                    <Link
                      href={`/catalog?season=${nextSeason(getSeason(month + 1))}&year=2024`}
                      className='hover:text-white'
                    >
                      Upcoming Season
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/catalog?format=MOVIE'
                      className='hover:text-white'
                    >
                      {' '}
                      Movies
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/catalog?format=TV'
                      className='hover:text-white'
                    >
                      {' '}
                      Tv Shows
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <ul className='flex flex-col gap-2 text-[0.7rem] font-semibold text-[#ffffffb2] lg:text-[0.85rem]'>
                  <li>
                    <Link href='/dmca' className='hover:text-white'>
                      {' '}
                      DMCA
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/privacy'
                      target='_blank'
                      className='!text-[0.8rem] !font-semibold hover:text-white'
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/terms'
                      target='_blank'
                      className='!text-[0.8rem] !font-semibold hover:text-white'
                    >
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className='bg-tersier mt-2 border-t border-white/5'></div>
        <div className='mx-auto w-full py-3 text-[0.7rem] text-[#ffffffb2] lg:flex lg:max-w-[83%] lg:items-center lg:justify-between lg:text-[0.8rem]'>
          <span className='ms-5 sm:text-center lg:ms-0'>
            © {year}{' '}
            <Link href='/' className='hover:text-white'>
              Elyzen
            </Link>{' '}
            | Made by <span className='font-bold'>codeblitz97, avalynndev</span>
          </span>
          <div className='mt-4 flex lg:mt-0 lg:justify-center'>
            <Link
              href='https://github.com/codeblitz97/elyzen'
              target='_blank'
              className=' ms-5 hover:text-gray-900 dark:hover:text-white lg:ms-0'
            >
              <GithubIcon />
              <span className='sr-only'>GitHub account</span>
            </Link>
            <Link
              href='https://discord.gg'
              target='_blank'
              className=' ms-5 hover:text-gray-900 dark:hover:text-white'
            >
              <DiscordLogoIcon />
              <span className='sr-only'>Discord community</span>
            </Link>
            <div className='ml-5 flex items-center'>
              <label className='relative cursor-pointer'>
                <div className="peer flex h-4 w-[40px] items-center rounded-full bg-[#EAEEFB]  text-xs font-bold text-[black] after:absolute after:flex after:h-6 after:w-6 after:items-center after:justify-center after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-['JP'] peer-checked:bg-[#EAEEFB] peer-checked:text-[#18181b] peer-checked:after:translate-x-3/4 peer-checked:after:border-white peer-checked:after:content-['EN']"></div>
              </label>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
