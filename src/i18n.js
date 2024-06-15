/** i18n setup */

/**
 * Getting messages
 */
const enTranslationMessages = require('translations/en.json');
const arTranslationMessages = require('translations/ar.json');

/**
 * Getting and saving default locale for the project
 * You can edit in constants file only
 */
const { DEFAULT_LOCALE } = require('constants/locale');
localStorage.setItem('locale', DEFAULT_LOCALE);

const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages =
    locale !== DEFAULT_LOCALE
      ? formatTranslationMessages(DEFAULT_LOCALE, enTranslationMessages)
      : {};
  const flattenFormattedMessages = (formattedMessages, key) => {
    const formattedMessage =
      !messages[key] && locale !== DEFAULT_LOCALE
        ? defaultFormattedMessages[key]
        : messages[key];
    return Object.assign(formattedMessages, { [key]: formattedMessage });
  };
  return Object.keys(messages).reduce(flattenFormattedMessages, {});
};

export const translationMessages = {
  en: formatTranslationMessages('en', enTranslationMessages),
  ar: formatTranslationMessages('ar', arTranslationMessages),
};
