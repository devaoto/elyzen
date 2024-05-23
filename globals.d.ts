declare namespace NodeJS {
  interface ProcessEnv {
    REDIS_URI?: string;
    NEXT_PUBLIC_DOMAIN: string;
    HIANIME_API: string;
    CONSUMET_API: string;
    MALSYNC_URI: string;
  }
}
