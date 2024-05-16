'use client';

import { FlameIcon, Menu } from 'lucide-react';
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

export default function SideBar() {
  const device = useDeviceDetector();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    setIsMobile(device === 'mobile');
  }, [device]);

  return (
    <>
      {!isMobile ? (
        <div className="px-1 pt-10 h-screen fixed justify-center flex flex-col gap-2 items-center z-50 bg-background">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ModeToggle />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Theme</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div>
                  <Button variant={'outline'} size="icon">
                    <FlameIcon className="hover:fill-slate-200" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Trending</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        <div className="fixed z-[69421] top-0">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost">
                <Menu />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="sticky z-[388484]">
              <div className="flex gap-3 flex-col">
                <div className="flex gap-1 items-center">
                  <span>
                    <ModeToggle />
                  </span>{' '}
                  <span className="font-bold">Change Theme</span>
                </div>
                <div className="flex gap-1 items-center">
                  <span>
                    <Button variant={'outline'} size={'icon'}>
                      <FlameIcon />
                    </Button>
                  </span>
                  <span className="font-bold">Trending</span>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </>
  );
}
