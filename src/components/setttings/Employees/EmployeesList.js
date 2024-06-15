import React, { useContext, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import BeutiButton from 'Shared/inputs/BeutiButton';
import { useHistory, useParams } from 'react-router-dom';
import BeutiPagination from 'components/shared/BeutiPagination';
import { ConfirmationModal } from 'components/shared/ConfirmationModal';
import { Routes } from 'constants/Routes';
import { toast } from 'react-toastify';
import { BranchesContext } from 'providers/BranchesSelections';
import EmployeesTable from './EmployeesList/EmployeesTable';
import { CallAPI } from '../../../utils/API/APIConfig';
import SearchInput from '../../shared/searchInput';
import EmployeesGrid from './EmployeesList/EmployeesGrid';
import {
  EMPLOYEE_CHECK_BEFORE_DELETE,
  EMPLOYEE_DELETE_EP,
  EMP_GET_ODATA,
} from '../../../utils/API/EndPoints/EmployeeEP';
import { WarningErrorModal } from './WarningModals/WarningModal';

const EmployeesList = () => {
  const { messages } = useIntl();
  const { page } = useParams();
  const history = useHistory();
  const { allBranchesData } = useContext(BranchesContext);

  const [view, setView] = useState('list');
  const [paginationController, setPaginationController] = useState({
    pagesMax: 10,
    pageNumber: +page || 0,
  });
  const [searchValue, setSearchValue] = useState(null);
  const [filterdEmployee, setFilterdEmployee] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState('');
  const [warningServicesDelete, setWarningServicesDelete] = useState([]);
  const [showConfirmBtn, setShowConfirmBtn] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState(false);
  const { refetch: getAllEmployees, data: employees } = CallAPI({
    name: 'getAllEmployees',
    url: EMP_GET_ODATA,
    baseURL: process.env.REACT_APP_ODOMAIN,
    enabled: true,
    select: (data) => data.data.data.list,
    onSuccess: (list) => {
      setFilterdEmployee(list);
      getCount(true);
    },
    query: {
      $skip: paginationController.pageNumber * paginationController.pagesMax,
      $top: paginationController.pagesMax,
      search: searchValue,
    },
  });
  const { refetch: getCount, data: countData } = CallAPI({
    name: 'getCountEmployees',
    url: '/EmployeeOData/$count?',
    refetchOnWindowFocus: false,
    baseURL: process.env.REACT_APP_ODOMAIN,
    select: (data) => data.data.data.list,
    query: {
      search: searchValue || '',
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                             Search In Employees                            */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    history.push(`/settings/settingEmployees/${paginationController.pageNumber}`);
    getAllEmployees(true);
  }, [paginationController]);
  useEffect(() => {
    if (searchValue !== null) {
      setPaginationController({
        ...paginationController,
        pageNumber: 0,
      });
    }
  }, [searchValue]);

  /* -------------------------------------------------------------------------- */
  /*                                   Delete                                   */
  /* -------------------------------------------------------------------------- */
  const { refetch } = CallAPI({
    name: 'deleteEmployee',
    url: EMPLOYEE_DELETE_EP,
    query: {
      employeeId: deleteEmployeeId,
    },
    method: 'delete',
    select: (data) => data?.data?.data,
    onSuccess: (res) => {
      if (!res.isSuccess && res?.errorResponse?.isServiceWithoutEmployee) {
        setDisplayedMessage(res?.errorResponse?.serviceWithoutEmployeeMsg);
        setShowConfirmBtn(false);
        return setWarningServicesDelete(res?.errorResponse?.services);
      }

      toast.success(messages['employees.delete.successMsg']);
      return getAllEmployees(true);
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  /* -------------------------------------------------------------------------- */
  /*                        check  before delete the emp                        */
  /* -------------------------------------------------------------------------- */

  const { refetch: refetchCheckDeleteEmp } = CallAPI({
    name: 'checkBeforeDeleteEmp',
    url: EMPLOYEE_CHECK_BEFORE_DELETE,
    body: {
      employeeId: deleteEmployeeId,
    },
    method: 'post',
    select: (data) => data?.data?.data,
    onSuccess: (res) => {
      if (!res?.isSuccess && res?.requiredServiceUpdateMsg) {
        setShowConfirmBtn(true);
        setDisplayedMessage(res?.requiredServiceUpdateMsg);
        return setWarningServicesDelete(res?.requiredServiceUpdateMsg);
      }
      return refetch();
    },
  });
  const handleDeleteEmployee = (id) => {
    setDeleteEmployeeId(id);
    setOpenDeleteModal(true);
  };
  return (
    <Row className="settings">
      <Col xs="12">
        <Row className="settings-employee_header">
          <Col xs="auto">
            <h3 className="settings__section-title">
              {messages['setting.employee.title']}
            </h3>
            <p className="settings__section-description">
              {messages['setting.employee.description']}
            </p>
          </Col>
          <Col xs="4">
            <SearchInput
              handleChange={setSearchValue}
              searchValue={searchValue}
              placeholder={messages['setting.employee.search']}
            />
          </Col>
          <Col xs="auto" className="d-flex">
            <div className="settings-employee_header-views">
              <button
                type="button"
                className={view === 'grid' && 'active'}
                onClick={() => setView('grid')}
              >
                <i className="flaticon2-menu-2"></i>
              </button>
              <button
                type="button"
                className={view === 'list' && 'active'}
                onClick={() => setView('list')}
              >
                <i className="flaticon2-indent-dots"></i>
              </button>
            </div>
            <BeutiButton
              text={messages['setting.employee.add']}
              type="button"
              className="settings-employee_header-add"
              onClick={() => history.push(Routes.addEmployee)}
            />
          </Col>
        </Row>
      </Col>

      <Col xs="12">
        {view === 'list' && (
          <EmployeesTable
            employees={filterdEmployee}
            handleDelete={handleDeleteEmployee}
            MultiBranchOwner={allBranchesData.length > 1}
          />
        )}
        {view === 'grid' && (
          <EmployeesGrid
            employees={filterdEmployee}
            handleDelete={handleDeleteEmployee}
            MultiBranchOwner={allBranchesData.length > 1}
          />
        )}
        {countData > 10 && (
          <section className="beuti-table__footer">
            <BeutiPagination
              count={countData}
              setPaginationController={setPaginationController}
              paginationController={paginationController}
            />
          </section>
        )}
      </Col>
      <ConfirmationModal
        setPayload={refetchCheckDeleteEmp}
        openModal={deleteEmployeeId && openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        title="rw.employees.modal.delete.title"
        message="rw.employees.modal.delete.body"
        confirmtext="common.delete"
      />
      <WarningErrorModal
        openModal={!!warningServicesDelete.length >= 1}
        setOpenModal={setWarningServicesDelete}
        services={warningServicesDelete}
        title="setting.employee.delete.warning.title"
        message={displayedMessage}
        showConfirmBtn={showConfirmBtn}
        setShowConfirmBtn={setShowConfirmBtn}
        callDeleteMethod={refetch}
      />
    </Row>
  );
};

export default EmployeesList;
