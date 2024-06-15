import React, { useContext, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { BranchesContext } from 'providers/BranchesSelections';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { handleImageString } from 'functions/toAbsoluteUrl';
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

const AddEmployee = () => {
  const { messages } = useIntl();
  const { branches, allBranchesData } = useContext(BranchesContext);
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
  useEffect(() => {
    setValue(
      'employee.branches',
      allBranchesData.map((branch) =>
        branches.find((id) => +branch.id === +id)
          ? { ...branch, isSelected: true }
          : { ...branch, isSelected: false },
      ),
    );
  }, [branches]);

  const { refetch: addNewEmployeeCall } = CallAPI({
    name: 'addEmployee',
    url: 'Employee/AddEmployee',
    refetchOnWindowFocus: false,
    method: 'post',
    body: {
      ...watch('employee'),
      image: handleImageString(watch('employee.image')),
      mobileNumber: watch('employee.mobileNumber')
        ? `05${watch('employee.mobileNumber')}`
        : null,

      branches: watch('employee')
        ?.branches?.filter((branch) => branch.isSelected)
        ?.map((service) => ({
          branchId: service.id,
          services: service.services?.map((item) => JSON.parse(item)),
        })),
      staffTItleAr: watch('employee.staffTItleAr')?.length
        ? watch('employee.staffTItleAr')
        : null,
      staffTItleEn: watch('employee.staffTItleEn')?.length
        ? watch('employee.staffTItleEn')
        : null,
    },
    onSuccess: (res) => {
      if (res?.data?.isSuccess) {
        history.push('/settings/settingEmployees/0');
        toast.success(messages['admin.employee.add.successMessage']);
      }
    },
  });
  return (
    <form onSubmit={handleSubmit(addNewEmployeeCall, (err) => console.log(err))}>
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
          <EmployeeLocation control={control} errors={errors} employeeID={false} />
        </Col>
        {watch('employee.branches').length > 0 && (
          <Col xs={12} className="settings__section">
            <EmployeeSelectBranchs
              errors={errors}
              register={register}
              watch={watch}
              setValue={setValue}
              AllBranches={watch('employee.branches')}
              clearErrors={clearErrors}
            />
          </Col>
        )}
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
  );
};

export default AddEmployee;
