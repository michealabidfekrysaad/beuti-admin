import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import React from 'react';
import { Image, Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Routes } from 'constants/Routes';
import BeutiButton from 'Shared/inputs/BeutiButton';
const NoOffersYet = () => {
  const { messages } = useIntl();
  const history = useHistory();
  return (
    <section className="emptytable">
      <Image src={toAbsoluteUrl('/empty.png')} />
      <div className="emptytable-title"> {messages['offers.no.title']}</div>
      <div className="emptytable-description">{messages['offers.no.description']}</div>
      <div>
        <BeutiButton
          text={messages['offers.add']}
          type="button"
          className="settings-employee_header-add"
          onClick={() => history.push(Routes.addOffer)}
        />
      </div>
    </section>
  );
};

export default NoOffersYet;
