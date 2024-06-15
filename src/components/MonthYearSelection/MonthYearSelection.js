import React from 'react';
import { Dropdown, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

function MonthYearSelection({ year, month, setYear, setMonth }) {
  const handleSetYear = (e, { value }) => setYear(value);
  const handleSetMonth = (e, { value }) => setMonth(value);
  const date = new Date();
  const currentYear = date.getFullYear();
  const yearsOption = [];
  for (let i = 2019; i <= currentYear; i += 1) {
    yearsOption.unshift({ key: i, text: i.toString(), value: i });
  }
  const months = [
    { key: 1, text: <FormattedMessage id="january" />, value: 1 },
    { key: 2, text: <FormattedMessage id="febryary" />, value: 2 },
    { key: 3, text: <FormattedMessage id="march" />, value: 3 },
    { key: 4, text: <FormattedMessage id="april" />, value: 4 },
    { key: 5, text: <FormattedMessage id="may" />, value: 5 },
    { key: 6, text: <FormattedMessage id="june" />, value: 6 },
    { key: 7, text: <FormattedMessage id="july" />, value: 7 },
    { key: 8, text: <FormattedMessage id="august" />, value: 8 },
    { key: 9, text: <FormattedMessage id="september" />, value: 9 },
    { key: 10, text: <FormattedMessage id="october" />, value: 10 },
    { key: 11, text: <FormattedMessage id="november" />, value: 11 },
    { key: 12, text: <FormattedMessage id="december" />, value: 12 },
  ];
  return (
    <div>
      <Grid columns={2}>
        <Grid.Column>
          <Dropdown
            id="month"
            search
            onChange={handleSetMonth}
            options={months}
            placeholder={<FormattedMessage id="month" />}
            selection
            value={month}
          />
        </Grid.Column>
        <Grid.Column>
          <Dropdown
            id="year"
            search
            onChange={handleSetYear}
            options={yearsOption}
            placeholder={<FormattedMessage id="year" />}
            selection
            value={year}
          />
        </Grid.Column>
      </Grid>
    </div>
  );
}

MonthYearSelection.propTypes = {
  setYear: PropTypes.func,
  year: PropTypes.string,
  month: PropTypes.string,
  setMonth: PropTypes.func,
};
export default MonthYearSelection;
