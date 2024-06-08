'use client';

import {
  Input,
  RadioGroup,
  Radio,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from '@nextui-org/react';
import useDebounce from '@/hooks/useDebounce';
import React from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { ReturnData } from '@/types/animeData';
import { Card } from '@/components/shared/Card';

export default function Catalog() {
  const [result, setResult] = React.useState<ReturnData | null>(null);
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
  const [season, setSeason] = React.useState<string | null>(null);
  const [year, setYear] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState<string>('');
  const [format, setFormat] = React.useState<string | null>(null);
  const [sort, setSort] = React.useState<string[]>([]);

  const debouncedQuery = useDebounce(query, 1000);
  const debouncedYear = useDebounce(year, 1000);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setQuery(params.get('query') || '');
    setYear(params.get('year') || '');
    setSeason(params.get('season') || null);
    setFormat(params.get('format') || null);
    setSort(params.getAll('sort'));
    setSelectedGenres(params.getAll('genres'));
  }, []);

  React.useEffect(() => {
    const params = new URLSearchParams();

    params.append('type', 'ANIME');
    if (debouncedQuery) {
      params.append('query', debouncedQuery);
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
    if (sort.length > 0) {
      sort.forEach((s) => {
        params.append('sort', s);
      });
    }
    if (selectedGenres.length > 0) {
      selectedGenres.forEach((genre) => {
        params.append('genres', genre);
      });
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [
    debouncedQuery,
    season,
    debouncedYear,
    format,
    sort,
    selectedGenres,
    router,
    pathname,
  ]);

  React.useEffect(() => {
    const fetchSearchResult = async () => {
      const params = new URLSearchParams(window.location.search);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/advancedSearch?${params.toString()}`
      );
      const data = await res.json();
      setResult(data);
    };

    fetchSearchResult();
  }, [searchParams]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((selectedGenre) => selectedGenre !== genre)
        : [...prevGenres, genre]
    );
  };

  const isGenreSelected = (genre: string) => selectedGenres.includes(genre);

  const toggleSort = (value: string) => {
    setSort((prevSorts) =>
      prevSorts.includes(value)
        ? prevSorts.filter((selectedSort) => selectedSort !== value)
        : [...prevSorts, value]
    );
  };

  const isSortSelected = (value: string) => sort.includes(value);

  const sortOptions = [
    { label: 'Popularity Descending', value: 'POPULARITY_DESC' },
    { label: 'Popularity Ascending', value: 'POPULARITY' },
    { label: 'Trending Descending', value: 'TRENDING_DESC' },
    { label: 'Trending Ascending', value: 'TRENDING' },
    { label: 'Updated At Descending', value: 'UPDATED_AT_DESC' },
    { label: 'Updated At Ascending', value: 'UPDATED_AT' },
    { label: 'Start Date Descending', value: 'START_DATE_DESC' },
    { label: 'Start Date Ascending', value: 'START_DATE' },
    { label: 'End Date Descending', value: 'END_DATE_DESC' },
    { label: 'End Date Ascending', value: 'END_DATE' },
    { label: 'Favorites Descending', value: 'FAVOURITES_DESC' },
    { label: 'Favorites Ascending', value: 'FAVOURITES' },
    { label: 'Score Descending', value: 'SCORE_DESC' },
    { label: 'Score Ascending', value: 'SCORE' },
    { label: 'Title Romaji Descending', value: 'TITLE_ROMAJI_DESC' },
    { label: 'Title Romaji Ascending', value: 'TITLE_ROMAJI' },
    { label: 'Title English Descending', value: 'TITLE_ENGLISH_DESC' },
    { label: 'Title English Ascending', value: 'TITLE_ENGLISH' },
    { label: 'Title Native Descending', value: 'TITLE_NATIVE_DESC' },
    { label: 'Title Native Ascending', value: 'TITLE_NATIVE' },
    { label: 'Episodes Descending', value: 'EPISODES_DESC' },
    { label: 'Episodes Ascending', value: 'EPISODES' },
    { label: 'ID Descending', value: 'ID_DESC' },
    { label: 'ID Ascending', value: 'ID' },
  ];

  return (
    <div className='ml-5'>
      <h1 className='mb-20 text-3xl font-bold'>Catalog</h1>
      <div className='flex flex-col gap-4 lg:flex-row'>
        <div>
          <div className='mb-2 min-w-full max-w-full md:min-w-full md:max-w-full lg:min-w-[300px] lg:max-w-[300px]'>
            <Input
              label='Query'
              value={query ?? undefined}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className='mb-2 min-w-full max-w-full md:min-w-full md:max-w-full lg:min-w-[300px] lg:max-w-[300px]'>
            <Input
              color='primary'
              variant='bordered'
              label='Year (1998 - 2024)'
              value={year ?? undefined}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className='min-w-full max-w-full rounded-lg bg-background/90 p-2 shadow-md md:min-w-full md:max-w-full lg:min-w-[300px] lg:max-w-[300px]'>
            <RadioGroup
              label='Select a season to search'
              color='primary'
              value={season ?? undefined}
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
              value={format!}
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
          <div className='mt-2 min-w-full max-w-full rounded-lg bg-background/90 p-2 shadow-md md:min-w-full md:max-w-full lg:min-w-[300px] lg:max-w-[300px]'>
            <Dropdown>
              <DropdownTrigger>
                <Button variant='flat'>
                  Sort by:{' '}
                  {sort.length > 0
                    ? sort
                        .map(
                          (s) =>
                            sortOptions.find((option) => option.value === s)
                              ?.label
                        )
                        .join(', ')
                    : 'Select Sort'}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label='Sort Options'
                color='primary'
                selectionMode='multiple'
                selectedKeys={sort} /* @ts-ignore */
                onSelectionChange={(keys) => setSort([...keys])}
              >
                {sortOptions.map((option) => (
                  <DropdownItem key={option.value}>{option.label}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
                  onPress={() => toggleGenre(genre)}
                  color={isGenreSelected(genre) ? 'primary' : 'default'}
                  variant={isGenreSelected(genre) ? 'solid' : 'ghost'}
                  className='capitalize'
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className='flex-grow'>
          <h2 className='mb-4 text-2xl font-semibold'>Results</h2>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {result?.results.map((anime) => (
              <Card key={anime.id} anime={anime} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
