import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Card } from 'react-bootstrap';
import useAPI, { get } from 'hooks/useAPI';
import AlertCenterInfo from './AlertCenterInfo';
import Index from './GraphSummary/Index';
import TopEmployee from './TopEmployee';
import TopSales from './TopSales';
import UpComingBookings from './UpComingBookings';

function HomePage() {
  const { messages } = useIntl();
  const adminHomePage = 'admin.homePage';

  const {
    response: profileCompleted,
    isLoading: gettingProfileComplete,
    setRecall: recallProfileComplete,
  } = useAPI(get, `ServiceProvider/IsSpProfileompleted`);

  useEffect(() => {
    recallProfileComplete(true);
  }, []);
  return (
    <>
      <Card className="h-100">
        <Card.Header>
          <div className="title">{messages['sidebar.admin.homePage']}</div>
        </Card.Header>
        {!gettingProfileComplete && !profileCompleted?.data?.isProfileCompleted && (
          <Card.Body className="home-page-alert">
            <AlertCenterInfo profileCompleted={profileCompleted} />
          </Card.Body>
        )}
        <Card.Body className="home-page-graph">
          <Index />
        </Card.Body>
        <div className="home-page-booking">
          <UpComingBookings />
        </div>
        <div className="home-page-top-emp">
          <TopEmployee />
        </div>
        <div className="home-page-top-sales">
          <TopSales />
        </div>
      </Card>
    </>
  );
}

export default HomePage;
