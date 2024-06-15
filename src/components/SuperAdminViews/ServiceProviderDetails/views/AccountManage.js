/* eslint-disable prettier/prettier */
/* eslint-disable arrow-body-style */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Segment, Button, Message } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import useAPI, { post, get } from 'hooks/useAPI';
import { isNumbersOnly, isPhoneLengthValid, startsWith05 } from 'functions/validate';
import ChangeNumber from './ChangeNumber';

// eslint-disable-next-line react/prop-types
function AccountManage({ mobile, id }) {
  const history = useHistory();
  const { messages } = useIntl();
  const [phone, setPhone] = useState(mobile);
  const [phoneError, setPhoneError] = useState(false);
  const [payload, setPayload] = useState(mobile);
  const tokenAPI = 'Account/login';
  const { response: token, isLoading, setRecall } = useAPI(post, tokenAPI, payload);
  const {
    response: dayBookings,
    isLoading: gettingDayBookings,
    setRecall: getDayBookings,
  } = useAPI(get, `StoredProc/MigrateOldServiceProvider?phoneNumber=${payload}`);

  const inputAndValidatePhone = (e) => {
    const input = e.target.value;
    if (input.length === 10) {
      setPhoneError(false);
    } else {
      setPhoneError(true);
    }
    setPhone(input);
  };

  const validatPhone = () => {
    if (isPhoneLengthValid(phone) && startsWith05(phone) && isNumbersOnly(phone)) {
      setPhoneError(false);
    } else {
      setPhoneError(true);
    }
  };

  const handleSubmit = () => {
    validatPhone();
    if (phone && !phoneError) {
      setPayload(phone);
      getDayBookings(true);
      setTimeout(() => {
        history.goBack();
      }, 2000);
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <ChangeNumber mobile={mobile} id={id} />
      </div>
      <div className="col-12 mt-5">
        <Form size="large" loading={isLoading}>
          <Segment>
            <Form.Input
              fluid
              icon="phone"
              error={phoneError}
              placeholder={messages[`reservationSteps.summary.phone`]}
              onBlur={validatPhone}
              onChange={inputAndValidatePhone}
              defaultValue={mobile}
            />
            <Button
              color="purple"
              fluid
              size="large"
              onClick={handleSubmit}
              disabled={phoneError}
            >
              {messages[`sAdmin.spDetails.fixAccount`]}
            </Button>
          </Segment>
        </Form>
        {dayBookings && (
          <Message positive>
            <p>{dayBookings.data === 0 && `${messages[`sAdmin.spDetails.success`]}`}</p>
          </Message>
        )}
      </div>
    </div>
  );
}

export default AccountManage;
