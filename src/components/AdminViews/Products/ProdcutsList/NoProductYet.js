import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import React from 'react';
import { Image, Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Routes } from 'constants/Routes';
import BeutiButton from 'Shared/inputs/BeutiButton';
const NoProductYet = () => {
  const { messages } = useIntl();
  const history = useHistory();
  return (
    <section className="emptytable">
      <Image src={toAbsoluteUrl('/empty.png')} />
      <div className="emptytable-title"> {messages['products.no.title']}</div>
      <div className="emptytable-description">{messages['products.no.description']}</div>
      <div>
        <BeutiButton
          text={messages['products.add']}
          type="button"
          className="settings-employee_header-add"
          onClick={() => history.push(Routes.productadd)}
        />
      </div>
    </section>
  );
};

export default NoProductYet;
