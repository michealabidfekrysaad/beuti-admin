import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  Header,
  Message,
  Form,
  Label,
  Button,
  Segment,
  Checkbox,
} from 'semantic-ui-react';
import { isNumbersOnly } from 'functions/validate';
import useAPI, { get, post } from 'hooks/useAPI';
import { useHistory } from 'react-router-dom';

export default function SPPromo() {
  const history = useHistory();
  const [id, setId] = useState('');
  const [code, setCode] = useState('');
  const [days, setDays] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [responseError, setResponseError] = useState('');
  const [regexError, setRegexError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submit, setSubmit] = useState(false);

  const toggle = () => setIsActive(!isActive);

  const { response: currentPromo, getting, setRecall: callCurrentPromo } = useAPI(
    get,
    'SPPromoCode/Get',
  );

  const { response: editResponse, isLoading: editing, setRecall: callEditPromo } = useAPI(
    post,
    'SPPromoCode/Add',
    {
      code,
      id,
      noOfFreeDays: days,
      isEnabled: isActive,
    },
  );

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        setSubmit(false);
        history.goBack();
      }, 3000);
    }
  }, [success]);

  useEffect(() => {
    if (editResponse && editResponse?.error) {
      setResponseError(editResponse.error.message);
      setSubmit(false);
    }
    if (editResponse && editResponse?.data?.success) {
      setSuccess(true);
    }
  }, [editResponse]);

  useEffect(() => {
    if (currentPromo && currentPromo.data) {
      setId(currentPromo.data.id);
      setDays(currentPromo.data.noOfFreeDays);
      setCode(currentPromo.data.code);
      setIsActive(currentPromo.data.isEnabled);
    }
  }, [currentPromo]);

  const handleValidationForPromo = (value) => {
    setResponseError(false);
    if (!/^[a-zA-Z0-9-\u0621-\u064A\u0660-\u0669]*$/.test(value)) {
      setRegexError(true);
    } else {
      setRegexError(false);
    }
    setCode(value);
  };
  useEffect(() => {
    callCurrentPromo(true);
  }, []);

  useEffect(() => {
    if (submit) {
      callEditPromo(true);
    }
  }, [submit]);

  const { messages } = useIntl();
  return (
    <>
      <Header as="h2" color="purple">
        {messages['promocodes.sidebar.promocode']}
        <Checkbox className="px-4" onChange={toggle} checked={isActive} />
      </Header>
      {success && <Message positive header={messages['promocodes.successMessage']} />}
      {responseError && <Message error header={responseError} />}
      <Form loading={submit || getting} onSubmit={() => setSubmit(true)}>
        <Form.Field>
          <Header as="h5">
            <FormattedMessage id="promocodes.sidebar.promocode" />
          </Header>
          <input
            placeholder={messages['promocodes.sidebar.promocode']}
            type="text"
            value={code}
            onChange={(e) => {
              handleValidationForPromo(e.target.value);
            }}
          />
          {code && code.length > 30 && (
            <Label basic color="red" pointing>
              {messages['promocodes.maxlength.validation']}
            </Label>
          )}
          <p style={{ color: '#b03060' }}>
            {regexError &&
              code.length <= 30 &&
              messages['promocodes.sidebar.promocode.validation']}
          </p>
        </Form.Field>
        <Header as="h5">
          <FormattedMessage id="promocode.days.without.commission" />
        </Header>
        <Form.Field>
          <input
            type="text"
            value={days}
            onChange={(e) => {
              setResponseError(false);
              return isNumbersOnly(e.target.value)
                ? setDays(Number(e.target.value))
                : null;
            }}
          />
          {(days > 99 || days < 0) && (
            <Label basic color="red" pointing>
              {messages['admin.setttings.vat.error']}
            </Label>
          )}
        </Form.Field>
        <Segment basic textAlign="right">
          <Button
            type="submit"
            color="purple"
            onClick={() => setSubmit(true)}
            disabled={
              !days ||
              success ||
              days < 1 ||
              days > 99 ||
              getting ||
              editing ||
              regexError ||
              !code ||
              code.length > 30
            }
          >
            {messages['common.save']}
          </Button>
        </Segment>
      </Form>
    </>
  );
}
