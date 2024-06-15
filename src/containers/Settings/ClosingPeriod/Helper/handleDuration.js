/* eslint-disable indent */

import moment from 'moment';

export const handleDuration = (startDate, endDate) =>
  Math.ceil(
    moment
      .duration(
        moment(moment(endDate).format('YYYY-MM-DD')).diff(
          moment(moment(startDate).format('YYYY-MM-DD')),
        ),
      )
      .asDays(),
  ) +
    1 >
  0
    ? Math.ceil(
        moment
          .duration(
            moment(moment(endDate).format('YYYY-MM-DD')).diff(
              moment(moment(startDate).format('YYYY-MM-DD')),
            ),
          )
          .asDays(),
      ) + 1
    : false;
