/* eslint-disable  */

import React from 'react';
import { useIntl } from 'react-intl';
import AddLocationModal from './AddLocation/AddLocationModal';
import { useContext } from 'react';
import { BookingContext } from 'providers/BookingProvider';

const AddLocation = ({
  openAddLocation,
  setOpenAddLocation,
  setTempFees = () => {},
  setFeesSelected = () => {},
  tempFees = 0,
}) => {
  const { messages } = useIntl();
  const { booking } = useContext(BookingContext);
  return (
    <section className="addbooking-location">
      <div>
        <div className="booking-view__note-title">
          {messages['booking.details.location']}
        </div>
        {/* <h2>{messages['booking.details.location']}</h2> */}
        <div className="booking-view__note-description">
          {booking.isLocationSelected
            ? booking.addressEn
            : messages['booking.details.no.location']}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setOpenAddLocation(true)}
        className="addbooking-location-add"
      >
        {booking.isLocationSelected
          ? messages['booking.location.change']
          : messages['booking.location.add']}
      </button>
      <AddLocationModal
        openModal={openAddLocation}
        setOpenModal={setOpenAddLocation}
        setTempFees={setTempFees}
        setFeesSelected={setFeesSelected}
        tempFees={tempFees}
      />
    </section>
  );
};

export default AddLocation;
