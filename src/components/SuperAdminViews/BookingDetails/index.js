/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingProfile } from 'components/shared/Shimmer';
import {
  List,
  Header,
  Grid,
  Message,
  Segment,
  Label,
  Button,
  Modal,
  Icon,
} from 'semantic-ui-react';
import useApi, { get, put } from 'hooks/useAPI';
import { expectedObj } from 'components/SuperAdminViews/BookingDetails/BookingObj';
import { useIntl } from 'react-intl';
import { formatDate } from 'functions/formatTableData';
import { formatTime } from 'functions/timeFunctions';
import { bookingStatus } from 'constants/bookingStatus';
import { AppointmentServicesView, QueueServicesView } from './views';

export function BookingDetails() {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(expectedObj);
  const [desiredStatus, setDesiredStatus] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [pendingToCancelled, setPendingToCancelled] = useState(false);
  const [pendingToConfirmed, setPendingToConfirmed] = useState(false);
  const [pendingToClosed, setPendingToClosed] = useState(false);
  const style = { color: '#535B66', margin: '0px' };

  const { messages, locale } = useIntl();
  const bookDetailApi = `Booking/getBookingDetails?bookingId=${bookingId}`;
  const { response: bookingDetailsRes, isLoading, setRecall: request } = useApi(
    get,
    bookDetailApi,
  );
  const { response: toggleStateRes, setRecall: toggleState } = useApi(
    put,
    `Booking/updateBookingStatus?bookingId=${bookingId}&bookingStatus=${desiredStatus}`,
  );

  useEffect(() => {
    if (toggleStateRes && toggleStateRes.data) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        request(true);
      }, 3000);
    }
    if (toggleStateRes && toggleStateRes.error) {
      setError(toggleStateRes.error.message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, [toggleStateRes]);

  useEffect(() => {
    if (desiredStatus) {
      toggleState(true);
      setPendingToClosed(false);
      setPendingToCancelled(false);
      setPendingToConfirmed(false);
    }
  }, [desiredStatus]);

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
      case bookingStatus.Confirmed:
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
        <Segment raised>
          {success && (
            <Message positive header={messages['admin.settings.booking.success']} />
          )}
          {error && <Message error header={error} />}
          <Label as="span" color={bookingStatusColor()} ribbon>
            {bookingDetails.bookingStatus.name}
          </Label>
          {/* Start SP-Details */}
          <Header as="h2" color="purple">
            {bookingDetails.serviceName}
          </Header>
          {bookingDetails.bookingStatus.id === 1 ||
            (bookingDetails.bookingStatus.id === 7 && (
              <Segment textAlign="center" basic>
                {bookingDetails.bookingStatus.id === 4 && (
                  <Button.Group>
                    <Modal
                      trigger={
                        <Button onClick={() => setPendingToCancelled(true)}>
                          {messages['change.to.cancelled']}
                        </Button>
                      }
                      basic
                      size="small"
                      open={pendingToCancelled}
                    >
                      <Header icon="warning sign" content={messages['changing.status']} />
                      <Modal.Content>
                        <p>{messages['confirm.toggleStatue.toCancelled']}</p>
                      </Modal.Content>
                      <Modal.Actions>
                        <Button
                          basic
                          color="red"
                          inverted
                          onClick={() => setPendingToCancelled(false)}
                        >
                          <Icon name="remove" /> {messages['common.cancel']}
                        </Button>
                        <Button
                          color="green"
                          inverted
                          onClick={() => setDesiredStatus(2)}
                        >
                          <Icon name="checkmark" /> {messages['common.confirm']}
                        </Button>
                      </Modal.Actions>
                    </Modal>
                    <Button.Or />
                    <Modal
                      trigger={
                        <Button onClick={() => setPendingToConfirmed(true)}>
                          {messages['change.to.confirmed']}
                        </Button>
                      }
                      basic
                      size="small"
                      open={pendingToConfirmed}
                    >
                      <Header icon="warning sign" content={messages['changing.status']} />
                      <Modal.Content>
                        <p>{messages['confirm.toggleStatue.toConfirmed']}</p>
                      </Modal.Content>
                      <Modal.Actions>
                        <Button
                          basic
                          color="red"
                          inverted
                          onClick={() => setPendingToConfirmed(false)}
                        >
                          <Icon name="remove" /> {messages['common.cancel']}
                        </Button>
                        <Button
                          color="green"
                          inverted
                          onClick={() => setDesiredStatus(1)}
                        >
                          <Icon name="checkmark" /> {messages['common.confirm']}
                        </Button>
                      </Modal.Actions>
                    </Modal>
                  </Button.Group>
                )}
                {bookingDetails.bookingStatus.id === 1 && (
                  <Button.Group>
                    <Modal
                      trigger={
                        <Button onClick={() => setPendingToCancelled(true)}>
                          {messages['change.to.cancelled']}
                        </Button>
                      }
                      basic
                      size="small"
                      open={pendingToCancelled}
                    >
                      <Header icon="warning sign" content={messages['changing.status']} />
                      <Modal.Content>
                        <p>{messages['confirm.toggleStatue.toCancelled']}</p>
                      </Modal.Content>
                      <Modal.Actions>
                        <Button
                          basic
                          color="red"
                          inverted
                          onClick={() => setPendingToCancelled(false)}
                        >
                          <Icon name="remove" /> {messages['common.cancel']}
                        </Button>
                        <Button
                          color="green"
                          inverted
                          onClick={() => setDesiredStatus(2)}
                        >
                          <Icon name="checkmark" /> {messages['common.confirm']}
                        </Button>
                      </Modal.Actions>
                    </Modal>
                    <Button.Or />
                    <Modal
                      trigger={
                        <Button onClick={() => setPendingToClosed(true)}>
                          {messages['change.to.closed']}
                        </Button>
                      }
                      basic
                      size="small"
                      open={pendingToClosed}
                    >
                      <Header icon="warning sign" content={messages['changing.status']} />
                      <Modal.Content>
                        <p>{messages['confirm.toggleStatue.toClosed']}</p>
                      </Modal.Content>
                      <Modal.Actions>
                        <Button
                          basic
                          color="red"
                          inverted
                          onClick={() => setPendingToClosed(false)}
                        >
                          <Icon name="remove" /> {messages['common.cancel']}
                        </Button>
                        <Button
                          color="green"
                          inverted
                          onClick={() => setDesiredStatus(3)}
                        >
                          <Icon name="checkmark" /> {messages['common.confirm']}
                        </Button>
                      </Modal.Actions>
                    </Modal>
                  </Button.Group>
                )}
              </Segment>
            ))}
          <Grid columns={2} style={style}>
            <Grid.Row stretched style={{ paddingBottom: '0px', paddingTop: '0.30em' }}>
              <Grid.Column style={{ padding: '0em 0.18em' }} width={8}>
                <Segment raised>
                  <List divided>
                    <List.Item className="summary">
                      <List.Icon
                        name="certificate"
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
                          {messages['booking.details.spNumber']} :
                          {bookingDetails.spMobile}
                        </List.Header>
                      </List.Content>
                    </List.Item>
                  </List>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid columns={2} style={style}>
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
                          {bookingDetails.customerName ||
                            (bookingDetails &&
                              bookingDetails.anonymousUser &&
                              bookingDetails.anonymousUser.name)}
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
                          {bookingDetails.customerMobile ||
                            bookingDetails.anonymousUser.phone}
                        </List.Header>
                      </List.Content>
                    </List.Item>
                  </List>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid columns={2} style={style}>
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
            </Grid.Row>
          </Grid>
          <Grid columns={2} style={style}>
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
                          {bookingDetails.isQueue
                            ? messages['common.queue']
                            : messages['common.appointment']}
                        </List.Header>
                      </List.Content>
                    </List.Item>
                  </List>
                </Segment>
              </Grid.Column>
              {bookingDetails.long > 0 && bookingDetails.lat > 0 && (
                <Grid.Column style={{ padding: '0em 0.18em' }}>
                  <a
                    href={`http://maps.google.com/maps?q=${bookingDetails.lat},${bookingDetails.long}`}
                    target="blank"
                  >
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
                  </a>
                </Grid.Column>
              )}
            </Grid.Row>
          </Grid>
        </Segment>
        {bookingDetails.isQueue ? (
          <QueueServicesView services={bookingDetails.queueServices} />
        ) : (
          <AppointmentServicesView services={bookingDetails.appointmentsServices} />
        )}
      </Grid.Column>
    </Grid>
  );
}
