import React from 'react';
import { useIntl } from 'react-intl';
import { Row, Col, Dropdown, Button } from 'react-bootstrap';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { Routes } from 'constants/Routes';
import PropTypes from 'prop-types';
import SelectInputMUI from 'Shared/inputs/SelectInputMUI';

const ChangeViewsAndAdd = ({
  calendarViewsChoose,
  calendarView,
  setCalendarView,
  showCalendar,
  setShowCalendar,
}) => {
  const { messages } = useIntl();
  const history = useHistory();

  const correctNowTime = () => {
    const coeff = 1000 * 60 * 5;
    const date = new Date();
    const rounded = new Date(Math.round(date.getTime() / coeff) * coeff);
    return moment(rounded).format('HH:mm:ss');
  };

  return (
    <Row className="align-items-center justify-content-end">
      <Col xs="auto">
        <button
          type="button"
          className="booking-headers_second--part_toggle--btn"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <p className="booking-headers_second--part_toggle--btn_text">
            {showCalendar ? (
              <>
                <i className="flaticon2-list-1 mx-2 icon-md"></i>
              </>
            ) : (
              <>
                <i className="flaticon2-calendar-1 mx-2 icon-md"></i>
              </>
            )}
          </p>
        </button>
      </Col>
      <Col xs="auto" className="mx-1">
        <SelectInputMUI
          className="booking-headers_first--part_views"
          list={calendarViewsChoose}
          value={calendarView}
          onChange={(e) => {
            setCalendarView(e?.target?.value);
            localStorage.setItem('intialView', e?.target?.value);
          }}
        />
      </Col>
      <Col xs="auto">
        <Dropdown
          id="dropdown-menu-align-end"
          className="booking-headers_second--part_add"
          drop="start"
        >
          <Dropdown.Toggle
            className="booking-headers_second--part_add-btn"
            id="dropdown-autoclose-true"
          >
            {messages['common.add']}
          </Dropdown.Toggle>
          <Dropdown.Menu className="booking-headers_second--part_add-drop">
            <Dropdown.Item
              as={Button}
              eventKey="1"
              onClick={() => {
                history.push({
                  pathname: '/booking/bookingFlow',
                  search: `?time=${correctNowTime()}&startDate=${moment().format(
                    'YYYY-MM-DD',
                  )}`,
                });
              }}
            >
              {messages['calendar.add.new.book']}
            </Dropdown.Item>
            <Dropdown.Item
              as={Button}
              eventKey="2"
              onClick={() => history.push(Routes.addCustomer)}
            >
              {messages['calendar.add.new.customer']}
            </Dropdown.Item>
            {/* <Dropdown.Item as={Button} eventKey="2">
              {messages['calendar.add.new.sale']}
            </Dropdown.Item> */}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  );
};
ChangeViewsAndAdd.propTypes = {
  calendarViewsChoose: PropTypes.array,
  calendarView: PropTypes.string,
  setCalendarView: PropTypes.func,
  showCalendar: PropTypes.bool,
  setShowCalendar: PropTypes.func,
};
export default ChangeViewsAndAdd;
