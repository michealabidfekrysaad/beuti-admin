/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useAPI, { get, post } from 'hooks/useAPI';
import { Form, Label, Button, Dropdown, Message, Header } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import { validateLettersAndNumbersOnly } from 'functions/validate';

function CategoryAdd() {
  const [gctDD, setGctDD] = useState([]);
  const [ctDD, setCtDD] = useState([]);
  const [generalCenterTypeId, setGeneralCenterTypeId] = useState(null); // userSelection
  const [centerTypeId, setCenterTypeId] = useState(null); // userSelection
  const [categoryArName, setCategoryArName] = useState('');
  const [categoryEnName, setCategoryEnName] = useState('');
  const [categoryArNameError, setCategoryArNameError] = useState(false);
  const [categoryEnNameError, setCategoryEnNameError] = useState(false);
  const [responseError, setResponseError] = useState('');
  const [payload, setPayload] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [gctApi, addCategory] = [
    'GeneralCenterType/AllGeneralCenterTypes',
    'Category/AddCategory',
  ];
  const history = useHistory();

  const { messages } = useIntl();
  const { response: gctList, isLoading: getting, setRecall: getGct } = useAPI(
    get,
    gctApi,
  );
  const { response: addCatResponse, isLoading: adding, setRecall: addGct } = useAPI(
    post,
    addCategory,
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
      addGct(true);
      setSubmit(false);
    }
  }, [payload]);

  useEffect(() => {
    if (submit) {
      setPayload({ centerTypeId, categoryArName, categoryEnName });
    }
  }, [submit]);

  useEffect(() => {
    getGct(true);
  }, []);

  useEffect(() => {
    if (generalCenterTypeId && gctList && gctList.data && gctList.data.list) {
      setCtDD(
        gctList.data.list
          .find((gct) => gct.id === generalCenterTypeId)
          .centerTypes.map((ct, i) => ({ key: i, text: ct.name, value: ct.id })),
      );
    }
  }, [generalCenterTypeId]);

  useEffect(() => {
    if (gctList && gctList.data && gctList.data.list) {
      setGctDD(
        gctList.data.list.map((gct, i) => ({ key: i, text: gct.name, value: gct.id })),
      );
    }
  }, [gctList]);

  const handleGCTUserSelection = (e, { value }) => {
    if (!value) {
      setCtDD([]);
      setCenterTypeId(null); // if they want the last selection to be auto selected comment this line.
    }
    setGeneralCenterTypeId(value);
  };
  const handleCTUserSelection = (e, { value }) => setCenterTypeId(value);

  const handleArNameInput = (e) => {
    const input = e.target.value;
    setCategoryArName(input);
    validateLettersAndNumbersOnly(input, setCategoryArNameError);
  };
  const handleEnNameInput = (e) => {
    const input = e.target.value;
    setCategoryEnName(input);
    validateLettersAndNumbersOnly(input, setCategoryEnNameError);
  };

  return (
    <>
      <Header as="h2" color="purple">
        {messages['spAdmin.categories.add.header']}
      </Header>
      {success && <Message positive header={messages['spAdmin.categories.successMsg']} />}
      {responseError && <Message error header={responseError} />}
      <Form loading={getting || adding} onSubmit={() => setSubmit(true)}>
        <Form.Field>
          <Header as="h4">{messages['table.categories.generalCenterType']}</Header>
          <Dropdown
            clearable
            options={gctDD}
            selection
            onChange={handleGCTUserSelection}
          />
          <Header>{messages['table.categories.centerType']}</Header>
        </Form.Field>
        <Form.Field>
          <Dropdown
            disabled={!generalCenterTypeId}
            clearable
            options={ctDD}
            selection
            onChange={handleCTUserSelection}
          />
        </Form.Field>
        <Form.Field>
          <Header as="h4">{messages['spAdmin.categories.add.nameAr']}</Header>
          <input
            placeholder={messages['spAdmin.categories.add.nameAr']}
            onChange={handleArNameInput}
          />
          {categoryArNameError && (
            <Label basic color="red" pointing>
              {messages['spAdmin.categories.add.nameError']}
            </Label>
          )}
          {categoryArName.length > 50 && (
            <Label basic color="red" pointing>
              {messages['spAdmin.categories.add.lengthError']}
            </Label>
          )}
        </Form.Field>
        <Form.Field>
          <Header as="h4">{messages['spAdmin.categories.add.nameEn']}</Header>
          <input
            placeholder={messages['spAdmin.categories.add.nameEn']}
            onChange={handleEnNameInput}
          />
          {categoryEnNameError && (
            <Label basic color="red" pointing>
              {messages['spAdmin.categories.add.nameError']}
            </Label>
          )}
          {categoryEnName.length > 50 && (
            <Label basic color="red" pointing>
              {messages['spAdmin.categories.add.lengthError']}
            </Label>
          )}
        </Form.Field>
        <Button
          type="submit"
          disabled={
            !generalCenterTypeId ||
            !centerTypeId ||
            !categoryArName ||
            !categoryEnName ||
            categoryArNameError ||
            categoryEnNameError ||
            success
          }
        >
          {messages['spAdmin.categories.add.addNewCategory']}
        </Button>
      </Form>
    </>
  );
}

export default CategoryAdd;
