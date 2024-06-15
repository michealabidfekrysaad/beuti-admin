/* eslint-disable  */

import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './CustomerStyle.scss';
import { useIntl } from 'react-intl';
import { CUSTOMER_ODATA_EP } from 'utils/API/EndPoints/CustomerEP';
import CustomerInformation from './CustomerProfile/CustomerInformation';
import { CallAPI } from '../../../utils/API/APIConfig';
import { BlockCustomerModal } from './CustomerProfile/BlockCustomer/BlockCustomerModal';
import { ConfirmationModal } from '../../shared/ConfirmationModal';
import CustomerViewData from './CustomersList/CustomerViewData/CustomerViewData';
import { CustomerSendVoucher } from './CustomerProfile/CustomerSendVoucher';

const CustomerProfile = () => {
  const allCustomerViews = {
    booking: 1,
    products: 2,
    invoices: 3,
    reviews: 4,
    Address: 5,
  };
  const { customerId } = useParams();
  const { search } = useLocation();
  const history = useHistory();
  const [activeCustomerView, setActiveCustomerView] = useState(allCustomerViews?.booking);
  const { messages } = useIntl();
  const [openSendVoucher, setOpenSendVoucher] = useState(false);
  const [openBlockCustomerModal, setOpenBlockCustomerModal] = useState(false);
  const [openUnBlockCustomerModal, setOpenUnBlockCustomerModal] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState([1, 2, 4, 5]);
  const [selectedStatusForBooking, setSelectedStatusForBooking] = useState([
    1,
    2,
    3,
    4,
    6,
  ]);
  const [loadMoreUpcmoing, setLoadMoreUpcoming] = useState(3);
  const [loadMorePast, setLoadMorePast] = useState(3);

  const { data: customerData, refetch: callUserData } = CallAPI({
    name: ['GetCustomerById', customerId],
    url: 'AnonymousCustomer/GetById',
    refetchOnWindowFocus: false,
    enabled: !!customerId,
    query: {
      id: customerId,
    },
    select: (data) => data?.data?.data,
  });
  const { data: allCustomer } = CallAPI({
    name: 'getAllCustomerForVoucher',
    url: CUSTOMER_ODATA_EP,
    // retry: 1,
    enabled: true,
    query: {
      $filter: `isRegistered eq true`,
    },
    refetchOnWindowFocus: false,
    baseURL: process.env.REACT_APP_ODOMAIN,
    select: (res) => res?.data?.data?.list,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  const { refetch: callUnBlockUser, isFetching } = CallAPI({
    name: ['blockUser', 0],
    url: 'AnonymousCustomer/CustomerBlock',
    method: 'put',
    onSuccess: (res) => {
      if (res?.data?.data?.success) {
        toast.success(messages['common.edited.success']);
        setOpenUnBlockCustomerModal(false);
        callUserData(true);
      }
    },
    body: {
      id: customerId,
      isBlocked: false,
    },
  });
  const handleFilterationForInvoice = () =>
    !!selectedStatus.length
      ? `invoiceStatusType in (${selectedStatus.map((n) => `'${String(n)}'`)})`
      : `invoiceStatusType in ('0')`;

  const {
    data: customerInoicesRes,
    refetch: callInvoices,
    isFetching: fetchInvoices,
  } = CallAPI({
    name: ['getCustomerInvoices', customerId, selectedStatus],
    url: 'CustomerInvoicesOdata/Get',
    baseURL: process.env.REACT_APP_ODOMAIN,
    refetchOnWindowFocus: false,
    enabled: !!customerId,
    query: {
      CustomerId: customerId,
      $filter: `${handleFilterationForInvoice()}`,
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    select: (res) => res?.data?.data?.list,
  });

  //   confirm pending will send ''
  //   confirm   or pending send id of selected
  //  no cofirm and pending send 0
  const handleFilterationUpcomingBooking = () => {
    if (!!selectedStatusForBooking.length) {
      if (
        [1, 4]?.every((value) => {
          return selectedStatusForBooking?.includes(+value);
        })
      ) {
        return '';
      }
      if (selectedStatusForBooking?.includes(1)) {
        return 1;
      }
      if (selectedStatusForBooking?.includes(4)) {
        return 4;
      }
    }
    return 0;
  };

  const {
    data: customerBookingsUpcoming,
    refetch: callBookings,
    isFetching: fetchBookings,
  } = CallAPI({
    name: ['getCustomerBookings', customerId, selectedStatusForBooking],
    url: 'Booking/GetCustomerUpcomingBookings',
    refetchOnWindowFocus: false,
    method: 'post',
    enabled: !!customerId && !!customerData,
    query: {
      brandCustomerId: customerId,
      BookingStatus: `${handleFilterationUpcomingBooking()}`,
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    select: (res) => res?.data?.data?.list,
  });

  const handleFilterationPastBooking = () =>
    !!selectedStatusForBooking.length
      ? `bookingStatus in (${selectedStatusForBooking.map((n) => `'${String(n)}'`)})`
      : `bookingStatus in ('0')`;

  const {
    data: customerPastBooking,
    refetch: callAllBookings,
    isFetching: fetchAllBookings,
  } = CallAPI({
    name: ['getCustomerAllBookings', customerId, selectedStatusForBooking],
    url: 'CustometPastBooingsOdata',
    baseURL: process.env.REACT_APP_ODOMAIN,
    refetchOnWindowFocus: false,
    enabled: !!customerId && !!customerData,
    query: {
      brandCustomerId: customerId,
      $filter: `${handleFilterationPastBooking()}`,
      $orderby: `bookingDate desc,bookingStartTime desc`,
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    select: (res) => res?.data?.data?.list,
  });
  const { data: vouchers, isFetching: fetchVouchers, refetch: callVoucher } = CallAPI({
    name: 'getAllVouchersForCustomers',
    url: '/Voucher/getAll',
    select: (data) =>
      data.data.data.list
        ?.filter((vouch) => +vouch?.status === 2)
        ?.map((vouch, index) => ({
          ...vouch,
          key: index,
          text: vouch?.code,
        })),
    onSuccess: (list) => {
      if (list?.length > 0) {
        setSelectedVoucherId(list[0]?.id);
        setOpenSendVoucher(true);
      } else {
        toast.error(messages['voucher.no.title']);
      }
    },
    refetchOnWindowFocus: false,
  });

  const { refetch: addVoucherCall } = CallAPI({
    name: 'seneVoucher',
    url: '/Voucher/SendVoucher',
    method: 'post',
    retry: false,
    body: {
      customerIds: [
        allCustomer?.find((cus) => +cus?.id === +customerId)?.customerId?.toString(),
      ],
      voucherId: selectedVoucherId?.toString(),
    },
    select: (data) => data.data.data,
    onSuccess: (res) => {
      if (res.success) {
        toast.success(messages['vouchers.send.success']);
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  useEffect(() => {
    let url = new URLSearchParams(search);
    if (url.has('invoices')) {
      url.delete('invoices');
      history.replace({
        search: url.toString(),
      });
      setActiveCustomerView(allCustomerViews.invoices);
    }
  }, []);
  return (
    <>
      <Row>
        <Col xs="4">
          <CustomerInformation
            customerData={customerData}
            setOpenBlockCustomerModal={setOpenBlockCustomerModal}
            setOpenUnBlockCustomerModal={setOpenUnBlockCustomerModal}
            setActiveCustomerView={setActiveCustomerView}
            allCustomerViews={allCustomerViews}
            activeCustomerView={activeCustomerView}
            setSelectedStatus={setSelectedStatus}
            selectedStatus={selectedStatus}
            callVoucher={callVoucher}
          />
        </Col>
        <Col xs="8">
          <CustomerViewData
            activeCustomerView={activeCustomerView}
            allCustomerViews={allCustomerViews}
            customerInoicesRes={customerInoicesRes}
            callInvoices={callInvoices}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            fetchInvoices={fetchInvoices}
            customerBookingsUpcoming={customerBookingsUpcoming}
            fetchBookings={fetchBookings}
            customerPastBooking={customerPastBooking}
            fetchAllBookings={fetchAllBookings}
            selectedStatusForBooking={selectedStatusForBooking}
            setSelectedStatusForBooking={setSelectedStatusForBooking}
            loadMoreUpcmoing={loadMoreUpcmoing}
            setLoadMoreUpcoming={setLoadMoreUpcoming}
            loadMorePast={loadMorePast}
            setLoadMorePast={setLoadMorePast}
          />
        </Col>
      </Row>
      <BlockCustomerModal
        openModal={openBlockCustomerModal}
        setOpenModal={setOpenBlockCustomerModal}
        Id={customerId}
        callUserData={callUserData}
      />
      <ConfirmationModal
        setPayload={callUnBlockUser}
        openModal={openUnBlockCustomerModal}
        setOpenModal={setOpenUnBlockCustomerModal}
        title="setting.customer.profile.unblock.title"
        message="setting.customer.profile.unblock.description"
        confirmtext="setting.customer.profile.unblock.confirm"
      />
      <CustomerSendVoucher
        openModal={openSendVoucher}
        setOpenModal={setOpenSendVoucher}
        Id={customerId}
        callUserData={callUserData}
        vouchers={vouchers}
        setSelectedVoucherId={setSelectedVoucherId}
        selectedVoucherId={selectedVoucherId}
        addVoucherCall={addVoucherCall}
      />
    </>
  );
};

export default CustomerProfile;
