import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import { Header, Segment, Table } from 'semantic-ui-react';
import useAPI, { get } from 'hooks/useAPI';
import Loading from 'components/AdminViews/NewBooking/Loading/shimmer';
import { Card, Row, Col } from 'react-bootstrap';
import { toADayFormat } from 'functions/MomentHandlers';

export default function GetActiveUsersCounts() {
  const { locale } = useIntl();
  const [date, setDate] = useState(new Date());
  const onChange = (event, data) => setDate(new Date(data.value.setHours(3, 0, 0, 0)));
  const { response, setRecall } = useAPI(
    get,
    `Booking/GetActiveUsersCounts?date=${toADayFormat(date)}`,
  );

  useEffect(() => {
    if (date) {
      setRecall(true);
    }
  }, [date]);

  return (
    <>
      <Card className="h-100">
        <Card.Header className="border-bottom-0 pb-0">
          <div className="title">
            <FormattedMessage id="kpis.inactiveSPCount.kpi" />
          </div>
        </Card.Header>

        {!response ? (
          <>
            <Loading active />
          </>
        ) : (
          <Card.Body>
            <SemanticDatepicker
              locale="en-US"
              pointing={locale === 'ar' ? 'right' : 'left'}
              type="basic"
              size="tiny"
              value={new Date(date)}
              onChange={onChange}
              clearable={false}
              datePickerOnly
            />
            <Row className="kpis-body mt-5">
              <Col xs={6} className="kpis-body-item border-lr-primary">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.sp.daily.active.users" />
                </div>

                <div className="kpis-body-item__number">
                  {response && response.data.dailyActiveUsersSP}
                </div>
              </Col>
              <Col xs={6} className="kpis-body-item border-lr-sucess">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.sp.weekly.active.users" />
                </div>
                <div className="kpis-body-item__number">
                  {response && response.data.weeklyActiveUsersSP}
                </div>
              </Col>
              <Col xs={6} className="kpis-body-item border-lr-info">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.sp.monthly.active.users" />
                </div>
                <div className="kpis-body-item__number">
                  {response && response.data.monthlyActiveUsersSP}
                </div>
              </Col>
              <Col xs={6} className="kpis-body-item border-lr-warning">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.customer.daily.active.users" />
                </div>
                <div className="kpis-body-item__number">
                  {response && response.data.dailyActiveUsersCustomer}
                </div>
              </Col>
              <Col xs={6} className="kpis-body-item border-lr-warning">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.customer.weekly.active.users" />
                </div>
                <div className="kpis-body-item__number">
                  {response && response.data.weeklyActiveUsersCustomer}
                </div>
              </Col>
              <Col xs={6} className="kpis-body-item border-lr-info">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.customer.monthly.active.users" />
                </div>
                <div className="kpis-body-item__number">
                  {response && response.data.monthlyActiveUsersCustomer}
                </div>
              </Col>
              <Col xs={6} className="kpis-body-item border-lr-sucess">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.stickinessRatioSP" />
                </div>
                <div className="kpis-body-item__number">
                  {response && response.data.stickinessRatioSP}
                </div>
              </Col>
              <Col xs={6} className="kpis-body-item border-lr-primary">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.stickinessRatioCustomer" />
                </div>
                <div className="kpis-body-item__number">
                  {response && response.data.stickinessRatioCustomer}
                </div>
              </Col>
            </Row>
          </Card.Body>
        )}
      </Card>
    </>
  );
}
