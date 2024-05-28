'use client';

import { SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from '@nextui-org/react';
import { ConsumetSearchResult } from '@/types/consumet';
import useDebounce from '@/hooks/useDebounce';
import Image from 'next/image';

export default function NavBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [searchResults, setSearchResults] =
    useState<ConsumetSearchResult | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [label, setLabel] = useState<string>('Spy x Family');

  const debouncedSearch = useDebounce(searchQuery, 1000);

  useEffect(() => {
    async function search(
      query: string
    ): Promise<ConsumetSearchResult | undefined> {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN!}/api/search/${query}`,
          { headers: { 'x-site': 'elyzen' } }
        );
        return (await response.json()) as ConsumetSearchResult;
      } catch (error) {
        console.log(error);
      }
    }

    const fetchSearchResults = async (query: string) => {
      if (query.trim() !== '') {
        const result = await search(query);
        setSearchResults(result as ConsumetSearchResult);
      } else {
        setSearchResults(null);
      }
    };

    fetchSearchResults(debouncedSearch);
  }, [debouncedSearch]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Navbar shouldHideOnScroll>
      <NavbarBrand>
        <Link href='/'>
          <h1 className='text-4xl font-extrabold'>
            Ely<span className='text-green-500'>Zen</span>
          </h1>
        </Link>
      </NavbarBrand>

      <NavbarContent justify='end'>
        <Dialog>
          <DialogTrigger>
            <SearchIcon className='size-5 md:size-8 lg:size-8' />
          </DialogTrigger>
          <DialogContent className='relative z-[3553535]'>
            <DialogDescription>
              <h1 className='text-2xl font-bold'>Search By Name</h1>
              <Input
                className='max-w-[200px]'
                onChange={handleSearchInputChange}
                placeholder='Naruto'
              />
              <div className='mt-10'>
                {searchResults && !('message' in searchResults) && (
                  <div className='max-h-[250px] overflow-y-scroll scrollbar-hide'>
                    {searchResults.results
                      .filter(
                        (s) =>
                          s.status !== 'Not yet aired' &&
                          s.status !== 'NOT_YET_RELEASED' &&
                          s.rating
                      )
                      .map((result) => (
                        <Link key={result.id} href={`/info/${result.id}`}>
                          <div className='hover:bg-base-200 mb-2 flex cursor-pointer items-center gap-2 duration-200'>
                            <Image
                              src={result.image}
                              alt={result.title.romaji}
                              width={1000}
                              height={1000}
                              className='max-h-[200px] max-w-[100px] object-cover'
                            />
                            <div>
                              <p style={{ color: result.color ?? 'crimson' }}>
                                {result.title.english
                                  ? result.title.english
                                  : result.title.romaji}
                              </p>
                              <p>Rating: {result.rating / 10 ?? 0.0}</p>
                              <p>
                                Total Episodes:{' '}
                                {result.currentEpisode ?? result.totalEpisodes}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    <p className='text-red-400'>
                      Some content has been filtered out. Use the catalog page
                      to get all.
                    </p>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </NavbarContent>
    </Navbar>
  );
}
