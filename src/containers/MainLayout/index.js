import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SideBarMenu from 'components/layout/SideBar/SideBarMenu';
import { useLocation } from 'react-router-dom';
import NavBar from 'components/layout/NavBar';
import { Container, Col, Row } from 'react-bootstrap';
import { SideBarContext } from 'providers/SideBarProvider';
import { Routes } from 'constants/Routes';

const MainLayout = ({ children }) => {
  const { sideBar } = useContext(SideBarContext);
  const [classCalendar, setclassCalendar] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location) {
      if (location?.pathname === Routes.dayBookingsCalendarView) {
        setclassCalendar(true);
      } else {
        setclassCalendar(false);
      }
    }
  }, [location]);

  return (
    <Container fluid className={`${classCalendar ? 'calendar-scroll' : ''}`}>
      <Row>
        <Col xs="auto" className="px-0">
          <SideBarMenu />
        </Col>
        <Col xs="auto" className="flex-grow-1 non-pushed-container">
          <NavBar />
          <div id="main-content">{children}</div>
        </Col>
        {/* <Col xs="12" className="px-0">
          <Footer />
        </Col> */}
      </Row>
    </Container>
  );
};

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default MainLayout;
