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
import { Card } from 'react-bootstrap';

export default function AppoitmentsSales({ TableLoader }) {
  const { messages } = useIntl();

  const [allData, setAllData] = useState([
    {
      Id: 1,
      customerName: 'name',
      customerMobile: 'mobile',
      spName: 'spName',
      spNumber: 'spNum',
    },
    {
      Id: 2,
      customerName: 'name',
      customerMobile: 'mobile',
      spName: 'spName',
      spNumber: 'spNum',
    },
    {
      Id: 3,
      customerName: 'name',
      customerMobile: 'mobile',
      spName: 'spName',
      spNumber: 'spNum',
    },
    {
      Id: 4,
      customerName: 'name',
      customerMobile: 'mobile',
      spName: 'spName',
      spNumber: 'spNum',
    },
  ]);

  const tableGuideTransfer = [
    { data: 'customerName', message: messages[`sales.appoitment.number`] },
    { data: 'customerMobile', message: messages[`sales.appoitment.service`] },
    { data: 'spName', message: messages[`product.history.table.header.date`] },
    { data: 'spNumber', message: messages[`admin.homePage.bookingTime`] },
    { data: 'customerName', message: messages[`admin.homePage.serviceDuration`] },
    { data: 'customerMobile', message: messages[`common.location`] },
    { data: 'spName', message: messages[`sales.appoitment.sp`] },
    { data: 'spNumber', message: messages[`common.searchBy.price`] },
    { data: 'spNumber', message: messages[`promocodes.status`] },
  ];
  return (
    <Card.Body className="mt-4">
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
                <TableCell align="center">{data.spNumber}</TableCell>
                <TableCell align="center">{data.customerName}</TableCell>
                <TableCell align="center">{data.customerMobile}</TableCell>
                <TableCell align="center">
                  {data.spName} {messages['common.currency']}
                </TableCell>
                <TableCell align="center">
                  {data.spName} {messages['common.currency']}
                </TableCell>
                <TableCell align="center">{data.spNumber}</TableCell>
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
                <TableCell align="center">
                  {data.spName} {messages['common.currency']}
                </TableCell>
                <TableCell align="center">
                  {data.spName} {messages['common.currency']}
                </TableCell>
                <TableCell align="center">
                  {data.spName} {messages['common.currency']}
                </TableCell>
                <TableCell align="center">
                  {data.spName} {messages['common.currency']}
                </TableCell>
                <TableCell align="center">
                  {data.spName} {messages['common.currency']}
                </TableCell>
              </TableRow>
            ))}
          {(allData?.length === 0 || false) && (
            <TableLoader colSpan="9" noData={!false} />
          )}
        </TableBody>
      </Table>
    </Card.Body>
  );
}
