/* eslint-disable react/prop-types */
import SearchInput from 'components/shared/searchInput';
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';

export default function ServicesHeaders({
  setServicesSearchFilter,
  serviceSearchFilter,
}) {
  const { messages } = useIntl();
  return (
    <div className="booking--header">
      <Col md="7" xs="12">
        <SearchInput
          handleChange={setServicesSearchFilter}
          searchValue={serviceSearchFilter}
          placeholder={messages['sales.confirmed.booking.search.place.holder']}
        />
      </Col>
    </div>
  );
}
