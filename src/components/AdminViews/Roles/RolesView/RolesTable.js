/* eslint-disable react/jsx-boolean-value */
import React from 'react';
import { useIntl } from 'react-intl';
import { Table, TableRow, TableCell, TableBody, TableHead } from '@material-ui/core';
import SVG from 'react-inlinesvg';
import TableLoader from 'components/shared/TableLoader';
import TableAction from 'components/shared/TableAction';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import PropTypes from 'prop-types';

export default function RolesTable({
  data,
  setOpenModal,
  setEditedItem,
  handleDeleteRow,
}) {
  const { messages } = useIntl();

  return (
    <section className="beuti-table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{messages['roles.table.role.name']}</TableCell>
            <TableCell>{messages['roles.table.emp.count']}</TableCell>
            <TableCell>{messages['roles.table.assigned.emp']}</TableCell>
            <TableCell align="center">{messages['products.table.actions']}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* repeat the rows */}
          <TableRow>
            <TableCell>cell-11</TableCell>
            <TableCell>cell-22</TableCell>
            <TableCell className="emp">
              <div className="emp__holder">
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">micheal abid</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
                <div className="emp__holder--cell">emp-1</div>
              </div>
            </TableCell>
            <TableCell align="center">
              <div className="beuti-table__actions">
                <TableAction
                  name="common.edit"
                  onClick={() => {
                    setOpenModal(true);
                    setEditedItem({});
                    // setBranches([prod?.branchId]);
                    // history.push(`/productList/productedit/${prod.id}`);
                  }}
                >
                  <SVG src={toAbsoluteUrl('/edit.svg')} />
                </TableAction>
                <TableAction
                  //   onClick={() => handleDeleteRow({ id: 1, name: 'micheal' })}
                  name="common.delete"
                  disabled={false}
                >
                  <SVG src={toAbsoluteUrl('/delete.svg')} />
                </TableAction>{' '}
              </div>
            </TableCell>
          </TableRow>
          {false && <TableLoader colSpan="6" />}
        </TableBody>
      </Table>
    </section>
  );
}

RolesTable.propTypes = {
  data: PropTypes.array,
  setOpenModal: PropTypes.func,
  setEditedItem: PropTypes.func,
  handleDeleteRow: PropTypes.func,
};
