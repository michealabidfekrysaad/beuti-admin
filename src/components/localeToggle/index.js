import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Flag } from 'semantic-ui-react';
import { LocaleContext } from 'providers/LanguageProvider';
import { languages } from './constants';

function LocaleToggle({ flag, hidden, color }) {
  const { messages, locale } = useIntl();
  const { setLocale } = useContext(LocaleContext);

  return (
    <>
      {languages.map(
        (lang) =>
          lang.locale !== locale && (
            <div
              key={lang.locale}
              role="button"
              lang={lang.locale}
              tabIndex="0"
              onClick={(e) => setLocale(e.target.lang)}
              onKeyDown={(e) => setLocale(e.target.lang)}
              className="locale-toggle"
              style={{
                visibility: hidden ? 'hidden' : 'visible',
                color: color || 'black',
              }}
            >
              {flag && <Flag name={`${locale === 'ar' ? 'uk' : 'sa'}`} />}
              {messages[`language.${lang.language}`]}
            </div>
          ),
      )}
    </>
  );
}

LocaleToggle.propTypes = {
  flag: PropTypes.bool,
  color: PropTypes.any,
  hidden: PropTypes.bool,
};

export default LocaleToggle;
