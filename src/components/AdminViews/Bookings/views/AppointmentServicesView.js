import React from 'react';
import { Table } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { formatData } from 'functions/formatTableData';

function AppointmentServicesView({ services }) {
  const aservice = 'appointment.service.booking.details';
  const { messages, locale } = useIntl();

  const tableGuide = [
    { data: 'serviceId', message: messages[`${aservice}.serviceId`] },
    { data: 'serviceName', message: messages[`${aservice}.serviceName`] },
    { data: 'serviceDuration', message: messages[`${aservice}.serviceDuration`] },
    { data: 'servicePrice', message: messages[`${aservice}.servicePrice`] },
    { data: 'employeeName', message: messages[`${aservice}.employeeName`] },
    { data: 'serviceTimeSlot', message: messages[`${aservice}.timeSlots`] },
  ];

  return (
    <div>
      <Table unstackable color="purple" style={{ marginBottom: '3em' }}>
        <Table.Header fullWidth>
          <Table.Row>
            {tableGuide.map((el) => (
              <Table.HeaderCell key={el.data}>{el.message}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {services &&
            services.length > 0 &&
            services.map((pieceOfData) => (
              <Table.Row key={pieceOfData.Id}>
                {tableGuide.map((rowData) => (
                  <Table.Cell key={rowData.data}>
                    {formatData(pieceOfData, rowData, locale, null, messages)}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </div>
  );
}

AppointmentServicesView.propTypes = {
  services: PropTypes.array,
};

export default AppointmentServicesView;
