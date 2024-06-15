import React from 'react';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import moment from 'moment';

const VoucherInfo = ({ voucher }) => {
  const { messages, locale } = useIntl();
  return (
    <Row className="voucherdetails">
      <Col lg={8} md={6} xs={12}>
        <h3 className="voucherdetails__title">
          {voucher?.code}
          <span className="voucherdetails__status">
            {voucher?.status === 1 && (
              <span className="text-warning">
                {messages['offers.table.status.upcoming']}
              </span>
            )}
            {voucher?.status === 2 && (
              <span className="text-success">
                {messages['offers.table.status.active']}
              </span>
            )}
            {voucher?.status === 3 && (
              <span className="text-danger">
                {messages['offers.table.status.expired']}
              </span>
            )}
          </span>
        </h3>
        <p className="voucherdetails__date">
          {` ${moment(voucher?.startDate)
            .locale(locale)
            .format('D MMM YYYY')} - ${moment(voucher?.expirationDate)
            .locale(locale)
            .format('D MMM YYYY')}`}
        </p>
      </Col>
      <Col
        xs="auto"
        className={`voucherdetails__price ${voucher?.status === 3 ? 'expired' : ''}`}
      >
        <span className="voucherdetails__price-number">{voucher?.value}</span>
        <span className="voucherdetails__price-currency">
          {messages['common.currency']}
        </span>
      </Col>
    </Row>
  );
};

VoucherInfo.propTypes = {
  voucher: PropTypes.object,
};

export default VoucherInfo;
