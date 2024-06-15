/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CallAPI } from 'utils/API/APIConfig';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal, Row, Col } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  SERVICE_PROVIDER_ADD_CATEGORIES,
  SERVICE_PROVIDER_EDIT_CATEGORY,
  SERVICE_PROVIDER_UPDATE_CATEGORY,
} from 'utils/API/EndPoints/ServiceProviderEP';
import BeutiButton from 'Shared/inputs/BeutiButton';
import { SchemaCategories } from '../../schema/SchemasCategoriesServices';
import BeutiInput from '../../../../Shared/inputs/BeutiInput';
import BeutiTextArea from '../../../../Shared/inputs/BeutiTextArea';
import CategoriesAutoComplete from '../../../AdminViews/Services/CategoriesAutoComplete';

export function AddNewCategoryModal({
  openModal,
  setOpenModal,
  title,
  editedCategory,
  setEditedCategory,
  refetchAllCategories,
}) {
  const { messages } = useIntl();
  const schemaCategoriesValidations = SchemaCategories();
  const [nameAR, setnameAR] = useState('');
  const [nameEn, setnameEn] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [payloadAdd, setPayloadAdd] = useState(null);
  const [payloadUpdate, setPayloadUpdate] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: { categoriesEn: nameEn },
    mode: 'all',
    resolver: yupResolver(schemaCategoriesValidations),
  });

  /* -------------------------------------------------------------------------- */
  /*                           API to add new category                          */
  /* -------------------------------------------------------------------------- */
  const { refetch: refetchAddCategory, isFetching: fetchingAddCategory } = CallAPI({
    name: 'addNewCategory',
    url: SERVICE_PROVIDER_ADD_CATEGORIES,
    method: 'post',
    refetchOnWindowFocus: false,
    // retry: 2,
    body: { ...payloadAdd },
    onSuccess: (res) => {
      if (res) {
        //   close modal, recall all categories
        closeAndreset();
        refetchAllCategories();
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  /* -------------------------------------------------------------------------- */
  /*                 API to  get the details of single category                 */
  /* -------------------------------------------------------------------------- */
  const { refetch: getCategoryDetails, isLoading: loadSingleCat } = CallAPI({
    name: 'getSingleCatDetails',
    url: SERVICE_PROVIDER_EDIT_CATEGORY,
    method: 'get',
    query: { id: editedCategory },
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      if (res?.data?.data) {
        //   handle success here and put data to  inputs
        setnameAR(res?.data?.data?.nameAr);
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

  /* -------------------------------------------------------------------------- */
  /*                      API to updated selected  category                     */
  /* -------------------------------------------------------------------------- */
  const { refetch: refetchUpdateCat, isFetching: fetchingUpdateCategory } = CallAPI({
    name: 'updateCategory',
    url: SERVICE_PROVIDER_UPDATE_CATEGORY,
    method: 'put',
    refetchOnWindowFocus: false,
    // retry: 2,
    body: { ...payloadUpdate },
    onSuccess: (res) => {
      if (res) {
        //   close modal, recall all categories
        closeAndreset();
        refetchAllCategories();
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  //   used when edit old category from page
  useEffect(() => {
    if (editedCategory) {
      getCategoryDetails();
    }
  }, [editedCategory]);

  const handleEnNameInput = (value) => {
    setValue('categoriesEn', value, { shouldValidate: true });
    setnameEn(value);
  };

  const submitFormCategories = (data) => {
    //   send data to API and clear  the inputs and  make logic
    if (!editedCategory) {
      setPayloadAdd({
        nameAr: data.categoriesAr,
        nameEn: data.categoriesEn,
        descriptionAr: data.categoryDescAr,
        descriptionEn: data.categoryDescEn,
      });
    } else {
      setPayloadUpdate({
        id: editedCategory,
        nameAr: data.categoriesAr,
        nameEn: data.categoriesEn,
        descriptionAr: data.categoryDescAr,
        descriptionEn: data.categoryDescEn,
      });
    }
  };

  const closeAndreset = () => {
    setOpenModal(false);
    setPayloadAdd(null);
    setPayloadUpdate(null);
    setnameAR('');
    setnameEn('');
    setSearchValue('');
    setEditedCategory(null);
    reset(
      {
        categoriesEn: '',
        categoriesAr: '',
        categoryDescAr: '',
        categoryDescEn: '',
      },
      {
        keepErrors: false,
      },
    );
  };

  useEffect(() => {
    if (watch('categoriesEn')) {
      setnameEn('');
    }
  }, [watch('categoriesEn'), nameEn]);

  //   add new category refetch API
  useEffect(() => {
    if (payloadAdd && !editedCategory) {
      refetchAddCategory();
    }
    if (payloadUpdate && editedCategory) {
      refetchUpdateCat();
    }
  }, [payloadAdd, payloadUpdate]);
  return (
    <>
      <Modal
        onHide={() => {
          closeAndreset();
        }}
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing"
      >
        <form onSubmit={handleSubmit(submitFormCategories)}>
          <Modal.Header>
            <Modal.Title className="title">{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="addServiceWizard px-4">
              <Col xs={12} className="addServiceWizard__title">
                {messages['wizard.add.new.category.information']}
              </Col>
              <Col xs={12} className="addServiceWizard__subtitle">
                {messages['wizard.add.category.sub.title']}
              </Col>
            </Row>
            <Row className="px-4">
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
                />
              </Col>
              <Col lg="6" xs="12" className="mt-2 mb-2">
                <BeutiInput
                  label={`${messages['wizard.add.new.category.name.en']} *`}
                  error={errors.categoriesEn?.message && errors.categoriesEn?.message}
                  useFormRef={register('categoriesEn')}
                />
              </Col>
            </Row>
            <hr />
            <Row className="addServiceWizard px-4">
              <Col xs={12} className="addServiceWizard__title">
                {messages['wizard.add.new.category.description']}
              </Col>
              <Col xs={12} className="addServiceWizard__subtitle">
                {messages['wizard.add.new.category.description.sub.title']}
              </Col>
            </Row>
            <Row className="px-4">
              <Col lg="6" xs="12" className="mt-2 mb-2">
                <BeutiTextArea
                  type="text"
                  label={`${messages['wizard.add.new.category.desc.en']}`}
                  useFormRef={register('categoryDescEn')}
                  error={errors.categoryDescEn?.message}
                />
              </Col>
              <Col lg="6" xs="12" className="mt-2 mb-2">
                <BeutiTextArea
                  type="text"
                  label={`${messages['wizard.add.new.category.desc.ar']}`}
                  useFormRef={register('categoryDescAr')}
                  error={errors.categoryDescAr?.message}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="pt-3">
            <button
              type="button"
              className="px-4 cancel"
              onClick={() => {
                closeAndreset();
              }}
            >
              <FormattedMessage id="common.cancel" />
            </button>
            <BeutiButton
              loading={fetchingAddCategory || fetchingUpdateCategory || loadSingleCat}
              text={messages['common.add']}
              className="px-4 confirm"
              type="submit"
            />
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

AddNewCategoryModal.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  title: PropTypes.string,
  editedCategory: PropTypes.number,
  setEditedCategory: PropTypes.func,
  refetchAllCategories: PropTypes.func,
};
