/* eslint-disable  */

import React from 'react';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import { Image } from 'react-bootstrap';
import { useIntl } from 'react-intl';

export default function NoDataFound({ src, title, subTitle }) {
  const { messages } = useIntl();
  return (
    <section className="emptytable">
      <Image src={toAbsoluteUrl(src)} />
      <div className="emptytable-title"> {messages[title]}</div>
      <div className="emptytable-description">{messages[subTitle]}</div>
    </section>
  );
}
