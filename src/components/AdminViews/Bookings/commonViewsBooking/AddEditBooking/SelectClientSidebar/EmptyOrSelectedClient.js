import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import ClientItem from './ClientItem';

const EmptyOrSelectedClient = ({
  booking,
  setBooking,
  allClients = [],
  newClient,
  seNewClient = () => {},
  salesPage = false,
}) => {
  const { messages } = useIntl();
  return (
    <>
      {booking?.brandCustomerId ? (
        <section className="booking-sidebar__clients-result--allClients">
          <ClientItem
            client={
              newClient ||
              allClients?.find(
                (client) =>
                  client?.id === booking?.brandCustomerId ||
                  client?.customerId === booking?.brandCustomerId,
              )
            }
            // client={booking?.customer}
            onClick={(clientData) => {
              setBooking({
                ...booking,
                brandCustomerId: '',
                customer: {},
              });
              seNewClient(false);
            }}
            selected
            salesPage={salesPage}
          />
        </section>
      ) : (
        !salesPage && (
          <div className="booking-sidebar__clients-result--empty">
            <p>{messages['booking.flow.client.hint']}</p>
          </div>
        )
      )}
    </>
  );
};
EmptyOrSelectedClient.propTypes = {
  booking: PropTypes.object,
  setBooking: PropTypes.func,
  allClients: PropTypes.array,
  newClient: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  seNewClient: PropTypes.func,
  salesPage: PropTypes.bool,
};
export default EmptyOrSelectedClient;
