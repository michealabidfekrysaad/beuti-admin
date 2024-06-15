/* eslint-disable no-lonely-if */
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
import Toggle from 'react-toggle';
import { RemoveChecker, salesItemIds } from '../../Helper/ViewsEnum';

export default function EditServiceAndPackage({
  open,
  setOpen,
  EditedItemClicked,
  allEmp,
  setOpenConfirmRemove,
  removeItemOrNot,
  setRemoveItemOrNot,
  salesData,
  setSalesData,
  identifier,
  setBookingSelectedInTheCart,
}) {
  const { messages } = useIntl();
  const [discountBySar, setDiscountBySar] = useState(false);
  const [activeDiscount, setActiveDiscount] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0);
  const [savedPriceIntoCart, setSavedPriceIntoCart] = useState(0);
  const [newSelectedEmp, setNewSelectedEmp] = useState(false);
  const [itemDiscountAmount, setitemDiscountAmount] = useState(0);

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
    discountPercentage:
      !discountBySar &&
      activeDiscount &&
      yup
        .string()
        .matches(/^[0-9.]*$/, {
          message: messages['sales.custom.item.discount.percentage.required'],
        })
        .test('len', messages['sales.custom.item.discount.percentage.max'], (val) => {
          if (val === undefined) {
            return true;
          }
          return val <= 100;
        })
        .required(messages['sales.custom.item.discount.percentage.min']),
    discountSar:
      discountBySar &&
      activeDiscount &&
      yup
        .string()
        .matches(/^[0-9.]*$/, {
          message: `${messages['sales.custom.item.discount.sar.required']} ${maxPrice} ${messages['common.currency']}`,
        })
        .test(
          'len',
          `${messages['sales.custom.item.discount.sar.required']} ${maxPrice} ${messages['common.currency']}`,
          (val) => {
            if (val === undefined) {
              return true;
            }
            return val <= maxPrice;
          },
        )
        .required(
          `${messages['sales.custom.item.discount.sar.required']} ${maxPrice} ${messages['common.currency']}`,
        ),
    finalPrice: yup.number(),
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
    if (!errors?.price?.message) {
      setMaxPrice(+watch('price'));
    }
  }, [watch('price')]);

  useEffect(() => {
    if (open && EditedItemClicked?.item) {
      setValue(
        'price',
        EditedItemClicked?.item?.priceBeforeDiscount || EditedItemClicked?.item?.price,
      );
      setValue('quantity', EditedItemClicked?.item?.quantity || 1);
      setValue('percentage', EditedItemClicked?.item?.percentage || 0);
      setValue('finalPrice', EditedItemClicked?.item?.finalPrice || 0);
      setDiscountBySar(EditedItemClicked?.item?.discountBySar || 0);
      setValue('discountPercentage', EditedItemClicked?.item?.discountPercentage || 0);
      setValue('discountSar', EditedItemClicked?.item?.discountSar || 0);
      setSavedPriceIntoCart(EditedItemClicked?.item?.savedPriceIntoCart || 0);
      setActiveDiscount(EditedItemClicked?.item?.activeDiscount || false);
      if (EditedItemClicked?.serviceorNot) {
        setNewSelectedEmp(
          allEmp?.find((emp) => emp?.id === EditedItemClicked?.item?.employeeId)?.id,
        );
      }
    }
  }, [open]);

  const closeModal = () => {
    clearErrors();
    setOpen(false);
  };

  const FormSubmit = () => {
    const commonData = {
      price: !activeDiscount ? +watch('price') : savedPriceIntoCart,
      priceBeforeDiscount: +watch('price') || 0,
      percentage: +watch('percentage') || 0,
      finalPrice: +watch('finalPrice') || 0,
      discountBySar,
      discountPercentage: +watch('discountPercentage') || 0,
      discountSar: +watch('discountSar') || 0,
      savedPriceIntoCart,
      activeDiscount,
      itemDiscountAmount: activeDiscount ? itemDiscountAmount : 0,
    };
    if (EditedItemClicked?.insideBooking) {
      if (EditedItemClicked?.serviceorNot) {
        setSalesData({
          ...salesData,
          itemsSelected: [
            ...salesData?.itemsSelected?.filter(
              (d) => d?.identify !== salesItemIds?.confirmedBooking,
            ),
            {
              ...salesData?.itemsSelected?.find(
                (d) => d?.identify === salesItemIds?.confirmedBooking,
              ),
              services: [
                ...salesData?.itemsSelected
                  ?.find((d) => d?.identify === salesItemIds?.confirmedBooking)
                  ?.services?.map((d) => {
                    if (d?.id !== EditedItemClicked?.item?.id) {
                      return d;
                    }
                    return {
                      ...d,
                      //   price: +watch('price'),
                      ...commonData,
                      employeeId: newSelectedEmp,
                      employeeName: allEmp?.find((emp) => emp?.id === newSelectedEmp)
                        ?.name,
                    };
                  }),
              ],
            },
          ],
        });
      } else {
        setSalesData({
          ...salesData,
          itemsSelected: [
            ...salesData?.itemsSelected?.filter(
              (d) => d?.identify !== salesItemIds?.confirmedBooking,
            ),
            {
              ...salesData?.itemsSelected?.find(
                (d) => d?.identify === salesItemIds?.confirmedBooking,
              ),
              packages: [
                ...salesData?.itemsSelected
                  ?.find((d) => d?.identify === salesItemIds?.confirmedBooking)
                  ?.packages?.map((d) => {
                    if (d?.packageHistoryId !== EditedItemClicked?.item?.id) {
                      return d;
                    }
                    return {
                      ...d,
                      ...commonData,
                      count: +watch('quantity'),
                      quantity: +watch('quantity'),
                      packages: d.packages?.map((info) => ({
                        ...info,
                        price: !activeDiscount ? +watch('price') : savedPriceIntoCart,
                        priceBeforeDiscount: +watch('price') || 0,
                        quantitiy: +watch('quantity'),
                        count: +watch('quantity'),
                        itemDiscountAmount,
                      })),
                    };
                  }),
              ],
            },
          ],
        });
      }
    } else {
      if (EditedItemClicked?.serviceorNot) {
        setSalesData({
          ...salesData,
          itemsSelected: [
            ...salesData?.itemsSelected?.map((d) => {
              if (d?.uniqueKey !== EditedItemClicked?.item?.uniqueKey) {
                return d;
              }
              return {
                ...d,
                // price: +watch('price'),
                ...commonData,
                employeeId: newSelectedEmp,
                employeeName: allEmp?.find((emp) => emp?.id === newSelectedEmp)?.name,
              };
            }),
          ],
        });
      } else {
        setSalesData({
          ...salesData,
          itemsSelected: [
            ...salesData?.itemsSelected?.map((d) => {
              if (d?.id !== EditedItemClicked?.item?.id) {
                return d;
              }
              return {
                ...d,
                ...commonData,
                quantity: +watch('quantity'),
              };
            }),
          ],
        });
      }
    }

    closeModal();
  };
  const removeItem = () => {
    if (EditedItemClicked?.insideBooking) {
      const lengthOfPackagesInsideBooking = salesData?.itemsSelected?.find(
        (d) => d?.identify === salesItemIds?.confirmedBooking,
      )?.packages?.length;
      const lengthOfServicesInsideBooking = salesData?.itemsSelected?.find(
        (d) => d?.identify === salesItemIds?.confirmedBooking,
      )?.services?.length;

      //   remove the whole booking if one array was last and other was empty
      if (
        (!lengthOfPackagesInsideBooking && lengthOfServicesInsideBooking === 1) ||
        (lengthOfPackagesInsideBooking === 1 && !lengthOfServicesInsideBooking)
      ) {
        setBookingSelectedInTheCart({});
        return setSalesData({
          ...salesData,
          itemsSelected: [
            ...salesData?.itemsSelected?.filter(
              (d) => d?.identify !== salesItemIds?.confirmedBooking,
            ),
          ],
          calculations: {
            ...salesData?.calculations,
            sumBookingPaidAmounts: 0,
          },
        });
      }

      if (EditedItemClicked?.serviceorNot) {
        setSalesData({
          ...salesData,
          itemsSelected: [
            ...salesData?.itemsSelected?.filter(
              (d) => d?.identify !== salesItemIds?.confirmedBooking,
            ),
            {
              ...salesData?.itemsSelected?.find(
                (d) => d?.identify === salesItemIds?.confirmedBooking,
              ),
              services: [
                ...salesData?.itemsSelected
                  ?.find((d) => d?.identify === salesItemIds?.confirmedBooking)
                  ?.services?.filter((d) => d?.id !== EditedItemClicked?.item?.id),
              ],
            },
          ],
        });
      } else {
        setSalesData({
          ...salesData,
          itemsSelected: [
            ...salesData?.itemsSelected?.filter(
              (d) => d?.identify !== salesItemIds?.confirmedBooking,
            ),
            {
              ...salesData?.itemsSelected?.find(
                (d) => d?.identify === salesItemIds?.confirmedBooking,
              ),
              packages: [
                ...salesData?.itemsSelected
                  ?.find((d) => d?.identify === salesItemIds?.confirmedBooking)
                  ?.packages?.filter(
                    (d) => d?.packageHistoryId !== EditedItemClicked?.item?.id,
                  ),
              ],
            },
          ],
        });
      }
    } else {
      if (EditedItemClicked?.serviceorNot) {
        setSalesData({
          ...salesData,
          itemsSelected: salesData?.itemsSelected?.filter(
            (d) => +d?.uniqueKey !== +EditedItemClicked?.item?.uniqueKey,
          ),
        });
      } else {
        setSalesData({
          ...salesData,
          itemsSelected: salesData?.itemsSelected?.filter(
            (d) => d?.id !== EditedItemClicked?.item?.id,
          ),
        });
      }
    }
    closeModal();
    return null;
  };

  useEffect(() => {
    if (
      removeItemOrNot === RemoveChecker.removed &&
      (salesItemIds?.services === identifier || salesItemIds?.packages === identifier)
    ) {
      removeItem();
      setRemoveItemOrNot(false);
    }
  }, [removeItemOrNot]);

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
      setSavedPriceIntoCart((priceWithQuantity - +watch('discountSar'))?.toFixed(2));
      setitemDiscountAmount(+watch('discountSar'));
    }
  }, [
    watch('discountPercentage'),
    watch('discountSar'),
    watch('price'),
    watch('quantity'),
    activeDiscount,
    discountBySar,
  ]);

  const selectEmpServiceBookingOrOutsideBooking = (id) => {
    if (!EditedItemClicked?.insideBooking && EditedItemClicked?.serviceorNot) {
      const foundEmpOrNot = EditedItemClicked?.item?.employeesOnService?.find(
        (data) => data?.employeeId === id,
      );
      if (foundEmpOrNot) {
        setValue('price', foundEmpOrNot?.price);
      } else {
        setValue('price', EditedItemClicked?.item?.defaultPriceComeFromBE);
      }
    }
    return setNewSelectedEmp(id);
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
      className="bootstrap-modal-customizing add-custom-item edit"
    >
      <Modal.Header>
        <Modal.Title className="title">
          <FormattedMessage id="checkout.edit.booking.item" />
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit(FormSubmit)}>
        <Modal.Body>
          <Row className="edit-body mb-2">
            <Col xs={12}>
              <section className="edit-body_pay--amount">
                <div className="edit-body_pay--amount-pay">
                  {EditedItemClicked?.item?.name}
                </div>
                <div className="edit-body_pay--amount-num">
                  {EditedItemClicked?.serviceorNot && EditedItemClicked?.item?.from ? (
                    <FormattedMessage id="common.start.from" />
                  ) : (
                    ''
                  )}{' '}
                  <FormattedMessage
                    id="vouchers.new.value.price"
                    values={{ price: EditedItemClicked?.item?.price }}
                  />
                </div>
              </section>
            </Col>
            <Col
              xs={`${EditedItemClicked?.serviceorNot ? '12' : '6'}`}
              className="mt-4  edit-body_input--div"
            >
              <BeutiInput
                error={errors?.price?.message}
                useFormRef={register('price')}
                label={<FormattedMessage id="checkout.modal.price" />}
                info={<FormattedMessage id="common.currency" />}
                disabled={activeDiscount}
              />
            </Col>
            {!EditedItemClicked?.serviceorNot && (
              <Col xs={6} className="mt-4  edit-body_input--div">
                <BeutiInput
                  type="number"
                  error={errors?.quantity?.message}
                  useFormRef={register('quantity')}
                  label={<FormattedMessage id="checkout.edit.booking.quantity" />}
                />
              </Col>
            )}
            {EditedItemClicked?.serviceorNot && (
              <Col xs={12} className="mt-4  edit-body_input--div">
                <SelectInputMUI
                  label={<FormattedMessage id="booking.flow.emp.name" />}
                  list={allEmp}
                  value={newSelectedEmp}
                  onChange={(e) =>
                    selectEmpServiceBookingOrOutsideBooking(e?.target?.value)
                  }
                  disabled={
                    !EditedItemClicked?.insideBooking &&
                    EditedItemClicked?.serviceorNot &&
                    activeDiscount
                  }
                />
              </Col>
            )}
          </Row>

          <Row className="pb-2">
            <Col xs="12" className="add-custom-item-header mb-2">
              <FormattedMessage id="offers.table.discount" />
            </Col>
            <Col xs="12" className="pb-4">
              <div className="add-custom-item-controller">
                <div className="add-custom-item-controller__toggle">
                  <Toggle
                    id="addDiscount"
                    icons={{
                      unchecked: null,
                    }}
                    checked={activeDiscount}
                    onChange={(e) => {
                      if (+watch('price') > 0) {
                        setActiveDiscount(!activeDiscount);
                        clearErrors(['discountSar', 'discountPercentage']);
                      }
                    }}
                  />
                  <label htmlFor="addDiscount">
                    <FormattedMessage id="custom.item.add.discount" />
                  </label>
                </div>
                <div className="add-custom-item-controller__selection">
                  <button
                    type="button"
                    className={`add-custom-item-controller__selection-btn ${
                      !discountBySar ? 'active--left' : ''
                    }`}
                    onClick={() => {
                      setDiscountBySar(false);
                      clearErrors(['discountSar', 'discountPercentage']);
                    }}
                    disabled={!activeDiscount}
                  >
                    &#x25;
                  </button>
                  <button
                    type="button"
                    className={`add-custom-item-controller__selection-btn ${
                      discountBySar ? 'active--right' : ''
                    }`}
                    onClick={() => setDiscountBySar(true)}
                    disabled={!activeDiscount}
                  >
                    <FormattedMessage id="common.currency" />
                  </button>
                </div>
              </div>
            </Col>
            <Col md="8" xs="12" className="pb-4">
              <div className="beuti-icon">
                <BeutiInput
                  type="text"
                  label={
                    messages[
                      `${
                        discountBySar
                          ? 'sales.custom.item.discount.value'
                          : 'promocodes.percentage'
                      }`
                    ]
                  }
                  useFormRef={
                    discountBySar
                      ? register('discountSar')
                      : register('discountPercentage')
                  }
                  error={
                    discountBySar
                      ? errors?.discountSar?.message
                      : errors?.discountPercentage?.message
                  }
                  id="percentage"
                  disabled={!activeDiscount}
                />
                <label htmlFor="percentage" className="icon">
                  {discountBySar ? (
                    <FormattedMessage id="common.currency" />
                  ) : (
                    <>&#x25;</>
                  )}
                </label>
              </div>
            </Col>
            <Col md="4" xs="12" className="pb-4">
              <div className="beuti-icon">
                <BeutiInput
                  type="text"
                  label={messages['custom.final.price']}
                  useFormRef={register('finalPrice')}
                  error={errors?.finalPrice?.message}
                  id="finalPrice"
                  disabled
                />
                <label htmlFor="finalPrice" className="icon">
                  <FormattedMessage id="common.currency" />
                </label>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="edit-footer">
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
          <div className="btns">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => closeModal()}
            >
              <FormattedMessage id="common.cancel" />
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!!errors?.price?.message || !!errors?.quantity?.message}
            >
              <FormattedMessage id="common.save" />
            </button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

EditServiceAndPackage.propTypes = {
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  EditedItemClicked: PropTypes.object,
  allEmp: PropTypes.array,
  setOpenConfirmRemove: PropTypes.func,
  removeItemOrNot: PropTypes.bool,
  setRemoveItemOrNot: PropTypes.func,
  salesData: PropTypes.object,
  setSalesData: PropTypes.func,
  identifier: PropTypes.object,
  setBookingSelectedInTheCart: PropTypes.func,
};
