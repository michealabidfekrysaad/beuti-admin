import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from 'react-bootstrap';
import BeutiInput from 'Shared/inputs/BeutiInput';
import { FinancialConfirmDelete } from './FinancialConfirmDelete';

export function FinancialEditDeleteAddModal({
  openModal,
  setOpenModal,
  title,
  value,
  setValuePayment,
  showDelete,
  setPayload,
  allPayments,
  paymentIdForModal,
}) {
  const { locale, messages } = useIntl();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ nameAR: null, nameEN: null });
  const [errorMessageMax, setErrorMessageMax] = useState({ nameAR: null, nameEN: null });
  const closeReset = () => {
    setOpenModal(false);
    setErrorMessage(false);
    if (showDelete) setValuePayment(null);
  };
  return (
    <>
      <Modal
        onHide={() => {
          closeReset();
          setValuePayment('');
        }}
        show={openModal}
        size="lg"
        centered
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing"
      >
        <Modal.Header>
          <Modal.Title className="title mb-1">
            <FormattedMessage id={title} />
          </Modal.Title>
          <span className="financialSettings__headingDiv--info">
            <FormattedMessage
              id={
                showDelete ? 'financial.edit.payment.info' : 'financial.add.payment.info'
              }
            />
          </span>
        </Modal.Header>
        <Modal.Body className="px-5">
          <div className="modalfinancial">
            <BeutiInput
              label={<FormattedMessage id="financial.payment.method.ar" />}
              value={value?.nameAR}
              error={errorMessage?.nameAR || errorMessageMax?.nameAR}
              onChange={(e) => {
                if (e.target.value.length > 50) {
                  setErrorMessageMax({
                    ...errorMessageMax,
                    nameAR: messages['financial.error.message.max.ar'],
                  });
                  setErrorMessage({ ...errorMessage, nameAR: null });
                  setValuePayment({ ...value, nameAR: e.target.value });
                } else {
                  setErrorMessage({ ...errorMessage, nameAR: null });
                  setValuePayment({ ...value, nameAR: e.target.value });
                  setErrorMessageMax({
                    ...errorMessageMax,
                    nameAR: null,
                  });
                }
              }}
            />
            <BeutiInput
              label={<FormattedMessage id="financial.payment.method.en" />}
              value={value?.nameEN}
              error={errorMessage?.nameEN || errorMessageMax?.nameEN}
              onChange={(e) => {
                if (e.target.value.length > 50) {
                  setErrorMessageMax({
                    ...errorMessageMax,
                    nameEN: messages['financial.error.message.max.en'],
                  });
                  setErrorMessage({ ...errorMessage, nameEN: null });
                  setValuePayment({ ...value, nameEN: e.target.value });
                } else {
                  setErrorMessage({ ...errorMessage, nameEN: null });
                  setValuePayment({ ...value, nameEN: e.target.value });
                  setErrorMessageMax({
                    ...errorMessageMax,
                    nameEN: null,
                  });
                }
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="pt-3">
          <div
            className={`pt-3 px-5 w-100 d-flex justify-content-${
              showDelete && allPayments.length > 1 ? 'between' : 'end'
            }`}
          >
            {showDelete && allPayments.length > 1 && (
              <button
                type="button"
                className="px-3 cancel text-danger"
                onClick={() => {
                  if (showDelete && value.nameEN && value.nameAR) {
                    setOpenDeleteModal(true);
                    setOpenModal(false);
                  }
                }}
              >
                <FormattedMessage id="common.delete" />
              </button>
            )}
            <div className="">
              <button
                type="button"
                className="cancel mx-1"
                onClick={() => {
                  closeReset();
                  setValuePayment('');
                }}
              >
                <FormattedMessage id="common.cancel" />
              </button>
              <button
                type="button"
                disabled={errorMessage?.nameAR || errorMessageMax?.nameAR}
                onClick={() => {
                  if (
                    value?.nameAR &&
                    value?.nameEN &&
                    !!value?.nameAR.match(/^(?!\s+$).*/) &&
                    !!value?.nameEN.match(/^(?!\s+$).*/)
                  ) {
                    if (showDelete) {
                      const newPaymentMethods = allPayments.map((x) => {
                        if (x.id === paymentIdForModal) {
                          return {
                            ...x,
                            nameAR: value.nameAR,
                            nameEN: value.nameEN,
                          };
                        }
                        return x;
                      });
                      setPayload(newPaymentMethods);
                    }
                    if (!showDelete) {
                      const newPaymentMethods = [
                        ...allPayments,
                        { id: 0, nameAR: value.nameAR, nameEN: value.nameEN },
                      ];
                      setPayload(newPaymentMethods);
                    }

                    closeReset();
                  } else {
                    if (!value?.nameAR || !value?.nameAR.match(/^(?!\s+$).*/))
                      setErrorMessage({
                        ...errorMessage,
                        nameEN:
                          (!value?.nameEN || !value?.nameEN?.match(/^(?!\s+$).*/)) &&
                          messages['financial.error.message.required.en'],
                        nameAR: messages['financial.error.message.required.ar'],
                      });
                    if (!value?.nameEN || !value?.nameEN.match(/^(?!\s+$).*/))
                      setErrorMessage({
                        ...errorMessage,
                        nameEN: messages['financial.error.message.required.en'],
                        nameAR:
                          (!value?.nameAR || !value?.nameAR?.match(/^(?!\s+$).*/)) &&
                          messages['financial.error.message.required.ar'],
                      });
                  }
                }}
                className="confirm mx-1"
              >
                <FormattedMessage id="common.save" />
              </button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
      <FinancialConfirmDelete
        setOpenModal={setOpenDeleteModal}
        openModal={openDeleteModal}
        message="financial.delete.confirm"
        title="financial.delete.header"
        allPayments={allPayments}
        paymentIdForModal={paymentIdForModal}
        setPayload={setPayload}
        closeReset={closeReset}
        setOpenEditModal={setOpenModal}
        messageVariables={locale === 'ar' ? value?.nameAR : value?.nameEN}
      />
    </>
  );
}

FinancialEditDeleteAddModal.propTypes = {
  paymentIdForModal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setValuePayment: PropTypes.func,
  showDelete: PropTypes.string,
  setPayload: PropTypes.func,
  allPayments: PropTypes.array,
};
