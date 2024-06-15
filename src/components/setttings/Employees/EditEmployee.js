import React, { useContext, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { BranchesContext } from 'providers/BranchesSelections';
import { yupResolver } from '@hookform/resolvers/yup';
import { handleImageString } from 'functions/toAbsoluteUrl';
import { toast } from 'react-toastify';
import { EMPLOYEE_CHECK_BEFORE_DELETE } from 'utils/API/EndPoints/EmployeeEP';
import EmployeeDetails from './AddEditEmployee/EmployeeDetails';
import EmployeeLocation from './AddEditEmployee/EmployeeLocation';
import PosCashier from './AddEditEmployee/PosCashier';
import ContactInformation from './AddEditEmployee/ContactInformation';
import EmployeeCommission from './AddEditEmployee/EmployeeCommission';
import EmployeeInformation from './AddEditEmployee/EmployeeInformation';
import { initalEmployeeData } from './AddEditEmployee/initalObjectEmployee';
import { AddEditEmployeeSchema } from './AddEditEmployee/EmployeeValidationSchema';
import EmployeeSelectBranchs from './AddEditEmployee/EmployeeSelectBranchs';
import { CallAPI } from '../../../utils/API/APIConfig';
import { SP_GET_USER_BRANCHES } from '../../../utils/API/EndPoints/BranchManager';
import { WarningErrorModal } from './WarningModals/WarningModal';

const EditEmployee = () => {
  const { messages } = useIntl();
  const { branches } = useContext(BranchesContext);
  const { employeeID } = useParams();
  const [warningServicesEdit, setWarningServicesEdit] = useState([]);
  const [originalLocationEmp, setOriginalLocationEmp] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState(false);
  const [showConfirmBtn, setShowConfirmBtn] = useState(false);
  const [userAcceptChange, setUserAcceptChange] = useState(false);

  const history = useHistory();
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
    defaultValues: {
      employee: initalEmployeeData,
    },
    resolver: yupResolver(AddEditEmployeeSchema),
  });
  CallAPI({
    name: 'getAllBranches',
    url: SP_GET_USER_BRANCHES,
    refetchOnWindowFocus: false,
    enabled: !!branches?.length,
    onSuccess: (branchesList) => {
      if (employeeID) {
        setValue('employee.branches', [
          branchesList.find((branch) => branch.id === branches[0]),
        ]);
      } else {
        setValue('employee.branches', branchesList);
      }
    },

    select: (res) =>
      res?.data?.data?.list.map((branch) =>
        branches.find((id) => +branch.id === +id)
          ? { ...branch, isSelected: true }
          : { ...branch, isSelected: false },
      ),
  });
  const { data: empData } = CallAPI({
    name: 'getEmployeeDetails',
    url: 'Employee/GetEmployeeDetails',
    refetchOnWindowFocus: false,
    enabled: !!employeeID && watch('employee.branches').length > 0,
    query: {
      employeeID,
    },
    onSuccess: (employeeData) => {
      setValue('employee.employeeId', employeeData.id);
      setValue('employee.nameEn', employeeData.nameEN);
      setValue('employee.nameAr', employeeData.nameAR);
      setValue('employee.workingLocation', employeeData.workingLocation);
      setValue('employee.mobileNumber', employeeData?.phoneNumber?.substring(2) || null);
      setValue('employee.email', employeeData.email);
      setValue('employee.isCasher', employeeData.isCashier);
      setValue('employee.casherPin', employeeData.pin);
      setValue('employee.staffTItleAr', employeeData.staffTitleAr);
      setValue('employee.staffTItleEn', employeeData.staffTitleEn);
      setValue('employee.notes', employeeData.notes);
      setValue('employee.startWorkingDate', employeeData.startWorkingDate);
      setValue('employee.endWorkingDate', employeeData.endWorkingDate);
      setValue('employee.servicesCommission', employeeData.servicesCommission);
      setValue('employee.productsCommission', employeeData.productsCommission);
      setValue('employee.offersCommission', employeeData.offersCommission);
      setValue('employee.image', employeeData.image);
      setValue(
        'employee.branches',
        watch('employee.branches').map((branch) => ({
          ...branch,
          services: employeeData.services,
        })),
      );
      setOriginalLocationEmp(employeeData.workingLocation);
    },
    select: (res) => ({
      ...res?.data?.data,
      services: res?.data?.data.services.map((service) =>
        JSON.stringify({ serviceId: service.id, locationId: service.workingLocationId }),
      ),
      servicesSelected: res?.data?.data.services?.map((ser) => ({
        ...ser,
        serviceId: ser?.id,
        locationId: ser?.workingLocationId,
      })),
    }),
  });
  const { refetch: editNewEmployeeCall } = CallAPI({
    name: 'EditEmployee',
    url: 'Employee/Edit',
    refetchOnWindowFocus: false,
    method: 'put',
    body: {
      ...watch('employee'),
      image: handleImageString(watch('employee.image')),
      mobileNumber: watch('employee.mobileNumber')
        ? `05${watch('employee.mobileNumber')}`
        : null,
      branches: watch('employee')
        ?.branches?.filter((branch) => branch?.isSelected)
        ?.map((service) => ({
          branchId: service.id,
          services: service.services?.map((item) => JSON.parse(item)),
        })),
      email: watch('employee.email')?.length ? watch('employee.email') : null,
      casherPin: watch('employee.casherPin')?.length ? watch('employee.casherPin') : null,
      staffTItleAr: watch('employee.staffTItleAr')?.length
        ? watch('employee.staffTItleAr')
        : null,
      staffTItleEn: watch('employee.staffTItleEn')?.length
        ? watch('employee.staffTItleEn')
        : null,
    },
    select: (data) => data.data?.data,
    onSuccess: (res) => {
      if (res?.isSuccess) {
        history.push('/settings/settingEmployees/0');
        toast.success(messages['admin.employee.edit.successMessage']);
      }
      if (!res.isSuccess && res?.errorResponse?.isServiceWithoutEmployee) {
        setShowConfirmBtn(false);
        setDisplayedMessage(res?.errorResponse?.serviceWithoutEmployeeMsg);
        setWarningServicesEdit(res?.errorResponse?.services);
      }
    },
    onError: (err) => {
      toast.error(err.response.data.error.message);
    },
  });

  const { refetch: refetchCheckEmpLocation } = CallAPI({
    name: 'checkEmpLocationChange',
    url: EMPLOYEE_CHECK_BEFORE_DELETE,
    refetchOnWindowFocus: false,
    method: 'post',
    body: {
      employeeId: employeeID,
      employeeLocationId: watch('employee.workingLocation'),
      services: empData?.servicesSelected,
    },
    select: (data) => data.data?.data,
    onSuccess: (res) => {
      if (!res?.isSuccess && res?.requiredServiceUpdateMsg && !userAcceptChange) {
        setShowConfirmBtn(true);
        setDisplayedMessage(res?.requiredServiceUpdateMsg);
        return setWarningServicesEdit(res?.requiredServiceUpdateMsg);
      }
      return null;
    },
    onError: (err) => {
      toast.error(err.response.data.error.message);
    },
  });
  return (
    <>
      <form onSubmit={handleSubmit(editNewEmployeeCall)}>
        <Row className="settings">
          <Col xs={12} className="settings__section">
            <EmployeeDetails
              errors={errors}
              register={register}
              watch={watch}
              setValue={setValue}
            />
          </Col>
          <Col xs={12} className="settings__section">
            <EmployeeLocation
              control={control}
              errors={errors}
              employeeID={employeeID}
              watch={watch}
              originalLocationEmp={originalLocationEmp}
              refetchCheckEmpLocation={refetchCheckEmpLocation}
            />
          </Col>
          <Col xs={12} className="settings__section">
            <EmployeeSelectBranchs
              errors={errors}
              register={register}
              watch={watch}
              setValue={setValue}
              employeeID={employeeID}
              clearErrors={clearErrors}
              AllBranches={watch('employee.branches')}
            />
          </Col>
          <Col xs={12} className="settings__section">
            <PosCashier
              errors={errors}
              register={register}
              watch={watch}
              setValue={setValue}
            />
          </Col>
          <Col xs={12} className="settings__section">
            <ContactInformation
              errors={errors}
              register={register}
              watch={watch}
              setValue={setValue}
            />
          </Col>
          <Col xs={12} className="settings__section">
            <EmployeeInformation
              errors={errors}
              register={register}
              watch={watch}
              setValue={setValue}
              clearErrors={clearErrors}
            />
          </Col>
          <Col xs={12} className="settings__section">
            <EmployeeCommission
              errors={errors}
              register={register}
              watch={watch}
              setValue={setValue}
            />
          </Col>
        </Row>
        <section className="settings__submit">
          <button
            className="beutibuttonempty mx-2 action"
            type="button"
            onClick={() => history.goBack()}
            //  disabled={addEditCustomerLoading}
          >
            {messages['common.cancel']}
          </button>
          <button
            className="beutibutton action"
            type="submit"
            //  disabled={addEditCustomerLoading}
          >
            {messages['common.save']}
          </button>
        </section>
      </form>
      <WarningErrorModal
        openModal={!!warningServicesEdit.length >= 1}
        setOpenModal={setWarningServicesEdit}
        services={warningServicesEdit}
        title={
          showConfirmBtn
            ? 'setting.employee.location.title'
            : 'setting.employee.reassign.warning.title'
        }
        message={displayedMessage}
        showConfirmBtn={showConfirmBtn}
        setShowConfirmBtn={setShowConfirmBtn}
        empSavedLocationDefault={() => {
          setValue('employee.workingLocation', originalLocationEmp);
          setValue(
            'employee.branches',
            watch('employee.branches').map((branch) => ({
              ...branch,
              services: empData.services,
            })),
          );
        }}
        noCheckAgain={() => setUserAcceptChange(true)}
      />
    </>
  );
};

export default EditEmployee;
