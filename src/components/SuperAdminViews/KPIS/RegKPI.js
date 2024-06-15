import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import { Card, Col, Row } from 'react-bootstrap';

import useAPI, { get } from 'hooks/useAPI';
import Loading from 'components/AdminViews/NewBooking/Loading/shimmer';
import { TextField } from '@material-ui/core';
import moment from 'moment';
import { tofullISOString } from '../../../functions/MomentHandlers';

// SUPER ADMIN
export default function RegKPI() {
  const { locale } = useIntl();
  const [date, setDate] = useState(new Date());
  const onChange = (event, data) => setDate(new Date(data.value.setHours(3, 0, 0, 0)));
  const { response, setRecall, isLoading } = useAPI(
    get,
    `RegKPI/GetRegisteredCount?date=${tofullISOString(date)}`,
  );

  useEffect(() => {
    setRecall(true);
  }, [date]);

  return (
    <>
      <Card className="h-100">
        <Card.Header className="border-bottom-0 pb-0">
          <div className="title">
            <FormattedMessage id="kpis.req.title" />
          </div>
        </Card.Header>

        {isLoading ? (
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
                  <FormattedMessage id="kpis.regCustomerCount" />
                </div>
                <div className="kpis-body-item__number">
                  {response?.data?.regCustomerCount}
                </div>
              </Col>
              <Col xs={12} className="kpis-body-item border-lr-info">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.regSPCount" />
                </div>
                <div className="kpis-body-item__number">{response?.data?.regSPCount}</div>
              </Col>
            </Row>
          </Card.Body>
        )}
      </Card>
    </>
  );
}
// <Statistic.Group size="tiny" color="green">
//   <SingleStatistic
//     val={response && response.data && response.data.regCustomerCount}
//     msgId="kpis.regCustomerCount"
//   />
//   <SingleStatistic
//     val={response && response.data && response.data.regSPCount}
//     msgId="kpis.regSPCount"
//   />
// </Statistic.Group>
