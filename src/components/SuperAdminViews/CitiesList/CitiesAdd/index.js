/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useAPI, { post } from 'hooks/useAPI';
import { Form, Label, Button, Message, Header } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import { validateLettersAndNumbersOnly } from 'functions/validate';

function CityAdd() {
  const [cityArName, setCityArName] = useState('');
  const [cityEnName, setCityEnName] = useState('');
  const [cityArNameError, setCityArNameError] = useState(false);
  const [cityEnNameError, setCityEnNameError] = useState(false);
  const [responseError, setResponseError] = useState('');
  const [payload, setPayload] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [addCityUrl] = ['City/AddCity'];
  const history = useHistory();

  const { messages } = useIntl();

  const { response: addCatResponse, isLoading: adding, setRecall: addCity } = useAPI(
    post,
    addCityUrl,
    payload,
  );

  useEffect(() => {
    if (addCatResponse && addCatResponse.error) {
      setResponseError(addCatResponse.error.message);
    }
    if (addCatResponse && addCatResponse.data && addCatResponse.data.success) {
      setSuccess(true);
      setTimeout(() => {
        history.goBack();
      }, 4000);
    }
  }, [addCatResponse]);

  useEffect(() => {
    if (payload) {
      addCity(true);
      setSubmit(false);
    }
  }, [payload]);

  useEffect(() => {
    if (submit) {
      setPayload({ cityArName, cityEnName });
    }
  }, [submit]);

  const handleArNameInput = (e) => {
    const input = e.target.value;
    setCityArName(input);
    validateLettersAndNumbersOnly(input, setCityArNameError);
  };
  const handleEnNameInput = (e) => {
    const input = e.target.value;
    setCityEnName(input);
    validateLettersAndNumbersOnly(input, setCityEnNameError);
  };

  return (
    <>
      <Header as="h2" color="purple">
        {messages['spAdmin.cities.add.header']}
      </Header>
      {success && <Message positive header={messages['spAdmin.cities.successMsg']} />}
      {responseError && <Message error header={responseError} />}
      <Form loading={adding} onSubmit={() => setSubmit(true)}>
        <Form.Field>
          <Header as="h4">{messages['table.cities.generalCenterType']}</Header>
          <Header>{messages['table.cities.centerType']}</Header>
        </Form.Field>
        <Form.Field>
          <Header as="h4">{messages['spAdmin.cities.add.nameAr']}</Header>
          <input
            placeholder={messages['spAdmin.cities.add.nameAr']}
            onChange={handleArNameInput}
          />
          {cityArNameError && (
            <Label basic color="red" pointing>
              {messages['spAdmin.cities.add.nameError']}
            </Label>
          )}
          {cityArName.length > 50 && (
            <Label basic color="red" pointing>
              {messages['spAdmin.cities.add.lengthError']}
            </Label>
          )}
        </Form.Field>
        <Form.Field>
          <Header as="h4">{messages['spAdmin.cities.add.nameEn']}</Header>
          <input
            placeholder={messages['spAdmin.cities.add.nameEn']}
            onChange={handleEnNameInput}
          />
          {cityEnNameError && (
            <Label basic color="red" pointing>
              {messages['spAdmin.cities.add.nameError']}
            </Label>
          )}
          {cityEnName.length > 50 && (
            <Label basic color="red" pointing>
              {messages['spAdmin.cities.add.lengthError']}
            </Label>
          )}
        </Form.Field>
        <Button
          type="submit"
          disabled={
            !cityArName || !cityEnName || cityArNameError || cityEnNameError || success
          }
        >
          {messages['spAdmin.cities.add.addNewCity']}
        </Button>
      </Form>
    </>
  );
}

export default CityAdd;
