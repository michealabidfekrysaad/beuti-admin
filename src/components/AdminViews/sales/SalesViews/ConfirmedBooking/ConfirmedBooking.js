/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { CallAPI } from 'utils/API/APIConfig';
import { EMP_GET_ODATA } from 'utils/API/EndPoints/EmployeeEP';
import EmptyData from '../../EmptyData/EmptyData';
import { selectedTimeOptions, salesItemIds } from '../../Helper/ViewsEnum';
import ConfirmedBookingHeaders from './ConfirmedBookingHeaders';
import SingleBook from './SingleBook';

export default function ConfirmedBooking({
  setSalesData,
  salesData,
  setSelectedTime,
  selectedTime,
  setBookingSelectedInTheCart,
  isPOS,
}) {
  const { messages } = useIntl();
  const timeOptions = selectedTimeOptions({ messages });
  const [searchValue, setSearchValue] = useState('');
  const [ConfirmedBookings, setConfirmedBookings] = useState([]);
  const [selectedEmps, setSelectedEmps] = useState([]);

  const { data: employees } = CallAPI({
    name: 'getAllEmpSystem',
    url: EMP_GET_ODATA,
    refetchOnWindowFocus: false,
    baseURL: !isPOS
      ? `${process.env.REACT_APP_ODOMAIN}`
      : `${process.env.REACT_APP_POS_URL}/odata`,
    enabled: true,
    select: (data) =>
      data.data.data.list?.map((emp) => ({
        ...emp,
        text: emp?.name,
      })),
  });

  const { data: allBookings, isFetching: fetchConfirmBookings } = CallAPI({
    name: ['allConfirmedBookings', selectedTime, searchValue, selectedEmps],
    url: 'Booking/GetSaleshConfirmedBookings',
    enabled: true,
    refetchOnWindowFocus: false,
    baseURL: !isPOS
      ? `${process.env.REACT_APP_DOMAIN}1`
      : `${process.env.REACT_APP_POS_URL}/api/v1`,
    method: 'post',
    body: {
      searchDuration: timeOptions?.find((d) => d?.id === selectedTime)?.searchDuration,
      searchString: searchValue?.length ? searchValue : null,
      isFutureDate: timeOptions?.find((d) => d?.id === selectedTime)?.isFutureDate,
      EmployeeIds:
        selectedEmps?.length === employees?.length || !selectedEmps?.length
          ? null
          : selectedEmps,
    },
    select: (data) =>
      data.data.data.list?.map((info) => ({
        ...info,
        bookingData: info?.bookingData?.map((book) => ({
          ...book,
          identify: salesItemIds?.confirmedBooking,
          sumBookingPaidAmounts: book?.walletPaiedAmount + book?.onlinePaiedAmount,
          packages: book?.packages?.map((pack) => ({
            ...pack,
            identify: salesItemIds?.packages,
            price: pack?.packages[0]?.price,
          })),
          services: book?.services?.map((ser) => ({
            ...ser,
            identify: salesItemIds?.services,
          })),
        })),
      })),
    onSuccess: (res) => setConfirmedBookings(res),
  });

  return (
    <>
      <ConfirmedBookingHeaders
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        allEmp={employees}
        selectedEmps={selectedEmps}
        setSelectedEmps={setSelectedEmps}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        selectedtimeOptions={timeOptions}
      />
      <SingleBook
        ConfirmedBookings={ConfirmedBookings}
        setSalesData={setSalesData}
        salesData={salesData}
        fetchConfirmBookings={fetchConfirmBookings}
        selectedTime={selectedTime}
        setBookingSelectedInTheCart={setBookingSelectedInTheCart}
      />
      {!ConfirmedBookings?.length && !fetchConfirmBookings && (
        <EmptyData
          image="/confirm-booking.svg"
          title={messages['empty.confirm.booking.title']}
          subTitle={messages['empty.confirm.booking.sub.title']}
        />
      )}
    </>
  );
}
