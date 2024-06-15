import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import React from 'react';
import { Image, Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Routes } from 'constants/Routes';
import BeutiButton from 'Shared/inputs/BeutiButton';
const NoCustomersYet = () => {
  const { messages } = useIntl();
  const history = useHistory();
  return (
    <section className="emptytable">
      <Image src={toAbsoluteUrl('/customers.svg')} />
      <div className="emptytable-title"> {messages['customer.no.title']}</div>
      <div className="emptytable-description">{messages['customer.no.description']}</div>
      <div>
        <BeutiButton
          text={messages['setting.customer.add']}
          type="button"
          className="settings-employee_header-add"
          onClick={() => history.push(Routes.addCustomer)}
        />
      </div>
    </section>
  );
};

export default NoCustomersYet;
