import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';
import arLocale from 'date-fns/locale/ar-SA';
import enLocale from 'date-fns/locale/en-US';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import BeutiTextArea from '../../../../Shared/inputs/BeutiTextArea';
const EmployeeInformation = ({ register, errors, setValue, watch, clearErrors }) => {
  const { messages, locale } = useIntl();

  return (
    <Row>
      <Col lg={8} md={6} xs={12} className="mb-5">
        <h3 className="settings__section-title">
          {messages['setting.employee.info.title']}
        </h3>
        <p className="settings__section-description">
          {messages['setting.employee.info.description']}
        </p>
      </Col>
      <Col lg={8} md={8} xs={12}>
        <Row>
          <MuiPickersUtilsProvider
            utils={DateFnsUtils}
            locale={locale === 'ar' ? arLocale : enLocale}
          >
            <Col xs="6" className="mb-4">
              <div className="beuti-input">
                <label htmlFor="test" className="beuti-input__label">
                  {messages['setting.employee.input.contract.start']}
                </label>
                <DatePicker
                  className="beuti-input__field "
                  value={watch('employee.startWorkingDate')}
                  variant="inline"
                  format="dd/MM/yyyy"
                  onChange={(date) => {
                    if (
                      moment(watch('employee.startWorkingDate'))
                        .startOf('day')
                        .valueOf() <=
                      moment(watch('employee.endWorkingDate'))
                        .startOf('day')
                        .valueOf()
                    ) {
                      clearErrors('employee.startWorkingDate');
                      clearErrors('employee.endWorkingDate');
                    }
                    setValue('employee.startWorkingDate', date);
                  }}
                  autoOk="true"
                  error={errors?.employee?.startWorkingDate?.message}
                  helperText={errors?.employee?.startWorkingDate?.message}
                />
              </div>
            </Col>
            <Col xs="6" className="mb-4">
              <div className="beuti-input">
                <label htmlFor="test" className="beuti-input__label">
                  {messages['setting.employee.input.contract.end']}
                </label>
                <DatePicker
                  className="beuti-input__field "
                  value={watch('employee.endWorkingDate')}
                  variant="inline"
                  format="dd/MM/yyyy"
                  onChange={(date) => {
                    if (
                      moment(watch('employee.startWorkingDate'))
                        .startOf('day')
                        .valueOf() <=
                      moment(watch('employee.endWorkingDate'))
                        .startOf('day')
                        .valueOf()
                    ) {
                      clearErrors('employee.startWorkingDate');
                      clearErrors('employee.endWorkingDate');
                    }
                    setValue('employee.endWorkingDate', date);
                  }}
                  autoOk="true"
                  minDate={watch('employee.startWorkingDate')}
                  error={errors?.employee?.endWorkingDate?.message}
                  helperText={errors?.employee?.endWorkingDate?.message}
                />
              </div>
            </Col>
          </MuiPickersUtilsProvider>

          <Col xs="12" className="mb-4">
            <BeutiTextArea
              type="text"
              label={messages['setting.employee.input.note']}
              useFormRef={register('employee.notes')}
              error={errors?.employee?.notes?.message}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
EmployeeInformation.propTypes = {
  register: PropTypes.func,
  watch: PropTypes.func,
  setValue: PropTypes.func,
  errors: PropTypes.object,
  clearErrors: PropTypes.func,
};

export default EmployeeInformation;
