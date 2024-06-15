import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Dropdown } from 'semantic-ui-react';
import { Card, Col, Row } from 'react-bootstrap';

import useAPI, { get } from 'hooks/useAPI';
import Loading from 'components/AdminViews/NewBooking/Loading/shimmer';
// SUPER ADMIN
export default function CityKPI() {
  const { messages } = useIntl();
  // 50 Defaults to Alreyad.
  const [cityId, setCityId] = useState(4);
  const [cityDD, setCityDD] = useState([]);
  const cityAPI = 'City/ViewCityList';
  const { response: cityList, setRecall: recallCities } = useAPI(get, cityAPI);
  const { response, setRecall, isLoading } = useAPI(
    get,
    `Booking/GetCityBookingsData?cityId=${cityId}`,
  );
  const handleCitySelection = (e, { value }) => setCityId(value);

  useEffect(() => {
    if (cityList && cityList.data && cityList.data.list) {
      const cityDDGen = cityList.data.list.map((cityData, i) => ({
        key: i,
        text: cityData.name,
        value: cityData.id,
      }));
      setCityDD(cityDDGen);
    }
  }, [cityList]);

  useEffect(() => {
    setRecall(true);
  }, [cityId]);

  useEffect(() => {
    setRecall(true);
    recallCities(true);
  }, []);

  return (
    <>
      <Card className="h-100">
        <Card.Header className="border-bottom-0 pb-0">
          <div className="title">
            <FormattedMessage id="common.cities" />
          </div>
        </Card.Header>

        {isLoading ? (
          <>
            <Loading active />
          </>
        ) : (
          <Card.Body>
            <Dropdown
              onChange={handleCitySelection}
              options={cityDD}
              placeholder={messages['sAdmin.spList.search.dropdown.city']}
              labeled
              className="selection"
              clearable
              value={cityId}
            />
            <Row className="kpis-body mt-5">
              <Col xs={12} className="kpis-body-item border-lr-primary">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.sp.number.of.bookings" />
                </div>
                <div className="kpis-body-item__number">
                  {response && response.data && response.data.noOfBookings}
                </div>
              </Col>
              <Col xs={12} className="kpis-body-item border-lr-info">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.sp.number.of.closed.bookings" />
                </div>
                <div className="kpis-body-item__number">
                  {response && response.data && response.data.noOfClosedBookings}
                </div>
              </Col>
              <Col xs={12} className="kpis-body-item border-lr-warning">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.sp.number.of.service.providers" />
                </div>
                <div className="kpis-body-item__number">
                  {response && response.data && response.data.noOfServiceProviders}
                </div>
              </Col>
              <Col xs={12} className="kpis-body-item border-lr-sucess">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.sp.all.bookings.value" />
                </div>
                <div className="kpis-body-item__number">
                  {response && response.data && response.data.bookingsValue}
                  {messages.currency}
                </div>
              </Col>
              <Col xs={12} className="kpis-body-item border-lr-main">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.sp.all.closed.bookings.value" />
                </div>
                <div className="kpis-body-item__number">
                  {response && response.data && response.data.closedBookingsValue}
                  {messages.currency}
                </div>
              </Col>
            </Row>
          </Card.Body>
        )}
      </Card>
    </>
  );
}
