/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import useAPI, { get } from 'hooks/useAPI';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { formatTime } from 'functions/timeFunctions';
import { DatePicker } from '@material-ui/pickers';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import { tofullISOString } from '../../../functions/MomentHandlers';

export function ChairsList() {
  const history = useHistory();
  const { messages } = useIntl();
  const [allData, setAllData] = useState();
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [bookingDate, setBookingDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const handleChangeDate = (date) => {
    setBookingDate(moment(date).format('YYYY-MM-DD'));
  };

  const handleTodayClick = () => {
    setBookingDate(moment(new Date()).format('YYYY-MM-DD'));
  };
  const bookingUri = `Booking/GetChairBookingsList?bookingDate=${bookingDate}`;
  const tableGuide = [
    { data: 'customerName', message: messages[`stAdmin.charis.customer.name`] },
    { data: 'customerMobile', message: messages[`stAdmin.charis.customer.mobile`] },
    { data: 'spName', message: messages[`stAdmin.charis.sp.name`] },
    { data: 'spNumber', message: messages[`stAdmin.charis.sp.number`] },
    {
      data: 'duration',
      message: messages[`stAdmin.charis.duration.time`],
    },
    {
      data: 'chairPrice',
      message: messages[`stAdmin.charis.chair.pricePerHour`],
    },
    {
      data: 'bookingStatus.name',
      message: messages[`stAdmin.charis.booking.status`],
    },
    { data: 'actions', message: messages[`common.actions`] },
  ];

  const {
    response: charirsBookingsResponse,
    isLoading: listLoading,
    setRecall: requestChairData,
  } = useAPI(get, bookingUri);

  function requestData() {
    requestChairData(true);
  }

  useEffect(() => {
    requestData();
  }, [bookingDate]);

  useEffect(() => {
    if (pageNumber > -1) {
      requestData();
    }
  }, [pageNumber]);

  useEffect(() => {
    if (pageNumber > -1 && query === '') {
      requestData();
    }
  }, [pageNumber, query]);

  useEffect(() => {
    if (query) {
      requestData();
    } else {
      setPageNumber(0);
      requestData();
    }
  }, [query]);

  useEffect(() => {
    if (charirsBookingsResponse) {
      setAllData(charirsBookingsResponse.data.list);
    }
  }, [charirsBookingsResponse]);

  return (
    <>
      <Card className="mb-5">
        <Card.Header>
          <div className="title">{messages['spAdmin.bookings.chairsList']}</div>
        </Card.Header>
        <>
          <div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => history.push('/charis/add/')}
            >
              {messages['spAdmin.bookings.chairsList.add.new']}
            </button>
          </div>
          <Row className="align-items-center justify-content-between mb-5 mt-4">
            <Col xs="auto">
              <div className="text-left d-flex alig-items-center beuti-picker">
                <DatePicker
                  value={bookingDate}
                  format="dd/MM/yyyy"
                  onChange={handleChangeDate}
                  autoOk="true"
                  variant="inline"
                />
                <button
                  type="button"
                  className="beuti-picker-today"
                  onClick={handleTodayClick}
                >
                  {messages['common.today']}
                </button>
              </div>
            </Col>
          </Row>
          <Card.Body className="mt-5">
            <Table>
              <TableHead>
                <TableRow>
                  {tableGuide.map((el) => (
                    <TableCell key={el.data} align="center">
                      {el.message}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {listLoading ? (
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
                      <TableCell align="center">{data.spName}</TableCell>
                      <TableCell align="center">{data.spNumber}</TableCell>
                      <TableCell align="center">
                        {messages['common.from']}
                        {formatTime(data.duration.from)} {messages['common.to']}
                        {formatTime(data.duration.to)}
                      </TableCell>
                      <TableCell align="center">
                        {data.chairPrice} {messages.currency}
                      </TableCell>
                      <TableCell align="center">{data.bookingStatus.name}</TableCell>
                      <TableCell align="center">
                        <button
                          type="button"
                          className="table-actions-btn-primary"
                          //   onClick={() => {
                          //     setOpenVoucherDeleteModal(true);
                          //     setVoucherId(id);
                          //   }}
                        >
                          {messages['common.delete']}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan="12"
                      align="center"
                      className="chair_list-icon pt-5"
                    >
                      <SVG src={toAbsoluteUrl('/assets/icons/Home/Chair1.svg')} />
                      <span className="mx-2">
                        {messages['spAdmin.bookings.nochairsList']}
                      </span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card.Body>
        </>
      </Card>
    </>
  );
}
