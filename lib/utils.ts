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

export const SERVICE_WORDS: Record<string, Record<string, string>> = {
  en: {
    a: 'неопределенный артикль',
    an: 'неопределенный артикль',
    the: 'определенный артикль',
    to: 'к / в / частица инфинитива',
    of: 'из / предлог родит. падежа',
    in: 'в / внутри',
    on: 'на',
    at: 'в / около / при',
    for: 'для / в течение',
    with: 'с / вместе с',
    by: 'у / около / посредством',
    from: 'из / от',
    and: 'и',
    or: 'или',
    but: 'но / однако',
    if: 'если',
    so: 'так / поэтому',
    it: 'это / оно',
    is: 'есть / является (3 л. ед.ч.)',
    are: 'есть / являются (мн.ч.)',
    be: 'быть / являться',
    as: 'как / в качестве',
  },
  fr: {
    un: 'один / неопред. артикль',
    une: 'одна / неопред. артикль',
    des: 'неопред. артикль (мн. ч.)',
    le: 'опред. артикль (м.р.)',
    la: 'опред. артикль (ж.р.)',
    les: 'опред. артикль (мн. ч.)',
    du: 'частичный артикль',
    et: 'и',
    en: 'в / из',
    dans: 'в',
    au: 'в / к',
    aux: 'в / к',
  },
  tr: {
    ve: 'и',
    bir: 'один / неопред. артикль',
    bu: 'этот / эта',
    su: 'этот (близко)',
    o: 'он / она / оно / тот',
    da: 'тоже / также / в',
    de: 'тоже / также / в',
    ile: 'с / вместе с',
    ne: 'что',
  },
};
