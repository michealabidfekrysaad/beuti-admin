/* eslint-disable no-return-assign */
import React, { useEffect, useState, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Routes } from 'constants/Routes';
import { Tooltip, CircularProgress } from '@material-ui/core';
import { Editor } from '@tinymce/tinymce-react';
import { CallAPI } from 'utils/API/APIConfig';

import Fade from '@material-ui/core/Fade';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SP_GET_FINANCIAL, SP_UPDATE_FINANCIAL } from 'utils/API/EndPoints/VoucherEP';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import BeutiInput from 'Shared/inputs/BeutiInput';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import { FinancialEditDeleteAddModal } from './FinancialEditDeleteAddModal';

export default function FinancialSettings() {
  const history = useHistory();
  const { messages, locale } = useIntl();
  const [allPayments, setAllPayments] = useState([]);
  const [editedPaymnet, setEditedPayment] = useState('');
  const [addedPaymnet, setAddedPayment] = useState('');
  const [submitedByButton, setSubmitedByButton] = useState(false);
  const [openEditDeleteModal, setOpenEditDeleteModal] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [paymentIdForModal, setPaymentIdForModal] = useState(false);
  const [payloadEditDelete, setPayloadEditDelete] = useState(false);
  const [payloadAddNew, setPayloadAddNew] = useState([]);
  const [currentBranchID, setCurrentBranchId] = useState(null);
  const [writeSlogan, setWriteSlogan] = useState(null);
  const [payloadAllData, setPayloadAllData] = useState(false);
  const maxSloganLength = 500;
  const editorRef = useRef(null);

  const schemaValidations = yup.object().shape({
    VatPercentage: yup
      .string()
      .test({
        name: 'greaterThan',
        message: messages['financial.vat.percentage.length.max'],
        test: (v) => {
          if (v && +v > 99) {
            return false;
          }
          return true;
        },
      })
      .test({
        name: 'smalllerThan',
        message: messages['financial.vat.percentage.length.min'],
        test: (v) => {
          if (v && +v < 0) {
            return false;
          }
          return true;
        },
      })
      .nullable(),
    vatNumber: yup
      .string()
      .transform((value, originalvalue) => {
        if (!value) {
          return '';
        }
        return value;
      })
      .test({
        name: 'numbersOnlyVat',
        message: messages['financial.vat.number.float.required'],
        test: (value) => /^[0-9\s]*$/.test(value) || !value,
      })
      .when('VatPercentage', {
        is: (VatPercentage) => +VatPercentage > 0,
        then: yup.string().required(messages['financial.vat.number.required']),
      })
      .test({
        name: 'numbers15',
        message: messages['financial.vat.number.length.min'],
        test: (value) => {
          if (+value.length === 15 || !value) {
            return true;
          }
          return false;
        },
      }),
    empComission: yup
      .number()
      .typeError(messages['financial.emp.comission.required'])
      .min(0, messages['financial.emp.comission.min'])
      .max(99, messages['financial.emp.comission.max'])
      .required(messages['financial.emp.comission.required']),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields, isDirty },
    clearErrors,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(schemaValidations),
    mode: 'all',
    defaultValues: { empComission: 0 },
  });
  const {
    refetch: getFinancialRefetch,
    isFetching: gettingData,
    data: allDataFromAPI,
  } = CallAPI({
    name: 'getFinancialSettings',
    url: SP_GET_FINANCIAL,
    enabled: true,
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      if (res?.data) {
        setValue('VatPercentage', res?.data?.data?.vatPercentage);
        setValue('vatNumber', res?.data?.data?.vatCertificateNumber);
        setValue('empComission', res?.data?.data?.employeeCommission);
        setAllPayments(res?.data?.data?.paymentMethods);
        setWriteSlogan(res?.data?.data?.slogan);
        setCurrentBranchId(res?.data?.data?.branchId);
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  const { refetch: updateFinancialRefetch, isFetching: updatingData } = CallAPI({
    name: 'updateFinancialSettings',
    url: SP_UPDATE_FINANCIAL,
    refetchOnWindowFocus: false,
    method: 'put',
    retry: false,
    body: {
      ...payloadAllData,
    },
    onSuccess: (res) => {
      if (res?.data) {
        if (res?.data?.data?.success) {
          toast.success(messages['financial.success']);
          setPayloadAllData(false);
          setPayloadAddNew([]);
          setPayloadEditDelete(false);
          setAddedPayment('');
          getFinancialRefetch(true);
          if (submitedByButton) {
            history.goBack();
          }
        }
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  useEffect(() => {
    if (editedPaymnet) {
      setOpenEditDeleteModal(true);
    }
  }, [editedPaymnet]);

  useEffect(() => {
    if (payloadEditDelete) {
      setPayloadAllData({
        ...allDataFromAPI?.data?.data,
        defaultEmployeesCommission: allDataFromAPI?.data?.data?.employeeCommission,
        paymentMethods: payloadEditDelete,
      });
      //  call the aPI when change the allData payload
    }
  }, [payloadEditDelete]);

  //   to call add new method payment api
  useEffect(() => {
    if (payloadAddNew.length > 0) {
      setPayloadAllData({
        ...allDataFromAPI?.data?.data,
        defaultEmployeesCommission: allDataFromAPI?.data?.data?.employeeCommission,
        paymentMethods: payloadAddNew,
      });
      //  call the aPI when change the allData payload
    }
  }, [payloadAddNew]);

  /* -------------------------------------------------------------------------- */
  /*           to call update financial settings when edit add delete           */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (payloadAllData) {
      clearErrors();
      updateFinancialRefetch();
    }
  }, [payloadAllData]);

  const handleChangeSlogan = (value) => {
    setWriteSlogan(value);
  };

  const submitForm = () => {
    setPayloadAllData({
      vatCertificateNumber: getValues('vatNumber') || null,
      vatPercentage: +getValues('VatPercentage'),
      defaultEmployeesCommission: +getValues('empComission'),
      slogan: writeSlogan || '',
      paymentMethods: allPayments,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(() => {
        setSubmitedByButton(true);
        submitForm();
      })}
    >
      <Row className="settings">
        <Col xs={12} className="settings__section">
          <Row className="justify-content-between">
            <Col lg={8} md={6} xs={12} className="mb-5">
              <h3 className="settings__section-title">{messages['financial.header']}</h3>
              <p className="settings__section-description">
                {messages['financial.info']}
              </p>
            </Col>
            <Col lg="auto" md={6} xs={12} className="mb-5">
              <button
                type="button"
                className="btn btn-primary py-3"
                onClick={() => {
                  setAddNew(true);
                }}
              >
                {messages['financial.add.payment.method']}
              </button>
            </Col>
            <Col xs={12}>
              <div className="financialSettings__payment">
                <div className="financialSettings__payment--header">
                  {messages['financial.payment.method']}
                </div>
                {allPayments?.length > 0 &&
                  !gettingData &&
                  allPayments.map((pay) => (
                    <div className="financialSettings__payment--data">
                      <div>
                        <button
                          type="button"
                          className="icon-wrapper-btn"
                          onClick={() => {
                            setEditedPayment(pay);
                            setPaymentIdForModal(pay.id);
                          }}
                        >
                          <span className="financialSettings__payment--data__payName">
                            <SVG src={toAbsoluteUrl('/menu.svg')} />
                            <span className="mx-2">
                              {locale === 'ar' ? pay.nameAR : pay.nameEN}
                            </span>
                          </span>
                        </button>
                      </div>
                      <Tooltip
                        arrow
                        TransitionComponent={Fade}
                        title={messages['common.edit']}
                      >
                        <button
                          type="button"
                          className="icon-wrapper-btn btn-icon-transparent mx-1"
                          onClick={() => {
                            setEditedPayment(pay);
                            setPaymentIdForModal(pay.id);
                          }}
                        >
                          <i
                            className={`flaticon2-${locale === 'ar' ? 'back' : 'next'}`}
                          ></i>
                        </button>
                      </Tooltip>
                    </div>
                  ))}
                {/* after loading and no data */}
                {allPayments.length === 0 && !gettingData && (
                  <div className="financialSettings__payment--data justify-content-center">
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        setAddNew(true);
                      }}
                    >
                      <i className="flaticon2-plus"></i>{' '}
                      {messages['financial.add.payment.method']}
                    </button>
                  </div>
                )}
                {/* loading only */}
                {gettingData && (
                  <div className="financialSettings__payment--data justify-content-center">
                    <CircularProgress size={24} className="mx-auto" color="secondary" />
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={12} className="settings__section">
          <Row>
            <Col lg={8} md={6}>
              <h3 className="settings__section-title">
                {messages['financial.vat.settings']}
              </h3>
              <p className="settings__section-description">
                {messages['financial.vat.settings.info']}
              </p>
            </Col>
            <Col lg={4} md={6}>
              <div className="mb-2">
                <BeutiInput
                  label={messages['financial.vat.number']}
                  useFormRef={register('vatNumber')}
                  error={errors.vatNumber?.message}
                />
              </div>
              <div className="mb-2 beuti-icon">
                <BeutiInput
                  label={messages['financial.vat.percentage']}
                  useFormRef={register('VatPercentage')}
                  error={errors.VatPercentage?.message}
                />
                <label htmlFor="servicesCommission" className="icon">
                  &#x25;
                </label>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={12} className="settings__section">
          <Row>
            <Col lg={8} md={6}>
              <h3 className="settings__section-title">
                {messages['financial.emp.comission']}
              </h3>
              <p className="settings__section-description">
                {messages['financial.emp.comission.info']}
              </p>
            </Col>
            <Col lg={4} md={6}>
              <div className="mb-2 beuti-icon">
                <BeutiInput
                  label={messages['financial.emp.comission.label']}
                  useFormRef={register('empComission')}
                  error={errors.empComission?.message}
                />
                <label htmlFor="servicesCommission" className="icon">
                  &#x25;
                </label>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={12} className="settings__section">
          <Row>
            <Col lg={8} md={6}>
              <h3 className="settings__section-title">
                {messages['financial.slogan.settings']}
              </h3>
              <p className="settings__section-description">
                {messages['financial.slogan.settings.info']}
              </p>
            </Col>
            <Col lg={4} md={6} className="mb-3">
              <Editor
                apiKey="qzr3pgntzsvoyd7n4p8isumfqo58rce2mlq2dmwqhiddqqan"
                onInit={(evt, editor) => (editorRef.current = editor)}
                onEditorChange={handleChangeSlogan}
                init={{
                  directionality: `${locale === 'ar' && 'rtl'}`,
                  language: `${locale === 'ar' && 'ar'}`,
                  menubar: false, // remove menubar if not needed
                  toolbar:
                    'styleselect| bold italic underline | alignleft aligncenter alignright alignjustify ltr rtl', // add custom buttons for your toolbar
                  style_formats: [
                    { title: 'H1', block: 'h1' },
                    { title: 'H2', block: 'h2' },
                    { title: 'H3', block: 'h3' },
                    { title: 'H4', block: 'h4' },
                    { title: 'H5', block: 'h5' },
                    { title: 'H6', block: 'h6' },
                    { title: 'Paragraph', block: 'p' },
                  ], // customize the styleselect dropdown in toolbar with only these
                  height: 250, // Editor height
                  resize: false, // disallow editor resize
                  statusbar: false, // remove bottom status bar
                  branding: false, // remove tinymce branding
                  plugins: 'noneditable directionality', // add the noneditable plugin
                  content_css: 'material-outline',
                  skin: 'material-outline', // use the material ui theme
                  dir: true,
                }}
                value={writeSlogan}
              />
              {writeSlogan?.length > maxSloganLength ? (
                <small className="redColor">
                  {messages['admin.settings.SloganError']}
                </small>
              ) : (
                <small>0-500</small>
              )}
            </Col>
          </Row>
        </Col>
      </Row>

      <section className="settings__submit">
        <button
          className="beutibuttonempty mx-2 action"
          type="button"
          onClick={() => history.goBack()}
          disabled={gettingData || updatingData}
        >
          {messages['common.cancel']}
        </button>
        <button
          className="beutibutton action"
          type="submit"
          disabled={gettingData || updatingData}
        >
          {messages['common.save']}
        </button>
      </section>
      <FinancialEditDeleteAddModal
        paymentIdForModal={paymentIdForModal}
        openModal={openEditDeleteModal}
        setOpenModal={setOpenEditDeleteModal}
        title="financial.edit.payment.method.modal.header"
        value={editedPaymnet}
        setValuePayment={setEditedPayment}
        showDelete="common.save"
        setPayload={setPayloadEditDelete}
        setAllPayments={setAllPayments}
        allPayments={allPayments}
      />
      {/* to add new payment method */}
      <FinancialEditDeleteAddModal
        openModal={addNew}
        setOpenModal={setAddNew}
        title="financial.add.payment.method"
        setPayload={setPayloadAddNew}
        setValuePayment={setAddedPayment}
        value={addedPaymnet}
        setAllPayments={setAllPayments}
        allPayments={allPayments}
      />
    </form>
  );
}
