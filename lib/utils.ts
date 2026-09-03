import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function pluralizeWords(count: number): string {
  const absCount = Math.abs(count) % 100;
  const lastDigit = absCount % 10;

  if (absCount > 10 && absCount < 20) {
    return `${count} слов`;
  }
  if (lastDigit > 1 && lastDigit < 5) {
    return `${count} слова`;
  }
  if (lastDigit === 1) {
    return `${count} слово`;
  }
  return `${count} слов`;
}