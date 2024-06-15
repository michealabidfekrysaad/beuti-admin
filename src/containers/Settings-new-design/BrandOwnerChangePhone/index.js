import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Routes } from 'constants/Routes';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CallAPI } from 'utils/API/APIConfig';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BeutiInput from 'Shared/inputs/BeutiInput';
import { OWNER_UPDATE_PHONE_NUMBER } from 'utils/API/EndPoints/BranchManager';
import { useIntl, FormattedMessage } from 'react-intl';
import OtpBrandOwnerChangePhone from './OtpBrandOwnerChangePhone';

export default function BrandOwnerChangePhone() {
  const { messages } = useIntl();
  const history = useHistory();
  const [timer, setTimer] = useState(0);
  const [otpCodeOld, setOTPCodeOld] = useState('----');
  const [otpCodeNew, setOTPCodeNew] = useState('----');
  const [mobileNumNew, setMobileNumNew] = useState('');
  const [displayOtp, setDisplayOtp] = useState('');

  const schema = yup.object().shape({
    phoneNum: yup
      .string()
      .required(
        <FormattedMessage
          id="branches.error.required"
          values={{ nameReuired: `${messages['common.mobile number']}` }}
        />,
      )
      .matches(/^(05)([0-9]{8})$/, `${messages['admin.customer.new.phone.validate']}`),
  });

  const {
    register,
    formState: { errors, isValid, isDirty },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const { isFetching, refetch } = CallAPI({
    name: 'changeBrandOwnerPhone',
    url: OWNER_UPDATE_PHONE_NUMBER,
    method: 'put',
    // retry: 1,
    refetchOnWindowFocus: true,
    body: {
      phoneNumber: watch('phoneNum'),
    },
    onSuccess: (res) => {
      // if success  put the timer then open the otp modal
      if (res?.data?.data?.isSuccess || res.data?.data?.blockType === 0) {
        setDisplayOtp('opacity');
        setMobileNumNew(watch('phoneNum'));
        setTimer(res?.data?.data?.remainingBlockTime);
      } else {
        toast.error(res?.data?.data?.message);
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  useEffect(() => {
    const time = timer > 0 && setInterval(() => setTimer(timer - 1), 1000);
    return () => clearInterval(time);
  }, [timer]);

  return (
    <div className="settings">
      {!displayOtp ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            refetch();
          }}
        >
          <Row>
            <Col xs={12} className="settings__section pb-0">
              <div className="d-flex justify-content-between px-3">
                <p className="title">{messages['routes.changeOwnerPhone']}</p>
              </div>
            </Col>
          </Row>
          <Row className="branch-header">
            <Col xs={12} className="mb-4">
              <p className="title">{messages['brand.owner.change.mobile.num']}</p>
              <p className="sub-title">
                {messages['brand.owner.change.mobile.num.info']}
              </p>
            </Col>
            <Col xs={6}>
              <BeutiInput
                type="text"
                label={messages['common.mobile number']}
                useFormRef={register('phoneNum')}
                error={errors?.phoneNum?.message && errors?.phoneNum?.message}
                disabled={isFetching}
              />
            </Col>
          </Row>
          <section className="settings__submit">
            <button
              className="beutibuttonempty mx-2 action"
              type="button"
              onClick={() => history.goBack()}
            >
              {messages['common.cancel']}
            </button>
            <button
              type="submit"
              className="beutibutton action"
              disabled={errors?.phoneNum || !isDirty || !isValid}
            >
              {messages['common.save']}
            </button>
          </section>
        </form>
      ) : (
        <OtpBrandOwnerChangePhone
          valueOld={otpCodeOld}
          valueNew={otpCodeNew}
          timer={timer}
          setterOld={setOTPCodeOld}
          setterNew={setOTPCodeNew}
          displayOtp={displayOtp}
          setDisplayOtp={setDisplayOtp}
          mobileNumNew={mobileNumNew}
          resend={refetch}
          loading={isFetching}
        />
      )}
    </div>
  );
}
