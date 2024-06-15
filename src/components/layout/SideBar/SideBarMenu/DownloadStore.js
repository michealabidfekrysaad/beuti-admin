/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';
import { useIntl } from 'react-intl';

const DownloadStore = ({ name, image, linkDownload }) => {
  const { messages } = useIntl();

  return (
    <div className="downloadstores-body__item" onClick={() => window.open(linkDownload)}>
      <div className="downloadstores-body__item-text">
        <p className="downloadstores-body__item-text--download">
          {messages['beuti.downloadfrom']}
        </p>
        <p className="downloadstores-body__item-text--name">{name}</p>
      </div>
      <div className="downloadstores-body__item-image">
        <img alt={image} src={image} width={35} height={35} />
      </div>
    </div>
  );
};
DownloadStore.propTypes = {
  name: PropTypes.string,
  image: PropTypes.string,
  linkDownload: PropTypes.string,
};

export default DownloadStore;
