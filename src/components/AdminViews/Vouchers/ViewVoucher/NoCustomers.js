import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import React from 'react';
import { Image } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

const NoCustomers = ({ notSent }) => {
  const { messages } = useIntl();
  return (
    <section className="emptytable">
      <Image src={toAbsoluteUrl('/customers.svg')} />
      <div className="emptytable-title">
        {notSent ? messages['voucher.notSend'] : messages['voucher.notResult']}
      </div>
    </section>
  );
};

export default NoCustomers;
NoCustomers.propTypes = {
  notSent: PropTypes.bool,
};
