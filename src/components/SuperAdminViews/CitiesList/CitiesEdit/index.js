import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useAPI, { get, put } from 'hooks/useAPI';
import { Form, Label, Button, Message, Header } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import { validateLettersAndNumbersOnly } from 'functions/validate';

function CitiesEdit() {
  const { cityId } = useParams();
  const [cityArName, setCityArName] = useState('');
  const [cityEnName, setCityEnName] = useState('');
  const [cityArNameError, setCityArNameError] = useState(false);
  const [cityEnNameError, setCityEnNameError] = useState(false);
  const [responseError, setResponseError] = useState('');
  const [payload, setPayload] = useState(null);
  const [changeHappened, setChangeHappened] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cityById, renameCity] = [`City/getById?cityId=${cityId}`, `City/RenameCity`];
  const history = useHistory();
  const { messages } = useIntl();

  const {
    response: getCityById,
    isLoading: gettingDataById,
    setRecall: callGetCityById,
  } = useAPI(get, cityById);

  const { response: renameCatResponse, isLoading, setRecall: renameCat } = useAPI(
    put,
    renameCity,
    payload,
  );

  useEffect(() => {
    if (!getCityById) {
      callGetCityById(true);
    }
    if (getCityById && getCityById.data) {
      const { arName, enName } = getCityById.data;
      setCityArName(arName);
      setCityEnName(enName);
    }
  }, [getCityById]);

  // response response handle
  useEffect(() => {
    // error handling
    if (renameCatResponse && renameCatResponse.error) {
      setResponseError(renameCatResponse.error.message);
    }
    // success handling
    if (renameCatResponse && renameCatResponse.data && renameCatResponse.data.success) {
      setTimeout(() => {
        history.goBack();
      }, 2000);
      setSuccess(true);
    }
  }, [renameCatResponse]);

  // on payload ready make rename put request
  useEffect(() => {
    if (payload) {
      renameCat(true);
    }
  }, [payload]);

  function constructPayload() {
    setPayload({ cityId, cityArName: cityArName.trim(), cityEnName: cityEnName.trim() });
  }

  const handleInput = (e) => {
    resetBeforeChangeState();
    setChangeHappened(true);
    const input = e.target.value;
    const lang = e.target.getAttribute('data-lang');
    if (lang === 'ar') {
      setCityArName(input);
    } else {
      setCityEnName(input);
    }
    validateLettersAndNumbersOnly(
      input,
      lang === 'ar' ? setCityArNameError : setCityEnNameError,
    );
  };

  const resetBeforeChangeState = () => {
    setPayload(null);
    setResponseError(null);
  };

  return (
    <>
      <Header as="h2" color="purple">
        {messages['spAdmin.cities.edit.header']}
      </Header>

      <Message info header={messages['spAdmin.categories.Rename.infoMsg']} />
      {success && (
        <Message positive header={messages['spAdmin.categories.Rename.successMsg']} />
      )}
      {responseError && <Message error header={responseError} />}
      {getCityById && (cityArName.length === 0 || cityEnName.length === 0) && (
        <Message negative header={messages['spAdmin.categories.add.lengthIsZeroMsg']} />
      )}

      <Form onSubmit={constructPayload} loading={isLoading || gettingDataById}>
        <Form.Field>
          <Header as="h4">{messages['spAdmin.categories.add.nameAr']}</Header>
          <input
            placeholder={messages['spAdmin.categories.add.nameAr']}
            onChange={handleInput}
            value={cityArName}
            data-lang="ar"
          />
          {cityArNameError && (
            <Label basic color="red" pointing>
              {messages['spAdmin.categories.add.nameError']}
            </Label>
          )}
          {cityArName.length > 50 && (
            <Label basic color="red" pointing>
              {messages['spAdmin.categories.add.lengthError']}
            </Label>
          )}
        </Form.Field>

        <Form.Field>
          <Header as="h4">{messages['spAdmin.categories.add.nameEn']}</Header>
          <input
            placeholder={messages['spAdmin.categories.add.nameEn']}
            onChange={handleInput}
            value={cityEnName}
            data-lang="en"
          />
          {cityEnNameError && (
            <Label basic color="red" pointing>
              {messages['spAdmin.categories.add.nameError']}
            </Label>
          )}
          {cityEnName.length > 50 && (
            <Label basic color="red" pointing>
              {messages['spAdmin.categories.add.lengthError']}
            </Label>
          )}
        </Form.Field>

        <Button
          type="submit"
          disabled={
            !cityId ||
            !cityArName ||
            !cityEnName ||
            cityArNameError ||
            cityEnNameError ||
            success ||
            !changeHappened
          }
        >
          {messages['common.save']}
        </Button>
      </Form>
    </>
  );
}

export default CitiesEdit;
