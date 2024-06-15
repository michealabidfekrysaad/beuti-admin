import React from 'react';
import PropTypes from 'prop-types';
import { formatTime, dayEquivalent } from 'functions/timeFunctions';
import { useIntl } from 'react-intl';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
} from '@material-ui/core';

export const WorkingDaysTable = ({ workDaysList }) => {
  const { locale, messages } = useIntl();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Paper className="table-boxshadow">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  {messages['sAdmin.spDetails.workingDays.table.day']}
                </TableCell>
                <TableCell align="center">
                  {messages['sAdmin.spDetails.workingDays.table.startTime']}
                </TableCell>
                <TableCell align="center">
                  {messages['sAdmin.spDetails.workingDays.table.endTime']}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workDaysList.map(({ day, startTime, endTime }) => (
                <TableRow key={day}>
                  <TableCell align="center">{dayEquivalent(day, locale)}</TableCell>
                  <TableCell align="center"> {formatTime(startTime, locale)}</TableCell>
                  <TableCell align="center">{formatTime(endTime, locale)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
};

WorkingDaysTable.propTypes = {
  workDaysList: PropTypes.array,
};
