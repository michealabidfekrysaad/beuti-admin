import React from 'react';
import PropTypes from 'prop-types';
import { Statistic } from 'semantic-ui-react';
import { useIntl } from 'react-intl';

export const SPStatistics = ({
  totalBooking,
  totalClients,
  totalCommission,
  totalProfit,
  totalServices,
}) => {
  const { messages } = useIntl();
  return (
    <Statistic.Group widths="four">
      <Statistic>
        <Statistic.Value>{totalBooking}</Statistic.Value>
        <Statistic.Label>
          {messages['table.spList.header.noOfTotalBooking']}
        </Statistic.Label>
      </Statistic>

      <Statistic>
        <Statistic.Value>{totalClients}</Statistic.Value>
        <Statistic.Label>
          {messages['common.totals']}
          <br />
          {messages['common.clients']}
        </Statistic.Label>
      </Statistic>

      <Statistic>
        <Statistic.Value>{totalCommission}</Statistic.Value>
        <Statistic.Label>{messages['common.commission']}</Statistic.Label>
      </Statistic>

      <Statistic>
        <Statistic.Value>{totalServices}</Statistic.Value>
        <Statistic.Label>{messages['common.servicesCount']}</Statistic.Label>
      </Statistic>
      <Statistic>
        <Statistic.Value>{totalProfit}</Statistic.Value>
        <Statistic.Label>{messages['common.totalProfit']}</Statistic.Label>
      </Statistic>
    </Statistic.Group>
  );
};

SPStatistics.propTypes = {
  totalBooking: PropTypes.number,
  totalClients: PropTypes.number,
  totalCommission: PropTypes.number,
  totalProfit: PropTypes.number,
  totalServices: PropTypes.number,
};
