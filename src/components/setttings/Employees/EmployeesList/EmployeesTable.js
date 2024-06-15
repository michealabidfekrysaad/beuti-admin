/* eslint-disable react/prop-types */

import { Table, TableRow, TableCell, TableBody, TableHead } from '@material-ui/core';

import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import React, { useContext } from 'react';
import { Image } from 'react-bootstrap';
import Rating from '@material-ui/lab/Rating';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { BranchesContext } from 'providers/BranchesSelections';
import TableAction from '../../../shared/TableAction';

const EmployeesTable = ({ employees, handleDelete, MultiBranchOwner }) => {
  const { messages } = useIntl();
  const history = useHistory();
  const { setBranches } = useContext(BranchesContext);

  return (
    <>
      <section className="beuti-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan="2">{messages['setting.employee.table.name']}</TableCell>
              <TableCell>{messages['setting.employee.table.title']}</TableCell>
              <TableCell>{messages['setting.employee.table.phone']}</TableCell>
              {MultiBranchOwner && (
                <TableCell>{messages['setting.employee.table.branch']}</TableCell>
              )}
              <TableCell>{messages['setting.employee.table.casher']}</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell colSpan="2">
                  <section className="employeetable-name">
                    <div className="employeetable-name__image">
                      <Image src={employee.image || toAbsoluteUrl('/Avatar.png')} />
                    </div>
                    <div className="employeetable-name__info">
                      <p>
                        <span>{employee.name}</span>
                        {employee.rate && (
                          <span className="employeetable-name__info-rate">
                            <Rating
                              name="half-rating-read"
                              defaultValue={0}
                              value={employee.rate / 5}
                              precision={0.1}
                              max={1}
                              readOnly
                            />
                            {employee.rate?.toFixed(1)}
                          </span>
                        )}
                      </p>

                      {employee.email && <p>{employee.email}</p>}
                    </div>
                  </section>
                </TableCell>
                <TableCell>{employee.title || '-'}</TableCell>
                <TableCell>{employee.mobileNumber || '-'}</TableCell>
                {MultiBranchOwner && (
                  <TableCell className="employeetable-name__info ">
                    <p>{employee.branchName || '-'}</p>
                    <p>{employee.branchAddress}</p>
                  </TableCell>
                )}
                <TableCell>
                  {employee.isCasher ? messages['common.yes'] : messages['common.no']}
                </TableCell>
                <TableCell align="center">
                  <TableAction
                    icon="flaticon-edit"
                    name="common.edit"
                    onClick={() => {
                      setBranches([employee.branchId]);
                      history.push(
                        `/settings/settingEmployees/editEmployee/${employee.id}`,
                      );
                    }}
                  />
                  <TableAction
                    icon="flaticon-delete"
                    onClick={() => handleDelete(employee.id)}
                    name="common.delete"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </>
  );
};

export default EmployeesTable;
