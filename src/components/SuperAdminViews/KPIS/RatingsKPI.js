import React from 'react';
import { FormattedMessage } from 'react-intl';
import useAPI, { get } from 'hooks/useAPI';
import Loading from 'components/AdminViews/NewBooking/Loading/shimmer';
import Rating from '@material-ui/lab/Rating';
import { Card, Col, Row } from 'react-bootstrap';
// SUPER ADMIN
export default function RatingsKPI() {
  const { response, setRecall, isLoading } = useAPI(get, `Booking/SPRatesCount`);

  React.useEffect(() => {
    setRecall(true);
  }, []);

  return (
    <>
      <Card className="h-100">
        <Card.Header className="border-bottom-0 pb-0">
          <div className="title">
            <FormattedMessage id="kpis.ratings" />
          </div>
        </Card.Header>

        {isLoading ? (
          <>
            <Loading active />
          </>
        ) : (
          <Card.Body className="d-flex">
            <Row className="kpis-body ">
              <Col xs={12} className="kpis-body-item border-lr-white">
                <div className="kpis-body-item__name">
                  <Rating
                    defaultValue={1}
                    readOnly
                    icon={<i className="flaticon-star icon-xs"></i>}
                  />
                </div>

                <div className="kpis-body-item__number">
                  {response && response.data.spTill1}
                </div>
              </Col>

              <Col xs={12} className="kpis-body-item border-lr-white">
                <div className="kpis-body-item__name">
                  <Rating
                    defaultValue={2}
                    readOnly
                    icon={<i className="flaticon-star icon-xs"></i>}
                  />
                </div>
                <div className="kpis-body-item__number">
                  {response && response.data.spTill2}
                </div>
              </Col>

              <Col xs={12} className="kpis-body-item border-lr-white">
                <div className="kpis-body-item__name">
                  <Rating
                    defaultValue={3}
                    readOnly
                    icon={<i className="flaticon-star icon-xs"></i>}
                  />
                </div>
                <div className="kpis-body-item__number">
                  <div className="kpis-body-item__number">
                    {response && response.data.spTill3}
                  </div>
                </div>
              </Col>

              <Col xs={12} className="kpis-body-item border-lr-white">
                <div className="kpis-body-item__name">
                  <Rating
                    defaultValue={4}
                    readOnly
                    icon={<i className="flaticon-star icon-xs"></i>}
                  />
                </div>
                <div className="kpis-body-item__number">
                  <div className="kpis-body-item__number">
                    {response && response.data.spTill4}
                  </div>
                </div>
              </Col>

              <Col xs={12} className="kpis-body-item border-lr-white">
                <div className="kpis-body-item__name">
                  <Rating
                    defaultValue={5}
                    readOnly
                    icon={<i className="flaticon-star icon-xs"></i>}
                  />
                </div>
                <div className="kpis-body-item__number">
                  <div className="kpis-body-item__number">
                    {response && response.data.spTill5}
                  </div>
                </div>
              </Col>
              <Col xs={12} className="kpis-body-item border-lr-main">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.reviewPercentage" />
                </div>
                <div className="kpis-body-item__number">
                  <div className="kpis-body-item__number">
                    {response && response.data.reviewsPercentage.toFixed(2)} %
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        )}
      </Card>
    </>
  );
}
