/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';

export default function SPBookingWizard({ callApi }) {
  const [BookingLink, setBookingLink] = useState('');
  const bookingLinkInput = useRef();

  const copyCodeToClipboard = () => {
    bookingLinkInput.current.select();
    document.execCommand('copy');
  };

  useEffect(() => {
    setBookingLink(`https://booking-wizard.beuti.co/Booking/OnlineBooking/numberOfSp`);
  }, []);

  const { messages } = useIntl();
  return (
    <>
      <h2 className="title mb-2">{messages['admin.settings.bookinglink']}</h2>

      <form>
        <div className="form-group">
          <input
            placeholder={messages['admin.settings.bookinglink']}
            className="form-control remove-blue-bg-color"
            value={BookingLink}
            ref={bookingLinkInput}
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
