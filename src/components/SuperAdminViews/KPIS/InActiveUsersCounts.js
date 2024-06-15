import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import useAPI, { get } from 'hooks/useAPI';
import Loading from 'components/AdminViews/NewBooking/Loading/shimmer';
import { Card, Row, Col } from 'react-bootstrap';
import { toADayFormat } from 'functions/MomentHandlers';
// SUPER ADMIN
export default function InActiveUsersCounts() {
  const { locale } = useIntl();
  const [date, setDate] = useState(new Date());
  const onChange = (event, data) => setDate(new Date(data.value.setHours(3, 0, 0, 0)));
  const { response, setRecall } = useAPI(
    get,
    `Booking/GetInactiveUsers?date=${toADayFormat(date)}`,
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
            <FormattedMessage id="kpis.twomonth.laziness" />
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
              <Col xs={12} className="kpis-body-item border-lr-primary">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.inactiveSPCount" />
                </div>
                <div className="kpis-body-item__number">
                  {response.data.inactiveSPCount}{' '}
                </div>
              </Col>
              <Col xs={12} className="kpis-body-item border-lr-info">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.regSPCount" />
                </div>
                <div className="kpis-body-item__number">
                  {response.data.inactiveCustomersCount}
                </div>
              </Col>
            </Row>
          </Card.Body>
        )}
      </Card>
    </>
  );
}
