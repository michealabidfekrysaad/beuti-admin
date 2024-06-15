import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useAPI, { get, put } from 'hooks/useAPI';
import {
  Form,
  Label,
  Button,
  Breadcrumb,
  Message,
  Header,
  Divider,
} from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import {
  customValidateLettersAndNumbersOnly,
  validateLettersAndNumbersOnly,
} from 'functions/validate';

function CategoryEdit() {
  const { categoryId } = useParams();
  const [generalCenterType, setGeneralCenterType] = useState('');
  const [centerType, setCenterType] = useState('');
  const [categoryArName, setCategoryArName] = useState('');
  const [categoryEnName, setCategoryEnName] = useState('');
  const [categoryArNameError, setCategoryArNameError] = useState(false);
  const [categoryEnNameError, setCategoryEnNameError] = useState(false);
  const [responseError, setResponseError] = useState('');
  const [payload, setPayload] = useState(null);
  const [changeHappened, setChangeHappened] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categoryById, renameCategory] = [
    `Category/getById?categoryId=${categoryId}`,
    `Category/RenameCategory`,
  ];
  const history = useHistory();
  const { messages, locale } = useIntl();

  const {
    response: getCatById,
    isLoading: gettingDataById,
    setRecall: callGetCatById,
  } = useAPI(get, categoryById);

  const { response: renameCatResponse, isLoading, setRecall: renameCat } = useAPI(
    put,
    renameCategory,
    payload,
  );

  useEffect(() => {
    if (!getCatById) {
      callGetCatById(true);
    }
    if (getCatById && getCatById.data) {
      const { centerType: ct, generalCenterType: gct, arName, enName } = getCatById.data;
      setGeneralCenterType(gct);
      setCenterType(ct);
      setCategoryArName(arName);
      setCategoryEnName(enName);
    }
  }, [getCatById]);

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
    setPayload({ categoryId, categoryArName, categoryEnName });
  }

  const handleInput = (e) => {
    resetBeforeChangeState();
    setChangeHappened(true);
    const input = e.target.value;
    const lang = e.target.getAttribute('data-lang');
    if (lang === 'ar') {
      setCategoryArName(input);
    } else {
      setCategoryEnName(input);
    }
    customValidateLettersAndNumbersOnly(
      input,
      lang === 'ar' ? setCategoryArNameError : setCategoryEnNameError,
    );
  };

  const resetBeforeChangeState = () => {
    setPayload(null);
    setResponseError(null);
  };

  return (
    <>
      <Header as="h2" color="purple">
        {messages['spAdmin.categories.edit.header']}
      </Header>

      <Message info header={messages['spAdmin.categories.Rename.infoMsg']} />
      {success && (
        <Message positive header={messages['spAdmin.categories.Rename.successMsg']} />
      )}
      {responseError && <Message error header={responseError} />}
      {getCatById && (categoryArName.length === 0 || categoryEnName.length === 0) && (
        <Message negative header={messages['spAdmin.categories.add.lengthIsZeroMsg']} />
      )}

      <Breadcrumb size="massive">
        <Breadcrumb.Section>{generalCenterType}</Breadcrumb.Section>
        <Breadcrumb.Divider
          icon={`${locale === 'en' ? 'right chevron' : 'left chevron'}`}
        />
        <Breadcrumb.Section>{centerType}</Breadcrumb.Section>
      </Breadcrumb>

      <Divider hidden />

      <Form onSubmit={constructPayload} loading={isLoading || gettingDataById}>
        <Form.Field>
          <Header as="h4">{messages['spAdmin.categories.add.nameAr']}</Header>
          <input
            placeholder={messages['spAdmin.categories.add.nameAr']}
            onChange={handleInput}
            value={categoryArName}
            data-lang="ar"
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
            onChange={handleInput}
            value={categoryEnName}
            data-lang="en"
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
            !categoryId ||
            !categoryArName ||
            !categoryEnName ||
            categoryArNameError ||
            categoryEnNameError ||
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

export default CategoryEdit;
