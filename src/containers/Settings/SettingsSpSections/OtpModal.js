import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useIntl } from 'react-intl';

import PropTypes from 'prop-types';
import { isNumbersOnly } from 'validations/validate';

export default function OtpModal({ setConfirmOtp, setOpen, open }) {
  const { messages } = useIntl();
  const [otpNumber, setOtpNumber] = useState('');

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        // onHide={() => {
        //   closeModal();
        // }}
        show={open}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="bootstrap-modal-customizing otp-confirm-modal"
      >
        <div className="otp-box">
          <div className="employee-box__title">
            {messages[`admin.settings.otp.confirm`]}
          </div>
          <button onClick={() => closeModal()} type="button" className="close-icon">
            <i className="flaticon2-cancel-music"></i>
          </button>
        </div>
        <Modal.Body className="otp-body">
          <label htmlFor="confirmOtp" className="input-box__controllers__label w-100">
            {messages[`admin.settings.otp.confirm`]}
          </label>
          <input
            name="confirmOtp"
            className="w-50 input-box__controllers-input"
            id="confirmOtp"
            type="tel"
            placeholder={messages[`admin.settings.otp.confirm`]}
            onChange={(e) =>
              isNumbersOnly(e.target.value) && e.target.value.length <= 4
                ? setOtpNumber(e.target.value)
                : null
            }
            value={otpNumber}
          ></input>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setConfirmOtp(true);
              closeModal();
            }}
            disabled={otpNumber.length < 4}
          >
            {messages['common.confirm']}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

OtpModal.propTypes = {
  setConfirmOtp: PropTypes.func,
  setOpen: PropTypes.func,
  open: PropTypes.bool,
};
