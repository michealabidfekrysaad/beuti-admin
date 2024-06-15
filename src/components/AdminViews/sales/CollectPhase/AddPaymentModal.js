/* eslint-disable prefer-template */
import React, { useEffect } from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import BeutiInput from 'Shared/inputs/BeutiInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

export default function AddPaymentModal({
  setOpen,
  open,
  toPayAmount,
  expectedAmountToPay,
  selectedPayMethod,
  salesData,
  setSalesData,
  setFlagUpdateCheckout,
  flagUpdateCheckout,
  refetchAddBoookingCheckout,
}) {
  const { messages } = useIntl();
  const schema = yup.object().shape({
    price: yup
      .string()
      .matches(/^\d+(\.\d{1,2})?$/, {
        message: messages['checkout.price.pay.required'],
      })
      .test('len', messages['products.price.max'], (val) => {
        if (val === undefined) {
          return true;
        }
        return val <= 10000;
      })
      .required(messages['checkout.price.pay.required']),
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
    defaultValues: {
      price: toPayAmount,
    },
  });
  useEffect(() => {
    if (open) {
      setValue('price', toPayAmount);
    }
  }, [open]);

  const addNewVlaueOrSumToTheOld = (idNewVal) => {
    if (
      salesData?.paymentMethodAmounts?.find(
        (method) => method?.paymentMethodId === idNewVal,
      ) &&
      !salesData?.paymentMethodAmounts?.find(
        (method) => method?.paymentMethodId === idNewVal,
      ).isSaved
    ) {
      setSalesData({
        ...salesData,
        paymentMethodAmounts: [
          ...salesData?.paymentMethodAmounts?.filter(
            (method) => method?.paymentMethodId !== idNewVal,
          ),
          {
            id: salesData?.paymentMethodAmounts?.find(
              (method) => method?.paymentMethodId === idNewVal,
            )?.id,
            name: selectedPayMethod?.name,
            paymentMethodId: idNewVal,
            amount:
              +watch('price') +
              salesData?.paymentMethodAmounts?.find(
                (method) => method?.paymentMethodId === idNewVal,
              )?.amount,
          },
        ],
      });
    } else {
      setSalesData({
        ...salesData,
        paymentMethodAmounts: [
          ...salesData?.paymentMethodAmounts,
          {
            id: `3fa85f64-5717-4${Math.floor(
              Math.random() * 90 + 10,
            )}2-b0fc-2c963f66afa2`,
            name: selectedPayMethod?.name,
            paymentMethodId: idNewVal,
            amount: +watch('price'),
            isSaved: false,
          },
        ],
      });
    }
    setFlagUpdateCheckout({ ...flagUpdateCheckout, price: true });
    if (+watch('price') === toPayAmount || +watch('price') > toPayAmount) {
      setTimeout(() => {
        refetchAddBoookingCheckout();
      }, [200]);
    }
    closeModal();
  };

  const closeModal = () => {
    clearErrors();
    setOpen(false);
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
      className="bootstrap-modal-customizing payment"
    >
      <Modal.Header>
        <Modal.Title className="title">
          <FormattedMessage
            id="checkout.modal.title"
            values={{ pay: selectedPayMethod?.name }}
          />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="payment-body">
          <Col xs={12}>
            <section className="payment-body_pay--amount">
              <div className="payment-body_pay--amount-pay">
                <FormattedMessage
                  id={`${
                    toPayAmount >= 0
                      ? 'checkout.modal.amount.pay'
                      : 'checkout.modal.amount.refunded'
                  }`}
                />
              </div>
              <div className="payment-body_pay--amount-num">
                <FormattedMessage
                  id="vouchers.new.value.price"
                  values={{ price: toPayAmount }}
                />
              </div>
            </section>
          </Col>
          <Col xs={12} className="mt-4  payment-body_input--div">
            <BeutiInput
              error={errors?.price?.message}
              useFormRef={register('price')}
              label={<FormattedMessage id="checkout.modal.select.label" />}
              info={<FormattedMessage id="common.currency" />}
            />
            <p className="payment-body_input--div-change pt-3">
              {+watch('price') === toPayAmount && !errors?.price?.message && (
                <FormattedMessage id="checkout.modal.no.change.given" />
              )}
              {+watch('price') < toPayAmount && !errors?.price?.message && (
                <>
                  <FormattedMessage id="checkout.modal.amount.pay" />{' '}
                  {toPayAmount - +watch('price')}
                  <FormattedMessage id="common.currency" />
                </>
              )}
              {+watch('price') > toPayAmount && !errors?.price?.message && (
                <>
                  <FormattedMessage id="checkout.modal.change.given" />{' '}
                  {+watch('price') - toPayAmount}
                  <FormattedMessage id="common.currency" />
                </>
              )}
            </p>
          </Col>
        </Row>
        <Row className="my-4">
          {expectedAmountToPay?.map((num) => (
            <Col xs={4} key={num}>
              <button
                type="button"
                onClick={() => {
                  setValue('price', num);
                  addNewVlaueOrSumToTheOld(selectedPayMethod?.id);
                  clearErrors();
                }}
                className="mt-3  payment-body_options--div"
              >
                <FormattedMessage id="vouchers.new.value.price" values={{ price: num }} />
              </button>
            </Col>
          ))}
        </Row>
      </Modal.Body>
      <Modal.Footer>
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
            addNewVlaueOrSumToTheOld(selectedPayMethod?.id);
          }}
          disabled={!!errors?.price?.message}
        >
          {+watch('price') === toPayAmount || +watch('price') > toPayAmount ? (
            <FormattedMessage id="sales.collect.save.checkout" />
          ) : (
            <FormattedMessage id="checkout.modal.collect.btn" />
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

AddPaymentModal.propTypes = {
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  toPayAmount: PropTypes.number,
  expectedAmountToPay: PropTypes.array,
  selectedPayMethod: PropTypes.object,
  salesData: PropTypes.object,
  setSalesData: PropTypes.func,
  setFlagUpdateCheckout: PropTypes.func,
  flagUpdateCheckout: PropTypes.object,
  refetchAddBoookingCheckout: PropTypes.func,
};
