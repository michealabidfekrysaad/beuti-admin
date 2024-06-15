/**
 * set the project's default locale here
 */

export const DEFAULT_LOCALE = localStorage.getItem('locale') || 'ar';

export const english = {
  language: 'english',
  locale: 'en',
  abbreviation: { capital: 'En', small: 'en' },
};

export const arabic = {
  language: 'arabic',
  locale: 'ar',
  abbreviation: { capital: 'Ar', small: 'ar' },
};

export const languages = [english, arabic];
