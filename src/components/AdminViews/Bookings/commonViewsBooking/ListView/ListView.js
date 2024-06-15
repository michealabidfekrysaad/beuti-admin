/* eslint-disable react/prop-types */
import React from 'react';
import ListServiceComponent from './ServiceComponent/ListServiceComponent';

export default function ListView({ BookingListRes, fetchServiceList }) {
  return (
    <>
      <ListServiceComponent
        BookingListRes={BookingListRes}
        fetchServiceList={fetchServiceList}
      />
    </>
  );
}
