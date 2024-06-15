/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import useAPI, { get } from 'hooks/useAPI';

export default function ReferralCode({ callApi }) {
  const [referralCode, setReferralCode] = useState('');
  const referralCodeInput = useRef();
  const { response: referralCodeData, getting, setRecall: callReferralCode } = useAPI(
    get,
    'ReferralCode/Get',
  );

  const copyCodeToClipboard = () => {
    referralCodeInput.current.select();
    document.execCommand('copy');
  };

  useEffect(() => {
    if (referralCodeData && referralCodeData.data && referralCodeData.data.data) {
      setReferralCode(referralCodeData.data.data);
    }
  }, [referralCodeData]);

  useEffect(() => {
    callReferralCode(callApi);
  }, [callApi]);

  const { messages } = useIntl();
  return (
    <>
      <h2 className="title mb-2">{messages['admin.settings.ReferralCode']}</h2>

      <form>
        <div className="form-group">
          <input
            placeholder={messages['admin.settings.ReferralCode']}
            className="form-control remove-blue-bg-color"
            value={referralCode}
            ref={referralCodeInput}
            readOnly
          />
        </div>
        <div className="alignBtn">
          <button type="button" className="btn btn-primary" onClick={copyCodeToClipboard}>
            {messages['common.copy']}
          </button>
        </div>
      </form>
    </>
  );
}
