import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import Pagination from '@material-ui/lab/Pagination';
import useOdata, { get } from 'hooks/useOdata';
import CitiesListTable from 'components/SuperAdminViews/CitiesList/CitiesListTable';

export default function Cities() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState('');
  const [reloadPag, setReloadPag] = useState('false');
  const [citiesList, setcitiesList] = useState();
  const [query, setQuery] = useState('');
  const { messages, locale } = useIntl();
  const sortBy = `${locale === 'ar' ? 'nameAR' : 'nameEN'}`;
  const [getCitiesAPI] = [
    `CityOData/Get?$skip=${(currentPage - 1) * 10}&$orderby=${sortBy}&${
      query ? `${query}` : ''
    }`,
  ];
  const {
    response: citiesListRes,
    isLoading: citiesLoading,
    setRecall: getCitiesList,
  } = useOdata(get, getCitiesAPI);
  const { response: count, setRecall: recallCount } = useOdata(
    get,
    `CityOData/$count?${query ? `${query}` : ''}`,
  );
  useEffect(() => {
    getCitiesList(true);
  }, [currentPage]);

  useEffect(() => {
    if (citiesListRes?.data?.list) {
      setReloadPag(false);
      setcitiesList(citiesListRes.data.list);
    }
  }, [citiesListRes]);

  useEffect(() => {
    if (query) {
      if (currentPage === 0) {
        requestData();
      } else {
        setReloadPag(true);
        requestData();
        setCurrentPage(1);
      }
    } else {
      setReloadPag(true);
      requestData();
      setCurrentPage(1);
    }
  }, [query]);

  function requestData() {
    recallCount(true);
    getCitiesList(true);
  }
  useEffect(() => {
    if (count?.data?.list) {
      setTotalPages(count?.data?.list);
    }
  }, [count]);
  useEffect(() => {
    getCitiesList(true);
    recallCount(true);
  }, []);

  return (
    <>
      <Card className="mb-5">
        <Card.Header>
          <div className="title"> {messages['sidebar.sadmin.cities']}</div>
        </Card.Header>
        <Card.Body>
          <CitiesListTable
            allData={citiesList}
            listLoading={citiesLoading}
            getCitiesList={getCitiesList}
            setQuery={setQuery}
            query={query}
          />
        </Card.Body>
        {Math.ceil(totalPages / 10) > 1 && (
          <Card.Footer>
            {count?.data?.list > 10 && !reloadPag && (
              <Pagination
                count={Math.ceil(totalPages / 10)}
                color="secondary"
                showFirstButton
                showLastButton
                variant="outlined"
                shape="rounded"
                onChange={(e, value) => {
                  setCurrentPage(value);
                }}
              />
            )}
          </Card.Footer>
        )}
      </Card>
    </>
  );
}
