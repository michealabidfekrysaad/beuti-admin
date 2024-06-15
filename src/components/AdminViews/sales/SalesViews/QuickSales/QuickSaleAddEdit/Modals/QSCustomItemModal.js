/* eslint-disable react/no-this-in-sfc */
/* eslint-disable indent */
import React from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import BeutiInput from 'Shared/inputs/BeutiInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { CustomItemschema } from './CustomItem.schema';
import { dropDownTypesItems } from '../../Helper/QuickSale.Helper';

// import { RemoveChecker, salesItemIds } from '../../Helper/ViewsEnum';

export default function QSCustomeItemModal({
  open,
  setOpen,
  setQuickSaleItems,
  quickSaleItems,
}) {
  const { messages } = useIntl();

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(CustomItemschema),
  });

  const closeModal = () => {
    reset();
    clearErrors();
    setOpen(false);
  };

  const FormSubmit = () => {
    setQuickSaleItems([
      ...quickSaleItems,
      {
        type: dropDownTypesItems.customItem,
        id: Math.random(),
        name: watch('name'),
        price: watch('price'),
      },
    ]);

    closeModal();
    return null;
  };

  return (
    <Modal
      onHide={() => {
        closeModal();
      }}
      show={open}
      size="lg"
      centered
      aria-labelledby="contained-modal-title-vcenter"
      className="bootstrap-modal-customizing add-custom-item"
    >
      <Modal.Header>
        <Modal.Title className="title mb-0">
          <FormattedMessage id="add.custom.item" />
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit(FormSubmit)}>
        <Row className="pb-2 mx-3">
          <Col xs="12" className="mt-4  edit-body_input--div">
            <BeutiInput
              error={errors?.name?.message}
              useFormRef={register('name')}
              label={<FormattedMessage id="custome.item.name" />}
              placeholder={messages['add.custom.item.place.holder']}
            />
          </Col>
          <Col md="12" xs="12" className="mt-4  edit-body_input--div">
            <BeutiInput
              error={errors?.price?.message}
              useFormRef={register('price')}
              label={<FormattedMessage id="products.table.price" />}
              info={<FormattedMessage id="common.currency" />}
            />
          </Col>
        </Row>

        <Modal.Footer className="edit-footer mt-5">
          <button type="button" className="btn cancel" onClick={() => closeModal()}>
            <FormattedMessage id="common.cancel" />
          </button>
          <button
            type="submit"
            className="btn confirm"
            disabled={!!errors?.price?.message || !!errors?.name?.message}
          >
            <FormattedMessage id="common.save" />
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

QSCustomeItemModal.propTypes = {
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  setQuickSaleItems: PropTypes.func,
  quickSaleItems: PropTypes.object,
};
