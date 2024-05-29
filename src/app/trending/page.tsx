'use client';

import CasualCard from '@/components/shared/CasualCard';
import { ExtendedAnimePage, getTrendingAnime } from '@/lib/clientSide';
import { useEffect, useState } from 'react';
import { Pagination, Input } from '@nextui-org/react';
import useDebounce from '@/hooks/useDebounce';
import dynamic from 'next/dynamic';

const SideBar = dynamic(() => import('@/components/SideBar'), { ssr: false });

export default function Trending() {
  const [animes, setAnimes] = useState<ExtendedAnimePage | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('');
  const debouncedPageInput = useDebounce(pageInput, 500);

  const fetchAnimes = async (page: number) => {
    const animes = await getTrendingAnime(page, 120);
    setAnimes(animes!);
  };

  useEffect(() => {
    fetchAnimes(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (debouncedPageInput) {
      const page = parseInt(debouncedPageInput, 10);
      if (!isNaN(page) && page > 0) {
        setCurrentPage(page);
      }
    }
  }, [debouncedPageInput]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleInputChange = (e: string) => {
    setPageInput(e);
  };

  return (
    <>
      <div className='absolute top-0'>
        <SideBar />
      </div>
      <div className='ml-0 md:ml-16 lg:ml-16 xl:ml-16 2xl:ml-16'>
        <h1 className='text-3xl font-bold'>Currently Trending</h1>
        <Input
          label='Enter page to navigate'
          value={pageInput}
          onValueChange={handleInputChange}
          className='mb-10 max-h-[50px] max-w-[200px]'
        />
        <div className='grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6'>
          {animes?.results.map((anime) => (
            <div className='' key={anime.id}>
              <CasualCard anime={anime} />
            </div>
          ))}
        </div>
        <div className='mt-5 flex w-full justify-center'>
          <Pagination
            total={animes?.totalPages || 1}
            initialPage={animes?.currentPage || 1}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
