/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import BeutiInput from 'Shared/inputs/BeutiInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import SelectInputMUI from 'Shared/inputs/SelectInputMUI';

export default function EditBookingItems({
  open,
  setOpen,
  EditedItemClicked,
  allEmp,
  setNewPackagesData,
  setNewServicesData,
  newPackagesData,
  newServicesData,
  setFlagUpdateCheckout,
  flagUpdateCheckout,
  breakDownRes,
}) {
  const { messages } = useIntl();
  const [newSelectedEmp, setNewSelectedEmp] = useState(false);
  const [tempData, setTempData] = useState(false);

  const schema = yup.object().shape({
    price: yup
      .string()
      .matches(/^[0-9.]*$/, {
        message: messages['checkout.price.pay.number'],
      })
      .test('len', messages['products.price.max'], (val) => {
        if (val === undefined) {
          return true;
        }
        return val <= 10000;
      })
      .required(messages['checkout.price.pay.required']),
    quantity: yup
      .string()
      .test('len', messages['products.quantity.min'], (val) => {
        if (!val) {
          return true;
        }
        return +val >= 1;
      })
      .test('len', messages['products.quantity.max'], (val) => {
        if (val === undefined) {
          return true;
        }
        return +val <= 1000000;
      })
      .required(messages['checkout.edit.booking.quantity.required']),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (open) {
      setValue(
        'price',
        EditedItemClicked?.serviceorNot
          ? EditedItemClicked?.item?.priceWithoutVat
          : EditedItemClicked?.item?.itemPriceWithoutVat,
      );
      setValue('quantity', EditedItemClicked?.item?.quantity);
      if (EditedItemClicked?.serviceorNot) {
        setNewSelectedEmp(
          allEmp?.find((emp) => emp?.id === EditedItemClicked?.item?.employeeId)?.id,
        );
      }
      setTempData(
        EditedItemClicked?.serviceorNot
          ? newServicesData?.find((ser) => ser?.id === EditedItemClicked?.item?.id)
          : newPackagesData?.find(
              (ser) =>
                ser?.packageHistoryId === EditedItemClicked?.item?.packageHistoryId,
            ),
      );
    }
  }, [open]);

  const closeModal = () => {
    clearErrors();
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      if (EditedItemClicked?.serviceorNot) {
        setTempData({
          ...tempData,
          employeeId: newSelectedEmp,
          employeeName: allEmp?.find((emp) => emp?.id === newSelectedEmp)?.name,
          quantity: +watch('quantity'),
          priceWithoutVat: +watch('price'),
        });
      } else {
        setTempData({
          ...tempData,
          quantity: +watch('quantity'),
          itemPriceWithoutVat: +watch('price'),
        });
      }
    }
  }, [watch('price'), watch('quantity'), newSelectedEmp]);
  const addNewItemData = () => {
    if (EditedItemClicked?.serviceorNot) {
      setNewServicesData(
        newServicesData?.map((ser) => {
          if (ser?.id === EditedItemClicked?.item?.id) {
            return tempData;
          }
          return ser;
        }),
      );
    } else {
      setNewPackagesData(
        newPackagesData?.map((ser) => {
          if (ser?.packageHistoryId === EditedItemClicked?.item?.packageHistoryId) {
            return tempData;
          }
          return ser;
        }),
      );
    }
    setFlagUpdateCheckout({ ...flagUpdateCheckout, item: true });
    closeModal();
  };
  const removeItem = () => {
    if (EditedItemClicked?.serviceorNot) {
      setNewServicesData([
        ...newServicesData?.filter((ser) => ser?.id !== EditedItemClicked?.item?.id),
      ]);
    } else {
      setNewPackagesData([
        ...newServicesData?.filter(
          (ser) => ser?.packageHistoryId !== EditedItemClicked?.item?.packageHistoryId,
        ),
      ]);
    }
    setFlagUpdateCheckout({ ...flagUpdateCheckout, item: true });
    closeModal();
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
      className="bootstrap-modal-customizing edit"
    >
      <Modal.Header>
        <Modal.Title className="title">
          <FormattedMessage id="checkout.edit.booking.item" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="edit-body mb-2">
          <Col xs={12}>
            <section className="edit-body_pay--amount">
              <div className="edit-body_pay--amount-pay">
                {EditedItemClicked?.item?.name}
              </div>
              <div className="edit-body_pay--amount-num">
                <FormattedMessage
                  id="vouchers.new.value.price"
                  values={{ price: EditedItemClicked?.item?.totalItemsPriceWithoutVat }}
                />
              </div>
            </section>
          </Col>
          <Col xs={6} className="mt-4  edit-body_input--div">
            <BeutiInput
              error={errors?.price?.message}
              useFormRef={register('price')}
              label={<FormattedMessage id="checkout.modal.price" />}
              info={<FormattedMessage id="common.currency" />}
            />
          </Col>
          <Col xs={6} className="mt-4  edit-body_input--div">
            <BeutiInput
              type="number"
              error={errors?.quantity?.message}
              useFormRef={register('quantity')}
              label={<FormattedMessage id="checkout.edit.booking.quantity" />}
            />
          </Col>
          {EditedItemClicked?.serviceorNot && (
            <Col xs={12} className="mt-4  edit-body_input--div">
              <SelectInputMUI
                label={<FormattedMessage id="booking.flow.emp.name" />}
                list={allEmp}
                value={newSelectedEmp}
                onChange={(e) => setNewSelectedEmp(e?.target?.value)}
              />
            </Col>
          )}
        </Row>
      </Modal.Body>
      <Modal.Footer className="edit-footer">
        <div className="remove">
          {(breakDownRes?.services?.length > 1 || breakDownRes?.packages?.length > 1) && (
            <button type="button" className="btn" onClick={() => removeItem()}>
              <FormattedMessage id="checkout.modal.remove.item" />
            </button>
          )}
        </div>
        <div className="btns">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => closeModal()}
          >
            <FormattedMessage id="common.cancel" />
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              addNewItemData();
            }}
            disabled={!!errors?.price?.message || !!errors?.quantity?.message}
          >
            <FormattedMessage id="common.save" />
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

EditBookingItems.propTypes = {
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  EditedItemClicked: PropTypes.object,
  allEmp: PropTypes.array,
  setNewServicesData: PropTypes.func,
  setNewPackagesData: PropTypes.func,
  newPackagesData: PropTypes.array,
  newServicesData: PropTypes.array,
  setFlagUpdateCheckout: PropTypes.func,
  flagUpdateCheckout: PropTypes.object,
  breakDownRes: PropTypes.array,
};
