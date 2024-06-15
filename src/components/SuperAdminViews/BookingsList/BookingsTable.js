import React from 'react';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { formatData } from 'functions/formatTableData';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@material-ui/core';
import Fade from '@material-ui/core/Fade';

function BookingsTable({ allData, query, listLoading }) {
  const bookingScope = 'spAdmin.bookings';
  const { messages, locale } = useIntl();

  const tableGuide = [
    { data: 'created_date', message: messages[`${bookingScope}.createdDate`] },
    { data: 'created_time', message: messages[`${bookingScope}.createdTime`] },
    { data: 'customer_name', message: messages[`${bookingScope}.customerName`] },
    { data: 'customer_number', message: messages[`${bookingScope}.customerNumber`] },
    { data: 'sp_name', message: messages[`${bookingScope}.spName`] },
    { data: 'sp_number', message: messages[`${bookingScope}.spNumber`] },
    { data: 'service_count', message: messages[`${bookingScope}.servicesNumber`] },
    { data: 'is_queue', message: messages[`${bookingScope}.bookingType`] },
    { data: 'booking_date', message: messages[`${bookingScope}.bookingDate`] },
    {
      data: 'booking_start_time',
      message: messages[`${bookingScope}.bookingTimeIfAppointment`],
    },
    { data: 'booking_status', message: messages[`${bookingScope}.bookingStatus`] },

    {
      data: 'employeeCommission',
      message: messages[`${bookingScope}.employeeCommission`],
    },
    { data: 'beutiCommission', message: messages[`${bookingScope}.beutiCommission`] },
    { data: 'bookingSourceApp', message: messages[`${bookingScope}.bookingSourceApp`] },
    { data: 'actions', message: messages[`${bookingScope}.actions`] },
  ];
  const history = useHistory();

  const actions = [
    {
      name: 'viewBookingDetails',
      element: (id) => (
        <Tooltip arrow TransitionComponent={Fade} title={messages['common.showDetails']}>
          <button
            type="button"
            className="icon-wrapper-btn btn-icon-primary mx-1"
            onClick={() => history.push(`/admin-bookings/${id}`)}
          >
            <i className="flaticon2-sheet text-primary"></i>
          </button>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {tableGuide.map((el) => (
              <TableCell key={el.data}>{el.message}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {allData?.length > 0 && !listLoading ? (
            allData.map((pieceOfData) => (
              <TableRow key={pieceOfData.Id}>
                {tableGuide.map((rowData) => (
                  <TableCell key={rowData.data}>
                    {formatData(pieceOfData, rowData, locale, actions, messages)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="15" align="center" className="text-info pt-5">
                {query.length > 0 ? (
                  <>
                    <i className="flaticon-gift la-2x  mx-2"></i>
                    {messages['common.noDataFound']}
                  </>
                ) : (
                  <CircularProgress size={24} className="mx-auto" color="secondary" />
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

BookingsTable.propTypes = {
  allData: PropTypes.array,
  listLoading: PropTypes.bool,
  query: PropTypes.string,
};

export default BookingsTable;
