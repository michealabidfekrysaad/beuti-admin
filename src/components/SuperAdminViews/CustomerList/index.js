/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { FormControl, Select, MenuItem, CircularProgress } from '@material-ui/core';
import useOdata, { get } from 'hooks/useOdata';
import { useIntl } from 'react-intl';
import { Card } from 'react-bootstrap';
import Pagination from '@material-ui/lab/Pagination';
import CustomersSearch from './CustomerSearch';
import CustomerList from './CustomerList';

export function CustomerListIndex() {
  const { messages } = useIntl();
  const [dataCount, setDataCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pagesMax, setPagesMax] = useState(10);
  const [chunks, setChunks] = useState([]);
  const [query, setQuery] = useState('');
  const [count, setCount] = useState(0);
  // the request help me for search
  const { response: countDataResponse, setRecall: getCount } = useOdata(
    get,
    `CustomerOdata/$count?${query ? `$filter=${query}` : ''}`,
  );
  // odata/CustomerOdata/$count
  const { response: customerListRes, isLoading, setRecall: getCustomerList } = useOdata(
    get,
    `CustomerOdata?$top=${pagesMax}&$skip=${pageNumber *
      pagesMax}&$orderby=registerationDate desc&${query ? `$filter=${query}` : ''}`,
  );
  // $top=${10}&$skip=100&

  function requestData() {
    getCount(true);
    getCustomerList(true);
  }
  useEffect(() => {
    setPageNumber(0);
    requestData();
  }, []);

  useEffect(() => {
    if (countDataResponse?.data?.list >= 0) {
      setCount(countDataResponse.data.list);
    }
  }, [countDataResponse]);

  useEffect(() => {
    if (customerListRes?.data?.list) {
      setChunks(customerListRes?.data?.list);
    }
  }, [customerListRes, pagesMax]);

  useEffect(() => {
    if (countDataResponse?.data?.list) {
      const dataList = countDataResponse?.data?.list;
      setDataCount(Math.ceil(dataList / pagesMax));
    }
  }, [countDataResponse, pagesMax]);

  const handlePageMaxChange = (e, { value }) => {
    setPagesMax(e.target.value);
    setPageNumber(0);
  };
  useEffect(() => {
    if (pageNumber || pagesMax) {
      // getCustomerList(true);
      requestData();
    }
  }, [pageNumber, pagesMax]);

  useEffect(() => {
    if (query) {
      setPageNumber(0);
      setPagesMax(10);
      requestData();
    } else {
      requestData();
      setPageNumber(0);
      setPagesMax(10);
    }
  }, [query]);

  return (
    <>
      <Card className="mb-5">
        <Card.Header>
          <div className="title">{messages['sidebar.sadmin.customerList']}</div>
        </Card.Header>
        <Card.Body>
          <CustomersSearch
            setPageNumber={setPageNumber}
            setQuery={setQuery}
            listLoading={isLoading}
            totalCountResponse={count}
            countDataResponse={count}
            query={query}
          />
          <CustomerList allData={chunks} listLoading={isLoading} query={query} />
        </Card.Body>

        {count >= 1 && (
          <Card.Footer>
            <FormControl variant="outlined">
              <Select value={pagesMax} onChange={handlePageMaxChange} className="maxPage">
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>

            <Pagination
              count={dataCount}
              color="secondary"
              showFirstButton
              showLastButton
              className="mx-2"
              variant="outlined"
              shape="rounded"
              page={pageNumber + 1}
              onChange={(e, value) => setPageNumber(value - 1)}
            />
            {isLoading && <CircularProgress size={24} color="secondary" />}
          </Card.Footer>
        )}
      </Card>
    </>
  );
}
