'use client';

import CasualCard from '@/components/shared/CasualCard';
import { Input, RadioGroup, Radio, Button } from '@nextui-org/react';
import useDebounce from '@/hooks/useDebounce';
import React from 'react';
import { ExtendedAnimePage } from '@/lib/clientSide';

export default function Catalog() {
  const [result, setResult] = React.useState<ExtendedAnimePage | null>(null);
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
  const [season, setSeason] = React.useState<string | null>(null);
  const [year, setYear] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState<string>('');
  const [format, setFormat] = React.useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 1000);
  const debouncedYear = useDebounce(year, 1000);

  React.useEffect(() => {
    const fetchSearchResult = async () => {
      const params = new URLSearchParams();

      params.append('type', 'ANIME');
      if (debouncedQuery) {
        params.append('query', encodeURIComponent(debouncedQuery));
      }
      if (season) {
        params.append('season', season);
      }
      if (debouncedYear) {
        params.append('year', debouncedYear);
      }
      if (format) {
        params.append('format', format);
      }

      if (selectedGenres.length > 0) {
        selectedGenres.forEach((genre) => {
          params.append('genres', genre);
        });
      }

      const queryParams = params.toString();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/advancedSearch?${queryParams}`
      );
      const data = await res.json();
      setResult(data);
    };

    fetchSearchResult();
  }, [selectedGenres, season, debouncedYear, debouncedQuery, format]); // Refetch results when filters change

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((selectedGenre) => selectedGenre !== genre)
        : [...prevGenres, genre]
    );
  };

  const isGenreSelected = (genre: string) => selectedGenres.includes(genre);

  return (
    <div className='ml-5'>
      <h1 className='mb-20 text-3xl font-bold'>Catalog</h1>
      <div className='flex flex-col gap-4 lg:flex-row'>
        <div>
          <div className='mb-2 min-w-full max-w-full md:min-w-full md:max-w-full lg:min-w-[300px] lg:max-w-[300px]'>
            <Input
              label='Query'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className='mb-2 min-w-full max-w-full md:min-w-full md:max-w-full lg:min-w-[300px] lg:max-w-[300px]'>
            <Input
              color='primary'
              variant='bordered'
              label='Year (1998 - 2024)'
              value={year!}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className='min-w-full max-w-full rounded-lg bg-background/90 p-2 shadow-md md:min-w-full md:max-w-full lg:min-w-[300px] lg:max-w-[300px]'>
            <RadioGroup
              label='Select a season to search'
              color='primary'
              value={season as string | undefined}
              onValueChange={(value) => setSeason(value)}
            >
              <Radio value='SPRING'>Spring</Radio>
              <Radio value='SUMMER'>Summer</Radio>
              <Radio value='FALL'>Fall</Radio>
              <Radio value='WINTER'>Winter</Radio>
            </RadioGroup>
          </div>
          <div className='mt-2 min-w-full max-w-full rounded-lg bg-background/90 p-2 shadow-md md:min-w-full md:max-w-full lg:min-w-[300px] lg:max-w-[300px]'>
            <RadioGroup
              label='Select a format to search'
              color='primary'
              value={format}
              onValueChange={(value) => setFormat(value)}
            >
              <Radio value='TV'>TV</Radio>
              <Radio value='TV_SHORT'>TV Short</Radio>
              <Radio value='OVA'>OVA</Radio>
              <Radio value='ONA'>ONA</Radio>
              <Radio value='MOVIE'>Movie</Radio>
              <Radio value='SPECIAL'>Special</Radio>
              <Radio value='MUSIC'>Music</Radio>
            </RadioGroup>
          </div>
          <div className='mt-4 min-w-full max-w-full md:min-w-full md:max-w-full lg:min-w-[300px] lg:max-w-[300px]'>
            <h2 className='mb-2 text-lg font-semibold'>Genres</h2>
            <div className='flex flex-wrap gap-2'>
              {[
                'Action',
                'Adventure',
                'Cars',
                'Comedy',
                'Drama',
                'Fantasy',
                'Horror',
                'Mahou Shoujo',
                'Mecha',
                'Music',
                'Mystery',
                'Psychological',
                'Romance',
                'Sci-Fi',
                'Slice of Life',
                'Sports',
                'Supernatural',
                'Thriller',
              ].map((genre) => (
                <Button
                  key={genre}
                  variant={isGenreSelected(genre) ? 'solid' : 'ghost'}
                  onClick={() => toggleGenre(genre)}
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h1 className='text-2xl font-bold'>Search Results</h1>
          {result ? (
            <div className='grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4'>
              {result.results.length > 0 ? (
                <>
                  {result.results.map((anime) => {
                    return (
                      <div key={anime.id}>
                        <CasualCard anime={anime} />
                      </div>
                    );
                  })}
                </>
              ) : (
                <>
                  <div>No result found...</div>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
