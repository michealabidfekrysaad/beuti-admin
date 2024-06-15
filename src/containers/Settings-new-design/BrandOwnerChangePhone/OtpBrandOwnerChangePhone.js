import React, { useContext } from 'react';
import { UserContext } from 'providers/UserProvider';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import { useLocation } from 'react-router-dom';
import SVG from 'react-inlinesvg';
import OtpView from 'components/shared/OtpView';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { redirectUser } from 'functions/redirectUser';
import { toast } from 'react-toastify';
import { useIntl, FormattedMessage } from 'react-intl';
import BeutiButton from 'Shared/inputs/BeutiButton';
import { CallAPI } from 'utils/API/APIConfig';
import { OWNER_CONFIRM_UPDATE_PHONE } from 'utils/API/EndPoints/BranchManager';

export default function OtpBrandOwnerChangePhone({
  valueOld,
  valueNew,
  timer,
  setterOld,
  setterNew,
  displayOtp,
  setDisplayOtp,
  mobileNumNew,
  resend,
  loading,
}) {
  const { messages } = useIntl();
  const location = useLocation();
  const { User, setUser } = useContext(UserContext);

  const { refetch, isFetching } = CallAPI({
    name: 'confirmOtpAdded',
    url: OWNER_CONFIRM_UPDATE_PHONE,
    method: 'put',
    retry: false,
    body: {
      newPhoneNumber: mobileNumNew,
      oldUserCode: valueOld,
      newUserCode: valueNew,
    },
    onSuccess: (res) => {
      if (res?.data?.success) {
        toast.success(messages['brand.owner.otp.success']);
        handleClickBackandReset();
        setUser({ access_token: null, userData: null });
        localStorage.clear();
        redirectUser(location, '/login');
      }
    },
    onError: (err) => toast.error(err.response.data.error.message),
  });

  const handleClickBackandReset = () => {
    setterOld('----');
    setterNew('----');
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
        <Col md={12} className="border-bottom pb-5">
          <Row className="d-flex justify-content-center mb-5">
            <Col
              xs="auto"
              className="text-center d-flex justify-content-center flex-column align-items-center"
            >
              <h1> {messages['common.otp']}</h1>
              <p className="sub-title w-75">
                <FormattedMessage
                  id="brand.owner.otp.hint"
                  values={{
                    num: ` ${User?.userData?.userPhone?.substring(
                      0,
                      3,
                    )}xxxxx${User?.userData?.userPhone?.substring(
                      User?.userData?.userPhone?.length - 2,
                    )}`,
                  }}
                />
              </p>
            </Col>
          </Row>
          <OtpView
            resend={resend}
            value={valueOld}
            setter={setterOld}
            timer={timer}
            loading={loading}
          />
        </Col>
        <Col md={12} className="pt-5">
          <Row className="d-flex justify-content-center mb-5">
            <Col
              xs="auto"
              className="text-center d-flex justify-content-center flex-column align-items-center"
            >
              <h1> {messages['common.otp']}</h1>
              <p className="sub-title w-75">
                <FormattedMessage
                  id="brand.owner.otp.hint.new"
                  values={{
                    num: ` ${mobileNumNew?.substring(0, 3)}xxxxx${mobileNumNew?.substring(
                      mobileNumNew?.length - 2,
                    )}`,
                  }}
                />
              </p>
            </Col>
          </Row>
          <OtpView
            resend={resend}
            value={valueNew}
            setter={setterNew}
            timer={timer}
            loading={loading}
            showResendBtn
          />
        </Col>
        <Col md={12} className="d-flex justify-content-center pt-5 pb-5">
          <BeutiButton
            type="submit"
            disabled={
              valueOld.length < 4 ||
              valueOld.includes('-') ||
              isFetching ||
              valueNew.length < 4 ||
              valueNew.includes('-')
            }
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

OtpBrandOwnerChangePhone.propTypes = {
  valueOld: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  valueNew: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  timer: PropTypes.number,
  setterOld: PropTypes.func,
  setterNew: PropTypes.func,
  displayOtp: PropTypes.string,
  setDisplayOtp: PropTypes.func,
  mobileNumNew: PropTypes.string,
  resend: PropTypes.func,
  loading: PropTypes.bool,
};
