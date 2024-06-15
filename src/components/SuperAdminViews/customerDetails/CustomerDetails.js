import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { CircularProgress } from '@material-ui/core';
import { formatDate } from 'functions/formatTableData';

export const CustomerDetails = ({ customerDetails, isLoading, setValue }) => {
  const { messages, locale } = useIntl();
  const tableHeader = 'table.spList.header';

  return (
    <>
      {!isLoading ? (
        <div className="row mt-4 customer-details">
          <div className="col-12">
            <h1>
              {messages[`customerDetails.header`]} : {customerDetails?.name}
            </h1>
          </div>
          <div className="col-12 mt-4">
            <div className="row">
              <div className="col-lg-5">
                <p className="title d-inline-block">{messages[`${tableHeader}.id`]}</p>
                <p className="d-inline-block ml-2 mr-2 font-size">
                  : {customerDetails?.id}
                </p>
              </div>
              <div className="col-lg-7">
                <p className="title d-inline-block">
                  {messages[`${tableHeader}.registrationDate`]}
                </p>
                <p className="d-inline-block ml-2 mr-2 font-size">
                  : {formatDate(customerDetails?.registerationDate, locale)}{' '}
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 mt-2">
            <div className="row">
              <div className="col-lg-5 ">
                <p className="title d-inline-block">{messages[`${tableHeader}.name`]}</p>
                <p className="d-inline-block ml-2 mr-2 font-size">
                  : {customerDetails?.name}
                </p>
              </div>
              <div className="col-lg-7 ">
                <p className="title d-inline-block">{messages[`${tableHeader}.email`]}</p>
                <p className="d-inline-block ml-2 mr-2 font-size">
                  : {customerDetails?.email}
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 mt-2">
            <div className="row">
              <div className="col-lg-5 ">
                <p className="title d-inline-block">
                  {messages[`${tableHeader}.ClosedBookings`]}
                </p>
                <p className="d-inline-block ml-2 mr-2 font-size">
                  : {customerDetails?.noOfClosedBookings}
                </p>
              </div>{' '}
              <div className="col-lg-7 ">
                <p className="title d-inline-block">
                  {messages[`${tableHeader}.RegistrationMethod`]}
                </p>
                <p className="d-inline-block ml-2 mr-2 font-size">
                  : {customerDetails?.registerationMethod}
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 mt-2">
            <div className="row">
              <div className="col-lg-5 ">
                <p className="title d-inline-block">
                  {messages[`${tableHeader}.mobile`]}
                </p>
                <p className="d-inline-block ml-2 mr-2 font-size">
                  : {customerDetails?.phoneNumber}
                </p>
              </div>
              <div className="col-lg-7 ">
                <p className="title d-inline-block">{messages[`common.rating`]}</p>
                <p className="d-inline-block ml-2 mr-2 font-size">
                  : {customerDetails?.rate}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-5">
          <CircularProgress size={24} color="secondary" />
        </div>
      )}
    </>
  );
};
CustomerDetails.propTypes = {
  customerDetails: PropTypes.object,
  isLoading: PropTypes.bool,
  setValue: PropTypes.func,
};
