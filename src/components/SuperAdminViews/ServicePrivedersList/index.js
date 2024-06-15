/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import ServiceProviderSearch from 'components/SuperAdminViews/ServicePrivedersList/ServiceProviderSearch';
import ServiceProvidersList from 'components/SuperAdminViews/ServicePrivedersList/ServiceProvidersList';
import { useIntl } from 'react-intl';
import { debounce } from 'lodash';
import useAPI, { get } from 'hooks/useAPI';
import useOdata from 'hooks/useOdata';
import { useHistory, useParams } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Pagination from '@material-ui/lab/Pagination';

export function SPsList() {
  const history = useHistory();
  const { splistpage } = useParams();
  const { messages } = useIntl();
  const [allData, setAllData] = useState([]);
  const [query, setQuery] = useState('');
  const [count, setCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(splistpage);
  const { response: countDataResponse, setRecall: getCount } = useAPI(
    get,
    `ServiceProvider/GetServiceProvidersCount?${query ? `${query}` : ''}`,
  );
  const {
    response: spOdataResponse,
    isLoading: listLoading,
    setRecall: requestSpOdata,
  } = useOdata(
    get,
    `serviceproviderodata?$orderby=id desc&skipCount=${
      pageNumber - 1 === 0 ? 0 : (pageNumber - 1) * 10
    }${query ? `${query}` : ''}`,
  );

  useEffect(() => {
    if (countDataResponse && countDataResponse.data) {
      setCount(countDataResponse.data);
    }
  }, [countDataResponse]);

  function requestData() {
    getCount(true);
    requestSpOdata(true);
  }
  const requestOnHold = useCallback(
    debounce(() => requestData(), 1500),
    [],
  );

  useEffect(() => {
    requestData();
  }, []);

  useEffect(() => {
    if (pageNumber > 1) {
      requestOnHold();
    }
  }, [pageNumber]);
  useEffect(() => {
    history.push(`/service-providers/view/${pageNumber}`);
  }, [pageNumber]);

  useEffect(() => {
    if (query) {
      if (pageNumber === 0) {
        requestData();
      } else if (document.querySelector('div[type="firstItem"]')) {
        document.querySelector('div[type="firstItem"]').click();
      } else {
        requestData();
        setPageNumber(1);
      }
    } else {
      requestData();
      setPageNumber(1);
    }
  }, [query]);

  useEffect(() => {
    if (spOdataResponse) {
      setAllData(spOdataResponse.data.list);
    }
  }, [spOdataResponse]);

  return (
    <>
      <Card className="mb-5">
        <Card.Header>
          <div className="title">{messages['sidebar.sadmin.serviceProviders']}</div>
        </Card.Header>
        <Card.Body>
          <ServiceProviderSearch
            setPageNumber={setPageNumber}
            setQuery={setQuery}
            listLoading={listLoading}
            totalCountResponse={count}
            countDataResponse={countDataResponse?.data}
            query={query}
          />
          <ServiceProvidersList
            allData={allData}
            listLoading={listLoading}
            query={query}
            requestSpOdata={requestSpOdata}
          />
        </Card.Body>

        {countDataResponse?.data > 10 && (
          <Card.Footer>
            <Pagination
              count={Math.ceil(countDataResponse?.data / 10)}
              color="secondary"
              showFirstButton
              showLastButton
              variant="outlined"
              shape="rounded"
              onChange={(e, value) => setPageNumber(value)}
              page={+pageNumber}
            />
          </Card.Footer>
        )}
      </Card>
    </>
  );
}
