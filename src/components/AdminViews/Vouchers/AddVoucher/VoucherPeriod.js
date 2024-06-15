import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';
import arLocale from 'date-fns/locale/ar-SA';
import enLocale from 'date-fns/locale/en-US';
import DateFnsUtils from '@date-io/date-fns';

import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
const OfferPeriod = ({ register, errors, setValue, watch, clearErrors }) => {
  const { messages, locale } = useIntl();

  return (
    <Row>
      <Col lg={8} md={6} xs={12} className="mb-5">
        <h3 className="settings__section-title">{messages['offers.period.title']}</h3>
        <p className="settings__section-description">
          {messages['voucher.period.description']}
        </p>
      </Col>
      <Col lg={8} md={8} xs={12}>
        <Row>
          <MuiPickersUtilsProvider
            utils={DateFnsUtils}
            locale={locale === 'ar' ? arLocale : enLocale}
          >
            <Col xs="6" className="mb-3">
              <div className="beuti-input">
                <label htmlFor="test" className="beuti-input__label">
                  {messages['offers.input.start']}*
                </label>
                <DatePicker
                  className="beuti-input__field "
                  value={watch('startDate')}
                  variant="inline"
                  format="dd/MM/yyyy"
                  onChange={(date) => {
                    if (
                      moment(watch('startDate'))
                        .startOf('day')
                        .valueOf() <=
                      moment(watch('endDate'))
                        .startOf('day')
                        .valueOf()
                    ) {
                      clearErrors('startDate');
                      clearErrors('endDate');
                    }
                    setValue('startDate', moment(date).format('YYYY-MM-DD'));
                  }}
                  autoOk="true"
                  error={errors?.startDate?.message}
                  helperText={errors?.startDate?.message}
                  minDate={new Date()}
                />
              </div>
            </Col>
            <Col xs="6" className="mb-3">
              <div className="beuti-input">
                <label htmlFor="test" className="beuti-input__label">
                  {messages['offers.input.end']}*
                </label>
                <DatePicker
                  className="beuti-input__field "
                  value={watch('endDate')}
                  variant="inline"
                  format="dd/MM/yyyy"
                  maxDate={new Date(watch('startDate')).setFullYear(
                    new Date().getFullYear() + 1,
                  )}
                  onChange={(date) => {
                    if (
                      moment(watch('startDate'))
                        .startOf('day')
                        .valueOf() <=
                      moment(watch('endDate'))
                        .endOf('day')
                        .valueOf()
                    ) {
                      clearErrors('startDate');
                      clearErrors('endDate');
                    }
                    setValue('endDate', moment(date).format('YYYY-MM-DD'));
                  }}
                  autoOk="true"
                  minDate={watch('startDate')}
                  error={errors?.endDate?.message}
                  helperText={errors?.endDate?.message}
                />
              </div>
            </Col>
          </MuiPickersUtilsProvider>
        </Row>
      </Col>
    </Row>
  );
};
OfferPeriod.propTypes = {
  register: PropTypes.func,
  watch: PropTypes.func,
  setValue: PropTypes.func,
  errors: PropTypes.object,
  clearErrors: PropTypes.func,
};

export default OfferPeriod;
