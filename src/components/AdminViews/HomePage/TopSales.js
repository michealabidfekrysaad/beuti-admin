/* eslint-disable react/no-array-index-key */

import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import useAPI, { get } from 'hooks/useAPI';

import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { formatData } from 'functions/formatTableData';

export default function TopSales() {
  const { messages, locale } = useIntl();
  const [topServices, setTopServices] = useState([]);
  const [error, setError] = useState(null);

  const adminHomePage = 'admin.homePage';

  const {
    response: topServicesRes,
    isLoading: getttingTopSales,
    setRecall: recallTopEmp,
  } = useAPI(get, `Service/GetTopServices`);

  useEffect(() => {
    // recallTopEmp(true);
  }, []);

  useEffect(() => {
    if (topServicesRes?.data) {
      setTopServices(topServicesRes.data.list);
    } else if (topServicesRes?.error) {
      setError(topServicesRes?.error?.message);
    }
  }, [topServicesRes]);

  const tableGuide = [
    { data: 'name', message: `${adminHomePage}.header.bestSeller` },
    {
      data: 'currentMonthNoOfClosedServices',
      message: `${adminHomePage}.header.currentMonth`,
    },
    {
      data: 'previousMonthNoOfClosedServices',
      message: `${adminHomePage}.header.prevMonth`,
    },
  ];

  return (
    <div className="beuti-table">
      <div className="card-body">
        <Table>
          <TableHead>
            <TableRow>
              {tableGuide.map((data) => (
                <TableCell align="center" key={data.message}>
                  {messages[data.message]}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {topServices.length > 0 ? (
              topServices.map((booking) => (
                <TableRow key={booking.id}>
                  {tableGuide.map((data, index) => (
                    <TableCell align="center" key={booking.id + index}>
                      {formatData(booking, data, locale, messages)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="12" align="center">
                  {getttingTopSales && (
                    <CircularProgress size={24} className="mx-auto" color="secondary" />
                  )}
                  {topServices.length === 0 &&
                    !getttingTopSales &&
                    messages[`${adminHomePage}.noSales`]}
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
