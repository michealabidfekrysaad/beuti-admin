/* eslint-disable react/no-this-in-sfc */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import BeutiInput from 'Shared/inputs/BeutiInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import { RemoveChecker, salesItemIds } from '../../Helper/ViewsEnum';
import DiscountForm from './DiscountForm';
import { CustomItemschema } from './CustomItem.schema';
export default function CustomeItem({
  open,
  setOpen,
  setSalesData,
  salesData,
  removeItemOrNot,
  setRemoveItemOrNot,
  setOpenConfirmRemove,
  EditedItemClicked = {},
  identifier,
}) {
  const { messages } = useIntl();
  const [discountBySar, setDiscountBySar] = useState(false);
  const [activeDiscount, setActiveDiscount] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0);
  const [savedPriceIntoCart, setSavedPriceIntoCart] = useState(0);
  const [itemDiscountAmount, setitemDiscountAmount] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(
      CustomItemschema(
        discountBySar,
        activeDiscount,
        maxPrice,
        EditedItemClicked,
        messages,
      ),
    ),
    defaultValues: {
      discountPercentage: 0,
      discountSar: 0,
      finalPrice: 0,
    },
  });

  const closeModal = () => {
    reset();
    setActiveDiscount(false);
    clearErrors();
    setOpen(false);
  };

  useEffect(() => {
    if (open && EditedItemClicked?.item) {
      setValue(
        'price',
        EditedItemClicked?.item?.priceBeforeDiscount || EditedItemClicked?.item?.price,
      );
      setValue('percentage', EditedItemClicked?.item?.percentage);
      setValue('finalPrice', EditedItemClicked?.item?.finalPrice);
      setDiscountBySar(EditedItemClicked?.item?.discountBySar);
      setValue('priceWithVat', EditedItemClicked?.item?.priceWithVat);
      setValue('discountPercentage', EditedItemClicked?.item?.discountPercentage || 0);
      setValue('discountSar', EditedItemClicked?.item?.discountSar);
      setValue('name', EditedItemClicked?.item?.name);
      setValue('quantity', EditedItemClicked?.item?.quantity);
      setValue('freequantity', EditedItemClicked?.item?.freequantity || 0);
      setSavedPriceIntoCart(EditedItemClicked?.item?.savedPriceIntoCart);
      setActiveDiscount(EditedItemClicked?.item?.activeDiscount);
    }
  }, [open]);

  const FormSubmit = () => {
    const commonDataObj = {
      name: watch('name')?.length
        ? watch('name')
        : messages['add.custom.item.place.holder'],
      price: !activeDiscount ? +watch('price') : savedPriceIntoCart,
      priceBeforeDiscount: +watch('price') || 0,
      percentage: +watch('percentage') || 0,
      finalPrice: +watch('finalPrice') || 0,
      discountBySar,
      priceWithVat: +watch('priceWithVat') || 0,
      discountPercentage: +watch('discountPercentage') || 0,
      discountSar: +watch('discountSar') || 0,
      id: EditedItemClicked?.item?.id,
      identify: EditedItemClicked?.item?.identify,
      savedPriceIntoCart,
      activeDiscount,
      freequantity: +watch('freequantity') || 0,
      itemDiscountAmount: activeDiscount ? itemDiscountAmount : 0,
    };
    // add custom  item for first time
    if (!EditedItemClicked?.item) {
      setSalesData({
        ...salesData,
        itemsSelected: [
          ...salesData?.itemsSelected,
          {
            ...commonDataObj,
            quantity: 1,
            identify: salesItemIds?.customItem,
            id: Math.floor(Math.random() * 10000),
          },
        ],
      });
      // edit  the custom  item
    } else {
      setSalesData({
        ...salesData,
        itemsSelected: [
          ...salesData?.itemsSelected?.map((data) => {
            if (
              (data?.identify === salesItemIds?.customItem ||
                data?.identify === salesItemIds?.fees ||
                data?.identify === salesItemIds?.products) &&
              data?.id === EditedItemClicked?.item?.id
            ) {
              return {
                ...data,
                ...commonDataObj,
                quantity: +watch('quantity'),
              };
            }
            return data;
          }),
        ],
      });
    }
    closeModal();
    return null;
  };

  const removeItem = () => {
    setSalesData({
      ...salesData,
      itemsSelected: salesData?.itemsSelected?.filter(
        (data) => data?.id !== EditedItemClicked?.item?.id,
      ),
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                  calculate price with vat depend on price                  */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const priceWithQuantity =
      +watch('price') * ((+watch('quantity') || 1) - (+watch('freequantity') || 0)) || 0;

    if (!errors?.price?.message) {
      setValue(
        'priceWithVat',
        (
          priceWithQuantity +
          priceWithQuantity * salesData?.calculations?.vatPercentage
        ).toFixed(2),
      );
      setMaxPrice(+watch('price'));
    }
  }, [watch('price')]);

  /* -------------------------------------------------------------------------- */
  /*             calculate  final price, shown  price  in  the cart             */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const singleItemPrice = +watch('price') || 0;
    const priceWithQuantity =
      +watch('price') * ((+watch('quantity') || 1) - (+watch('freequantity') || 0)) || 0;

    if (!discountBySar) {
      setValue(
        'finalPrice',
        (
          priceWithQuantity -
          priceWithQuantity * (+watch('discountPercentage') / 100) +
          (priceWithQuantity - priceWithQuantity * (+watch('discountPercentage') / 100)) *
            (+watch('discountPercentage') / 100)
        ).toFixed(2),
      );
      setSavedPriceIntoCart(
        (
          singleItemPrice -
          singleItemPrice * (+watch('discountPercentage') / 100)
        )?.toFixed(2),
      );
      setitemDiscountAmount((+watch('discountPercentage') * singleItemPrice) / 100);
    }
    if (discountBySar) {
      setValue(
        'finalPrice',
        (
          priceWithQuantity -
          +watch('discountSar') +
          (priceWithQuantity - +watch('discountSar')) *
            salesData?.calculations?.vatPercentage
        ).toFixed(2),
      );
      setSavedPriceIntoCart((singleItemPrice - +watch('discountSar'))?.toFixed(2));
      setitemDiscountAmount(+watch('discountSar'));
    }
  }, [
    watch('discountPercentage'),
    watch('discountSar'),
    watch('price'),
    watch('quantity'),
    watch('freequantity'),
    activeDiscount,
    discountBySar,
  ]);

  useEffect(() => {
    if (
      removeItemOrNot === RemoveChecker.removed &&
      (salesItemIds?.customItem === identifier ||
        salesItemIds?.products === identifier ||
        salesItemIds?.fees === identifier)
    ) {
      removeItem();
      setRemoveItemOrNot(false);
    }
  }, [removeItemOrNot]);

  return (
    <Modal
      onHide={() => {
        closeModal();
      }}
      show={open}
      size="lg"
      centered
      aria-labelledby="contained-modal-title-vcenter"
      className={`bootstrap-modal-customizing ${
        !EditedItemClicked?.item ? 'add-custom-item' : 'edit add-custom-item'
      }`}
    >
      <Modal.Header>
        <Modal.Title className="title mb-0">
          <FormattedMessage
            id={`${EditedItemClicked?.item ? 'edit' : 'add'}.custom.item`}
          />
        </Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit(FormSubmit)}>
        {EditedItemClicked?.item && (
          <Modal.Body>
            <Row className="edit-body">
              <Col xs={12}>
                <section className="edit-body_pay--amount">
                  <section className="product-details">
                    {EditedItemClicked?.item?.identify === salesItemIds?.products && (
                      <SVG src={toAbsoluteUrl('/productModal.svg')} />
                    )}
                    <div className="edit-body_pay--amount-pay">
                      <p className="product-details_name">
                        {EditedItemClicked?.item?.name}
                      </p>
                      {EditedItemClicked?.item?.identify === salesItemIds?.products && (
                        <p className="product-details_qantity"> Low Stock</p>
                      )}
                    </div>
                  </section>
                  <div className="edit-body_pay--amount-num">
                    <FormattedMessage
                      id="vouchers.new.value.price"
                      values={{ price: EditedItemClicked?.item?.price }}
                    />
                  </div>
                </section>
              </Col>
            </Row>
          </Modal.Body>
        )}
        <Row className="pb-2 mx-3">
          {!EditedItemClicked?.item && (
            <Col xs="12" className="mt-4  edit-body_input--div">
              <BeutiInput
                error={errors?.name?.message}
                useFormRef={register('name')}
                label={<FormattedMessage id="custome.item.name" />}
                placeholder={messages['add.custom.item.place.holder']}
              />
            </Col>
          )}
          <Col
            md={`${EditedItemClicked?.item ? '6' : '8'}`}
            xs="12"
            className="mt-4  edit-body_input--div"
          >
            <BeutiInput
              error={errors?.price?.message}
              useFormRef={register('price')}
              label={<FormattedMessage id="products.table.price" />}
              info={<FormattedMessage id="common.currency" />}
              disabled={activeDiscount}
            />
          </Col>
          {!EditedItemClicked?.item && (
            <Col md="4" xs="12" className="mt-4  edit-body_input--div">
              <BeutiInput
                error={errors?.priceWithVat?.message}
                useFormRef={register('priceWithVat')}
                label={<FormattedMessage id="products.input.price.withoutvat" />}
                info={<FormattedMessage id="common.currency" />}
                disabled
              />
            </Col>
          )}
          {EditedItemClicked?.item && (
            <Col md="6" xs="12" className="mt-4  edit-body_input--div">
              <BeutiInput
                type="number"
                error={errors?.quantity?.message}
                useFormRef={register('quantity')}
                label={<FormattedMessage id="checkout.edit.booking.quantity" />}
              />
            </Col>
          )}
          {EditedItemClicked?.item?.identify === salesItemIds?.customItem && (
            <Col xs="12" className="mt-4  edit-body_input--div">
              <BeutiInput
                error={errors?.name?.message}
                useFormRef={register('name')}
                label={<FormattedMessage id="custome.item.name" />}
                placeholder={messages['add.custom.item.place.holder']}
              />
            </Col>
          )}{' '}
          {EditedItemClicked?.item?.identify === salesItemIds?.products && (
            <Col xs="12">
              <Row className="align-items-end">
                <Col xs="6" className="mt-4  edit-body_input--div">
                  <BeutiInput
                    error={errors?.freequantity?.message}
                    useFormRef={register('freequantity')}
                    label="Free Quantity"
                  />
                </Col>
                {+watch('freequantity') > 0 &&
                  +watch('freequantity') < watch('quantity') && (
                    <Col xs="6" className="freeitem-text">
                      <FormattedMessage
                        id="sales.edit.product.free.quanity.with.total"
                        values={{
                          paid: +watch('quantity') - +watch('freequantity'),
                          free: +watch('freequantity'),
                        }}
                      />
                    </Col>
                  )}
                {+watch('freequantity') > 0 &&
                  +watch('freequantity') === watch('quantity') && (
                    <Col xs="6" className="freeitem-text">
                      <FormattedMessage
                        id="sales.edit.product.free.quanity.all"
                        values={{
                          free: +watch('freequantity'),
                        }}
                      />
                    </Col>
                  )}
              </Row>
            </Col>
          )}
          <hr className="w-100 mt-5" />
        </Row>
        <DiscountForm
          activeDiscount={activeDiscount}
          discountBySar={discountBySar}
          setDiscountBySar={setDiscountBySar}
          watch={watch}
          setActiveDiscount={setActiveDiscount}
          clearErrors={clearErrors}
          errors={errors}
          register={register}
        />
        <Modal.Footer className="edit-footer">
          <>
            {EditedItemClicked?.item && (
              <div className="remove">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    closeModal();
                    setOpenConfirmRemove(true);
                  }}
                >
                  <FormattedMessage id="checkout.modal.remove.item" />
                </button>
              </div>
            )}
            <div className="btns">
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
            </div>
          </>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

CustomeItem.propTypes = {
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  setSalesData: PropTypes.func,
  salesData: PropTypes.object,
  removeItemOrNot: PropTypes.bool,
  setRemoveItemOrNot: PropTypes.func,
  setOpenConfirmRemove: PropTypes.func,
  EditedItemClicked: PropTypes.object,
  identifier: PropTypes.object,
};
