import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import React from 'react';
import { Image, Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Routes } from 'constants/Routes';
import BeutiButton from 'Shared/inputs/BeutiButton';
const NoOInvoicesYet = () => {
  const { messages } = useIntl();
  const history = useHistory();
  return (
    <section className="emptytable">
      <Image src={toAbsoluteUrl('/empty.png')} />
      <div className="emptytable-title"> {messages['Invoice.no.title']}</div>
      <div className="emptytable-description">{messages['Invoice.no.description']}</div>
    </section>
  );
};

export default NoOInvoicesYet;
