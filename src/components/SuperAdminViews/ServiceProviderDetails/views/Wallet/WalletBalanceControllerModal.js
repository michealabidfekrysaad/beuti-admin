/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Label, TextArea, Form } from 'semantic-ui-react';
import { Modal, Row, Col } from 'react-bootstrap';
import { useIntl, FormattedMessage } from 'react-intl';
import { isPrice } from 'functions/validate';

const WalletBalanceControllerModal = ({
  open,
  setOpen,
  handleSubmit,
  payload,
  changePayload,
}) => {
  const { messages } = useIntl();
  const maxLength = 100;
  const roundTwoNum = (value) => (value ? Math.round(value * 100) / 100 : null);
  console.log(open);
  return (
    <Modal
      show={open}
      onHide={() => {
        setOpen(false);
      }}
      size="lg"
      className="bootstrap-modal-customizing"
    >
      <Modal.Header className="align-items-start px-4">
        <Modal.Title className="title mb-0">
          {payload.sign === 1
            ? messages['sAdmin.spDetails.walletIncrease']
            : messages['sAdmin.spDetails.walletdecrease']}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Input
          labelPosition="right"
          type="number"
          placeholder={messages['sAdmin.spDetails.wallet.table.amount']}
          className="mb-3 hide-arrows"
          value={payload.amount}
          onChange={(e) =>
            (isPrice(e.target.value) || !e.target.value) && e.target.value.length < 6
              ? changePayload({
                  ...payload,
                  amount: roundTwoNum(e.target.value),
                })
              : null
          }
        >
          <input />
          <Label basic>{messages['common.currency']}</Label>
        </Input>
        <Form>
          <TextArea
            placeholder={messages['sAdmin.spDetails.wallet.table.note']}
            onChange={(e) => changePayload({ ...payload, note: e.target.value })}
          />
          {payload.note.length > maxLength && (
            <small className="text-danger">
              <FormattedMessage
                id="sAdmin.spDetails.wallet.table.note.error"
                values={{ error: maxLength }}
              />
            </small>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer className="justify-content-end">
        <div className="px-3">
          <Button
            negative
            onClick={() => {
              setOpen(false);
              changePayload({ ...payload, note: '', sign: 0, amount: null });
            }}
          >
            {messages['common.back']}
          </Button>
          <Button
            positive
            onClick={handleSubmit}
            disabled={
              +payload.amount === 0 ||
              !payload.amount ||
              payload.note.length <= 0 ||
              payload.note.length > maxLength
            }
          >
            {messages['common.save']}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

WalletBalanceControllerModal.propTypes = {
  open: PropTypes.bool,
  payload: PropTypes.object,
  handleSubmit: PropTypes.func,
  setOpen: PropTypes.func,
  changePayload: PropTypes.func,
};
export default WalletBalanceControllerModal;
