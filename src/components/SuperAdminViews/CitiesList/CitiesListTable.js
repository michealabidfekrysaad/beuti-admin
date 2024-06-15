/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Switch,
  TextField,
} from '@material-ui/core';
import { Col, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import useAPI, { put } from 'hooks/useAPI';
import { formatData } from 'functions/formatTableData';
import Alert from '@material-ui/lab/Alert';

function CitiesListTable({ allData, getCitiesList, listLoading, setQuery }) {
  const history = useHistory();
  const { messages, locale } = useIntl();
  const [success, setSuccess] = useState(false);
  const [cityName, setCityName] = useState('');
  const [error, setError] = useState('');
  const [statusPayload, setStatusPayload] = useState(null);
  let query = '';
  const { response: cityEnabledRes, setRecall: recallUpdateEnabled } = useAPI(
    put,
    `City/ToggleStatus`,
    statusPayload,
  );

  const goToEditCity = (id) => {
    history.push(`/cities/edit/${id}`);
  };
  const addpolygon = (id) => {
    history.push(`/cities/polygon/${id}`);
  };
  const handleSearch = () => {
    if (cityName) query += `&cityName=${cityName}`;
    setQuery(query); // sets query & recall via useEffect in parent function
  };
  function clearSearchFields() {
    setCityName('');
    setQuery('');
  }

  useEffect(() => {
    if (cityEnabledRes?.error) {
      setError(cityEnabledRes.error.message);
      setTimeout(() => {
        setError('');
      }, 2000);
    }

    if (cityEnabledRes?.data?.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
      getCitiesList(true);
    }
  }, [cityEnabledRes]);

  useEffect(() => {
    if (statusPayload) {
      recallUpdateEnabled(true);
    }
  }, [statusPayload]);

  const tableGuide = [
    {
      data: `${locale === 'ar' ? 'nameAR' : 'nameEN'}`,
      message: messages[`spAdmin.cities.header.name`],
    },
    { data: 'actions', message: messages['common.actions'] },
  ];

  const actions = [
    {
      name: 'polygon',
      element: (id) => (
        <Tooltip key={id + 1000} arrow title={messages['beut.add.polygon']}>
          <button
            type="button"
            className="icon-wrapper-btn btn-icon-info mx-2"
            onClick={() => addpolygon(id)}
          >
            <i className="flaticon-globe text-info"></i>
          </button>
        </Tooltip>
      ),
    },
    {
      name: 'edit',
      element: (id) => (
        <Tooltip key={id} arrow title={messages['common.edit']}>
          <button
            type="button"
            className="icon-wrapper-btn btn-icon-primary mx-2"
            onClick={() => goToEditCity(id)}
          >
            <i className="flaticon2-pen text-primary"></i>
          </button>
        </Tooltip>
      ),
    },

    //   put the toggle here
    {
      name: 'toggle',
      element: (id, dataPiece) => (
        <Switch
          checked={dataPiece.isEnabled}
          onChange={() =>
            setStatusPayload({
              cityId: id,
              isEnabled: !dataPiece.isEnabled,
            })
          }
          name="toggleisEnabled"
        />
      ),
    },
  ];

  return (
    <>
      {success && (
        <Alert className="align-items-center" severity="success">
          {messages['admin.settings.workingTimeDelete.citySuccessfully']}
        </Alert>
      )}
      {error && (
        <Alert className="align-items-center" severity="error">
          {error}
        </Alert>
      )}
      <Row className="justify-content-md-center">
        <Col xs={12} md={6} lg={4} className="mt-2">
          <form noValidate>
            <TextField
              type="text"
              placeholder={messages[`cities.search.by.city`]}
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <i className="flaticon-placeholder-3  text-default px-2"></i>
                ),
              }}
            />
          </form>
        </Col>
        <Col xs={12} md={6} lg={4} className="mt-2">
          <button
            onClick={handleSearch}
            type="button"
            className="icon-wrapper-btn btn-icon-primary mx-2 font-col text-primary"
            title={messages['common.search']}
          >
            <i className="flaticon2-search  la-1x text-primary"></i>{' '}
            {messages['common.search']}
          </button>
          {/* clear search */}
          <button
            onClick={clearSearchFields}
            type="button"
            className="icon-wrapper-btn btn-icon-danger mx-2 font-col text-danger"
            title={messages['common.clear']}
          >
            <i className="flaticon2-refresh-button la-1x text-danger"></i>{' '}
            {messages['common.clear']}
          </button>
        </Col>
      </Row>
      <Table>
        <TableHead>
          <TableRow>
            {tableGuide.map((el) => (
              <TableCell className="dynamic-table" key={el.data}>
                {el.message}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {allData?.length > 0 ? (
            allData.map((pieceOfData) => (
              <TableRow key={pieceOfData.Id}>
                {tableGuide.map((rowData, i, arr) => (
                  <TableCell key={rowData.data} className="dynamic-table">
                    {formatData(pieceOfData, rowData, locale, actions, messages)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                align="center"
                colSpan="12"
                style={{ margin: '3em 0em', padding: '2em 0em' }}
              >
                {!listLoading ? (
                  <>
                    <i className="flaticon-gift la-2x  mx-2"></i>
                    {messages['common.noDataFound']}
                  </>
                ) : (
                  <CircularProgress size={24} className="mx-auto" color="secondary" />
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

CitiesListTable.propTypes = {
  setQuery: PropTypes.func,
  allData: PropTypes.array,
  getCitiesList: PropTypes.func,
  listLoading: PropTypes.bool,
};

export default CitiesListTable;
