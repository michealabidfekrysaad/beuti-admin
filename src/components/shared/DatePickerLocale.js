import React from 'react';
import arLocale from 'date-fns/locale/ar-SA';
import enLocale from 'date-fns/locale/en-US';
import DateFnsUtils from '@date-io/date-fns';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormControl } from '@material-ui/core';
import { useIntl } from 'react-intl';
import { Col, Row } from 'react-bootstrap';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

function DatePickerLocale({
  duration,
  setDuration,
  allowPast,
  width75,
  noshrinkLabel = false,
  showErrorBorderandMessage = false,
  startDateLabel,
  endDateLabel,
  defaultFormat = 'dd MMM yyyy',
}) {
  const { messages, locale } = useIntl();

  return (
    <Row>
      <MuiPickersUtilsProvider
        utils={DateFnsUtils}
        locale={locale === 'ar' ? arLocale : enLocale}
      >
        <Col lg={6} sm={12}>
          <FormControl fullWidth className={`mb-4 ${width75 && 'w-75'}`}>
            <DatePicker
              format={defaultFormat}
              value={duration.from}
              label={`${
                startDateLabel ? messages[startDateLabel] : messages['common.fromDate']
              } `}
              InputLabelProps={
                noshrinkLabel && {
                  shrink: !noshrinkLabel,
                }
              }
              onChange={(value) =>
                setDuration({ ...duration, from: moment(value).format('YYYY-MM-DD') })
              }
              autoOk="true"
              okLabel={null}
              disablePast={allowPast ? null : 'true'}
              error={showErrorBorderandMessage}
              helperText={
                showErrorBorderandMessage && messages[showErrorBorderandMessage]
              }
              cancelLabel={messages['common.cancel']}
            />
          </FormControl>
        </Col>
        <Col lg={6} sm={12}>
          <FormControl fullWidth className={`mb-4 ${width75 && 'w-75'}`}>
            <DatePicker
              format={defaultFormat}
              value={duration.to}
              label={`${
                endDateLabel ? messages[endDateLabel] : messages['common.toDate']
              } `}
              InputLabelProps={
                noshrinkLabel && {
                  shrink: !noshrinkLabel,
                }
              }
              onChange={(value) =>
                setDuration({ ...duration, to: moment(value).format('YYYY-MM-DD') })
              }
              autoOk="true"
              okLabel={null}
              disabled={!duration.from}
              disablePast={allowPast ? null : 'true'}
              minDate={duration.from}
              error={showErrorBorderandMessage}
              helperText={
                showErrorBorderandMessage && messages[showErrorBorderandMessage]
              }
              cancelLabel={messages['common.cancel']}
            />
          </FormControl>
        </Col>
      </MuiPickersUtilsProvider>
    </Row>
  );
}

DatePickerLocale.propTypes = {
  duration: PropTypes.object,
  setDuration: PropTypes.func,
  allowPast: PropTypes.bool,
  width75: PropTypes.bool,
  noshrinkLabel: PropTypes.bool,
  showErrorBorderandMessage: PropTypes.bool,
  startDateLabel: PropTypes.string,
  endDateLabel: PropTypes.string,
  defaultFormat: PropTypes.string,
};

export default DatePickerLocale;
