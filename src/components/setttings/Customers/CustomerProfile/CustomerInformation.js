/* eslint-disable  */

import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import React from 'react';
import { Image } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import Rating from '@material-ui/lab/Rating';
import CustomerActions from './CustomerActions';
import CustomerViewList from './CustomerViewList';

const CustomerInformation = ({
  customerData,
  setOpenBlockCustomerModal,
  setOpenUnBlockCustomerModal,
  setActiveCustomerView,
  allCustomerViews,
  activeCustomerView,
  setSelectedStatus,
  selectedStatus,
  callVoucher,
}) => {
  const { messages } = useIntl();
  const addPartPaidAndUnpaid = () => {
    if (!selectedStatus.includes(1)) {
      setSelectedStatus([...selectedStatus, 1]);
    }
    if (!selectedStatus.includes(5)) {
      setSelectedStatus([...selectedStatus, 5]);
    }
    if (selectedStatus?.length === 0) {
      setSelectedStatus([1, 5]);
    }
  };
  return (
    <section className="customerprofile">
      <div className="customerprofile-image">
        <Image src={customerData?.profileImage || toAbsoluteUrl('/Avatar.png')} />
        {customerData?.rate ? (
          <div className="customerprofile-image__rate">
            <Rating
              name="half-rating-read"
              defaultValue={0}
              value={5 / 5}
              precision={0.1}
              max={1}
              readOnly
            />
            {customerData?.rate.toFixed(1)}
          </div>
        ) : (
          ''
        )}
      </div>
      <div className="customerprofile-name">{customerData?.registeredName}</div>
      {customerData?.name && customerData?.isRegistered && (
        <div className="d-flex mb-1">
          <p className="customerprofile-altername">{customerData?.name}</p>
        </div>
      )}
      {customerData?.email && (
        <p className="customerprofile-email">{customerData?.email}</p>
      )}
      {customerData?.phone && (
        <p className="customerprofile-phone">{customerData?.phone}</p>
      )}
      {customerData?.unpaidAmounts > 0 && (
        <div
          className="customerprofile-un--paid"
          onClick={() => {
            addPartPaidAndUnpaid();
            setActiveCustomerView(allCustomerViews?.invoices);
          }}
        >
          <FormattedMessage id="setting.customer.profile.unpaid" />{' '}
          <span className="customerprofile-un--paid_value">
            <FormattedMessage
              id="booking.service.current"
              values={{
                price: customerData?.unpaidAmounts?.toFixed(2),
              }}
            />
          </span>
        </div>
      )}
      <CustomerActions
        setOpenBlockCustomerModal={setOpenBlockCustomerModal}
        setOpenUnBlockCustomerModal={setOpenUnBlockCustomerModal}
        customerData={customerData}
        callVoucher={callVoucher}
      />
      {customerData?.blockReason && (
        <div className="customerprofile-blocked">{customerData?.blockReason}</div>
      )}
      {customerData?.notes && (
        <>
          <div className="customerprofile-note mb-1">
            {messages['setting.customer.profile.notes']}
          </div>
          <p className="customerprofile-text mb-2">{customerData?.notes}</p>
        </>
      )}
      <CustomerViewList
        setActiveCustomerView={setActiveCustomerView}
        allCustomerViews={allCustomerViews}
        activeCustomerView={activeCustomerView}
      />
    </section>
  );
};

export default CustomerInformation;
