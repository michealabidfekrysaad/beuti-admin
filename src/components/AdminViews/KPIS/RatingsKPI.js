/* eslint-disable react/prop-types */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Loading from 'components/AdminViews/NewBooking/Loading/shimmer';
import Rating from '@material-ui/lab/Rating';
import { Card, Col } from 'react-bootstrap';
export default function RatingsKPI({ isLoading, responseRating }) {
  return (
    <>
      <Card className="admin-statistics">
        <Card.Body>
          {isLoading ? (
            <>
              <Loading active />
            </>
          ) : (
            <>
              <h1 className="title-primary text-center">
                <FormattedMessage id="kpis.rate" />{' '}
              </h1>
              <hr />
              <Col xs={12} className="kpis-body-item border-lr-white">
                <div className="kpis-body-item__name">
                  <Rating
                    defaultValue={1}
                    readOnly
                    icon={<i className="flaticon-star icon-xs"></i>}
                  />
                </div>

                <div className="kpis-body-item__number">
                  {responseRating && responseRating?.data?.count1StarRate}
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
                  {responseRating && responseRating.data?.count2StarRate}
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
                    {responseRating && responseRating.data?.count3StarRate}
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
                    {responseRating && responseRating.data?.count4StarRate}
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
                    {responseRating && responseRating.data?.count5StarRate}
                  </div>
                </div>
              </Col>
              <Col xs={12} className="kpis-body-item border-lr-main">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.reviewPercentage" />
                </div>
                <div className="kpis-body-item__number">
                  <div className="kpis-body-item__number">
                    {responseRating && responseRating.data?.countFeedback}
                  </div>
                </div>
              </Col>
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
}
