/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { CallAPI } from 'utils/API/APIConfig';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal, Row, Col } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import empAvatar from 'images/emp-avatar.png';
import {
  SERVICE_PROVIDER_ADD_SERVICE,
  SERVICE_PROVIDER_UPDATE_SERVICE,
  SP_GET_WIZARD_EMPLOYEES_EP,
  SP_REQUIRE_LOCATION_UPDATE,
} from 'utils/API/EndPoints/ServiceProviderEP';
import { durationEn, durationAr } from 'constants/hours';
import SelectInputMUI from 'Shared/inputs/SelectInputMUI';
import RadioInputMUI from 'Shared/inputs/RadioInputMUI';
import { SchemaAddNewService } from '../../schema/SchemasCategoriesServices';
import BeutiInput from '../../../../Shared/inputs/BeutiInput';
import ServiceAutoCompelete from '../../../AdminViews/Services/ServicesAutoCompelete';
import BeutiButton from '../../../../Shared/inputs/BeutiButton';
import { CheckLocationResponseModal } from './CheckLocationRsponseModal';
import { SP_GET_USER_BRANCHES } from '../../../../utils/API/EndPoints/BranchManager';

export function AddNewServiceModal({
  openModal,
  setOpenModal,
  title,
  editedService,
  allCategoriesWithoutServices,
  parentCategoryForService,
  setEditedService,
  refetchAll,
}) {
  const { messages, locale } = useIntl();
  const durationService = locale === 'ar' ? durationAr : durationEn;
  const schemaServicesValidations = SchemaAddNewService();
  const [payloadAdd, setPayloadAdd] = useState(null);
  const [payloadUpdate, setPayloadUpdate] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [nameAR, setnameAR] = useState('');
  const [nameEn, setnameEn] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [checkEditLocation, setCheckEditLocation] = useState(false);
  const [fnToCall, setFnToCall] = useState(false);
  const [openCheckingModal, setOpenCheckingModal] = useState(null);
  const [messageFromBE, setMessageFromBE] = useState(false);
  const [dataShowOnScreen, setDataShowOnScreen] = useState(false);

  const optionsList = useMemo(
    () => [
      {
        id: 1,
        label: messages['wizard.add.new.service.location.home'],
      },
      {
        id: 2,
        label: messages['wizard.add.new.service.location.salon'],
      },
      {
        id: 3,
        label: messages['wizard.add.new.service.location.both'],
      },
    ],
    [],
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: { serLocation: '2', serviceAr: '', duration: null },
    mode: 'all',
    resolver: yupResolver(schemaServicesValidations),
  });

  const { data: AllBranches } = CallAPI({
    name: 'getAllBranchesForInfoWizard',
    url: SP_GET_USER_BRANCHES,
    refetchOnWindowFocus: false,
    enabled: true,
    select: (res) => res?.data?.data?.list,
  });

  /* -------------------------------------------------------------------------- */
  /*               check for location before edit service location              */
  /* -------------------------------------------------------------------------- */
  const {
    data: branchNameWithNewLocation,
    refetch: checkLocationWhenEdit,
    isFetching: fetchingcheckLocationEdit,
  } = CallAPI({
    name: 'checkLocationEditForWizard',
    url: SP_REQUIRE_LOCATION_UPDATE,
    method: 'post',
    // retry: 1,
    refetchOnWindowFocus: false,
    body: { ...checkEditLocation },
    onSuccess: (res) => {
      if (!res?.length > 0) {
        // if response can delete ok trigger payload update
        if (editedService) refetchUpdateService();
        if (!editedService) refetchAddService();
      } else {
        // else show confirmation message if confirm trigger update if cancel do nothing
        setOpenCheckingModal(true);
        setMessageFromBE('service.location.with.emp.location');
        setOpenModal(false);
        setSearchValue('');
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    select: (res) => res?.data?.data,
  });

  /* -------------------------------------------------------------------------- */
  /*                           API to add new service                           */
  /* -------------------------------------------------------------------------- */
  const { refetch: refetchAddService, isFetching: fetchingAddService } = CallAPI({
    name: 'addNewService',
    url: SERVICE_PROVIDER_ADD_SERVICE,
    method: 'post',
    // retry: 1,
    refetchOnWindowFocus: false,
    body: { ...payloadAdd },
    onSuccess: (res) => {
      if (res) {
        //   close modal, recall all service again
        closeAndreset();
        refetchAll();
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  /* -------------------------------------------------------------------------- */
  /*                  API to get the details of single service                  */
  /* -------------------------------------------------------------------------- */
  const {
    data: serviceSavedInDataBase,
    refetch: getServiceDetails,
    isFetching: fetchService,
  } = CallAPI({
    name: 'getSingleSerDetails',
    url: 'Service/GetServices',
    method: 'get',
    query: { serviceId: editedService },
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      if (res?.data?.data) {
        const catWithService = res?.data?.data?.list.find(
          (singleRow) => singleRow.id === parentCategoryForService,
        );
        const selectedService = catWithService?.categoryServiceDto.find(
          (singleService) => singleService.id === editedService,
        );
        if (selectedService?.locationId === 3) {
          setEmployees(allEmp);
        } else {
          setEmployees(
            allEmp?.filter(
              (emp) =>
                +emp.workingLocation === +selectedService?.locationId ||
                +emp.workingLocation === 3,
            ),
          );
        }
        setnameAR(selectedService?.nameAR);
        setValue(
          'checkbox',
          selectedService?.employees.map((singleEmp) => singleEmp?.employeeID.toString()),
          { shouldValidate: true },
        );
        setValue('duration', selectedService?.duration?.substr(0, 5));
        setValue('serLocation', selectedService?.locationId.toString());
        setValue('categories', catWithService?.id);
        setValue('serviceEn', selectedService?.nameEn);
        setValue('serviceAr', selectedService?.nameAR);
        setValue('price', selectedService?.priceValue);
        setTimeout(() => {
          setDataShowOnScreen(true);
        }, 1000);
      }
    },
    onError: (err) => toast.error(err?.message),
  });
  /* -------------------------------------------------------------------------- */
  /*                     API to  updateed  selected service                     */
  /* -------------------------------------------------------------------------- */
  const { refetch: refetchUpdateService, isFetching: updatingService } = CallAPI({
    name: 'updateService',
    url: SERVICE_PROVIDER_UPDATE_SERVICE,
    refetchOnWindowFocus: false,
    method: 'post',
    body: { ...payloadUpdate },
    retry: 0,
    onSuccess: (res) => {
      if (res) {
        closeAndreset();
        refetchAll();
      }
    },
    onError: (err) =>
      toast.error(err?.response?.message || err?.response?.data?.error?.message),
  });

  /* -------------------------------------------------------------------------- */
  /*                          API to  get all employess                         */
  /* -------------------------------------------------------------------------- */
  const { refetch: refetchEmp, data: allEmp, isFetching: fetchEmp } = CallAPI({
    name: 'getEmployeeForService',
    url: SP_GET_WIZARD_EMPLOYEES_EP,
    refetchOnWindowFocus: false,
    retry: 0,
    select: (data) =>
      data?.data?.data?.list.map((oneEmp) => ({
        id: oneEmp.id,
        name: locale === 'ar' ? oneEmp.nameAR : oneEmp.nameEN,
        image: oneEmp.photo,
        workingLocation: oneEmp.workingLocation,
      })),
    onSuccess: (res) => {
      if (res) {
        setEmployees(res);
        // call details of servcie after get  all emp
        if (editedService) getServiceDetails();
      }
    },
    onError: (err) => toast.error(err?.response?.data),
  });

  useEffect(() => {
    if (openModal) {
      refetchEmp();
    }
  }, [openModal]);

  useEffect(() => {
    if (watch('serLocation') && !fetchEmp && !editedService) {
      if (+watch('serLocation') === 3) {
        setEmployees(allEmp);
      } else {
        setValue('checkbox', []);
        setEmployees(
          allEmp?.filter(
            (emp) =>
              +emp.workingLocation === +watch('serLocation') ||
              +emp.workingLocation === 3,
          ),
        );
      }
    }
    if (watch('serLocation') && !fetchEmp && editedService && dataShowOnScreen) {
      if (+watch('serLocation') === 3) {
        setEmployees(allEmp);
      } else {
        setValue('checkbox', []);
        setEmployees(
          allEmp?.filter(
            (emp) =>
              +emp.workingLocation === +watch('serLocation') ||
              +emp.workingLocation === 3,
          ),
        );
      }
    }
  }, [watch('serLocation'), fetchEmp]);

  const handleEnNameInput = (value) => {
    setValue('serviceEn', value, { shouldValidate: true });
    setnameEn(value);
  };
  const submitFormServices = (data) => {
    //   send data to API and clear  the inputs and  make logic
    const arrayOfEmp = [];
    // check if sp has one  emp or not due  to validation
    if (typeof data?.checkbox === 'string') {
      arrayOfEmp.push({ employeeID: data?.checkbox });
    } else {
      data?.checkbox.map((emp) => arrayOfEmp.push({ employeeID: emp }));
    }
    if (!editedService) {
      setCheckEditLocation({
        branchEmployees: [
          {
            branchName: AllBranches?.find(
              (br) => +br?.id === JSON.parse(localStorage.getItem('selectedBranches'))[0],
            )?.name,
            branchId: JSON.parse(localStorage.getItem('selectedBranches'))[0],
            employeeIds: arrayOfEmp?.map((el) => el?.employeeID),
          },
        ],
      });
      setPayloadAdd({
        categoryId: data.categories,
        nameEn: data.serviceEn,
        nameAR: data.serviceAr,
        duration: data.duration,
        price: data.price,
        location: +data.serLocation,
        employeeServices: arrayOfEmp,
      });
    } else {
      setCheckEditLocation({
        serviceId: +editedService,
        branchEmployees: [
          {
            branchName: AllBranches?.find(
              (br) => +br?.id === JSON.parse(localStorage.getItem('selectedBranches'))[0],
            )?.name,
            branchId: JSON.parse(localStorage.getItem('selectedBranches'))[0],
            employeeIds: arrayOfEmp?.map((el) => el?.employeeID),
          },
        ],
      });
      setPayloadUpdate({
        id: +editedService,
        categoryId: +data.categories,
        nameEn: data.serviceEn,
        nameAR: data.serviceAr,
        duration: data.duration,
        price: +data.price,
        location: +data.serLocation,
        employeeServices: arrayOfEmp,
      });
    }
  };

  const closeAndreset = () => {
    setOpenModal(false);
    reset();
    setnameAR('');
    setSearchValue('');
    setnameEn('');
    setEditedService(null);
    setPayloadAdd(null);
    setPayloadUpdate(null);
    setDataShowOnScreen(false);
  };

  useEffect(() => {
    if (watch('serviceEn')) {
      setnameEn('');
    }
  }, [watch('serviceEn'), nameEn]);

  //   add new service refetch API
  useEffect(() => {
    if (payloadAdd && !editedService) {
      checkLocationWhenEdit();
    }
    if (payloadUpdate && editedService) {
      // call the response before edit selected service
      checkLocationWhenEdit();
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
        <form onSubmit={handleSubmit(submitFormServices)}>
          <>
            <Modal.Header>
              <Modal.Title className="title">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {!fetchService && !fetchEmp ? (
                <>
                  <Row className="addServiceWizard px-4">
                    <Col xs={12} className="addServiceWizard__title">
                      {messages['wizard.add.new.category.information']}
                    </Col>
                    <Col xs={12} className="addServiceWizard__subtitle">
                      {messages['wizard.add.new.service.sub.title']}
                    </Col>
                  </Row>
                  <Row className="px-4">
                    <Col lg="12" xs="12" className="mt-2 mb-2">
                      <SelectInputMUI
                        list={allCategoriesWithoutServices}
                        defaultValue={parentCategoryForService}
                        useFormRef={register('categories')}
                        watch={watch}
                        label={messages['wizard.add.new.service.category.label']}
                        error={errors.categories?.message}
                      />
                    </Col>
                    <Col lg="6" xs="12" className=" mb-2">
                      <ServiceAutoCompelete
                        handleEnNameInput={handleEnNameInput}
                        handleArNameInput={(value) => setnameAR(value)}
                        nameAr={nameAR}
                        useFormRef={register(
                          'serviceAr',
                          {
                            onChange: (e) => {
                              setnameAR(e.target.value);
                              setSearchValue(e.target.value);
                            },
                          },
                          { shouldValidate: true },
                        )}
                        error={errors.serviceAr?.message}
                        searchValue={searchValue}
                      />
                    </Col>
                    <Col lg="6" xs="12" className=" mb-2">
                      <BeutiInput
                        label={`${messages['wizard.add.new.service.en.name']} *`}
                        error={errors.serviceEn?.message && errors.serviceEn?.message}
                        useFormRef={register('serviceEn')}
                        //   disabled={isFetching || data?.data?.success}
                      />
                    </Col>
                  </Row>
                  <hr />
                  <Row className="addServiceWizard px-4 mt-5">
                    <Col xs="12" className="addServiceWizard__title">
                      {messages['wizard.add.new.service.price.duration']}
                    </Col>
                    <Col xs="12" className="addServiceWizard__subtitle">
                      {messages['wizard.add.new.service.price.duration.sub.title']}
                    </Col>
                  </Row>

                  <Row className="px-4">
                    <Col lg="6" xs="12" className="mt-2 mb-2">
                      <SelectInputMUI
                        list={durationService}
                        defaultValue={watch('duration') || null}
                        useFormRef={register('duration')}
                        watch={watch}
                        label={messages['wizard.add.new.service.duration']}
                        error={errors.duration?.message}
                      />
                    </Col>
                    <Col lg="6" xs="12" className="mt-2 mb-2">
                      <BeutiInput
                        label={messages['wizard.add.new.service.price']}
                        useFormRef={register('price')}
                        error={errors.price?.message && errors.price?.message}
                        note={messages['wizard.add.new.service.price.note']}
                        //   disabled={isFetching || data?.data?.success}
                      />
                    </Col>
                  </Row>
                  <hr />
                  <Row className="addServiceWizard px-4 mt-5">
                    <Col xs={12} className="addServiceWizard__title">
                      {messages['wizard.add.new.service.price.location']}
                    </Col>
                  </Row>
                  <Row className="px-4">
                    <Col xs={12} className="mt-4">
                      <RadioInputMUI
                        list={optionsList}
                        control={control}
                        name="serLocation"
                        value="2"
                        error={errors?.serLocation?.message}
                      />
                    </Col>
                  </Row>
                  <hr />
                  <Row className="addServiceWizard px-4 mt-5">
                    <Col xs={12} className="addServiceWizard__title">
                      {messages['wizard.add.new.service.emp']}
                    </Col>
                    <Col xs={12} className="addServiceWizard__subtitle">
                      {messages['wizard.add.new.service.emp.sub.title']}
                    </Col>
                  </Row>
                  <Row className="px-4 align-items-center">
                    {employees?.length > 0 &&
                      employees.map((emp, index) => (
                        <>
                          <Col key={emp.id} xs="6" lg="4" className="mt-4">
                            <div className="form-group form-check addEmpService">
                              {/* fake emp for the validation success array */}
                              <input
                                name={emp.name}
                                id={emp.id + index.toString() + emp.name}
                                type="checkbox"
                                value={emp.id + emp.name}
                                {...register('checkbox')}
                                className="custom-color d-none"
                              />
                              <input
                                name={emp.name}
                                id={emp.id + index.toString()}
                                type="checkbox"
                                value={emp.id}
                                {...register('checkbox')}
                                className={`custom-color ${
                                  errors.checkbox ? 'is-invalid' : ''
                                }`}
                              />
                              <label
                                htmlFor={emp.id + index.toString()}
                                className="form-check-label addEmpService__label"
                              >
                                <img
                                  src={emp?.image || empAvatar}
                                  className="addEmpService__label--roundedImg"
                                  alt={emp?.name}
                                />

                                <p className="addEmpService__label--empName">
                                  {emp.name}
                                </p>
                              </label>
                            </div>
                          </Col>
                        </>
                      ))}
                    {errors.checkbox?.message && (
                      <Col xs="12">
                        <p className="beuti-input__errormsg" style={{ bottom: '-10px' }}>
                          {errors.checkbox?.message}
                        </p>
                      </Col>
                    )}
                  </Row>
                </>
              ) : (
                <div className="loading mb-4 pb-4"></div>
              )}
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
                loading={
                  fetchingAddService ||
                  updatingService ||
                  fetchService ||
                  fetchingcheckLocationEdit ||
                  fetchEmp
                }
                disabled={fetchingcheckLocationEdit}
                text={messages['common.add']}
                className="px-4 confirm"
                type="submit"
              />
            </Modal.Footer>
          </>
        </form>
      </Modal>

      {/* check location service modal confirmation */}
      <CheckLocationResponseModal
        fnToCall={fnToCall}
        setFnToCall={setFnToCall}
        title="wizard.add.new.service.price.location"
        message={messageFromBE}
        openModal={openCheckingModal}
        setOpenModal={setOpenCheckingModal}
        refetchUpdateService={refetchUpdateService}
        openCloseBigModal={setOpenModal}
        refetchAddService={refetchAddService}
        editedService={editedService}
        branchNameWithNewLocation={branchNameWithNewLocation}
      />
    </>
  );
}

AddNewServiceModal.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  title: PropTypes.string,
  editedService: PropTypes.number,
  allCategoriesWithoutServices: PropTypes.array,
  parentCategoryForService: PropTypes.number,
  setEditedService: PropTypes.func,
  refetchAll: PropTypes.func,
};
