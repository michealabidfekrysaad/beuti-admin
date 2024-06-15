import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import BeutiTextArea from 'Shared/inputs/BeutiTextArea';
import { CallAPI } from '../../../../../utils/API/APIConfig';
import SelectInputMUI from '../../../../../Shared/inputs/SelectInputMUI';

export function BlockCustomerModal({ callUserData, Id, openModal, setOpenModal }) {
  CallAPI({
    name: 'blockCustomer',
  });
  const { messages } = useIntl();
  const [reasonPayload, setReasonPayload] = useState({ blockType: 0 });
  const reasons = [
    { text: `${messages['setting.customer.profile.selectreason.label']}...`, id: 0 },
    { text: messages['setting.customer.profile.reason.noshows'], id: 1 },
    { text: messages['setting.customer.profile.reason.cancelation'], id: 2 },
    { text: messages['setting.customer.profile.reason.rescheduling'], id: 3 },
    { text: messages['setting.customer.profile.reason.rude'], id: 4 },
    { text: messages['setting.customer.profile.reason.refusetopay'], id: 5 },
    { text: messages['setting.customer.profile.reason.bookingfake'], id: 6 },
    { text: messages['setting.customer.profile.other'], id: 7 },
  ];
  const handleChangeReason = (e) =>
    setReasonPayload({ ...reasonPayload, blockType: e.target.value });
  const { refetch: callBlockUser, isFetching } = CallAPI({
    name: ['blockUser', 1],
    url: 'AnonymousCustomer/CustomerBlock',
    method: 'put',
    onSuccess: (res) => {
      if (res?.data?.data?.success) {
        toast.success(messages['common.edited.success']);
        setOpenModal(false);
        callUserData(true);
        setReasonPayload({ blockType: 0 });
      }
    },
    body: {
      id: Id,
      isBlocked: true,
      ...reasonPayload,
    },
  });
  return (
    <>
      <Modal
        onHide={() => {
          setOpenModal(false);
          setReasonPayload({ blockType: 0 });
        }}
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing block-modal"
      >
        <Modal.Header className="align-items-start">
          <Modal.Title className="title">
            {messages['setting.customer.profile.selectreason.title']}
          </Modal.Title>
          <p>{messages['setting.customer.profile.selectreason.description']}</p>
          <div className="w-100">
            <SelectInputMUI
              list={reasons}
              onChange={handleChangeReason}
              value={reasonPayload.blockType}
              label={messages['setting.customer.profile.selectreason.label']}
              disabledOptions={(id) => !id}
            />
          </div>
          {reasonPayload.blockType === 7 && (
            <div className="w-100 mt-2">
              <BeutiTextArea
                label={messages['setting.customer.profile.selectreason.placeholder']}
                onChange={(e) =>
                  setReasonPayload({ ...reasonPayload, blockReason: e.target.value })
                }
              />
            </div>
          )}
        </Modal.Header>
        <Modal.Footer className="pt-3 mt-5 justify-content-end">
          <button
            type="button"
            className="px-4 cancel"
            onClick={() => {
              setOpenModal(false);
              setReasonPayload({ blockType: 0 });
            }}
            disabled={isFetching}
          >
            <FormattedMessage id="common.cancel" />
          </button>
          <button
            type="button"
            onClick={() => {
              callBlockUser(true);
            }}
            className="px-4 confirm btn-danger"
            disabled={
              !reasonPayload.blockType ||
              (reasonPayload.blockType === 7 && !reasonPayload.blockReason) ||
              isFetching
            }
          >
            <FormattedMessage id="setting.customer.profile.block" />
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

BlockCustomerModal.propTypes = {
  callUserData: PropTypes.func,
  Id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
};
