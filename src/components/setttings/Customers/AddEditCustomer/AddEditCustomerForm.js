/* eslint-disable */
import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import arLocale from 'date-fns/locale/ar-SA';
import enLocale from 'date-fns/locale/en-US';
import DateFnsUtils from '@date-io/date-fns';
import BeutiInput from 'Shared/inputs/BeutiInput';
import PropTypes from 'prop-types';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import BeutiTextArea from 'Shared/inputs/BeutiTextArea';
import { useHistory } from 'react-router-dom';

const AddEditCustomerForm = ({
  register,
  errors,
  setValue,
  watch,
  customerId,
  existUser,
  customerData,
}) => {
  const history = useHistory();
  const { messages, locale } = useIntl();
  return (
    <Row>
      <Col lg={12} md={6} xs={12} className="mb-5">
        <h3 className="settings__section-title">
          {messages['setting.customer.details.title']}
        </h3>
        <p className="settings__section-description">
          {messages['setting.customer.details.description']}
        </p>
      </Col>
      <Col lg={8} md={8} xs={12}>
        <Row className="mb-4">
          {customerData?.registeredName && customerData?.isRegistered && (
            <Col xs="6">
              <BeutiInput
                type="text"
                label={messages['setting.customer.name']}
                disabled
                value={customerData?.registeredName}
              />
            </Col>
          )}
          <Col xs="6">
            <BeutiInput
              type="text"
              label={
                customerData?.registeredName && customerData?.isRegistered
                  ? messages['setting.customer.alternativeName']
                  : messages['setting.customer.name']
              }
              useFormRef={register('name')}
              error={errors?.name?.message}
            />
          </Col>

          {customerData?.isRegistered && !errors.name?.message && (
            <Col xs="12">
              <p className="beuti-input__note">
                {messages['setting.customer.alternativeName.note']}
              </p>
            </Col>
          )}
          <Col xs="12" className="my-4">
            <div className="phonenumber-start">
              <BeutiInput
                type="text"
                label={messages['common.mobile number']}
                useFormRef={register('phone')}
                error={!!existUser || errors?.phone?.message}
                disabled={
                  customerData?.isRegistered && customerData?.phone && watch('phone')
                }
                note={
                  customerId &&
                  customerData?.isRegistered &&
                  messages['setting.customer.phone.note']
                }
              />
              {existUser && (
                <p
                  className="beuti-input__errormsg click-here text-main"
                  onClick={() =>
                    history.push(`/settingCustomers/editCustomer/${existUser}`)
                  }
                >
                  {messages['setting.customer.exist.vist']}
                </p>
              )}
              <label htmlFor="minimumPrice" className="icon">
                05 |
              </label>
            </div>
          </Col>
          <Col xs="6" className="mb-4">
            <BeutiInput
              type="text"
              label={messages['common.email']}
              useFormRef={register('email')}
              error={errors?.email?.message}
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
                  className={`beuti-input__label ${errors?.dateOfBirth?.message &&
                    'text-danger'}`}
                >
                  {messages['setting.customer.birthday']}
                </label>
                <DatePicker
                  className="beuti-input__field "
                  value={watch('dateOfBirth')}
                  variant="inline"
                  format="dd MMMM yyyy"
                  onChange={(date) =>
                    setValue('dateOfBirth', date, { shouldValidate: true })
                  }
                  autoOk="true"
                  error={errors?.dateOfBirth?.message}
                  helperText={errors?.dateOfBirth?.message}
                  maxDate={new Date(Date.now() - 86400000)}
                />
              </div>
            </Col>
          </MuiPickersUtilsProvider>

          <Col xs="12" className="mb-4">
            <BeutiTextArea
              type="text"
              label={messages['common.notes']}
              useFormRef={register('notes')}
              error={errors.notes?.message}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
AddEditCustomerForm.propTypes = {
  register: PropTypes.func,
  watch: PropTypes.func,
  setValue: PropTypes.func,
  customerId: PropTypes.number,
  existUser: PropTypes.oneOf([PropTypes.string, PropTypes.bool]),
  errors: PropTypes.object,
  customerData: PropTypes.object,
};

export default AddEditCustomerForm;
