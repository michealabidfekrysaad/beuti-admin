import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { SP_GET_ALL_CATEGORIES_SERVICES_OPTIONS } from 'utils/API/EndPoints/OfferEP';
import { CallAPI } from 'utils/API/APIConfig';
import { toast } from 'react-toastify';
import ServicesAddOffer from './ServicesAddOffer';
import ServiceAddModalOffer from './ServiceAddModalOffer';

const OfferServices = ({ register, errors, watch, getValues, setValue, clearErrors }) => {
  const { messages } = useIntl();
  const [pricingOptions, setPricingOptions] = useState([]);
  const [openModalForServices, setOpenModalForServices] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*               get all categories  with services with options               */
  /* -------------------------------------------------------------------------- */
  const {
    data: serviceList,
    refetch: getServices,
    isFetching: serviceFetching,
  } = CallAPI({
    name: 'getAllServicesForAddNewOffer',
    url: SP_GET_ALL_CATEGORIES_SERVICES_OPTIONS,
    onSuccess: (res) => {
      if (res?.length >= 1) {
        setPricingOptions(
          res
            ?.flat()
            ?.map((el) => el.categoryServiceDto)
            ?.flat()
            ?.map((el) => el?.options)
            ?.flat(),
        );
        setOpenModalForServices(true);
      } else {
        toast.error(messages['services.not.found.offer']);
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    select: (res) => res?.data?.data?.list?.sort((a, b) => +a?.id - +b?.id),
  });

  return (
    <Row>
      <Col lg={8} md={6} xs={12} className="mb-5">
        <h3 className="settings__section-title">{messages['offers.services.title']}</h3>
        <p className="settings__section-description">
          {messages['offers.services.description']}
        </p>
      </Col>

      <Col lg={9} md={12} className="mb-5">
        <ServicesAddOffer
          watch={watch}
          errors={errors}
          serviceFetching={serviceFetching}
          getServices={getServices}
          serviceList={serviceList}
          getValues={getValues}
          setValue={setValue}
          pricingOptions={pricingOptions}
          clearErrors={clearErrors}
        />
      </Col>
      <ServiceAddModalOffer
        show={openModalForServices}
        setShow={setOpenModalForServices}
        list={serviceList}
        register={register}
        setValue={setValue}
        getValues={getValues}
        watch={watch}
      />
    </Row>
  );
};
OfferServices.propTypes = {
  register: PropTypes.func,
  errors: PropTypes.object,
  watch: PropTypes.func,
  getValues: PropTypes.func,
  setValue: PropTypes.func,
  clearErrors: PropTypes.func,
};

export default OfferServices;
