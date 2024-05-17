export async function mergeEpisodeMetadata(
  episodeData: any,
  imageData: any
): Promise<any> {
  const episodeImages = {};

  imageData.forEach((image: any) => {
    (episodeImages as any)[image.number! || image.episode!] = image;
  });

  for (const providerEpisodes of episodeData) {
    const episodesArray = Array.isArray(providerEpisodes.episodes)
      ? providerEpisodes.episodes
      : [
          ...(providerEpisodes.episodes.sub || []),
          ...(providerEpisodes.episodes.dub || []),
        ];

    for (const episode of episodesArray) {
      const episodeNum = episode.number;
      if ((episodeImages as any)[episodeNum]) {
        const img =
          (episodeImages as any)[episodeNum].img ||
          (episodeImages as any)[episodeNum].image;
        let title;
        if (typeof (episodeImages as any)[episodeNum]?.title === 'object') {
          const en = (episodeImages as any)[episodeNum]?.title?.en;
          const xJat = (episodeImages as any)[episodeNum]?.title?.['x-jat'];
          title = en || xJat || `Episode ${episodeNum}`;
        } else {
          title = (episodeImages as any)[episodeNum]?.title || '';
        }

        const description =
          (episodeImages as any)[episodeNum].description ||
          (episodeImages as any)[episodeNum].overview ||
          (episodeImages as any)[episodeNum].summary;
        Object.assign(episode, { img, title, description });
      }
    }
  }

  return episodeData;
}
