/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import BeutiButton from 'Shared/inputs/BeutiButton';
import { FC_VERIFY_PHONE_EP } from 'utils/API/EndPoints/FreeLaneEP';
import { CallAPI } from 'utils/API/APIConfig';
import * as yup from 'yup';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BeutiInput from 'Shared/inputs/BeutiInput';
import OtpVerifyFreelance from './OtpVerifyFreelance';

export default function VerifyFreelanceNumber({ setOpenModal, openModal }) {
  const { messages } = useIntl();
  const history = useHistory();
  const [timer, setTimer] = useState(0);
  const [displayOtp, setDisplayOtp] = useState('');
  const [otpCode, setOtpCode] = useState('----');

  const schema = yup.object().shape({
    phoneNum: yup
      .string()
      .required(messages['freeLance.number.required'])
      .matches(/^(05)([0-9]{8})$/, `${messages['admin.customer.new.phone.validate']}`),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  //   send phone number for verify freelance certificate
  const { isFetching, refetch } = CallAPI({
    name: 'verifyFreelanceCertificate',
    url: FC_VERIFY_PHONE_EP,
    method: 'post',
    retry: false,
    refetchOnWindowFocus: false,
    body: {
      Phone: watch('phoneNum'),
    },
    onSuccess: (res) => {
      // if success  put the timer then open the otp modal
      if (res?.data?.data?.isSuccess && !res?.data?.data?.message) {
        setDisplayOtp('opacity');
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

  const submitForm = () => {
    refetch();
  };
  return (
    <div className={`${displayOtp}  parent-verify-certificate`}>
      {!displayOtp ? (
        <Modal
          onHide={() => {
            setOpenModal(false);
            history.goBack();
          }}
          show={openModal}
          size="lg"
          centered
          aria-labelledby="contained-modal-title-vcenter"
          className="bootstrap-modal-customizing"
        >
          <form onSubmit={handleSubmit(submitForm)}>
            <Modal.Header>
              <Modal.Title className="title">{messages['freeLance.header']}</Modal.Title>
              <p className="subtitle">{messages['freeLance.header.sub.title']}</p>
            </Modal.Header>
            <div className="px-4 py-3">
              <div className="mb-2">
                <BeutiInput
                  label={messages['common.mobile number']}
                  useFormRef={register('phoneNum')}
                  error={errors?.phoneNum?.message && errors?.phoneNum?.message}
                  disabled={isFetching}
                />
              </div>
              <p className="mb-1">
                {messages['freeLance.have.certificate']}
                <a href="https://freelance.sa/" target="_blank" className="register-here">
                  {messages['freeLance.register.here']}
                </a>
              </p>
            </div>
            <Modal.Footer className="pt-3 d-flex justify-content-end">
              <div className="d-flex justify-content-end px-4">
                <button
                  type="button"
                  className="px-4 cancel mx-1"
                  onClick={() => {
                    setOpenModal(false);
                  }}
                >
                  {messages['common.cancel']}
                </button>
                <BeutiButton
                  type="submit"
                  disabled={isFetching}
                  loading={isFetching}
                  text={messages['freeLance.verify.button']}
                />
              </div>
            </Modal.Footer>
          </form>
        </Modal>
      ) : (
        <OtpVerifyFreelance
          otpCode={otpCode}
          setOtpCode={setOtpCode}
          timer={timer}
          displayOtp={displayOtp}
          setDisplayOtp={setDisplayOtp}
          resend={refetch}
          loading={isFetching}
          mobileNumNew={watch('phoneNum')}
        />
      )}
    </div>
  );
}
