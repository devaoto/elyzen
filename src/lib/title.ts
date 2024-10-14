/* eslint-disable unicorn/no-array-for-each */
import * as stringSimilarity from 'fastest-levenshtein';

export type Result<T> = {
  title: string;
  sanitizedTitle?: string;
} & T;

type MatchResult<T> = {
  index: number;
  similarity: number;
  bestMatch: Result<T>;
  matchType: 'fuzzy' | 'strict' | 'loose';
};

type Title = {
  english?: string;
  romaji?: string;
  native?: string;
  userPreferred?: string;
};

export function sanitizeTitle(title: string): string {
  const sanitizedTitle = title ? title.toLowerCase() : '';
  let result = sanitizedTitle.replaceAll(/\b(season|cour|part)\b/g, '');
  result = result.replaceAll(/[^\d\sa-z]/g, '');
  result = result
    .replaceAll('yuu', 'yu')
    .replaceAll('ouh', 'oh')
    .replaceAll('yaa', 'ya')
    .replaceAll(/\b(uncut|uncensored|dub|censored|sub|dubbed|subbed)\b/g, '');
  result = result.normalize('NFD').replaceAll(/[\u0300-\u036F]/g, '');
  return result.trim().replaceAll(/\s+/g, ' ');
}

export function wordMatchPercentage(titleA: string, titleB: string): number {
  const wordsA = titleA.split(/\s+/);
  const wordsB = titleB.split(/\s+/);
  const matchingWords = wordsA.filter((wordA) => wordsB.includes(wordA)).length;
  return matchingWords / Math.max(wordsA.length, wordsB.length);
}

export function hasExtraWords(
  titleA: string,
  titleB: string,
  maxExtraWords = 2
): boolean {
  const wordsA = titleA.split(/\s+/);
  const wordsB = titleB.split(/\s+/);
  return Math.abs(wordsA.length - wordsB.length) > maxExtraWords;
}

export function hasMatchingNumbers(titleA: string, titleB: string): boolean {
  const numberPattern = /\d+/g;
  const numbersA =
    titleA.match(numberPattern) || ([] as unknown as RegExpMatchArray);
  const numbersB =
    titleB.match(numberPattern) || ([] as unknown as RegExpMatchArray);
  return (
    numbersA.some((num) => numbersB.includes(num)) ||
    (numbersA.length === 0 && numbersB.length === 0)
  );
}

export function hasMatchingSubDub(titleA: string, titleB: string): boolean {
  const subDubPattern = /\b(sub|dub)\b/i;
  const subDubA = titleA.match(subDubPattern);
  const subDubB = titleB.match(subDubPattern);
  return (
    (!subDubA && !subDubB) ||
    (subDubA &&
      subDubB &&
      subDubA[0].toLowerCase() === subDubB[0].toLowerCase())!
  );
}

function strictMatch<T = unknown>(
  sanitizedResults: Result<T>[],
  sanitizedTitleOptions: string[]
): MatchResult<T> | null {
  const matchedResult = sanitizedResults.find((sanitizedResult) =>
    sanitizedTitleOptions.includes(sanitizedResult.sanitizedTitle!)
  );
  return matchedResult
    ? {
        index: sanitizedResults.indexOf(matchedResult),
        similarity: 1,
        bestMatch: matchedResult,
        matchType: 'strict',
      }
    : null;
}

function looseMatch<T = unknown>(
  sanitizedResults: Result<T>[],
  sanitizedTitleOptions: string[]
): MatchResult<T> | null {
  const index = sanitizedResults.findIndex(
    ({ sanitizedTitle: resultTitle }) => {
      return sanitizedTitleOptions.some(
        (sanitizedTitle) =>
          wordMatchPercentage(resultTitle!, sanitizedTitle) >= 0.8 &&
          !hasExtraWords(resultTitle!, sanitizedTitle) &&
          hasMatchingNumbers(resultTitle!, sanitizedTitle) &&
          hasMatchingSubDub(resultTitle!, sanitizedTitle)
      );
    }
  );

  if (index === -1) {
    return null;
  }

  const bestMatch = sanitizedResults.find(({ sanitizedTitle: resultTitle }) => {
    return sanitizedTitleOptions.some(
      (sanitizedTitle) =>
        wordMatchPercentage(resultTitle!, sanitizedTitle) >= 0.8 &&
        !hasExtraWords(resultTitle!, sanitizedTitle) &&
        hasMatchingNumbers(resultTitle!, sanitizedTitle) &&
        hasMatchingSubDub(resultTitle!, sanitizedTitle)
    );
  });

  if (!bestMatch) {
    return null;
  }

  return {
    index,
    similarity: 0.8,
    bestMatch,
    matchType: 'loose',
  };
}

function fuzzyMatch<T = unknown>(
  sanitizedResults: Result<T>[],
  sanitizedTitleOptions: string[]
): MatchResult<T> | null {
  let bestMatchIndex = -1;
  let highestSimilarity = 0;
  const similarityThreshold = 0.7;

  sanitizedResults.forEach((result, index) => {
    let bestSimilarity = 0;

    sanitizedTitleOptions.forEach((sanitizedTitle) => {
      const distance = stringSimilarity.distance(
        result.sanitizedTitle!,
        sanitizedTitle
      );
      const similarity =
        1 -
        distance /
          Math.max(result.sanitizedTitle!.length, sanitizedTitle.length);

      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
      }
    });

    if (bestSimilarity > highestSimilarity) {
      highestSimilarity = bestSimilarity;
      bestMatchIndex = index;
    }
  });

  return highestSimilarity >= similarityThreshold
    ? {
        index: bestMatchIndex,
        similarity: highestSimilarity,
        bestMatch: sanitizedResults[bestMatchIndex],
        matchType: 'fuzzy',
      }
    : null;
}

function getSanitizedTitleOptions(title: Title): string[] {
  return [
    sanitizeTitle(title.romaji ?? ''),
    sanitizeTitle(title.english ?? ''),
    sanitizeTitle(title.native ?? ''),
    sanitizeTitle(title.userPreferred ?? ''),
  ].filter(Boolean);
}

function findMatch<T>(
  sanitizedResults: Result<T>[],
  sanitizedTitleOptions: string[]
): MatchResult<T> | null {
  return (
    strictMatch(sanitizedResults, sanitizedTitleOptions) ||
    looseMatch(sanitizedResults, sanitizedTitleOptions) ||
    fuzzyMatch(sanitizedResults, sanitizedTitleOptions)
  );
}

export function findBestMatchedAnime<T = unknown>(
  title: Title | undefined,
  titles: Result<T>[] | undefined
): MatchResult<T> | null {
  if (!title || !titles || titles.length === 0) return null;

  const sanitizedTitleOptions = getSanitizedTitleOptions(title);
  if (sanitizedTitleOptions.length === 0) return null;

  const sanitizedResults = titles.map((result) => ({
    ...result,
    sanitizedTitle: sanitizeTitle(result.title as string),
  }));

  return findMatch(sanitizedResults, sanitizedTitleOptions);
}
