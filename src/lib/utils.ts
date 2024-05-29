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
export function getCurrentSeason(): 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER' {
  // Get the current month
  const month = new Date().getMonth() + 1; // Adding 1 to get 1-indexed month

  // Determine the season based on the month
  switch (true) {
    case month >= 3 && month <= 5:
      return 'SPRING';
    case month >= 6 && month <= 8:
      return 'SUMMER';
    case month >= 9 && month <= 11:
      return 'FALL';
    default:
      return 'WINTER';
  }
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
