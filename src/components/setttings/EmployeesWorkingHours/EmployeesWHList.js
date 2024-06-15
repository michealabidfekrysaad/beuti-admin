/* eslint-disable  */
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router-dom';
import EmployeesWHTable from './EmployeesWHList/EmployeesWHTable';
import './EmployeesWHList.scss';
import { CallAPI } from '../../../utils/API/APIConfig';
import { Col, Row } from 'react-bootstrap';
import moment from 'moment';
import { AddEmployeeWHModal } from './AddEditEmployeeWH/AddEmployeeWhModal';
import { useForm } from 'react-hook-form';
import { BranchesContext } from 'providers/BranchesSelections';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  currentAcion,
  defaultDayObject,
  handleNextDayDates,
  handleNextDayDatesIncoming,
} from './Helper/AddWHFunction';
import { AddEmployeeWHSchema } from './EmployeeWHSchema';
import { RepeatShiftModal } from './AddEditEmployeeWH/RepeatShiftConfrimation';
import EmployeeWHSelectDate from './EmployeesWHList/EmployeeWHSelectDate';
import { DeleteShiftConfirmation } from './AddEditEmployeeWH/DeleteShiftConfirmation';
import { toast } from 'react-toastify';
import { get } from 'lodash';

export default function EmployeesWHList() {
  const { locale, messages } = useIntl();
  moment.locale('en');

  const { page } = useParams();
  const history = useHistory();
  const AllEmployeesPlaceholder = useMemo(
    () => ({ employeeId: 0, name: messages['setting.employee.wh.allEmployees'] }),
    [],
  );
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openRepeatModal, setOpenRepeatModal] = useState(false);
  const [addOrEdit, setAddOrEdit] = useState(currentAcion.add);
  const [viewEmployee, setViewEmployee] = useState([]);
  const [paginatedEmployees, setPaginatedEmployees] = useState([]);
  const [filterEmployees, setFilterEmployees] = useState([AllEmployeesPlaceholder]);
  const [paginationController, setPaginationController] = useState({
    pagesMax: 10,
    pageNumber: +page || 0,
  });
  const [selectedDate, setSelectedDate] = useState({
    start: moment(new Date())
      .startOf('week')
      .format('YYYY-MM-DD'),
    end: moment(new Date())
      .endOf('week')
      .format('YYYY-MM-DD'),
  });

  const { branches } = useContext(BranchesContext);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(AddEmployeeWHSchema),
    defaultValues: {
      day: {
        ...defaultDayObject,
      },
    },
  });

  const { data: salonWorkingTime } = CallAPI({
    name: 'GetSalonWorkingHours',
    url: 'WorkingDay/GetWorkingDays',
    enabled: true,
    refetchOnWindowFocus: false,

    select: (data) => {
      const HashMapWeek = {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      };
      for (const i of data.data?.data) {
        HashMapWeek[i.day] = i;
      }
      setValue('salonWorkingDays', HashMapWeek);
      return HashMapWeek;
    },
  });

  /* -------------------------------------------------------------------------- */
  /*              Get Employee Working Hours And Handle Pagination              */
  /* -------------------------------------------------------------------------- */
  const { data: EmployeeWorkingHours, refetch: getEmployeesWorkingHours } = CallAPI({
    name: ['employeeWorkingDay', selectedDate.start, selectedDate.end],
    url: 'EmployeeWorkDay/Get',
    enabled: true,
    refetchOnWindowFocus: false,
    query: {
      startDate: selectedDate.start,
      endDate: selectedDate.end,
    },
    body: [],
    onSuccess: (res) => {
      moment.locale(locale);

      setPaginatedEmployees(
        res?.slice(
          paginationController.pageNumber * 10,
          paginationController.pageNumber * 10 + paginationController.pagesMax,
        ),
      );
    },
    select: (data) => {
      const EmployeeList = data?.data?.data;
      const sortWorkingDays = EmployeeList.map((employee) => ({
        ...employee,
        employeesWorkDays: employee.employeesWorkDays?.sort((a, b) => a.day - b.day),
      }));
      return sortWorkingDays.map((data) => ({
        ...data,
        employeesWorkDays: data.employeesWorkDays
          ? handleNextDayDatesIncoming(data.employeesWorkDays)
          : data.employeesWorkDays,
      }));
    },
  });
  useEffect(() => {
    if (EmployeeWorkingHours) {
      setPaginatedEmployees(
        EmployeeWorkingHours?.slice(
          paginationController.pageNumber * 10,
          paginationController.pageNumber * 10 + paginationController.pagesMax,
        ),
      );
    }
  }, [paginationController]);

  useEffect(() => {
    const clonePagaintedList = JSON.parse(JSON.stringify(paginatedEmployees));
    setViewEmployee(
      clonePagaintedList.filter((emp) =>
        filterEmployees.find((filtedEmp) => filtedEmp.employeeId === emp.employeeId),
      ),
    );
  }, [filterEmployees, paginatedEmployees]);
  useEffect(() => {
    if (filterEmployees.length === 0) {
      setFilterEmployees([AllEmployeesPlaceholder]);
    }
  }, [filterEmployees]);
  useEffect(() => {
    history.push(`/settings/settingEmployeesWH/${paginationController.pageNumber}`);
  }, [paginationController]);

  useEffect(() => {
    history.push(`/settings/settingEmployeesWH/0`);
    setPaginationController({ pagesMax: 10, pageNumber: 0 });
  }, [branches]);
  /* -------------------------------------------------------------------------- */
  /*                        Handle Employee Working Hours                       */
  /* -------------------------------------------------------------------------- */
  const resetValuesAndCloseModal = () => {
    setValue('day', { ...defaultDayObject });
    setValue('employee', '');
    setOpenUpdateModal(false);
    getEmployeesWorkingHours(true);
  };

  const { refetch: updateEmployeeWHCall } = CallAPI({
    name: 'employeeWorkingDayUpdate',
    url: 'EmployeeWorkDay/Update',
    method: 'post',
    body: {
      ...watch('day'),
      selectedDate: watch('day')?.date,
      employeeId: watch('employee')?.employeeId,
      shifts: handleNextDayDates(watch('day')?.shifts),
    },
    onSuccess: (data) => {
      if (data?.data?.data?.success) {
        toast.success(messages['common.edited.success']);
        resetValuesAndCloseModal();
      }
    },
  });
  const handleSubmitUpdate = () => {
    if (watch('day.employeeWorkDayEndRepeat') && !watch('day.employeeWorkDayRepeat')) {
      setOpenUpdateModal(false);
      setOpenRepeatModal(true);
    } else {
      updateEmployeeWHCall(true);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*              Set Default Value For Date In Repeat Confirmation             */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (watch) {
      const subscription = watch((input, { name }) => {
        if (
          (name === 'day.employeeWorkDayRepeat' ||
            name === 'day.employeeWorkDayEndRepeat') &&
          !get(input, 'day.employeeWorkDayRepeat') &&
          !get(input, 'day.repeatEndDate')
        ) {
          setValue('day.repeatEndDate', get(input, 'day.date'));
        }
      });
      return () => subscription.unsubscribe();
    }
    return null;
  }, [watch]);
  /* -------------------------------------------------------------------------- */
  /*                           Delete No Repeat Shifts                          */
  /* -------------------------------------------------------------------------- */
  const { refetch: deleteEmployeeWHCallNoRepeat } = CallAPI({
    name: 'DeleteNoRepeatShifts',
    url: 'EmployeeWorkDay/Update',
    method: 'post',
    body: {
      ...watch('day'),
      employeeWorkDayEndRepeat: 0,
      employeeWorkDayRepeat: 1,
      selectedDate: watch('day')?.date,
      employeeId: watch('employee')?.employeeId,
      shifts: [],
    },
    onSuccess: (data) => {
      if (data?.data?.data?.success) {
        toast.success(messages['common.deletedSuccess']);
        resetValuesAndCloseModal();
      }
    },
  });
  return (
    <>
      <Row className="settings">
        <Col xs="12">
          <Row className="justify-content-between align-items-center py-3">
            <Col xs="3">
              <h3 className="settings__section-title">
                {messages['setting.employee.wh.title']}
              </h3>
              <p className="settings__section-description">
                {messages['setting.employee.wh.description']}
              </p>
            </Col>
            <Col xs="auto" className="flex-grow-1">
              <EmployeeWHSelectDate
                setSelectedDate={setSelectedDate}
                selectedDate={selectedDate}
                setFilterEmployees={setFilterEmployees}
                filterEmployees={filterEmployees}
                AllEmployeesPlaceholder={AllEmployeesPlaceholder}
                paginatedEmployees={paginatedEmployees}
              />
            </Col>
          </Row>
        </Col>
        <Col xs="12">
          <div className="mb-5" id="employee-work-hour">
            <EmployeesWHTable
              employeeTotal={viewEmployee.length > 0 ? viewEmployee : paginatedEmployees}
              workingTimeSalon={salonWorkingTime}
              paginationController={paginationController}
              setPaginationController={setPaginationController}
              countData={
                viewEmployee.length === 0
                  ? EmployeeWorkingHours?.length
                  : viewEmployee?.length
              }
              watch={watch}
              setValue={setValue}
              setOpenUpdateModal={setOpenUpdateModal}
              setAddOrEdit={setAddOrEdit}
            />
          </div>
        </Col>
        {/* Modals */}
        <AddEmployeeWHModal
          openModal={openUpdateModal}
          setOpenModal={setOpenUpdateModal}
          workingTimeSalon={salonWorkingTime}
          setOpenDeleteModal={setOpenDeleteModal}
          register={register}
          setValue={setValue}
          watch={watch}
          handleSubmit={handleSubmit(handleSubmitUpdate)}
          errors={errors}
          resetValuesAndCloseModal={resetValuesAndCloseModal}
          addOrEdit={addOrEdit}
          deleteEmployeeWHCallNoRepeat={deleteEmployeeWHCallNoRepeat}
        />
        <RepeatShiftModal
          openModal={openRepeatModal}
          setOpenModal={setOpenRepeatModal}
          setOpenAddModal={setOpenUpdateModal}
          watch={watch}
          updateEmployeeWHCall={updateEmployeeWHCall}
          handleNextDayDates={handleNextDayDates}
          resetValuesAndCloseModal={resetValuesAndCloseModal}
        />
        <DeleteShiftConfirmation
          openModal={openDeleteModal}
          setOpenModal={setOpenDeleteModal}
          setOpenAddModal={setOpenUpdateModal}
          watch={watch}
          updateEmployeeWHCall={updateEmployeeWHCall}
          handleNextDayDates={handleNextDayDates}
          resetValuesAndCloseModal={resetValuesAndCloseModal}
          deleteEmployeeWHCallNoRepeat={deleteEmployeeWHCallNoRepeat}
        />
      </Row>
    </>
  );
}
