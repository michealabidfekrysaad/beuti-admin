import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import BeutiInput from 'Shared/inputs/BeutiInput';
import Toggle from 'react-toggle';
import PropTypes from 'prop-types';

const DiscountForm = ({
  activeDiscount,
  discountBySar,
  setDiscountBySar,
  watch,
  setActiveDiscount,
  clearErrors,
  errors,
  register,
}) => {
  const { messages } = useIntl();

  return (
    <Row className="pb-2 mx-3">
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
              discountBySar ? register('discountSar') : register('discountPercentage')
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
            {discountBySar ? <FormattedMessage id="common.currency" /> : <>&#x25;</>}
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
  );
};

export default DiscountForm;
DiscountForm.propTypes = {
  activeDiscount: PropTypes.bool,
  discountBySar: PropTypes.bool,
  setDiscountBySar: PropTypes.func,
  watch: PropTypes.func,
  setActiveDiscount: PropTypes.func,
  clearErrors: PropTypes.func,
  errors: PropTypes.object,
  register: PropTypes.func,
};
