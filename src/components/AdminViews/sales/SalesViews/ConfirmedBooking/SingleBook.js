/* eslint-disable react/prop-types */
import React from 'react';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import SVG from 'react-inlinesvg';
import { Row, Col, Dropdown, Button } from 'react-bootstrap';
import { useIntl, FormattedMessage } from 'react-intl';
import { convertMinsToHours, convertTimeToMinuts } from 'utils/Helpers/TimeHelper';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router-dom';
import { salesItemIds } from '../../Helper/ViewsEnum';

export default function SingleBook({
  ConfirmedBookings,
  setSalesData,
  salesData,
  fetchConfirmBookings,
  selectedTime,
  setBookingSelectedInTheCart,
}) {
  const { messages, locale } = useIntl();
  const history = useHistory();
  const location = useLocation();

  const handleSelectBookingLogic = (singleBook) => {
    setBookingSelectedInTheCart(singleBook);
    //   if there is booking replace it with new one
    if (
      salesData?.itemsSelected?.find(
        (foundBefore) =>
          foundBefore?.identify === salesItemIds?.confirmedBooking &&
          foundBefore?.id !== singleBook?.id,
      )
    ) {
      return setSalesData({
        ...salesData,
        itemsSelected: [
          ...salesData?.itemsSelected?.filter(
            (someBookings) => someBookings?.identify !== salesItemIds?.confirmedBooking,
          ),
          {
            ...singleBook,
            services: singleBook?.services?.filter((data) => !data?.packageUniqueKey),
            sumBookingPaidAmounts:
              singleBook?.onlinePaiedAmount + singleBook?.walletPaiedAmount,
          },
        ],
      });
    }
    //   if same booking was inside the cart remove it
    if (salesData?.itemsSelected?.find((ele) => ele?.id === singleBook?.id)) {
      setBookingSelectedInTheCart({});
      return setSalesData({
        ...salesData,
        itemsSelected: salesData?.itemsSelected?.filter(
          (someBookings) => someBookings?.id !== singleBook?.id,
        ),
      });
    }
    //   first click on any booking to choose it
    return setSalesData({
      ...salesData,
      itemsSelected: [
        ...salesData?.itemsSelected,
        {
          ...singleBook,
          services: singleBook?.services?.filter((data) => !data?.packageUniqueKey),
          sumBookingPaidAmounts:
            singleBook?.onlinePaiedAmount + singleBook?.walletPaiedAmount,
        },
      ],
    });
  };
  return (
    <Row className="book">
      {fetchConfirmBookings && !ConfirmedBookings?.length ? (
        <Col xs="12" className="mt-5">
          <div className="loading"></div>
        </Col>
      ) : (
        ConfirmedBookings?.map((book) => (
          <>
            <Col xs="12" className="book-header" key={book?.bookingDate}>
              <div className="book-header__date">
                {moment(book?.bookingDate)
                  ?.locale(locale)
                  ?.format('dddd, DD MMMM')}
              </div>
            </Col>
            {book?.bookingData?.map((singleBook) => (
              <Col xs={12} className="book-data" key={book?.id}>
                <button
                  type="button"
                  className={`book-data__container ${
                    salesData?.itemsSelected?.find((ele) => ele?.id === singleBook?.id)
                      ? 'selected-booking'
                      : ''
                  }`}
                  onClick={() => {
                    handleSelectBookingLogic(singleBook);
                  }}
                >
                  <div className="book-data__container-date">
                    {moment(singleBook?.date)
                      ?.locale(locale)
                      ?.format('dddd h:mm A')}
                  </div>
                  <div className="book-data__container-info">
                    <div className="book-data__container-info__first">
                      <div className="book-data__container-info__first-customer--name">
                        {singleBook?.customerName}
                      </div>
                      {singleBook?.services?.map((ser) => (
                        <div
                          className="book-data__container-info__first-services"
                          key={ser?.id}
                        >
                          {ser?.name},{'  '}
                          <FormattedMessage
                            id="booking.service.duration"
                            values={{
                              duration: convertMinsToHours(
                                convertTimeToMinuts('01:00:00'),
                                messages,
                              ),
                              employee: ser?.employeeName,
                            }}
                          />{' '}
                        </div>
                      ))}
                    </div>
                    <div className="book-data__container-info__last">
                      <div className="book-data__container-info__last-location">
                        <SVG
                          className="mx-2"
                          src={toAbsoluteUrl(
                            `/assets/icons/beuti/${
                              singleBook?.isHome ? 'home' : 'salon'
                            }.svg`,
                          )}
                        />
                        <div>
                          {
                            messages[
                              `${
                                singleBook?.isHome
                                  ? 'wizard.add.new.service.location.home'
                                  : 'wizard.add.new.service.location.salon'
                              }`
                            ]
                          }
                        </div>
                      </div>
                      <div className="book-data__container-info__last-price">
                        {singleBook?.priceWithoutVAt} {messages['common.currency']}
                      </div>
                      <div className="book-data__container-info__last-view--book">
                        <Dropdown
                          id="dropdown-menu-align-end"
                          className="showMore"
                          drop="start"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <Dropdown.Toggle
                            className="showMore--btn"
                            id="dropdown-autoclose-true"
                          >
                            <i className="flaticon-more-v2" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="showMore--dropdown">
                            <Dropdown.Item
                              as={Button}
                              eventKey="1"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                history.push({
                                  pathname: `/booking/bookingFlow/${singleBook?.id}`,
                                  state: {
                                    prevPath: location.pathname,
                                    filter: selectedTime,
                                  },
                                });
                              }}
                            >
                              {messages['booking.sidebar.status.edit']}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                </button>
              </Col>
            ))}
          </>
        ))
      )}
    </Row>
  );
}
