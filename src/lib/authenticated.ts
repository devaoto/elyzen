import { toast } from 'sonner';

interface SaveProgressResponse {
  SaveMediaListEntry: {
    id: number;
    mediaId: number;
    progress: number;
    status: string;
  };
}

export interface AnilistUserResponse {
  User: {
    about: string;
    avatar: {
      large: string;
      medium: string;
    };
    bannerImage: string;
    createdAt: number;
    donatorBadge: string;
    donatorTier: number;
    id: number;
    name: string;
    updatedAt: number;
  };
}

const executeGraphQlQuery = async <T = any>(
  authToken: string | null,
  gqlQuery: string,
  queryVariables: Record<string, any>
): Promise<{ data?: T; errors?: any } | null> => {
  try {
    const response = await fetch('https://graphql.anilist.co/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify({ query: gqlQuery, variables: queryVariables }),
    });

    return response.json();
  } catch (error) {
    console.error('An error occurred, please try again later');
    return null;
  }
};

export const saveProgress = async (
  authToken: string | null,
  mediaId: number,
  progress: number
): Promise<void> => {
  const updateListProgressMutation = `
        mutation($mediaId: Int, $progress: Int, $progressVolumes: Int) {
            SaveMediaListEntry(mediaId: $mediaId, progress: $progress, progressVolumes: $progressVolumes) {
                id
                mediaId
                progress
                status
            }
        }
    `;
  const variables = {
    mediaId: mediaId,
    progress: progress,
    progressVolumes: 0,
  };

  try {
    const response = await executeGraphQlQuery<SaveProgressResponse>(
      authToken,
      updateListProgressMutation,
      variables
    );
    if (response && response.data) {
      toast.success('Episode progress saved successfully');
    } else {
      toast.error('Failed to save episode progress');
    }
  } catch (error) {
    console.error('An error occurred while updating the list');
    toast.error('An error occurred while updating the list');
  }
};

export const getAnilistUser = async (
  token: string,
  name: string
): Promise<{ data?: AnilistUserResponse; errors?: any } | null> => {
  const query = `query($name: String)  {
  User(name: $name) {
    about
    avatar {
      large
      medium
    }
    bannerImage
    createdAt
    donatorBadge
    donatorTier
    id
    name
    updatedAt
  }
}`;

  return executeGraphQlQuery<AnilistUserResponse>(token, query, { name });
};
