import React from 'react';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import { useHistory } from 'react-router-dom';
import SVG from 'react-inlinesvg';
import OtpView from 'components/shared/OtpView';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import BeutiButton from 'Shared/inputs/BeutiButton';
import { CallAPI } from 'utils/API/APIConfig';
import { FC_CONFIRM_PHONE_EP } from 'utils/API/EndPoints/FreeLaneEP';

export default function OtpVerifyFreelance({
  otpCode,
  timer,
  setOtpCode,
  displayOtp,
  setDisplayOtp,
  mobileNumNew,
  resend,
  loading,
}) {
  const { messages } = useIntl();
  const history = useHistory();

  const { refetch, isFetching } = CallAPI({
    name: 'confirmFreeLanceNumber',
    url: FC_CONFIRM_PHONE_EP,
    method: 'post',
    retry: false,
    body: {
      Phone: mobileNumNew,
      Code: otpCode,
    },
    onSuccess: (res) => {
      if (res?.data?.data?.isSuccess) {
        toast.success(res?.data?.data?.message);
        handleClickBackandReset();
        history.goBack();
      }
    },
    onError: (err) => {
      toast.error(err.response.data.error.message);
    },
  });

  const handleClickBackandReset = () => {
    setOtpCode('----');
    setDisplayOtp('');
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        refetch();
      }}
      className={`${displayOtp}  otp-child-update-brand-phone`}
    >
      <Row className="mx-0">
        <Col md={12} className="pb-5">
          <Row className="d-flex justify-content-center mb-5">
            <Col
              xs="auto"
              className="text-center d-flex justify-content-center flex-column align-items-center"
            >
              <h1> {messages['common.otp']}</h1>
            </Col>
          </Row>
          <OtpView
            resend={resend}
            value={otpCode}
            setter={setOtpCode}
            timer={timer}
            loading={loading}
            showResendBtn
          />
        </Col>
        <Col md={12} className="d-flex justify-content-center pt3 pb-5">
          <BeutiButton
            type="submit"
            disabled={otpCode.length < 4 || otpCode.includes('-') || isFetching}
            className="btn-otp-brand-change-mobile"
            loading={isFetching}
            text={messages['common.confirm']}
          />
        </Col>
        <div className="div-back">
          <button
            type="button"
            onClick={() => {
              handleClickBackandReset();
            }}
            className="div-back__btn close-icon__btn"
          >
            <SVG src={toAbsoluteUrl('/assets/icons/Navigation/Close.svg')} />
          </button>
        </div>
      </Row>
    </form>
  );
}

OtpVerifyFreelance.propTypes = {
  otpCode: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  timer: PropTypes.number,
  setOtpCode: PropTypes.func,
  displayOtp: PropTypes.string,
  setDisplayOtp: PropTypes.func,
  mobileNumNew: PropTypes.string,
  resend: PropTypes.func,
  loading: PropTypes.bool,
};
