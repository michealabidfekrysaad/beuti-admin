import React from 'react';
import PropTypes from 'prop-types';
import { Statistic } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

const SingleStatistic = ({ val, msgId }) => (
  <Statistic color="purple">
    <Statistic.Value>{val}</Statistic.Value>
    <Statistic.Label>
      <FormattedMessage id={msgId} />
    </Statistic.Label>
  </Statistic>
);

SingleStatistic.propTypes = {
  val: PropTypes.any,
  msgId: PropTypes.string,
};

export default SingleStatistic;
