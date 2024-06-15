import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { LocaleContext } from 'providers/LanguageProvider';
import SelectInputMUI from 'Shared/inputs/SelectInputMUI';

function LocaleSwitch() {
  const { setLocale } = useContext(LocaleContext);
  const { locale, messages } = useIntl();
  const languages = [
    {
      key: 1,
      id: 'en',
      value: 'en',
      icon: '/assets/icons/flags/en.svg',
      text: messages['language.english'],
    },
    {
      key: 2,
      id: 'ar',
      value: 'ar',
      icon: '/assets/icons/flags/ar.svg',
      text: messages['language.arabic'],
    },
  ];
  return (
    <div className="select-language mx-4">
      <SelectInputMUI
        list={languages}
        value={languages?.find((ele) => ele?.value === locale)?.value}
        name="language"
        onChange={(e) => {
          setLocale(e.target.value);
        }}
      />
    </div>
  );
}

export default LocaleSwitch;
