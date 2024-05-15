import { fetchAnilistInfo } from '@/lib/info';
import { use } from 'react';
import Image from 'next/image';
import { darkHexColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
export default function Information({ params }: { params: { id: string } }) {
  const info = use(fetchAnilistInfo(params));

  return (
    <>
      {
        <div className="overflow-x-hidden">
          <div className="relative">
            <div
              style={{
                backgroundColor:
                  darkHexColor(info?.color ? info?.color : '#00FF7F', 80) ??
                  'springgreen',
              }}
              className="overflow-x-hidden h-[620px] w-[1920px]"
            ></div>
            <div className="overflow-x-hidden absolute inset-0 z-[1]">
              {info.bannerImage ? (
                <Image
                  src={info.bannerImage}
                  alt={info.color!}
                  width={1920}
                  height={900}
                  className="min-h-[620px] object-cover [clip-path:polygon(44%_0,100%_0%,100%_100%,31%_100%)]"
                />
              ) : info.coverImage ? (
                <Image
                  src={info.coverImage}
                  alt={info.color! ?? info.title.english ?? info.title.romaji}
                  width={1920}
                  height={900}
                  className="max-h-[620px] min-h-[620px] min-w-[1920px] object-cover [clip-path:polygon(44%_0,100%_0%,100%_100%,31%_100%)]"
                />
              ) : null}
            </div>
            <div className="absolute inset-0 z-[2] bg-gradient-to-r from-transparent from-[80%] to-background" />
            <div className="absolute inset-0 z-[2] bg-gradient-to-l from-transparent from-[80%] to-background" />
            <div className="absolute inset-0 z-[2] bg-gradient-to-t from-transparent from-[80%] to-background" />
            <div className="absolute inset-0 z-[5] bg-gradient-to-b from-transparent to-background">
              <div className="flex flex-col justify-center h-full ml-10">
                <div className="flex flex-col items-center gap-4 md:flex-row lg:flex-row xl:flex-row">
                  <Image
                    src={info.coverImage!}
                    className="object-cover rounded-xl max-h-[400px]"
                    alt={info.title.english! ?? info.title.romaji!}
                    width={300}
                    height={500}
                  />
                  <div>
                    <h1
                      style={{ color: info.color ?? 'pink' }}
                      className="text-center text-3xl font-bold md:text-left lg:text-left"
                    >
                      {info.title.english ?? info.title.romaji}
                    </h1>
                    <h2 className="text-center text-2xl font-semibold md:text-left lg:text-left">
                      {info.title.romaji}
                    </h2>
                    <div className="flex mt-2 gap-3">
                      <Badge>EP {info.totalEpisodes}</Badge>
                      <Badge variant={'outline'}>{info.format}</Badge>
                    </div>
                    <Dialog>
                      <DialogTrigger>
                        <div
                          className="py-5 px-2 -ml-2 hover:bg-black/20 duration-300 rounded-lg mt-2 text-sm line-clamp-4 max-w-xl text-left"
                          dangerouslySetInnerHTML={{
                            __html: info.description?.replace(/<br>/g, '')!,
                          }}
                        />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogDescription className="max-h-80 text-lg overflow-y-scroll scrollbar-hide">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: info.description!,
                            }}
                          />
                        </DialogDescription>
                      </DialogContent>
                    </Dialog>
                    <div className="mt-2 flex justify-center md:justify-start xl:justify-start lg:justify-start">
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild className="cursor-no-drop">
                            <div>
                              <Button variant="outline" disabled>
                                Watch Now
                              </Button>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Not yet implemented</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}
