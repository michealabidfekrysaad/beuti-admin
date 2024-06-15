/* eslint-disable  react/prop-types */

import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FormControl, TextField } from '@material-ui/core';
import { onlyNumbers } from 'functions/validate';

const EditSPCommission = ({
  open,
  setOpen,
  messages,
  isLoading,
  newCommission,
  setNewCommission,
  handleSubmit,
  oldCommission,
  editComissionRes,
}) => {
  useEffect(() => {
    if (editComissionRes?.data?.success) {
      setOpen(false);
    }
  }, [editComissionRes]);
  return (
    <Modal
      onHide={() => {
        setNewCommission(oldCommission);
        setOpen(false);
      }}
      show={open}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="bootstrap-modal-customizing"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter" className="title">
          {messages['beuti.new.commission.title']}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormControl fullWidth className="mb-3">
          <TextField
            error={
              newCommission > 99 || newCommission < 0
                ? messages['common.zero.two.numbers']
                : false
            }
            value={newCommission}
            className="login-modal-input"
            label={messages['beuti.new.commission.title']}
            onChange={(e) =>
              onlyNumbers(e.target.value) ? setNewCommission(+e.target.value) : null
            }
            helperText={
              newCommission > 99 || newCommission < 0
                ? messages['common.zero.two.numbers']
                : false
            }
          />
        </FormControl>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            setNewCommission(oldCommission);
            setOpen(false);
          }}
          disabled={isLoading}
          className="px-4"
          variant="outline-danger"
        >
          {messages['common.close']}
        </Button>
        <Button
          variant="success"
          disabled={
            newCommission > 99 || newCommission < 0 || oldCommission === newCommission
          }
          onClick={() => handleSubmit(true)}
          className="px-4"
        >
          {messages['common.confirm']}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSPCommission;
