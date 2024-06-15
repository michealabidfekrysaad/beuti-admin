/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingProfile } from 'components/shared/Shimmer';
import { List, Header, Grid, Message, Segment, Label } from 'semantic-ui-react';
import useApi, { get } from 'hooks/useAPI';
import { expectedObj } from 'components/SuperAdminViews/BookingDetails/BookingObj';
import { useIntl } from 'react-intl';
import { formatDate } from 'functions/formatTableData';
import { formatTime, formatDuration } from 'functions/timeFunctions';

export function CancelledBookingDetails() {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(expectedObj);

  const { messages, locale } = useIntl();
  const bookDetailApi = `Booking/getBookingDetails?bookingId=${bookingId}`;
  const { response: bookingDetailsRes, isLoading, setRecall: request } = useApi(
    get,
    bookDetailApi,
  );

  useEffect(() => {
    if (bookingDetailsRes && bookingDetailsRes.data) {
      setBookingDetails(bookingDetailsRes.data);
    }
  }, [bookingDetailsRes]);

  useEffect(() => {
    request(true);
  }, []);

  function bookingStatusColor() {
    let color;
    switch (bookingDetails.bookingStatus.id) {
      case 1:
        color = 'blue';
        break;
      case 2:
        color = 'red';
        break;
      case 3:
        color = 'green';
        break;
      case 4:
        color = 'orange';
        break;
      default:
        color = 'gray';
    }
    return color;
  }

  return isLoading ? (
    <LoadingProfile type="profile" fluid />
  ) : (
    <Grid>
      <Grid.Column>
        <Message
          icon="calendar"
          content={`${messages['spAdmin.bookings.workingHours']} : ${formatTime(
            bookingDetails.salonStartTime,
            locale,
          )} : ${formatTime(bookingDetails.salonEndTime, locale)}`}
          header={formatDate(bookingDetails.bookingDate, locale)}
        />
        {bookingDetails.address && bookingDetails.address.length > 0 && (
          <Message icon="map marker alternate" header={`${bookingDetails.address}`} />
        )}
        <Segment raised>
          <Label as="span" color={bookingStatusColor()} ribbon>
            {bookingDetails.bookingStatus.name}
          </Label>
          {/* Start SP-Details */}
          <Header as="h2" color="purple">
            {bookingDetails.serviceName}
          </Header>
          <Grid columns={2} style={{ color: '#535B66', margin: '0px' }}>
            <Grid.Row stretched style={{ paddingBottom: '0px', paddingTop: '0.30em' }}>
              <Grid.Column style={{ padding: '0em 0.18em' }} width={8}>
                <Segment raised>
                  <List divided>
                    <List.Item className="summary">
                      <List.Icon
                        name="address card"
                        size="large"
                        verticalAlign="middle"
                        color="purple"
                      />
                      <List.Content>
                        <List.Header
                          as="p"
                          className={`${locale === 'ar' ? 'ar-font' : 'en-font'}`}
                        >
                          {messages['booking.details.spName']} : {bookingDetails.spName}
                        </List.Header>
                      </List.Content>
                    </List.Item>
                  </List>
                </Segment>
              </Grid.Column>
              <Grid.Column style={{ padding: '0em 0.18em' }} width={8}>
                <Segment raised>
                  <List divided>
                    <List.Item className="summary">
                      <List.Icon
                        name="mobile alternate"
                        size="large"
                        verticalAlign="middle"
                        color="purple"
                      />
                      <List.Content>
                        <List.Header
                          as="p"
                          className={`${locale === 'ar' ? 'ar-font' : 'en-font'}`}
                        >
                          {messages['booking.details.spNumber']} :{' '}
                          {bookingDetails.spMobile}
                        </List.Header>
                      </List.Content>
                    </List.Item>
                  </List>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          {/* End SP-Details */}
          {/* Start Customer-Details */}
          <Grid columns={2} style={{ color: '#535B66', margin: '0px' }}>
            <Grid.Row stretched style={{ paddingBottom: '0px', paddingTop: '0.30em' }}>
              <Grid.Column style={{ padding: '0em 0.18em' }} width={8}>
                <Segment raised>
                  <List divided>
                    <List.Item className="summary">
                      <List.Icon
                        name="user"
                        size="large"
                        verticalAlign="middle"
                        color="purple"
                      />
                      <List.Content>
                        <List.Header
                          as="p"
                          className={`${locale === 'ar' ? 'ar-font' : 'en-font'}`}
                        >
                          {messages['booking.details.customerName']} :{' '}
                          {bookingDetails.customerName}
                        </List.Header>
                      </List.Content>
                    </List.Item>
                  </List>
                </Segment>
              </Grid.Column>
              <Grid.Column style={{ padding: '0em 0.18em' }} width={8}>
                <Segment raised>
                  <List divided>
                    <List.Item className="summary">
                      <List.Icon
                        name="mobile alternate"
                        size="large"
                        verticalAlign="middle"
                        color="purple"
                      />
                      <List.Content>
                        <List.Header
                          as="p"
                          className={`${locale === 'ar' ? 'ar-font' : 'en-font'}`}
                        >
                          {messages['booking.details.customerNumber']} :{' '}
                          {bookingDetails.customerMobile}
                        </List.Header>
                      </List.Content>
                    </List.Item>
                  </List>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          {/* END Customer-Details */}
          {/* Start Service prica and duration-Details */}
          <Grid columns={2} style={{ color: '#535B66', margin: '0px' }}>
            <Grid.Row stretched style={{ paddingBottom: '0px', paddingTop: '0.30em' }}>
              <Grid.Column style={{ padding: '0em 0.18em' }}>
                <Segment raised>
                  <List divided>
                    <List.Item className="summary">
                      <List.Icon
                        name="money"
                        size="large"
                        verticalAlign="middle"
                        color="purple"
                      />
                      <List.Content>
                        <List.Header
                          as="p"
                          className={`${locale === 'ar' ? 'ar-font' : 'en-font'}`}
                        >
                          {messages['booking.details.bookingPrice']} :{' '}
                          {bookingDetails.bookingPrice}
                          {bookingDetails.currency || messages['common.currency']}
                        </List.Header>
                      </List.Content>
                    </List.Item>
                  </List>
                </Segment>
              </Grid.Column>
              <Grid.Column style={{ padding: '0em 0.18em' }}>
                <Segment raised>
                  <List divided>
                    <List.Item className="summary">
                      <List.Icon
                        name="time"
                        size="large"
                        verticalAlign="middle"
                        color="purple"
                      />
                      <List.Content>
                        <List.Header
                          as="p"
                          className={`${locale === 'ar' ? 'ar-font' : 'en-font'}`}
                        >
                          {messages['booking.details.serviceDuration']} :{' '}
                          {formatDuration(
                            bookingDetails.serviceDuration,
                            locale,
                            messages,
                          )}
                        </List.Header>
                      </List.Content>
                    </List.Item>
                  </List>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          {/* END Service prica and duration-Details */}
          {/* Start Payment-Details */}
          <Grid columns={2} style={{ color: '#535B66', margin: '0px' }}>
            <Grid.Row stretched style={{ paddingBottom: '0px', paddingTop: '0.30em' }}>
              <Grid.Column style={{ padding: '0em 0.18em' }} width={8}>
                <Segment raised>
                  <List divided>
                    <List.Item className="summary">
                      <List.Icon
                        name="user"
                        size="large"
                        verticalAlign="middle"
                        color="purple"
                      />
                      <List.Content>
                        <List.Header
                          as="p"
                          className={`${locale === 'ar' ? 'ar-font' : 'en-font'}`}
                        >
                          {messages['booking.details.paymentMethod']} :{' '}
                          {bookingDetails.paymentMethodId === 1 &&
                            messages['common.cash']}
                          {bookingDetails.paymentMethodId === 2 &&
                            messages['common.mada']}
                          {bookingDetails.paymentMethodId === 3 &&
                            messages['common.applePay']}
                        </List.Header>
                      </List.Content>
                    </List.Item>
                  </List>
                </Segment>
              </Grid.Column>
              <Grid.Column style={{ padding: '0em 0.18em' }} width={8}>
                <Segment raised>
                  <List divided>
                    <List.Item className="summary">
                      <List.Icon
                        name="male"
                        size="large"
                        verticalAlign="middle"
                        color="purple"
                      />
                      <List.Content>
                        <List.Header
                          as="p"
                          className={`${locale === 'ar' ? 'ar-font' : 'en-font'}`}
                        >
                          {messages['booking.details.employeeName']} :{' '}
                          {bookingDetails.employeeName}
                        </List.Header>
                      </List.Content>
                    </List.Item>
                  </List>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          {/* END Payment and employee-Details */}
          {/* Start isQueue && queue or appointment Details */}
          <Grid columns={2} style={{ color: '#535B66', margin: '0px' }}>
            <Grid.Row stretched style={{ paddingBottom: '0px', paddingTop: '0.30em' }}>
              <Grid.Column style={{ padding: '0em 0.18em' }} width={8}>
                <Segment raised>
                  <List divided>
                    <List.Item className="summary">
                      <List.Icon
                        name="tag"
                        size="large"
                        verticalAlign="middle"
                        color="purple"
                      />
                      <List.Content>
                        <List.Header
                          as="p"
                          className={`${locale === 'ar' ? 'ar-font' : 'en-font'}`}
                        >
                          {messages['booking.details.type']} :{' '}
                          {bookingDetails.employeeIsQueue
                            ? messages['common.queue']
                            : messages['common.appointment']}
                        </List.Header>
                      </List.Content>
                    </List.Item>
                  </List>
                </Segment>
              </Grid.Column>
              {bookingDetails.employeeIsQueue && bookingDetails.queueWaitingTime && (
                <Grid.Column style={{ padding: '0em 0.18em' }} width={8}>
                  <Segment raised>
                    <List divided>
                      <List.Item className="summary">
                        <List.Icon
                          name="category"
                          size="large"
                          verticalAlign="middle"
                          color="purple"
                        />
                        <List.Content>
                          <List.Header
                            as="p"
                            className={`${locale === 'ar' ? 'ar-font' : 'en-font'}`}
                          >
                            {bookingDetails.queueWaitingTime}
                          </List.Header>
                          <List.Description
                            as="p"
                            style={{ color: '#535B66' }}
                            className={`${locale === 'ar' ? 'ar-font' : 'en-font'}`}
                          ></List.Description>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Segment>
                </Grid.Column>
              )}
              {!bookingDetails.employeeIsQueue && bookingDetails.serviceTimeSlot && (
                <Grid.Column style={{ padding: '0em 0.18em' }} width={8}>
                  <Segment raised>
                    <List divided>
                      <List.Item className="summary">
                        <List.Icon
                          name="time"
                          size="large"
                          verticalAlign="middle"
                          color="purple"
                        />
                        <List.Content>
                          <List.Header
                            as="p"
                            className={`${locale === 'ar' ? 'ar-font' : 'en-font'}`}
                          >
                            {messages['booking.details.serviceTime']}{' '}
                            {messages['common.from']}
                            {formatTime(bookingDetails.serviceTimeSlot.from, locale)}{' '}
                            {messages['common.to']}{' '}
                            {formatTime(bookingDetails.serviceTimeSlot.to, locale)}
                          </List.Header>
                          <List.Description
                            as="p"
                            style={{ color: '#535B66' }}
                            className={`${locale === 'ar' ? 'ar-font' : 'en-font'}`}
                          ></List.Description>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Segment>
                </Grid.Column>
              )}
            </Grid.Row>
          </Grid>
          {/* END Customer-Details */}
          {/* Start Customer-Details */}
          {bookingDetails.long > 0 && bookingDetails.lat > 0 && (
            <a
              href={`http://maps.google.com/maps?q=${bookingDetails.lat},${bookingDetails.long}`}
              target="blank"
            >
              <Grid columns={1} style={{ color: '#535B66', margin: '0px' }}>
                <Grid.Row
                  stretched
                  style={{ paddingBottom: '0px', paddingTop: '0.30em' }}
                >
                  <Grid.Column style={{ padding: '0em 0.18em' }}>
                    <Segment raised>
                      <List divided>
                        <List.Item className="summary">
                          <List.Icon
                            name="map"
                            size="large"
                            verticalAlign="middle"
                            color="purple"
                          />
                          <List.Content>
                            <List.Header
                              as="p"
                              className={`${locale === 'ar' ? 'ar-font' : 'en-font'}`}
                            >
                              {messages['common.location']}
                            </List.Header>
                          </List.Content>
                        </List.Item>
                      </List>
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </a>
          )}
          {/* END Customer-Details */}
        </Segment>
      </Grid.Column>
    </Grid>
  );
}
