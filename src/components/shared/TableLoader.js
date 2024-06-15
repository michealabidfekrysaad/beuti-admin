import React from 'react';
import { TableRow, TableCell, CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

const TableLoader = ({ colSpan, noData }) => {
  const { messages } = useIntl();
  return (
    <TableRow className="loader">
      <TableCell align="center" colSpan={colSpan} className="pt-5">
        {noData ? (
          messages['common.noDataFound']
        ) : (
          <CircularProgress size={24} className="mx-auto" color="secondary" />
        )}
      </TableCell>
    </TableRow>
  );
};

TableLoader.propTypes = {
  colSpan: PropTypes.string,
  noData: PropTypes.bool,
};

export default TableLoader;
