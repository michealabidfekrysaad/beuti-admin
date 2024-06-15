import React, { useContext, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { Routes } from 'constants/Routes';
import { BranchesContext } from 'providers/BranchesSelections';
import BeutiButton from 'Shared/inputs/BeutiButton';
import { useHistory, useParams } from 'react-router-dom';
import BeutiPagination from 'components/shared/BeutiPagination';
import { CallAPI } from '../../../utils/API/APIConfig';
import SearchInput from '../../shared/searchInput';
// import NoProductYet from './ProdcutsList/NoProductYet';
import CustomersTable from './CustomersList/CustomersTable';
import {
  CUSTOMER_ODATA_EP,
  CUSTOMER_ODATA_COUNT_EP,
} from '../../../utils/API/EndPoints/CustomerEP';
import NoCustomersYet from './CustomersList/NoCustomersYet';

const CustomersList = () => {
  const { messages } = useIntl();
  const { page } = useParams();
  const history = useHistory();
  const { branches, setBranches, allBranchesData } = useContext(BranchesContext);
  const [sorting, setSorting] = useState({
    by: 'upcomingBookingDate',
    order: 'asc',
  });
  const [paginationController, setPaginationController] = useState({
    pagesMax: 10,
    pageNumber: +page || 0,
  });
  const [searchValue, setSearchValue] = useState('');
  const [filterdCustomer, setFilterdCustomer] = useState([]);

  const { refetch: getAllCustomers, isFetching } = CallAPI({
    name: ['getAllCustomers', searchValue],
    url: CUSTOMER_ODATA_EP,
    baseURL: process.env.REACT_APP_ODOMAIN,
    select: (data) => data.data.data.list,
    onSuccess: (list) => {
      setFilterdCustomer(list);
      getCount(true);
    },
    refetchOnWindowFocus: false,
    query: {
      $skip: paginationController.pageNumber * paginationController.pagesMax,
      $top: paginationController.pagesMax,
      $filter: `contains(name,'${searchValue}') or contains(phoneNumber,'${searchValue}') or contains(registeredName,'${searchValue}')`,

      $orderby: `${sorting.by} ${sorting.order}`,
    },
  });
  const { refetch: getCount, data: countData } = CallAPI({
    name: ['getCountCustomers', searchValue],
    url: CUSTOMER_ODATA_COUNT_EP,
    baseURL: process.env.REACT_APP_ODOMAIN,
    select: (data) => data.data.data.list,
    query: {
      $filter: `contains(name,'${searchValue}') or contains(phoneNumber,'${searchValue}') or contains(registeredName,'${searchValue}')`,
    },
  });
  // Set All Branches Selected
  useEffect(() => {
    setBranches([...allBranchesData.map((branch) => branch.id)]);
  }, []);
  /* -------------------------------------------------------------------------- */
  /*                             Search In Products                            */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    history.push(`/settingCustomers/${paginationController.pageNumber}`);
    getAllCustomers(true);
  }, [paginationController]);
  useEffect(() => {
    if (searchValue !== null || branches) {
      setPaginationController({
        ...paginationController,
        pageNumber: 0,
      });
    }
  }, [searchValue, branches]);
  /* -------------------------------------------------------------------------- */
  /*                           Handle Sorting In table                          */
  /* -------------------------------------------------------------------------- */

  const handleSort = (type) => {
    if (type === sorting.by && sorting.order === 'asc') {
      return setSorting({ ...sorting, order: 'desc' });
    }
    if (type === sorting.by && sorting.order === 'desc') {
      return setSorting({ ...sorting, order: 'asc' });
    }
    return setSorting({ by: type, order: 'asc' });
  };
  useEffect(() => {
    getAllCustomers(true);
  }, [sorting]);

  return (
    <Row className="settings">
      <Col xs="12">
        <Row className="justify-content-between align-items-center py-3">
          <Col xs="auto">
            <h3 className="settings__section-title">
              {messages['setting.customer.title']}
            </h3>
            <p className="settings__section-description">
              {messages['setting.customer.list.description']}
            </p>
          </Col>

          <Col xs="auto" className="d-flex">
            <BeutiButton
              text={messages['setting.customer.add']}
              type="button"
              className="settings-employee_header-add"
              onClick={() => history.push(Routes.addCustomer)}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xs="4">
            <SearchInput
              handleChange={setSearchValue}
              searchValue={searchValue}
              placeholder={messages['setting.customer.search']}
            />
          </Col>
        </Row>
      </Col>

      {(!!filterdCustomer.length || isFetching) && (
        <Col xs="12">
          <CustomersTable
            customers={filterdCustomer}
            handleSort={handleSort}
            customersLoading={isFetching}
          />

          {!isFetching && countData > 10 && (
            <section className="beuti-table__footer">
              <BeutiPagination
                count={countData}
                setPaginationController={setPaginationController}
                paginationController={paginationController}
              />
            </section>
          )}
        </Col>
      )}
      {!filterdCustomer.length && !isFetching && (
        <Col xs="12">
          <NoCustomersYet />
        </Col>
      )}
    </Row>
  );
};

export default CustomersList;
