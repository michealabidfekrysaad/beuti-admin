/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import useOdata, { get } from 'hooks/useOdata';
import BookingsSearch from 'components/SuperAdminViews/BookingsList/BookingsSearch';
import BookingsTable from 'components/SuperAdminViews/BookingsList/BookingsTable';
import { useIntl } from 'react-intl';
import { Card } from 'react-bootstrap';
import Pagination from '@material-ui/lab/Pagination';

export function BookingsList() {
  const { messages } = useIntl();
  const [allData, setAllData] = useState([]);
  const [query, setQuery] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchResultsCount, SearchResultsCount] = useState();

  const { response: totalCountResponse, setRecall: getTotalCount } = useOdata(
    get,
    `BookingOdata/$count?`,
  );
  const { response: queryCount, setRecall: getQueryCount } = useOdata(
    get,
    `BookingOdata/$count?&${query ? `${query}` : ''}`,
  );

  useEffect(() => {
    if (totalCountResponse?.data) {
      setTotalCount(totalCountResponse?.data?.list);
    }
    if (queryCount?.data) {
      SearchResultsCount(queryCount?.data?.list);
    }
  }, [totalCountResponse, queryCount]);

  const bookingUri = `BookingOdata?&count=true&$orderby=id desc&$skip=${
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
    getQueryCount(true);
  }

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
      getQueryCount(true);
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
    <Card className="mb-5">
      <Card.Header>
        <div className="title">{messages['sidebar.sadmin.bookings']}</div>
      </Card.Header>
      <Card.Body>
        <BookingsSearch
          setPageNumber={setPageNumber}
          setQuery={setQuery}
          listLoading={listLoading}
          allData={allData}
          countDataResponse={searchResultsCount}
          totalCountResponse={totalCount}
          query={query}
        />
        <BookingsTable allData={allData} listLoading={listLoading} query={query} />
      </Card.Body>
      <Card.Footer>
        {searchResultsCount > 10 && (
          <Pagination
            count={Math.ceil(searchResultsCount / 10)}
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
  );
}
