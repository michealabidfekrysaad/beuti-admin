/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import BeutiInput from 'Shared/inputs/BeutiInput';

export default function PackagePricing({
  register,
  errors,
  vatPercentage,
  watch,
  setValue,
}) {
  const { messages } = useIntl();
  const [changePrice, setChangePrice] = useState(false);

  useEffect(() => {
    if (changePrice || changePrice === 0) {
      setValue(`priceWithVat`, (changePrice + changePrice * vatPercentage).toFixed(2));
      setChangePrice(false);
    }
  }, [changePrice]);

  useEffect(() => {
    if (watch) {
      const subscription = watch((value, { name }) => {
        if (name === 'price') {
          setChangePrice(+get(value, name));
        }
      });
      return () => subscription.unsubscribe();
    }
    return null;
  }, [watch]);

  return (
    <Row className="pt-3">
      <Col xs={12} className="addPackage-title">
        {messages['package.pricing.title']}
      </Col>
      <Col xs={12} className="addPackage-subTitle">
        {messages['package.pricing.sub.title']}
      </Col>
      <Col xs={12} md={6} className="mb-2 pt-4">
        <BeutiInput
          label={messages['newService.price.without.vat']}
          info={messages['common.currency']}
          useFormRef={register(`price`)}
          error={errors?.price && errors?.price?.message}
        />
      </Col>
      {vatPercentage > 0 && (
        <Col xs={12} md={6} className="mb-2 pt-4">
          <BeutiInput
            label={messages['newService.price.with.vat']}
            useFormRef={register(`priceWithVat`)}
            info={messages['common.currency']}
            disabled
            error={errors?.priceWithVat && errors?.priceWithVat?.message}
          />
        </Col>
      )}
    </Row>
  );
}
