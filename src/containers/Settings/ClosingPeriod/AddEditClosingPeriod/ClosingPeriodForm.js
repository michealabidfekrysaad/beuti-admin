import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import arLocale from 'date-fns/locale/ar-SA';
import enLocale from 'date-fns/locale/en-US';
import DateFnsUtils from '@date-io/date-fns';
import BeutiInput from 'Shared/inputs/BeutiInput';
import PropTypes from 'prop-types';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment from 'moment';
const ClosingPeriodForm = ({ register, errors, setValue, watch, clearErrors }) => {
  const { messages, locale } = useIntl();
  return (
    <Row>
      <Col lg={8} md={6} xs={12} className="mb-5">
        <h3 className="settings__section-title">{messages['closing.period.title']}</h3>
        <p className="settings__section-description">
          {messages['closing.period.description']}
        </p>
      </Col>
      <Col lg={8} md={8} xs={12}>
        <Row className="mb-4">
          <Col xs="6" className="mb-4">
            <BeutiInput
              type="text"
              label={messages['closing.period.reason.ar']}
              useFormRef={register('reasonAr')}
              error={errors?.reasonAr?.message}
            />
          </Col>
          <Col xs="6">
            <BeutiInput
              type="text"
              label={messages['closing.period.reason.en']}
              useFormRef={register('reasonEn')}
              error={errors?.reasonEn?.message}
            />
          </Col>
          <MuiPickersUtilsProvider
            utils={DateFnsUtils}
            locale={locale === 'ar' ? arLocale : enLocale}
          >
            <Col xs="6" className="mb-4">
              <div className="beuti-input">
                <label
                  htmlFor="test"
                  className={`beuti-input__label ${errors?.startDate?.message &&
                    'text-danger'}`}
                >
                  {messages['closing.period.startDate']}
                </label>
                <DatePicker
                  className="beuti-input__field "
                  value={watch('startDate')}
                  variant="inline"
                  format="dd MMMM yyyy"
                  onChange={(date) =>
                    setValue('startDate', date, { shouldValidate: true })
                  }
                  autoOk="true"
                  minDate={new Date()}
                  error={errors?.startDate?.message}
                  helperText={errors?.startDate?.message}
                />
              </div>
            </Col>
            <Col xs="6" className="mb-4">
              <div className="beuti-input">
                <label
                  htmlFor="test"
                  className={`beuti-input__label ${errors?.endDate?.message &&
                    'text-danger'}`}
                >
                  {messages['closing.period.endDate']}
                </label>
                <DatePicker
                  className="beuti-input__field "
                  value={watch('endDate')}
                  variant="inline"
                  format="dd MMMM yyyy"
                  onChange={(date) => {
                    setValue('endDate', date, { shouldValidate: true });
                    if (
                      moment(watch('startDate'))
                        .startOf('day')
                        .valueOf() <=
                      moment(watch('endDate'))
                        .startOf('day')
                        .valueOf()
                    ) {
                      clearErrors('startDate');
                    }
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
ClosingPeriodForm.propTypes = {
  register: PropTypes.func,
  watch: PropTypes.func,
  setValue: PropTypes.func,
  clearErrors: PropTypes.func,

  errors: PropTypes.object,
};

export default ClosingPeriodForm;
