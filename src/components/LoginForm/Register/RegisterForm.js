/* eslint-disable react/jsx-props-no-spreading */

import React, { useState, useContext, useEffect } from 'react';
import { Row, Col, Container, Image } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import BeutiInput from 'Shared/inputs/BeutiInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CallAPI } from 'utils/API/APIConfig';
import { AuthStepsContext } from 'providers/AuthStepsProvider';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { schema } from './RegisterSchema';
import RegisterModal from './RegisterModal';
import { GCT_BUSSINESS_CATEGORIES_ORDERD_EP } from '../../../utils/API/EndPoints/ServicesEP';
import BeutiButton from '../../../Shared/inputs/BeutiButton';
import { toAbsoluteUrl } from '../../../functions/toAbsoluteUrl';

const RegisterForm = ({ callCreateSalon, loading, setFormData }) => {
  const { messages } = useIntl();
  const { authSteps, setAuthSteps } = useContext(AuthStepsContext);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBC, setSelectedBC] = useState({ id: '', nane: '', description: '' });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setAuthSteps({
      ...authSteps,
      registerObject: { businessCategory: selectedBC.id },
    });
  }, [selectedBC]);

  useEffect(() => {
    const subscribeFrom = watch((values) =>
      setFormData({
        ...values,
      }),
    );
    return () => subscribeFrom.unsubscribe();
  }, []);

  const { data: BClist, refetch: getBC, isFetching: BCloading } = CallAPI({
    name: 'bussiness-categories',
    url: GCT_BUSSINESS_CATEGORIES_ORDERD_EP,
    method: 'get',
    onSuccess: () => setOpenModal(true),
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    select: (res) => res?.data?.data?.list,
  });

  return (
    <>
      <form onSubmit={handleSubmit(callCreateSalon)}>
        <Container fluid>
          <Row className="registerform">
            <Col xs="7" className="mb-2">
              <p className="registerform-label">{messages[`register.salonnameAr`]}</p>
              <BeutiInput
                type="text"
                label={messages['register.salonname.supp']}
                useFormRef={register('nameAR')}
                error={errors.nameAR?.message}
              />
            </Col>
            <Col xs="7" className="mb-2">
              <p className="registerform-label">{messages[`register.salonnameEn`]}</p>
              <BeutiInput
                type="text"
                label={messages['register.salonname.supp']}
                useFormRef={register('nameEN')}
                error={errors.nameEN?.message}
              />
            </Col>
            <Col xs="7" className="mb-4">
              <p className="registerform-label">{messages[`register.salontype`]}</p>
              <button
                type="button"
                className="beuti-dropdown-modal mt-3"
                onClick={getBC}
                disabled={BCloading || loading}
              >
                <span>
                  {BCloading ? (
                    <div className="spinner-border spinner-border-sm mb-1" />
                  ) : (
                    selectedBC.name
                  )}
                </span>
                {/* <img  /> */}
                <Image src={toAbsoluteUrl('/arrowdown.png')} alt="arrow-down" />
              </button>
            </Col>
            <Col xs="7" className="mb-2">
              <p className="registerform-label">{messages[`register.phonenumber`]}</p>
              <BeutiInput
                type="text"
                label={messages['register.phonenumber.supp']}
                useFormRef={register('mobileNumber')}
                error={errors.mobileNumber?.message}
              />
            </Col>
            <Col xs="7" className="mb-4">
              <p className="registerform-label">{messages[`register.password`]}</p>
              <BeutiInput
                type="password"
                label={' '}
                useFormRef={register('password')}
                error={errors.password?.message}
              />
            </Col>
            <Col xs="7" className="mt-5 mb-2">
              <p className="registerform-label paste-clipboard">
                {messages[`register.coupon`]}
              </p>
              <BeutiInput
                type="text"
                label={messages['register.coupon.supp']}
                useFormRef={register('coupon')}
                error={errors.coupon?.message}
                className="paste-clipboard-input"
              />
              <button
                type="button"
                className="paste-clipboard-button"
                onClick={(e) => {
                  navigator.clipboard
                    .readText()
                    .then((data) => setValue('coupon', data, { shouldValidate: true }));
                }}
              >
                {messages['common.paste']}
              </button>
            </Col>
            <Col xs="7" className="mb-5">
              <div className="form-check d-block container-box__controllers--checkDiv ">
                <input
                  className="form-check-input custom-color my-0 pb-0"
                  type="checkbox"
                  id="allowStock"
                  {...register('terms')}
                />
                <label
                  className="container-box__controllers--label my-0 mx-2"
                  htmlFor="allowStock"
                >
                  {messages['register.accept']}
                  <a href="https://beuti.co/beutipolicy.html" target="_blank">
                    {messages['register.terms']}
                  </a>
                </label>
                <p className="beuti-input__errormsg">{errors.terms?.message}</p>
              </div>
            </Col>
            <Col xs="auto" className="text-center mt-5">
              <BeutiButton
                type="submit"
                text={messages[`common.register`]}
                disabled={!isValid || !selectedBC.id || BCloading || loading}
              />
            </Col>
          </Row>
        </Container>
      </form>

      <RegisterModal
        show={openModal}
        setShow={setOpenModal}
        list={BClist}
        selectedBC={selectedBC}
        setSelectedBC={setSelectedBC}
      />
    </>
  );
};

RegisterForm.propTypes = {
  callCreateSalon: PropTypes.func,
  loading: PropTypes.bool,
  setFormData: PropTypes.func,
};
export default RegisterForm;
