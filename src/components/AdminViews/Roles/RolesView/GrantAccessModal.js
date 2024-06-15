/* eslint-disable react/no-this-in-sfc */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { Col, Modal, Row, Dropdown } from 'react-bootstrap';
import BeutiInput from 'Shared/inputs/BeutiInput';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import SelectInputMUI from 'Shared/inputs/SelectInputMUI';

export default function GrantAccessModal({
  openModal,
  setOpenModal,
  allEmp = [],
  selectedEmp,
  setSelectedEmp,
  setSelectedrole,
  selectedRole,
}) {
  const schema = yup.object().shape({
    phone: yup
      .string()
      .test('phoneTest', function(val) {
        // if (val.length === 0) {
        //   return this.createError({
        //     message: <FormattedMessage id="register.phonenumber.error.required" />,
        //     path: 'phone',
        //   });
        // }
        if (val && val.length !== 8) {
          return this.createError({
            message: <FormattedMessage id="register.phonenumber.error.required.saudia" />,
            path: 'phone',
          });
        }
        return true;
      })
      .matches(/^[0-9]*$/, {
        message: <FormattedMessage id="register.phonenumber.error.required.saudia" />,
      }),
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });
  const { messages } = useIntl();

  const closeModal = () => {
    setOpenModal(false);
    clearErrors();
  };
  const FormSubmit = (data) => {
    //   error  from  BE
    // setError('phone', { type: 'custom', message: 'common' });
    console.log(data);
    closeModal();
  };

  return (
    <Modal
      onHide={() => closeModal()}
      show={openModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      className="bootstrap-modal-customizing add-custom-item edit"
    >
      <form onSubmit={handleSubmit(FormSubmit)}>
        <Modal.Header>
          <Modal.Title className="title">
            <FormattedMessage id="roles.grant.access" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs="12" className="mb-2">
              <SelectInputMUI
                list={allEmp}
                value={selectedEmp}
                onChange={(e) => setSelectedEmp(e.target.value)}
                label={messages['roles.grant.access.select.emp']}
              />
            </Col>
            <Col xs="12" className="mb-2">
              <div className="phonenumber-start">
                <BeutiInput
                  type="text"
                  label={messages['common.mobile number']}
                  useFormRef={register('phone')}
                  error={errors?.phone?.message}
                />
                <label htmlFor="minimumPrice" className="icon">
                  05 |
                </label>
              </div>
            </Col>
            <Col xs="12" className="mb-2">
              <SelectInputMUI
                list={[]}
                value={selectedRole}
                onChange={(e) => setSelectedrole(e.target.value)}
                label={messages['roles.grant.access.select.roles']}
              />
            </Col>
          </Row>
        </Modal.Body>{' '}
        <Modal.Footer className="justify-content-end">
          <div></div>
          <div className="btns">
            <button type="button" className="btn cancel" onClick={() => closeModal()}>
              <FormattedMessage id="common.cancel" />
            </button>
            <button type="submit" className="btn confirm">
              <FormattedMessage id="common.save" />
            </button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
