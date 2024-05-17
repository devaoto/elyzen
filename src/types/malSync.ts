export interface MalSyncSiteDetails {
  identifier: string | number;
  image: string;
  malId: number;
  aniId: number;
  page: string;
  title: string;
  type: string;
  url: string;
  external?: boolean;
}

export interface MalSyncAnime {
  id: number;
  type: string;
  title: string;
  url: string;
  total: number;
  image: string;
  malId: number;
  Sites: {
    [site: string]: Record<string, MalSyncSiteDetails>;
  };
}
