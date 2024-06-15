/* eslint-disable  */

import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { useParams, useHistory } from 'react-router-dom';
import BeutiButton from 'Shared/inputs/BeutiButton';
import { CUSTOMER_ODATA_EP } from 'utils/API/EndPoints/CustomerEP';
import { ConfirmationModal } from 'components/shared/ConfirmationModal';
import { CallAPI } from '../../../utils/API/APIConfig';

import VoucherInfo from './ViewVoucher/VoucherInfo';
import VoucherCustomers from './ViewVoucher/AllCustomer';
import { EDIT_VOUCHER_MODE, VIEW_VOUCHER_MODE } from './Helper/Modes';
import VoucherActions from './ViewVoucher/VoucherActions';
import NoCustomers from './ViewVoucher/NoCustomers';

const ViewVoucher = () => {
  const { messages } = useIntl();
  const { VoucherId } = useParams();
  const history = useHistory();
  const [mode, setMode] = useState(VIEW_VOUCHER_MODE);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filterdCustomers, setFilterdCustomers] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const {
    data: getVoucherData,
    isFetching: getVoucherLoading,
    refetch: getVoucherCall,
  } = CallAPI({
    name: ['ViewVoucher', VoucherId],
    url: '/Voucher/Get',
    query: {
      VoucherId,
    },
    enabled: true,
    refetchOnWindowFocus: false,
    select: (data) => data.data.data,
    onSuccess: (res) => res && getCustomersCall(),
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  const { isFetching: addVoucherLoading, refetch: addVoucherCall } = CallAPI({
    name: 'addVoucher',
    url: '/Voucher/SendVoucher',
    method: 'post',
    body: {
      customerIds: [...selectedCustomers],
      voucherId: VoucherId,
    },
    select: (data) => data.data.data,
    onSuccess: (res) => {
      if (res.success) {
        getVoucherCall();
        setMode(VIEW_VOUCHER_MODE);
        setSelectedCustomers([]);
        toast.success(messages['vouchers.send.success']);
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  const { data: allCustomer, refetch: getCustomersCall } = CallAPI({
    name: 'getAllCustomers',
    url: CUSTOMER_ODATA_EP,
    baseURL: process.env.REACT_APP_ODOMAIN,
    onSuccess: (res) => setFilterdCustomers(res),
    select: (data) => {
      const brandCustomer = data.data.data.list?.map((customer) => ({
        customerId: customer?.customerId,
        customerMobileNumber: customer?.phoneNumber,
        customerName: customer?.registeredName || customer?.name,
      }));
      if (!getVoucherData?.customers?.length) {
        return brandCustomer;
      }
      return brandCustomer.filter(
        (customer) =>
          !getVoucherData?.customers.find(
            (custom) => +customer.customerId === +custom.customerId,
          ),
      );
    },
    refetchOnWindowFocus: false,
    query: {
      $filter: `isRegistered eq true`,
    },
  });
  useEffect(() => {
    if (!searchValue) {
      return setFilterdCustomers(allCustomer);
    }
    return setFilterdCustomers(
      allCustomer.filter(
        (customer) =>
          customer?.customerName?.toLowerCase().includes(searchValue.toLowerCase()) ||
          customer?.customerMobileNumber?.includes(searchValue),
      ),
    );
  }, [searchValue]);
  const handleSelect = (e) => {
    if (selectedCustomers.find((id) => id === e.target.id)) {
      return setSelectedCustomers(selectedCustomers.filter((id) => id !== e.target.id));
    }
    return setSelectedCustomers([...selectedCustomers, e.target.id]);
  };
  const { isFetching: deleteVoucerLoading, refetch: deleteVoucherCall } = CallAPI({
    name: 'deleteVoucher',
    url: '/Voucher/Delete',
    method: 'delete',
    query: {
      voucherId: VoucherId,
    },
    refetchOnWindowFocus: false,
    select: (data) => data.data.data,
    onSuccess: (res) => {
      if (res.success) {
        toast.success(messages['voucher.delete.success']);
        history.push('/voucherList/0');
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  return (
    <>
      <Row className="settings">
        <Col xs={12}>
          <VoucherInfo voucher={getVoucherData} />
        </Col>
        <Col xs={12}>
          <VoucherActions
            mode={mode}
            getVoucherLoading={getVoucherLoading}
            setSearchValue={setSearchValue}
            searchValue={searchValue}
            setMode={setMode}
            setOpenDeleteModal={setOpenDeleteModal}
            voucher={getVoucherData}
          />
        </Col>

        <Col xs={12}>
          <Row className="voucherdetails">
            <Col xs="12">
              <VoucherCustomers
                mode={mode}
                handleSelect={handleSelect}
                selectedCustomers={selectedCustomers}
                customers={
                  mode === VIEW_VOUCHER_MODE
                    ? getVoucherData?.customers
                    : filterdCustomers
                }
              />
            </Col>
            {((!getVoucherData?.customers?.length && mode === VIEW_VOUCHER_MODE) ||
              (!filterdCustomers?.length && mode === EDIT_VOUCHER_MODE)) &&
              !getVoucherLoading && (
                <Col xs="12">
                  <NoCustomers
                    notSent={
                      !getVoucherData?.customers?.length && mode === VIEW_VOUCHER_MODE
                    }
                  />
                </Col>
              )}
          </Row>
        </Col>
      </Row>
      {mode === EDIT_VOUCHER_MODE && (
        <section className="settings__submit">
          <button
            className="beutibuttonempty mx-2 action"
            type="button"
            onClick={() => {
              setSelectedCustomers([]);
              setMode(VIEW_VOUCHER_MODE);
            }}
            disabled={getVoucherLoading || addVoucherLoading}
          >
            {messages['common.cancel']}
          </button>
          <BeutiButton
            text={messages['common.save']}
            type="button"
            disabled={
              getVoucherLoading ||
              mode === VIEW_VOUCHER_MODE ||
              !selectedCustomers?.length ||
              addVoucherLoading ||
              deleteVoucerLoading
            }
            loading={getVoucherLoading || deleteVoucerLoading || addVoucherLoading}
            className="beutibutton action"
            onClick={addVoucherCall}
          />
        </section>
      )}
      <ConfirmationModal
        setPayload={deleteVoucherCall}
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        title="voucher.delete.title.msg"
        message="voucher.delete.msg"
        confirmtext="common.delete"
      />
    </>
  );
};

export default ViewVoucher;
