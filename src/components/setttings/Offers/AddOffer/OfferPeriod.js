import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';
import arLocale from 'date-fns/locale/ar-SA';
import enLocale from 'date-fns/locale/en-US';
import DateFnsUtils from '@date-io/date-fns';
import Toggle from 'react-toggle';

import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
const OfferPeriod = ({ register, errors, setValue, watch, clearErrors }) => {
  const { messages, locale } = useIntl();

  return (
    <Row>
      <Col lg={8} md={6} xs={12} className="mb-5">
        <h3 className="settings__section-title">{messages['offers.period.title']}</h3>
        <p className="settings__section-description">
          {messages['offers.period.description']}
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
                  {messages['offers.input.start']}
                </label>
                <DatePicker
                  className="beuti-input__field "
                  value={watch('reservationStart')}
                  variant="inline"
                  format="dd/MM/yyyy"
                  onChange={(date) => {
                    if (
                      moment(watch('reservationStart'))
                        .startOf('day')
                        .valueOf() <=
                      moment(watch('reservationEnd'))
                        .startOf('day')
                        .valueOf()
                    ) {
                      clearErrors('reservationStart');
                      clearErrors('reservationEnd');
                    }
                    setValue('reservationStart', date);
                  }}
                  autoOk="true"
                  error={errors?.reservationStart?.message}
                  helperText={errors?.reservationStart?.message}
                  minDate={new Date()}
                />
              </div>
            </Col>
            <Col xs="6" className="mb-3">
              <div className="beuti-input">
                <label htmlFor="test" className="beuti-input__label">
                  {messages['offers.input.end']}
                </label>
                <DatePicker
                  className="beuti-input__field "
                  value={watch('reservationEnd')}
                  variant="inline"
                  format="dd/MM/yyyy"
                  maxDate={new Date(watch('reservationStart')).setFullYear(
                    new Date().getFullYear() + 1,
                  )}
                  onChange={(date) => {
                    if (
                      moment(watch('reservationStart'))
                        .startOf('day')
                        .valueOf() <=
                      moment(watch('reservationEnd'))
                        .startOf('day')
                        .valueOf()
                    ) {
                      clearErrors('reservationStart');
                      clearErrors('reservationEnd');
                    }
                    setValue('reservationEnd', date);
                  }}
                  autoOk="true"
                  minDate={watch('reservationStart')}
                  error={errors?.reservationEnd?.message}
                  helperText={errors?.reservationEnd?.message}
                />
              </div>
            </Col>
          </MuiPickersUtilsProvider>
          {!errors?.reservationStart?.message && !errors?.reservationEnd?.message && (
            <Col xs="12">
              <p className="settings__section-note">{messages['offers.booking.note']}</p>
            </Col>
          )}

          {/* Different Booking Date Start */}
          <Col xs="12" className="mt-4">
            <div className="settings__section-toggle">
              <Toggle
                id="acceptChairBookingOnly"
                icons={{
                  unchecked: null,
                }}
                checked={!!watch('receivingService')}
                onChange={(e) => {
                  setValue('bookingStart', watch('reservationStart'));
                  setValue('bookingEnd', watch('reservationEnd'));
                  setValue('receivingService', !watch('receivingService'));
                }}
              />
              <label htmlFor="acceptChairBookingOnly">
                {messages['offers.input.receiving']}
              </label>
            </div>
          </Col>
          {!!watch('receivingService') && (
            <>
              <MuiPickersUtilsProvider
                utils={DateFnsUtils}
                locale={locale === 'ar' ? arLocale : enLocale}
              >
                <Col xs="6" className="mb-3">
                  <div className="beuti-input">
                    <label htmlFor="test" className="beuti-input__label">
                      {messages['offers.input.start']}
                    </label>
                    <DatePicker
                      className="beuti-input__field "
                      value={watch('bookingStart')}
                      variant="inline"
                      format="dd/MM/yyyy"
                      minDate={watch('reservationStart')}
                      onChange={(date) => {
                        if (
                          moment(watch('bookingStart'))
                            .startOf('day')
                            .valueOf() <=
                          moment(watch('bookingEnd'))
                            .startOf('day')
                            .valueOf()
                        ) {
                          clearErrors('bookingStart');
                          clearErrors('bookingEnd');
                        }
                        setValue('bookingStart', date);
                      }}
                      autoOk="true"
                      error={errors?.bookingStart?.message}
                      helperText={errors?.bookingStart?.message}
                    />
                  </div>
                </Col>
                <Col xs="6" className="mb-3">
                  <div className="beuti-input">
                    <label htmlFor="test" className="beuti-input__label">
                      {messages['offers.input.end']}
                    </label>
                    <DatePicker
                      className="beuti-input__field "
                      value={watch('bookingEnd')}
                      variant="inline"
                      format="dd/MM/yyyy"
                      maxDate={new Date(watch('bookingStart')).setFullYear(
                        new Date().getFullYear() + 1,
                      )}
                      onChange={(date) => {
                        if (
                          moment(watch('bookingStart'))
                            .startOf('day')
                            .valueOf() <=
                          moment(watch('bookingEnd'))
                            .startOf('day')
                            .valueOf()
                        ) {
                          clearErrors('bookingStart');
                          clearErrors('bookingEnd');
                        }
                        setValue('bookingEnd', date);
                      }}
                      autoOk="true"
                      minDate={watch('bookingStart')}
                      error={errors?.bookingEnd?.message}
                      helperText={errors?.bookingEnd?.message}
                    />
                  </div>
                </Col>
              </MuiPickersUtilsProvider>
              {!errors?.bookingStart?.message && !errors?.bookingEnd?.message && (
                <Col xs="12">
                  <p className="settings__section-note">
                    {messages['offers.receiving.note']}
                  </p>
                </Col>
              )}
            </>
          )}
          {/* Different Booking Date End */}
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
