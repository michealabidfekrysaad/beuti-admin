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
import { Card, Row, Col } from 'react-bootstrap';

export default function DailySales({ TableLoader }) {
  const { messages } = useIntl();
  const [allData, setAllData] = useState([
    {
      customerName: 'name',
      customerMobile: 'mobile',
      spName: 'spName',
      spNumber: 'spNum',
    },
    {
      customerName: 'name',
      customerMobile: 'mobile',
      spName: 'spName',
      spNumber: 'spNum',
    },
    {
      customerName: 'name',
      customerMobile: 'mobile',
      spName: 'spName',
      spNumber: 'spNum',
    },
    {
      customerName: 'name',
      customerMobile: 'mobile',
      spName: 'spName',
      spNumber: 'spNum',
    },
  ]);
  const [cashData, setCashData] = useState([
    {
      customerName: 'cash',
      customerMobile: 'cash',
      spName: 'cash',
    },
  ]);

  const tableGuideTransfer = [
    { data: 'customerName', message: messages[`sales.purchase.type`] },
    { data: 'customerMobile', message: messages[`common.searchBy.quantity`] },
    { data: 'spName', message: messages[`sales.refund.amount`] },
    { data: 'spNumber', message: messages[`sales.total`] },
  ];
  const tableGuideCash = [
    { data: 'customerName', message: messages[`table.spList.header.paymentMethod`] },
    { data: 'customerMobile', message: messages[`sales.cash`] },
    { data: 'spName', message: messages[`sales.refund.amount`] },
  ];
  return (
    <Row className="mt-4">
      <Col xs={12} lg={6}>
        <Card.Body>
          <h4 className="font-weight-bold mb-2">{messages['sales.transfer.summary']}</h4>
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="12" align="center">
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
                  </TableRow>
                ))}
              {(allData?.length === 0 || false) && (
                <TableLoader colSpan="4" noData={!false} />
              )}
            </TableBody>
          </Table>
        </Card.Body>
      </Col>
      <Col xs={12} lg={6}>
        <Card.Body>
          <h4 className="font-weight-bold mb-2">{messages['sales.cash.summary']}</h4>
          <Table>
            <TableHead>
              <TableRow>
                {tableGuideCash.map((el) => (
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
              ) : cashData?.length > 0 ? (
                cashData.map((data) => (
                  <TableRow key={data.Id} align="center">
                    <TableCell align="center">{data.customerName}</TableCell>
                    <TableCell align="center">{data.customerMobile}</TableCell>
                    <TableCell align="center">
                      {data.spName} {messages['common.currency']}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="12" align="center">
                    <span className="mx-2">
                      {messages['customerWalletHistory.noBalanceFound']}
                    </span>
                  </TableCell>
                </TableRow>
              )} */}

              {!false &&
                cashData.length > 0 &&
                cashData.map((data) => (
                  <TableRow key={data.Id} align="center">
                    <TableCell align="center">{data.customerName}</TableCell>
                    <TableCell align="center">{data.customerMobile}</TableCell>
                    <TableCell align="center">
                      {data.spName} {messages['common.currency']}
                    </TableCell>
                    <TableCell align="center">{data.spNumber}</TableCell>
                  </TableRow>
                ))}
              {(cashData?.length === 0 || false) && (
                <TableLoader colSpan="4" noData={!false} />
              )}
            </TableBody>
          </Table>
        </Card.Body>
      </Col>
    </Row>
  );
}
