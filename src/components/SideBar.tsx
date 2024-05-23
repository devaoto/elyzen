'use client';

import {
  FlameIcon,
  HomeIcon,
  Menu,
  SettingsIcon,
  StarIcon,
} from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from './ui/tooltip';
import { ModeToggle } from './ThemeToggle';
import useDeviceDetector from '@/hooks/useDeviceDetector';
import { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import { Button } from './ui/button';
import Link from 'next/link';
import { Separator } from './ui/separator';

export default function SideBar() {
  const device = useDeviceDetector();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    setIsMobile(device === 'mobile');
  }, [device]);

  return (
    <>
      {!isMobile ? (
        <div className='fixed z-[999999] flex h-screen flex-col items-center gap-2 px-1 pt-10'>
          <div className='flex flex-col gap-2 self-start'>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Link href='/'>
                      <Button variant={'outline'} size={'icon'}>
                        <HomeIcon />
                      </Button>
                    </Link>
                  </div>
                </TooltipTrigger>
                <TooltipContent side='right'>
                  <p>Home</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <ModeToggle />
                  </div>
                </TooltipTrigger>
                <TooltipContent side='right'>
                  <p>Theme</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className='my-auto flex flex-col gap-2'>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <Button variant={'outline'} size='icon'>
                      <FlameIcon className='hover:fill-slate-200' />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side='right'>
                  <p>Trending</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <Button variant={'outline'} size='icon'>
                      <StarIcon className='hover:fill-slate-200' />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side='right'>
                  <p>Popular</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className='mb-2 flex flex-col gap-2 self-end'>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <Button variant={'outline'} size='icon'>
                      <SettingsIcon />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side='right'>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      ) : (
        <div className='fixed left-2 top-12 z-[999999]'>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant='ghost'>
                <Menu />
              </Button>
            </DrawerTrigger>
            <DrawerContent className='sticky z-[388484]'>
              <div className='flex flex-col gap-3'>
                <div className='flex items-center gap-1'>
                  <Link href='/'>
                    <Button variant={'outline'} size={'icon'}>
                      <HomeIcon />
                    </Button>
                  </Link>{' '}
                  <span className='font-bold'>Home</span>
                </div>
                <div className='flex items-center gap-1'>
                  <span>
                    <ModeToggle />
                  </span>{' '}
                  <span className='font-bold'>Change Theme</span>
                </div>
                <Separator className='my-2' />
                <div className='flex items-center gap-1'>
                  <span>
                    <Button variant={'outline'} size={'icon'}>
                      <FlameIcon />
                    </Button>
                  </span>
                  <span className='font-bold'>Trending</span>
                </div>
                <div className='flex items-center gap-1'>
                  <span>
                    <Button variant={'outline'} size={'icon'}>
                      <StarIcon />
                    </Button>
                  </span>
                  <span className='font-bold'>Popular</span>
                </div>
                <Separator className='my-2' />
                <div className='flex items-center gap-1'>
                  <span>
                    <Button variant={'outline'} size={'icon'}>
                      <SettingsIcon />
                    </Button>
                  </span>
                  <span className='font-bold'>Settings</span>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </>
  );
}
