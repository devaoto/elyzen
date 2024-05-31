import { NextRequest, NextResponse } from 'next/server';

function constructSearchQuery(url: URL) {
  const params = url.searchParams;

  const query = params.get('query');
  const type = params.get('type');
  const page = params.get('page');
  const perPage = params.get('perPage');
  const season = params.get('season');
  const format = params.get('format');
  const sort = params.getAll('sort');
  const genres = params.getAll('genres');
  const id = params.get('id');
  const year = params.get('year');
  const status = params.get('status');

  let searchParams = new URLSearchParams();

  if (query) searchParams.set('query', query);
  if (type) searchParams.set('type', type);
  if (page) searchParams.set('page', page);
  if (perPage) searchParams.set('perPage', perPage);
  if (season) searchParams.set('season', season);
  if (format) searchParams.set('format', format);
  if (sort && sort.length > 0) {
    const validSort = sort.filter((item) => item);
    if (validSort.length > 0)
      searchParams.set('sort', JSON.stringify(validSort));
  }
  if (genres && genres.length > 0) {
    const validGenres = genres.filter((genre) => genre);
    if (validGenres.length > 0)
      searchParams.set('genres', JSON.stringify(validGenres));
  }
  if (id) searchParams.set('id', id);
  if (year) searchParams.set('year', year);
  if (status) searchParams.set('status', status);

  return searchParams.toString();
}

export const GET = async (request: NextRequest) => {
  try {
    const baseUrl = `${process.env.CONSUMET_API}/meta/anilist/advanced-search`;
    const url = new URL(request.url);

    const params = constructSearchQuery(url);

    const finalURL = `${baseUrl}?${params}`;

    const response = await fetch(finalURL);

    return NextResponse.json(await response.json());
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        status: 500,
      },
      { status: 500 }
    );
  }
};
