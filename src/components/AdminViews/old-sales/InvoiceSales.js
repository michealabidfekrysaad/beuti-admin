/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { formatTime, formatDate } from 'functions/timeFunctions';
import { Card } from 'react-bootstrap';
export default function InvoiceSales({ TableLoader }) {
  const { messages, locale } = useIntl();

  const [allData, setAllData] = useState([
    {
      Id: 1,
      customerName: 'name',
      customerMobile: 'mobile',
      spName: 'spName',
      spNumber: '2021-11-01T00:00:00',
    },
    {
      Id: 2,
      customerName: 'name',
      customerMobile: 'mobile',
      spName: 'spName',
      spNumber: '2021-11-01T00:00:00',
    },
    {
      Id: 3,
      customerName: 'name',
      customerMobile: 'mobile',
      spName: 'spName',
      spNumber: '2021-11-01T00:00:00',
    },
    {
      Id: 4,
      customerName: 'name',
      customerMobile: 'mobile',
      spName: 'spName',
      spNumber: '2021-11-01T00:00:00',
    },
  ]);

  const tableGuideTransfer = [
    { data: 'customerName', message: messages[`sales.appoitment.number`] },
    { data: 'customerMobile', message: messages[`sales.appoitment.sp`] },
    { data: 'spName', message: messages[`promocodes.status`] },
    { data: 'spNumber', message: messages[`sales.invoice.date`] },
    { data: 'customerName', message: messages[`sales.invoice.deliver.date`] },
  ];
  return (
    <Card.Body className="mt-4">
      InvoiceSales
      <Table>
        <TableHead>
          <TableRow>
            {tableGuideTransfer.map((el) => (
              <TableCell key={el.data} align="center">
                {el.message}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* {false ? (
            <TableRow>
              <TableCell colSpan="12" align="center" className="text-info pt-5">
                <CircularProgress size={24} className="mx-auto" color="secondary" />
              </TableCell>
            </TableRow>
          ) : allData?.length > 0 ? (
            allData.map((data) => (
              <TableRow key={data.Id} align="center">
                <TableCell align="center">{data.customerName}</TableCell>
                <TableCell align="center">{data.customerMobile}</TableCell>
                <TableCell align="center">
                  {data.spName} {messages['common.currency']}
                </TableCell>
                <TableCell align="center">data</TableCell>
                <TableCell align="center">{formatDate(data.spNumber, locale)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="12" align="center" className="chair_list-icon pt-5">
                <span className="mx-2">
                  {messages['customerWalletHistory.noBalanceFound']}
                </span>
              </TableCell>
            </TableRow>
          )} */}

          {!false &&
            allData.length > 0 &&
            allData.map((data) => (
              <TableRow key={data.Id} align="center">
                <TableCell align="center">{data.customerName}</TableCell>
                <TableCell align="center">{data.customerMobile}</TableCell>
                <TableCell align="center">
                  {data.spName} {messages['common.currency']}
                </TableCell>
                <TableCell align="center">{data.spNumber}</TableCell>
                <TableCell align="center">{data.spNumber}</TableCell>
              </TableRow>
            ))}
          {(allData?.length === 0 || false) && (
            <TableLoader colSpan="5" noData={!false} />
          )}
        </TableBody>
      </Table>
    </Card.Body>
  );
}
