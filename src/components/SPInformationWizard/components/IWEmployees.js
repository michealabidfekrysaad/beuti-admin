import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Col, Row, Image } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { CallAPI } from 'utils/API/APIConfig';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory } from 'react-router';
import { Routes } from 'constants/Routes';
import Alert from '@material-ui/lab/Alert';
import {
  SP_ADD_WIZARD_EMPLOYEES_EP,
  SP_EDIT_WIZARD_EMPLOYEES_EP,
  SP_GET_WIZARD_EMPLOYEES_EP,
} from '../../../utils/API/EndPoints/ServiceProviderEP';
import { handleImageString, toAbsoluteUrl } from '../../../functions/toAbsoluteUrl';
import IWEditDeleteEmployee from './IWEmployees/IWEditDeleteEmployee';
import { IWAddEditEmployeeModal } from './IWEmployees/IWAddEditEmployeeModal';
import { schemaStepThree } from '../schema/IWSchemas';

const IWEmployees = () => {
  const { messages, locale } = useIntl();
  const history = useHistory();
  // 1 === Add Employee
  // 2 === Edit Employee
  const [submitActionType, setSubmitActionType] = useState(1);
  const [openAddEditModal, setOpenAddEditModal] = useState(false);
  const [errorUploadImg, setErrorUploadImg] = useState(false);

  const [showError, setShowError] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schemaStepThree),
  });
  const handleSuccess = (data) => {
    if (data?.data?.data?.success) {
      setOpenAddEditModal(false);
      getAllEmployees(true);
      setValue('employee', {});
      clearErrors();
      setShowError(false);
      setErrorUploadImg(false);
    }
  };
  const { refetch: getAllEmployees, data: employees } = CallAPI({
    name: 'getAllEmployees',
    url: SP_GET_WIZARD_EMPLOYEES_EP,
    enabled: true,
    select: (data) => data.data.data.list,
  });
  const { isFetching: AddLoading, refetch: AddEmployee } = CallAPI({
    name: 'AddEmployee',
    url: SP_ADD_WIZARD_EMPLOYEES_EP,
    body: {
      ...watch('employee'),
      image: handleImageString(watch('employee')?.image),
    },
    method: 'post',
    onSuccess: handleSuccess,
  });
  const { isFetching: EditLoading, refetch: EditEmployee } = CallAPI({
    name: 'EditEmployee',
    url: SP_EDIT_WIZARD_EMPLOYEES_EP,
    body: {
      ...watch('employee'),
      image: handleImageString(watch('employee')?.image),
    },
    method: 'put',
    onSuccess: handleSuccess,
  });
  return (
    <>
      <Row className="informationwizard">
        <Col xs={12} className="informationwizard__title">
          {messages['rw.employees.title']}
        </Col>
        <Col xs={12} className="informationwizard__subtitle mb-5">
          {messages['rw.employees.subtitle']}
        </Col>
        {showError && (
          <Alert
            onClose={() => setShowError(false)}
            severity="error"
            icon={false}
            className="mb-2 w-100"
          >
            {messages['rw.employees.empty.error']}
          </Alert>
        )}

        <Col xs={12} className="informationwizard__box mt-0">
          <Row className="informationwizard__box-add">
            <Col xs="12">
              <button
                type="button"
                className="informationwizard__box-add--plusbtn"
                onClick={() => {
                  setSubmitActionType(1);
                  setOpenAddEditModal(true);
                }}
              >
                <i className="flaticon-plus"></i>
                <span>{messages['rw.employees.add']}</span>
              </button>
            </Col>
          </Row>
          <Row className="informationwizard__box-employess">
            <Col xs="12" className="informationwizard__box-employess-title">
              {employees?.length > 0 && messages['rw.employees.names']}
            </Col>
            <Col xs="12" className="informationwizard__box-employess-list">
              {employees?.length > 0 &&
                employees.map((employee) => (
                  <Row
                    key={employee.id}
                    className="informationwizard__box-employess-list--item"
                  >
                    <Col xs="auto" className="d-flex align-items-center">
                      <div className="informationwizard__box-employess-list--item-img">
                        <Image src={employee.photo || toAbsoluteUrl('/Avatar.png')} />
                      </div>
                      <div className="informationwizard__box-employess-list--item-name">
                        {locale === 'ar' ? employee.nameAR : employee.nameEN}
                      </div>
                    </Col>
                    <Col xs="auto" className="d-flex align-items-center">
                      <IWEditDeleteEmployee
                        employee={employee}
                        employees={employees}
                        setValue={setValue}
                        setSubmitActionType={setSubmitActionType}
                        setOpenAddEditModal={setOpenAddEditModal}
                        getAllEmployees={getAllEmployees}
                      />
                    </Col>
                  </Row>
                ))}
            </Col>
            {(!employees || employees?.length === 0) && (
              <Col xs="12" className="informationwizard__box-employess-empty">
                {!employees ? (
                  <div className="spinner-border spinner-border-lg" role="status" />
                ) : (
                  messages['rw.employees.empty']
                )}
              </Col>
            )}
          </Row>
        </Col>
        <Col className="text-center my-5" xs="12">
          <button
            type="button"
            onClick={() => history.push(Routes.spinformationwizardStepTwo)}
            className="informationwizard__previous"
          >
            {messages['common.previous']}
          </button>
          <button
            type="button"
            className="informationwizard__submit"
            onClick={() =>
              employees.length > 0
                ? history.push(Routes.spinformationwizardStepFour)
                : setShowError(true)
            }
          >
            {messages['common.next']}
          </button>
        </Col>
      </Row>
      <IWAddEditEmployeeModal
        submitActionType={submitActionType}
        openModal={openAddEditModal}
        setOpenModal={setOpenAddEditModal}
        register={register}
        handleSubmit={handleSubmit((data) =>
          submitActionType === 2 ? EditEmployee(true) : AddEmployee(true),
        )}
        setValue={setValue}
        watch={watch}
        loading={EditLoading || AddLoading}
        errors={errors}
        clearErrors={clearErrors}
        control={control}
        errorUploadImg={errorUploadImg}
        setErrorUploadImg={setErrorUploadImg}
      />
    </>
  );
};

export default IWEmployees;
