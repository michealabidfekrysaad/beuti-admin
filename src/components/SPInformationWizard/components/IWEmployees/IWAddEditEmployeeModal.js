/* eslint-disable react/jsx-props-no-spreading */

import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal, Row, Col, Image } from 'react-bootstrap';
import { FormHelperText } from '@material-ui/core';
import BeutiInput from '../../../../Shared/inputs/BeutiInput';
import RadioInputMUI from '../../../../Shared/inputs/RadioInputMUI';
import UploadImage from '../../../shared/UploadImage';
import { toAbsoluteUrl } from '../../../../functions/toAbsoluteUrl';
import BeutiButton from '../../../../Shared/inputs/BeutiButton';

export function IWAddEditEmployeeModal({
  submitActionType,
  openModal,
  setOpenModal,
  register,
  handleSubmit,
  setValue,
  watch,
  errors,
  control,
  loading,
  clearErrors,
  errorUploadImg,
  setErrorUploadImg,
}) {
  const { messages } = useIntl();

  const optionsList = useMemo(
    () => [
      {
        id: 1,
        label: messages['wizard.add.new.service.location.home'],
      },
      {
        id: 2,
        label: messages['wizard.add.new.service.location.salon'],
      },
      {
        id: 3,
        label: messages['wizard.add.new.service.location.both'],
      },
    ],
    [],
  );

  return (
    <>
      <Modal
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing"
        onHide={() => null}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header>
            <Modal.Title className="title">
              {submitActionType === 1
                ? messages['rw.employees.add']
                : messages['admin.employees.edit']}
            </Modal.Title>
            <div className="addempoloyee-modal-header">
              <Image src={watch('employee.image') || toAbsoluteUrl('/Avatar.png')} />
              <UploadImage
                onDone={(e) => setValue('employee.image', e)}
                changing
                text={messages['common.upload']}
                changeImgText={messages['common.change']}
                maxSizeUpload="3000"
                setErrorMessage={setErrorUploadImg}
              />
              <FormHelperText id="component-error-text" error>
                {errorUploadImg}
              </FormHelperText>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-4">
              <Col xs="12" className="mb-4">
                <BeutiInput
                  type="text"
                  label={messages['rw.emoloyees.name.ar']}
                  useFormRef={register('employee.nameAr')}
                  error={errors?.employee?.nameAr?.message}
                />
              </Col>
              <Col xs="12">
                <BeutiInput
                  type="text"
                  label={messages['rw.emoloyees.name.en']}
                  useFormRef={register('employee.nameEn')}
                  error={errors?.employee?.nameEn?.message}
                />
              </Col>
            </Row>
            <Row>
              <Col xs="12" className="mb-1">
                {messages['rw.emoloyees.location']}
              </Col>
              <Col xs="12">
                <RadioInputMUI
                  list={optionsList}
                  control={control}
                  name="employee.workingLocation"
                  error={errors?.employee?.workingLocation?.message}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="pt-3">
            <button
              type="button"
              className="px-4 cancel"
              disabled={loading}
              onClick={() => {
                setOpenModal(false);
                clearErrors();
                setErrorUploadImg(false);
                setValue('employee', {});
              }}
            >
              <FormattedMessage id="common.cancel" />
            </button>
            <BeutiButton
              loading={loading}
              text={messages['common.add']}
              className="px-4 confirm"
              type="submit"
            />
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

IWAddEditEmployeeModal.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  handleSubmit: PropTypes.func,
  register: PropTypes.func,
  setValue: PropTypes.func,
  clearErrors: PropTypes.func,
  watch: PropTypes.func,
  errors: PropTypes.object,
  control: PropTypes.object,
  submitActionType: PropTypes.number,
  loading: PropTypes.bool,
  errorUploadImg: PropTypes.bool,
  setErrorUploadImg: PropTypes.func,
};
