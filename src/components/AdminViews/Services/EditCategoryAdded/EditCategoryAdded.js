import React, { useState } from 'react';
import { CallAPI } from 'utils/API/APIConfig';
import { useIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import {
  SERVICE_PROVIDER_EDIT_CATEGORY,
  SERVICE_PROVIDER_UPDATE_CATEGORY,
} from 'utils/API/EndPoints/ServiceProviderEP';
import BeutiButton from 'Shared/inputs/BeutiButton';
import BeutiInput from '../../../../Shared/inputs/BeutiInput';
import BeutiTextArea from '../../../../Shared/inputs/BeutiTextArea';
import CategoriesAutoComplete from '../CategoriesAutoComplete';
import { AddNewCategorySchema } from '../AddNewCategory/AddNewCategorySchema';

export default function EditCategoryAdded() {
  const { messages } = useIntl();
  const history = useHistory();
  const [nameAR, setnameAR] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const schemaCategoriesValidations = AddNewCategorySchema('EditCategory');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schemaCategoriesValidations),
  });

  const handleEnNameInput = (value) => {
    setValue('categoriesEn', value, { shouldValidate: true });
  };

  const { isFetching: loadSingleCat } = CallAPI({
    name: 'singleCatForEdit',
    url: SERVICE_PROVIDER_EDIT_CATEGORY,
    method: 'get',
    enabled: true,
    query: { id: history?.location?.state },
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      if (res?.data) {
        setnameAR(res?.data?.data?.nameAr || '');
        reset(
          {
            categoriesEn: res?.data?.data?.nameEn,
            categoriesAr: res?.data?.data?.nameAr,
            categoryDescAr: res?.data?.data?.descriptionAr,
            categoryDescEn: res?.data?.data?.descriptionEn,
          },
          {
            keepErrors: false,
          },
        );
      }
    },
    onError: (err) => toast.error(err?.message),
  });

  const { refetch, isFetching: fetchAddNew } = CallAPI({
    name: 'updateCategoryAddedBefore',
    url: SERVICE_PROVIDER_UPDATE_CATEGORY,
    method: 'put',
    onSuccess: (data) => {
      if (data?.data?.data.success) {
        toast.success(messages['common.edited.success']);
        history.goBack();
      }
    },
    body: {
      nameAr: nameAR,
      nameEn: watch('categoriesEn'),
      descriptionAr: watch('categoryDescAr'),
      descriptionEn: watch('categoryDescEn'),
      id: history?.location?.state,
    },
    onError: (err) =>
      toast.error(err?.response?.data?.error?.message || err?.response?.status),
  });

  return !loadSingleCat ? (
    <form onSubmit={handleSubmit(() => refetch())} className="pb-5 mb-5">
      <Row className="informationwizard py-2">
        <Col xs={12} className="informationwizard__title catTitle">
          {messages['newCategory.title']}
        </Col>
        <Col xs={12} className="informationwizard__subtitle">
          {messages['newCategory.subtitle']}
        </Col>
      </Row>
      <Row className="pt-2">
        <Col lg="6" xs="12" className="mt-2 mb-2">
          <CategoriesAutoComplete
            handleEnNameInput={handleEnNameInput}
            handleArNameInput={(value) => setnameAR(value)}
            nameAr={nameAR}
            useFormRef={register('categoriesAr', {
              onChange: (e) => {
                setnameAR(e.target.value);
                setSearchValue(e.target.value);
              },
            })}
            error={errors.categoriesAr?.message}
            searchValue={searchValue}
            classes="catLabel"
          />
        </Col>
        <Col lg="6" xs="12" className="mt-2 mb-2">
          <BeutiInput
            label={`${messages['wizard.add.new.category.name.en']} *`}
            error={errors.categoriesEn?.message && errors.categoriesEn?.message}
            useFormRef={register('categoriesEn')}
            labelClass="catLabelInput"
          />
        </Col>
      </Row>
      <hr className="w-100" />
      <Row className="informationwizard pt-4">
        <Col xs={12} className="informationwizard__title">
          {messages['newCategory.description']}
        </Col>
        <Col xs={12} className="informationwizard__subtitle">
          {messages['newCategory.description.sub.title']}
        </Col>
      </Row>
      <Row className="pt-2">
        <Col lg="6" xs="12" className="mt-2 mb-2">
          <BeutiTextArea
            type="text"
            label={`${messages['newCategory.desc.ar']}`}
            useFormRef={register('categoryDescAr')}
            error={errors.categoryDescAr?.message}
            note={messages['newCategory.desc.min.max.note']}
            labelClass="catDescLabel"
          />
        </Col>
        <Col lg="6" xs="12" className="mt-2 mb-2">
          <BeutiTextArea
            type="text"
            label={`${messages['newCategory.desc.en']}`}
            useFormRef={register('categoryDescEn')}
            error={errors.categoryDescEn?.message}
            note={messages['newCategory.desc.min.max.note']}
            labelClass="catDescLabel"
          />
        </Col>
      </Row>
      <Row>
        <Col className="text-center informationwizard__footer" xs="12">
          <button
            type="button"
            onClick={() => history.goBack()}
            className="informationwizard__footer--previous catCancel"
          >
            {messages['common.cancel']}
          </button>
          <BeutiButton
            text={messages['common.save']}
            type="submit"
            className="informationwizard__footer--submit catSave"
            loading={loadSingleCat || fetchAddNew}
            disabled={loadSingleCat || fetchAddNew}
          />
        </Col>
      </Row>
    </form>
  ) : (
    <div className="loading"></div>
  );
}
