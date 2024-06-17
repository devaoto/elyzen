declare namespace NodeJS {
  interface ProcessEnv {
    REDIS_URI?: string;
    NEXT_PUBLIC_DOMAIN: string;
    HIANIME_API: string;
    CONSUMET_API: string;
    MALSYNC_URI: string;
    NEXT_PUBLIC_CORS_PROXY_URL?: string;
  }
}

// If bun supports NextJs any soon. Uncomment these codes

// declare module 'bun' {
//   interface Env {
//     REDIS_URI?: string;
//     NEXT_PUBLIC_DOMAIN: string;
//     HIANIME_API: string;
//     CONSUMET_API: string;
//     MALSYNC_URI: string;
//     NEXT_PUBLIC_CORS_PROXY_URL?: string;
//   }
// }
