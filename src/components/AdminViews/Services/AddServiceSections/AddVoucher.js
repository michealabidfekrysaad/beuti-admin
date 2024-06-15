import React from 'react';
import { Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { DatePicker } from '@material-ui/pickers';
import PropTypes from 'prop-types';

export default function AddVoucher({
  voucherDate,
  setVoucherDate,
  setAllowVoucher,
  allowVoucher,
}) {
  const { messages } = useIntl();
  moment.locale('en');
  const handleDayPicker = (value) => {
    const start = moment(value).format('YYYY-MM-DD');
    setVoucherDate(start);
  };

  return (
    <>
      <Col xs={12}>
        <p className="container-box__controllers--header">
          {messages['voucher.title']}{' '}
          <span className="container-box__controllers--label__required">*</span>
        </p>
      </Col>
      <Col xs={12}>
        <div className="form-check container-box__controllers--checkDiv">
          <input
            className="form-check-input custom-color"
            type="checkbox"
            checked={allowVoucher}
            onChange={() => setAllowVoucher(!allowVoucher)}
            id="allowVoucher"
          />
          <label className="form-check-label" htmlFor="allowVoucher">
            {messages['spAdmin.service.add.allow.voucher']}
          </label>
        </div>
      </Col>
      <Col xs={4} className="mt-4 mb-2">
        <label htmlFor="endVoucherDate" className="container-box__controllers--label">
          {messages['spAdmin.service.add.end.voucher']}{' '}
          <span className="container-box__controllers--label__required">*</span>
        </label>
        <DatePicker
          className="date-focus w-75"
          value={voucherDate}
          //   label="Booking Day"
          variant="outlined"
          format="dd/MM/yyyy"
          onChange={handleDayPicker}
          autoOk="true"
          okLabel={null}
        />
      </Col>
    </>
  );
}

AddVoucher.propTypes = {
  voucherDate: PropTypes.string,
  setVoucherDate: PropTypes.func,
  setAllowVoucher: PropTypes.func,
  allowVoucher: PropTypes.bool,
};
