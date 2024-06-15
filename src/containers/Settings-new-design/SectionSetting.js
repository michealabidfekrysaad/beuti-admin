/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';

export default function SectionSetting({ image, header, info, link, hint, onClick }) {
  const history = useHistory();
  const { locale } = useIntl();

  return (
    <section className="setting-tab">
      <div
        className="sectionSetting"
        onClick={(e) => (link ? history.push(link) : onClick(e))}
      >
        <div className="sectionSetting--leftDiv">
          {image?.includes('svg') ? (
            <div className="sectionSetting-svg">
              <SVG src={toAbsoluteUrl(image)} />
            </div>
          ) : (
            <img src={image} alt={image} className="sectionSetting--leftDiv__image" />
          )}

          <div className="sectionSetting--leftDiv__headingDiv">
            <h6 className="font-weight-bold">
              {header} <span>{hint}</span>
            </h6>
            <p>{info}</p>
          </div>
        </div>
        <div>
          <i className={`${locale === 'ar' ? 'flaticon2-back' : 'flaticon2-next'}`}></i>
        </div>
      </div>
    </section>
  );
}
