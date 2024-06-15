import React from 'react';
import { Table } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { formatData } from 'functions/formatTableData';

function QueueServicesView({ services }) {
  const qservice = 'queue.service.booking.details';
  const { messages, locale } = useIntl();
  // eslint-disable-next-line no-console

  const tableGuide = [
    { data: 'serviceId', message: messages[`${qservice}.serviceId`] },
    { data: 'serviceName', message: messages[`${qservice}.serviceName`] },
    { data: 'serviceDuration', message: messages[`${qservice}.serviceDuration`] },
    { data: 'servicePrice', message: messages[`${qservice}.servicePrice`] },
    { data: 'employeeName', message: messages[`${qservice}.employeeName`] },
    { data: 'queueNumber', message: messages[`${qservice}.queueNumber`] },
    // { data: 'queueWaitingTime', message: messages[`${qservice}.queueWaitingTime`] },
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

QueueServicesView.propTypes = {
  services: PropTypes.array,
};

export default QueueServicesView;
