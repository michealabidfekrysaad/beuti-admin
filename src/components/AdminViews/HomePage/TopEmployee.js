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

export default function TopEmployee() {
  const { messages, locale } = useIntl();
  const [topEmp, setTopEmp] = useState([]);
  const [error, setError] = useState(null);

  const adminHomePage = 'admin.homePage';

  const {
    response: topEmployees,
    isLoading: gettingTopEmp,
    setRecall: recallTopEmp,
  } = useAPI(get, `Employee/GetTopEmployees`);

  useEffect(() => {
    recallTopEmp(true);
  }, []);

  useEffect(() => {
    if (topEmployees?.data) {
      setTopEmp(topEmployees.data.list);
    } else if (topEmployees?.error) {
      setError(topEmployees?.error?.message);
    }
  }, [topEmployees]);

  const tableGuide = [
    { data: 'name', message: `${adminHomePage}.header.bestEmp` },
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
            {topEmp.length > 0 ? (
              topEmp.map((booking) => (
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
                  {gettingTopEmp && (
                    <CircularProgress size={24} className="mx-auto" color="secondary" />
                  )}
                  {topEmp.length === 0 &&
                    !gettingTopEmp &&
                    messages[`${adminHomePage}.noEmp`]}
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
