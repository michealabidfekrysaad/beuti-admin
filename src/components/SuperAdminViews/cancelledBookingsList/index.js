/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import useOdata, { get } from 'hooks/useOdata';
import CancelledBookingsSearch from 'components/SuperAdminViews/cancelledBookingsList/CancelledBookingsSearch';
import CancelledBookingsTable from 'components/SuperAdminViews/cancelledBookingsList/CancelledBookingsTable';
import { useIntl } from 'react-intl';
import { Card } from 'react-bootstrap';
import Pagination from '@material-ui/lab/Pagination';

export function CancelledBookingsList() {
  const { messages } = useIntl();
  const [allData, setAllData] = useState({ value: [] });
  const [query, setQuery] = useState('');
  const [countRes, setCountRes] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const { response: totalCountResponse, setRecall: getTotalCount } = useOdata(
    get,
    `PaidAndCancelledBookingOdata/$count?`,
  );

  const bookingUri = `PaidAndCancelledBookingOdata?$count=true&$skip=${
    pageNumber - 1 === 0 ? 0 : (pageNumber - 1) * 10
  }${query ? `${query}` : ''}`;

  const {
    response: bookingsResponse,
    isLoading: listLoading,
    setRecall: requestSpOdata,
  } = useOdata(get, bookingUri);

  function requestData() {
    requestSpOdata(true);
    getTotalCount(true);
  }

  useEffect(() => {
    if (totalCountResponse?.data) {
      setCountRes(totalCountResponse?.data?.list);
    }
  }, [totalCountResponse]);

  useEffect(() => {
    requestData();
  }, []);

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
      setPageNumber(1);
      requestData();
    }
  }, [query]);

  useEffect(() => {
    if (bookingsResponse?.data) {
      setAllData(bookingsResponse?.data?.list);
    }
  }, [bookingsResponse]);

  return (
    <>
      <Card className="mb-5">
        <Card.Header>
          <div className="title"> {messages['sidebar.sadmin.cancelledBookings']}</div>
        </Card.Header>
        <Card.Body>
          <CancelledBookingsSearch
            setQuery={setQuery}
            listLoading={listLoading}
            allData={allData}
            countDataResponse={allData.length}
            totalCountResponse={countRes}
            query={query}
          />
          <CancelledBookingsTable
            allData={allData}
            query={query}
            listLoading={listLoading}
          />
        </Card.Body>
        <Card.Footer>
          {countRes > 10 && (
            <Pagination
              count={Math.ceil(countRes / 10)}
              color="secondary"
              showFirstButton
              showLastButton
              variant="outlined"
              shape="rounded"
              onChange={(e, value) => setPageNumber(value)}
              page={+pageNumber}
            />
          )}
        </Card.Footer>
      </Card>
    </>
  );
}
