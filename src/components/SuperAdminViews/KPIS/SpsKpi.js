import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import useAPI, { get } from 'hooks/useAPI';
import Loading from 'components/AdminViews/NewBooking/Loading/shimmer';
import { Card, Col, Row } from 'react-bootstrap';

// SUPER ADMIN
export default function RegKPI() {
  const { response, setRecall, isLoading } = useAPI(get, `ServiceProvider/GetSPCounts`);
  useEffect(() => {
    setRecall(true);
  }, []);
  return (
    <>
      <Card className="h-100">
        <Card.Header className="border-bottom-0 pb-0">
          <div className="title">
            <FormattedMessage id="kpis.sp.title" />
          </div>
        </Card.Header>

        {isLoading ? (
          <>
            <Loading active />
          </>
        ) : (
          <Card.Body className="d-flex">
            <Row className="kpis-body ">
              <Col xs={6} className="kpis-body-item border-lr-primary">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.sp.active.sp" />
                </div>

                <div className="kpis-body-item__number">
                  {response && response?.data?.activeSPCount}
                </div>
              </Col>
              <Col xs={6} className="kpis-body-item border-lr-secondary">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.sp.inactive.sp" />
                </div>
                <div className="kpis-body-item__number">
                  {response && response?.data?.inActiveSPCount}
                </div>
              </Col>
              <Col xs={6} className="kpis-body-item border-lr-info">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.sp.activeClinics" />
                </div>
                <div className="kpis-body-item__number">
                  {response &&
                    response?.data?.spgctCounts?.find((x) => x.id === 5)?.activeSPCount}
                </div>
              </Col>
              <Col xs={6} className="kpis-body-item border-lr-secondary">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.sp.inActiveClinics" />
                </div>
                <div className="kpis-body-item__number">
                  {response &&
                    response?.data?.spgctCounts?.find((x) => x.id === 5)?.inActiveSPCount}
                </div>
              </Col>
              <Col xs={6} className="kpis-body-item border-lr-warning">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.sp.active.salons" />
                </div>
                <div className="kpis-body-item__number">
                  {response &&
                    response?.data?.spgctCounts?.find((x) => x.id === 2)?.activeSPCount}
                </div>
              </Col>
              <Col xs={6} className="kpis-body-item border-lr-secondary">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.sp.inactive.salons" />
                </div>
                <div className="kpis-body-item__number">
                  {response &&
                    response?.data?.spgctCounts?.find((x) => x.id === 2)?.inActiveSPCount}
                </div>
              </Col>
              <Col xs={6} className="kpis-body-item border-lr-sucess">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.sp.active.makeupArtists" />
                </div>
                <div className="kpis-body-item__number">
                  {response &&
                    response.data?.spgctCounts?.find((x) => x.id === 3).activeSPCount}
                </div>
              </Col>
              <Col xs={6} className="kpis-body-item border-lr-secondary">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.sp.inactive.makeupArtists" />
                </div>
                <div className="kpis-body-item__number">
                  {response &&
                    response.data?.spgctCounts?.find((x) => x.id === 3).inActiveSPCount}
                </div>
              </Col>

              <Col xs={6} className="kpis-body-item border-lr-main">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.sp.active.homeServices" />
                </div>
                <div className="kpis-body-item__number">
                  {response &&
                    response.data?.spgctCounts?.find((x) => x.id === 4).activeSPCount}
                </div>
              </Col>

              <Col xs={6} className="kpis-body-item border-lr-secondary">
                <div className="kpis-body-item__name">
                  <FormattedMessage id="kpis.sp.inactive.homeServices" />
                </div>
                <div className="kpis-body-item__number">
                  {response &&
                    response.data?.spgctCounts?.find((x) => x.id === 4).inActiveSPCount}
                </div>
              </Col>
            </Row>
          </Card.Body>
        )}
      </Card>
    </>
  );
}
