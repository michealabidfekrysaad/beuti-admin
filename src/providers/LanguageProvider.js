import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';

export const LocaleContext = React.createContext();

const LanguageProvider = ({ messages, children }) => {
  const [locale, setLocale] = useState(localStorage.locale || 'ar');

  useEffect(() => {
    const body = document.getElementById('body');
    const html = document.getElementById('html');
    localStorage.setItem('locale', locale);

    body.dir = locale === 'ar' ? 'rtl' : 'ltr';
    html.lang = locale === 'ar' ? 'ar' : 'en';
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <IntlProvider locale={locale} key={locale} messages={messages[locale]}>
        {React.Children.only(children)}
      </IntlProvider>
    </LocaleContext.Provider>
  );
};

LanguageProvider.propTypes = {
  messages: PropTypes.object,
  children: PropTypes.element.isRequired,
};

export default LanguageProvider;
