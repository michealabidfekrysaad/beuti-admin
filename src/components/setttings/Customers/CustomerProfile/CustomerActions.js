import React from 'react';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import moment from 'moment';

const CustomerActions = ({
  setOpenBlockCustomerModal,
  setOpenUnBlockCustomerModal,
  customerData,
  callVoucher,
}) => {
  const history = useHistory();
  const { customerId } = useParams();
  const { messages } = useIntl();
  const correctNowTime = () => {
    const example = 1000 * 60 * 5;
    const date = new Date();
    const rounded = new Date(Math.round(date.getTime() / example) * example);
    return moment(rounded)
      .locale('en')
      .format('HH:mm:ss');
  };
  return (
    <div className="customerprofile-actions sm-lg-0">
      <div className="customerprofile-actions__item">
        <button
          type="button"
          onClick={() => {
            history.push({
              pathname: '/booking/bookingFlow',
              search: `?time=${correctNowTime()}&customerId=${
                customerData?.id
              }&startDate=${moment()
                .locale('en')
                .format('YYYY-MM-DD')}`,
            });
          }}
        >
          <SVG src={toAbsoluteUrl('/booking.svg')} />
        </button>
        <span>{messages['setting.customer.profile.book']}</span>
      </div>
      <div className="customerprofile-actions__item">
        <button
          type="button"
          onClick={() => {
            if (customerData?.isRegistered) {
              callVoucher();
            } else {
              toast.error(messages['setting.customer.voucher.not.registered']);
            }
          }}
        >
          <SVG src={toAbsoluteUrl('/product.svg')} />
        </button>
        <span>{messages['setting.customer.profile.send']}</span>
      </div>
      <div className="customerprofile-actions__item">
        <button
          type="button"
          onClick={() => history.push(`/settingCustomers/editCustomer/${customerId}`)}
        >
          <SVG src={toAbsoluteUrl('/editpurple.svg')} />
        </button>
        <span>{messages['setting.customer.profile.edit']}</span>
      </div>
      <div className="customerprofile-actions__item">
        <button
          type="button"
          className="block"
          onClick={() =>
            customerData?.isBlocked
              ? setOpenUnBlockCustomerModal(true)
              : setOpenBlockCustomerModal(true)
          }
        >
          <SVG src={toAbsoluteUrl('/block.svg')} />
        </button>
        <span className="text-danger">
          {customerData?.isBlocked
            ? messages['setting.customer.profile.unblock.confirm']
            : messages['setting.customer.profile.block']}
        </span>
      </div>
    </div>
  );
};
CustomerActions.propTypes = {
  setOpenBlockCustomerModal: PropTypes.func,
  setOpenUnBlockCustomerModal: PropTypes.func,
  customerData: PropTypes.object,
  callVoucher: PropTypes.func,
};

export default CustomerActions;
