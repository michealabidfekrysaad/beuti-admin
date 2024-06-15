/* eslint-disable  */

import React from 'react';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';

export default function EmptyData({ image, title, subTitle, btnName, onClickBtn }) {
  return (
    <div className="Empty-data">
      <div className="Empty-data__image">
        <SVG src={toAbsoluteUrl(image)} />
      </div>
      <div className="Empty-data__title">{title}</div>
      <div className="Empty-data__sub-title">{subTitle}</div>
      <div className="Empty-data__btn">
        {btnName && (
          <button type="button" className="Empty-data__btn--action" onClick={onClickBtn}>
            {btnName}
          </button>
        )}
      </div>
    </div>
  );
}
