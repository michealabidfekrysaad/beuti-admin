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
      <Image src={toAbsoluteUrl('/voucher.svg')} />
      <div className="emptytable-title"> {messages['voucher.no.title']}</div>
      <div className="emptytable-description">{messages['voucher.no.description']}</div>
      <div>
        <BeutiButton
          text={messages['voucher.addVoucher']}
          type="button"
          className="settings-employee_header-add"
          onClick={() => history.push(Routes.addVoucher)}
        />
      </div>
    </section>
  );
};

export default NoOffersYet;
