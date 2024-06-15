import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import Alert from '@material-ui/lab/Alert';
import { useIntl } from 'react-intl';
import useAPI, { put } from 'hooks/useAPI';
import { isNumbersOnly, isPhoneLengthValid, startsWith05 } from 'functions/validate';

// eslint-disable-next-line react/prop-types
function ChangeNumber({ mobile, id }) {
  const history = useHistory();
  const { messages } = useIntl();
  const [phone, setPhone] = useState(mobile);
  const [phoneError, setPhoneError] = useState(false);
  const [payload, setPayload] = useState('');
  const [error, setError] = useState(false);

  const {
    response: changePhoneRes,
    isLoading: changePhoneLoad,
    setRecall: recallChangePhone,
  } = useAPI(put, `ServiceProvider/ChangeServiceProviderPhone?spId=${id}`, payload);

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
    if (phone && !phoneError && mobile !== phone) {
      setPayload({ newPhone: phone });
      recallChangePhone(true);
    }
  };

  useEffect(() => {
    if (changePhoneRes?.error) {
      setError(changePhoneRes?.error.message);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
    if (changePhoneRes?.isSuccess) {
      setTimeout(() => {
        history.goBack();
      }, 2000);
    }
  }, [changePhoneRes]);
  return (
    <>
      <Form size="large">
        <div className="like-segment">
          <Form.Input
            fluid
            icon="phone"
            error={phoneError}
            placeholder={messages[`sAdmin.spDetails.placeHolder.phone`]}
            onBlur={validatPhone}
            onChange={inputAndValidatePhone}
            defaultValue={mobile}
          />
          <button
            type="button"
            className="btn btn-primary btn-lg btn-block font-weight-bold"
            onClick={handleSubmit}
            disabled={phoneError || mobile === phone || changePhoneLoad}
          >
            {messages[`sAdmin.spDetails.changeNumber`]}
          </button>
        </div>
      </Form>
      {error && (
        <Alert className="mb-3" severity="error">
          {error}
        </Alert>
      )}
      {changePhoneRes?.isSuccess && (
        <Alert className="mb-3" severity="success">
          {messages[`sAdmin.spDetails.changeNumber.success`]}
        </Alert>
      )}
    </>
  );
}

export default ChangeNumber;
