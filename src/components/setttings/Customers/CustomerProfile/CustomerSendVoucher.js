import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from 'react-bootstrap';
import SelectInputMUI from 'Shared/inputs/SelectInputMUI';
import moment from 'moment';

export function CustomerSendVoucher({
  openModal,
  setOpenModal,
  vouchers,
  setSelectedVoucherId,
  selectedVoucherId,
  addVoucherCall,
}) {
  const { messages, locale } = useIntl();
  return (
    <>
      <Modal
        onHide={() => {
          setOpenModal(false);
        }}
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing block-modal"
      >
        <Modal.Header className="align-items-start">
          <Modal.Title className="title">
            {messages['setting.customer.voucher.send.title']}
          </Modal.Title>
          <div className="w-100">
            <SelectInputMUI
              list={vouchers}
              onChange={(e) => setSelectedVoucherId(e?.target?.value)}
              value={selectedVoucherId}
              label={messages['setting.customer.voucher.send.customer']}
            />
          </div>
          <div className="w-100 mt-4">
            <p className="w-50 d-inline-block">
              {messages['voucher.Code']} :{' '}
              {vouchers?.find((vouch) => vouch?.id === selectedVoucherId)?.code}
            </p>
            <p className="w-50 d-inline-block">
              {messages['voucher.Value']} :{' '}
              {vouchers?.find((vouch) => vouch?.id === selectedVoucherId)?.value}{' '}
              {messages['common.currency']}
            </p>
            <p className="w-50 d-inline-block">
              {messages['offers.input.start']} :{' '}
              {moment(
                vouchers?.find((vouch) => vouch?.id === selectedVoucherId)?.startDate,
              )
                ?.locale(locale)
                .format('D MMM YYYY')}
            </p>
            <p className="w-50 d-inline-block">
              {messages['offers.input.end']} :{' '}
              {moment(
                vouchers?.find((vouch) => vouch?.id === selectedVoucherId)
                  ?.expirationDate,
              )
                ?.locale(locale)
                .format('D MMM YYYY')}
            </p>
          </div>
        </Modal.Header>
        <Modal.Footer className="pt-3 mt-5 justify-content-end">
          <button
            type="button"
            className="px-4 cancel"
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <FormattedMessage id="common.cancel" />
          </button>
          <button
            type="button"
            onClick={() => {
              addVoucherCall();
              setOpenModal(false);
            }}
            className="px-4 confirm"
          >
            <FormattedMessage id="send.send.btn" />
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

CustomerSendVoucher.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  vouchers: PropTypes.array,
  setSelectedVoucherId: PropTypes.func,
  selectedVoucherId: PropTypes.number,
  addVoucherCall: PropTypes.func,
};
