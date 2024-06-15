import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import SelectInputMUI from 'Shared/inputs/SelectInputMUI';

export default function CategorySearch({
  setQuery,
  setStatusFilterationValue,
  statusFilterationValue,
}) {
  const [dataSearch, setDataSearch] = useState({
    categoryName: '',
  });
  const { messages } = useIntl();
  const statusFilteration = [
    {
      id: 1,
      text: messages['common.selectAll'],
    },
    { id: 2, text: messages['common.Enable'] },
    { id: 3, text: messages['common.disable'] },
  ];
  const handleSearch = () => {
    // creating query
    let query = '';
    if (dataSearch.categoryName) query += `${dataSearch.categoryName}`;

    setQuery(query); // sets query & recall in parent
  };
  const clearSearchFields = () => {
    setDataSearch({
      categoryName: '',
    });
    setQuery('');
  };

  return (
    <Row className="categories-search">
      <Col xs="auto">
        <Row>
          <Col xs={6} md="auto">
            <TextField
              type="text"
              placeholder={messages['spAdmin.categories.search']}
              value={dataSearch.categoryName}
              onChange={(e) =>
                setDataSearch({ ...dataSearch, categoryName: e.target.value })
              }
              InputProps={{
                startAdornment: <i className="flaticon2-drop text-default"></i>,
              }}
            />
          </Col>
          <Col className="d-flex mt-3" xs={6} md="auto">
            <button
              onClick={handleSearch}
              type="button"
              className="icon-wrapper-btn btn-icon-primary mx-2 font-col text-primary"
              title={messages['common.search']}
            >
              <i className="flaticon2-search  la-1x text-primary"></i>{' '}
              {messages['common.search']}
            </button>
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
      </Col>
      <Col xs="3">
        <SelectInputMUI
          list={statusFilteration}
          value={statusFilterationValue}
          onChange={(e) => setStatusFilterationValue(e.target.value)}
        />
      </Col>
    </Row>
  );
}

CategorySearch.propTypes = {
  setQuery: PropTypes.func,
  statusFilterationValue: PropTypes.number,
  setStatusFilterationValue: PropTypes.func,
};
