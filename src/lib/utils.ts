import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomElement<T>(arr: T[]): T | undefined {
  if (arr.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

export function numberToMonth(num: number): string {
  // Use a switch statement to match the input number to the corresponding month
  switch (num) {
    case 1:
      return 'January';
    case 2:
      return 'February';
    case 3:
      return 'March';
    case 4:
      return 'April';
    case 5:
      return 'May';
    case 6:
      return 'June';
    case 7:
      return 'July';
    case 8:
      return 'August';
    case 9:
      return 'September';
    case 10:
      return 'October';
    case 11:
      return 'November';
    case 12:
      return 'December';
    default:
      return 'January';
  }
}

export function darkHexColor(hex: string, percent: number): string {
  // Remove the '#' character if present
  hex = hex.replace('#', '');

  // Parse the hexadecimal color value
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Darken the color
  r = Math.floor(r * (1 - percent / 100));
  g = Math.floor(g * (1 - percent / 100));
  b = Math.floor(b * (1 - percent / 100));

  // Ensure the values are within the valid range [0, 255]
  r = Math.min(Math.max(0, r), 255);
  g = Math.min(Math.max(0, g), 255);
  b = Math.min(Math.max(0, b), 255);

  // Convert the decimal values to hexadecimal
  const darkHex =
    '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

  return darkHex;
}

/**
 * getCurrentSeason function returns the current season based on the current month.
 * The seasons are determined based on the following months:
 * - Spring: March, April, May
 * - Summer: June, July, August
 * - Fall: September, October, November
 * - Winter: December, January, February
 * @returns The current season as a string: 'SPRING', 'SUMMER', 'FALL', or 'WINTER'.
 */
export function getCurrentSeason(month?: number): string {
  month = month ? month : new Date().getMonth();

  const seasons = ['Winter', 'Spring', 'Summer', 'Fall'];

  if (month < 1 || month > 12) {
    throw new Error('Month must be between 1 and 12');
  }

  const index = Math.floor(((month % 12) / 12) * 4) % 4;
  return seasons[index];
}

export function convertStatus(
  status: string
): 'RELEASING' | 'FINISHED' | 'NOT_YET_RELEASED' | 'HIATUS' | 'CANCELLED' {
  switch (status) {
    case 'Ongoing':
    case 'RELEASING':
      return 'RELEASING';
    case 'FINISHED':
    case 'Aired':
      return 'FINISHED';
    case 'NOT_YET_RELEASED':
    case 'Not yet aired':
      return 'NOT_YET_RELEASED';
    case 'HIATUS':
    case 'Hiatus':
      return 'HIATUS';
    case 'CANCELLED':
    case 'Cancelled':
      return 'CANCELLED';
    default:
      return 'RELEASING';
  }
}

export function hexToRgb(hex: string) {
  hex = hex.replace(/^#/, '');

  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  return { r, g, b };
}

export function getBrightnessScore(hex: string) {
  let { r, g, b } = hexToRgb(hex);

  let brightness = Math.sqrt(
    0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)
  );

  return Math.round((brightness / 255) * 100);
}

/**
 * Calculates the relative time between the current time and the given creation time.
 *
 * @param {number} createdAt - The creation time in seconds since the epoch.
 * @return {string} The formatted relative time, such as "1 min ago", "3 days ago", etc.
 */
export function getRelativeTime(createdAt: number): string {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const timeDifference = currentTimestamp - createdAt;
  let formattedRelativeTime = '';

  if (timeDifference < 60) {
    formattedRelativeTime = `${timeDifference} sec ago`;
  } else if (timeDifference < 60 * 60) {
    const minutes = Math.floor(timeDifference / 60);
    formattedRelativeTime = `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
  } else if (timeDifference < 24 * 60 * 60) {
    const hours = Math.floor(timeDifference / (60 * 60));
    formattedRelativeTime = `${hours} hr${hours !== 1 ? 's' : ''} ago`;
  } else if (timeDifference < 7 * 24 * 60 * 60) {
    const days = Math.floor(timeDifference / (60 * 60 * 24));
    formattedRelativeTime = `${days} day${days !== 1 ? 's' : ''} ago`;
  } else if (timeDifference < 30 * 24 * 60 * 60) {
    const weeks = Math.floor(timeDifference / (7 * 24 * 60 * 60));
    formattedRelativeTime = `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  } else if (timeDifference < 365 * 24 * 60 * 60) {
    const months = Math.floor(timeDifference / (30 * 24 * 60 * 60));
    formattedRelativeTime = `${months} month${months !== 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(timeDifference / (365 * 24 * 60 * 60));
    formattedRelativeTime = `${years} year${years !== 1 ? 's' : ''} ago`;
  }

  return formattedRelativeTime;
}

/**
 * Formats a given timestamp into a readable date string.
 *
 * @param {number} timestamp - The timestamp to be formatted.
 * @return {string} The formatted date string in the format "day month year".
 */
export function formatTimestamp(timestamp: number): string {
  const milliseconds = timestamp * 1000;
  const date = new Date(milliseconds);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formattedDate = date.toLocaleDateString('en-US', options);
  return formattedDate;
}
