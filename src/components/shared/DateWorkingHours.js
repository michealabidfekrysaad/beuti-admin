import React from 'react';
import { DatePicker } from '@material-ui/pickers';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Col, Row } from 'react-bootstrap';
import { FormControl } from '@material-ui/core';
import moment from 'moment';

const DateWorkingHours = ({
  duration,
  setDuration,
  allowPast,
  width75,
  noshrinkLabel = false,
  showErrorBorderandMessage = false,
  startDateLabel,
  endDateLabel,
}) => {
  moment.locale('en');
  const { messages } = useIntl();
  return (
    <>
      <Row>
        <Col lg={6} sm={12}>
          <FormControl fullWidth className={`mb-4 ${width75 && 'w-75'}`}>
            <DatePicker
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
            />
          </FormControl>
        </Col>
        <Col lg={6} sm={12}>
          <FormControl fullWidth className={`mb-4 ${width75 && 'w-75'}`}>
            <DatePicker
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
            />
          </FormControl>
        </Col>
      </Row>
    </>
  );
};
DateWorkingHours.propTypes = {
  duration: PropTypes.object,
  setDuration: PropTypes.func,
  allowPast: PropTypes.bool,
  width75: PropTypes.bool,
  noshrinkLabel: PropTypes.bool,
  showErrorBorderandMessage: PropTypes.bool,
  startDateLabel: PropTypes.string,
  endDateLabel: PropTypes.string,
};

export default DateWorkingHours;
