import NextAuth, { AuthOptions, Profile } from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/db/db';
import { getServerSession } from 'next-auth';
import { JWT as JWTType } from 'next-auth/jwt';
import { Session as SessionType } from 'next-auth';

export const authOptions: AuthOptions = {
  // @ts-ignore
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    {
      id: 'AniListProvider',
      name: 'AniList',
      type: 'oauth',
      token: 'https://anilist.co/api/v2/oauth/token',
      authorization: {
        url: 'https://anilist.co/api/v2/oauth/authorize',
        params: { scope: '', response_type: 'code' },
      },
      userinfo: {
        url: 'https://graphql.anilist.co',
        async request(context) {
          const { data } = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${context.tokens.access_token}`,
              Accept: 'application/json',
            },
            body: JSON.stringify({
              query: `
                query {
                  Viewer {
                    id
                    name
                    avatar {
                      large
                      medium
                    }
                    bannerImage
                    createdAt
                    mediaListOptions {
                      animeList {
                        customLists
                      }
                    }
                  }
                }
              `,
            }),
          }).then((res) => res.json());

          const userLists = data.Viewer?.mediaListOptions.animeList.customLists;

          let customLists = userLists || [];

          if (!userLists?.includes('Watched Via Elyzen')) {
            customLists.push('Watched Via Elyzen');
            const fetchGraphQL = async (
              query: string,
              variables: Record<string, unknown>
            ) => {
              const response = await fetch('https://graphql.anilist.co/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(context.tokens.access_token && {
                    Authorization: `Bearer ${context.tokens.access_token}`,
                  }),
                  Accept: 'application/json',
                },
                body: JSON.stringify({ query, variables }),
              });
              return response.json();
            };

            const modifiedLists = async (lists: string[]) => {
              const setList = `
                mutation($lists: [String]){
                  UpdateUser(animeListOptions: { customLists: $lists }){
                    id
                  }
                }
              `;
              const data = await fetchGraphQL(setList, { lists });
              return data;
            };

            await modifiedLists(customLists);
          }

          return {
            token: context.tokens.access_token,
            name: data.Viewer.name,
            sub: data.Viewer.id,
            image: data.Viewer.avatar,
            createdAt: data.Viewer.createdAt,
            list: data.Viewer?.mediaListOptions.animeList.customLists,
          };
        },
      },
      clientId: process.env.ANILIST_CLIENT_ID as string,
      clientSecret: process.env.ANILIST_CLIENT_SECRET as string,
      profile(profile: any) {
        return {
          token: profile.token,
          id: profile.sub,
          name: profile?.name,
          image: profile.image,
          createdAt: profile?.createdAt,
          list: profile?.list,
        };
      },
    },
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWTType; user?: any }) {
      return { ...token, ...user };
    },
    async session({
      session,
      token,
    }: {
      session: SessionType;
      token: JWTType;
    }) {
      session.user = token;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export const getAuthSession = () => getServerSession(authOptions);

export { handler as GET, handler as POST };
