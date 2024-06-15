/* eslint-disable react/no-array-index-key */

import React, { useEffect, useState, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import useAPI, { get } from 'hooks/useAPI';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
} from '@material-ui/core';
import { formatData } from 'functions/formatTableData';
import Fade from '@material-ui/core/Fade';

import { BookingDateContext } from '../../../providers/BookingDateProvider';

export default function UpComingBookings() {
  const { messages, locale } = useIntl();
  const history = useHistory();
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [error, setError] = useState(null);
  const { selectedDate, setSelectedDate } = useContext(BookingDateContext);
  const [query, setQuery] = useState('');

  const adminHomePage = 'admin.homePage';

  const {
    response: upComingBookings,
    isLoading: getttingUpcoming,
    setRecall: recallTopEmp,
  } = useAPI(
    get,
    `Booking/ViewSPUpCommingBookings?fromdate=2021-09-23&todate=2021-09-26${query}`,
  );

  useEffect(() => {
    recallTopEmp(true);
  }, []);

  useEffect(() => {
    if (upComingBookings?.data) {
      setUpcomingBookings(upComingBookings.data.list);
    } else if (upComingBookings?.error) {
      setError(upComingBookings?.error?.message);
    }
  }, [upComingBookings]);
  const goToEditCategory = (id) => {
    history.push(`/booking/view/${id}`);
  };

  const tableGuide = [
    { data: 'serviceName', message: `${adminHomePage}.serviceName` },
    { data: 'customerName', message: `${adminHomePage}.customerName` },
    { data: 'employeeName', message: `${adminHomePage}.employeeName` },
    { data: 'bookingDate', message: `${adminHomePage}.bookingDate` },
    { data: 'bookingTime', message: `${adminHomePage}.bookingTime` },
    { data: 'serviceDuration', message: `${adminHomePage}.serviceDuration` },
    { data: 'actions', message: 'common.actions' },
  ];
  const actions = [
    {
      name: 'details',
      element: (id) => (
        <Link to={`/booking/view/${id}`} target="blank" className="action-btns">
          {messages[`common.edit`]}
        </Link>
      ),
    },
    {
      name: 'delete',
      element: (id) => (
        //   change the to for deletation
        <Link to={`/booking/view/${id}`} target="blank" className="action-btns">
          {messages[`common.delete`]}
        </Link>
      ),
    },
  ];

  return (
    <div className="beuti-table">
      <div className="card-body">
        <p className="header-booking">{messages[`${adminHomePage}.BookingHeader`]}</p>
        <p style={{ display: 'inline-block' }}>the dropdown here</p>
        <Table>
          <TableHead>
            <TableRow>
              {tableGuide.map((data) => (
                <TableCell align="center" key={data.data}>
                  {messages[data.message]}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <TableRow key={booking.id}>
                  {tableGuide.map((data, index) => (
                    <TableCell align="center" key={booking.id + index}>
                      {formatData(booking, data, locale, actions, messages)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="12" align="center">
                  {getttingUpcoming && (
                    <CircularProgress size={24} className="mx-auto" color="secondary" />
                  )}

                  {upcomingBookings.length === 0 &&
                    !getttingUpcoming &&
                    messages[`${adminHomePage}.noBookings`]}
                  {error && { error }}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
