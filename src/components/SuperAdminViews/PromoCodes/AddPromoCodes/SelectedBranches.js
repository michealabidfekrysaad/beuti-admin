/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { Table, TableRow, TableCell, TableBody, TableHead } from '@material-ui/core';
import { useIntl } from 'react-intl';
import BeutiButton from 'Shared/inputs/BeutiButton';
import SearchInput from 'components/shared/searchInput';
import moment from 'moment';

import TableAction from '../../../shared/TableAction';

const SelectedBranchesTable = ({
  selectedBranches,
  setSelectedBranches,
  setOpenModal,
}) => {
  const { messages } = useIntl();
  const [searchValue, setSearchValue] = useState('');
  const [filtedList, setFiltedList] = useState(selectedBranches);
  useEffect(() => {
    setFiltedList(
      selectedBranches.filter((branch) => branch?.name?.includes(searchValue)) ||
        branch.brand,
    );
  }, [searchValue]);
  useEffect(() => {
    setFiltedList(selectedBranches);
    setSearchValue('');
  }, [selectedBranches]);
  return (
    <>
      <section className="w-100 mb-3 row justify-content-between align-items-center">
        {selectedBranches.length >= 1 && (
          <div className="col-6">
            <SearchInput
              handleChange={setSearchValue}
              searchValue={searchValue}
              placeholder={messages['canbaner.search.branch']}
            />
          </div>
        )}
        <div className="col-auto">
          <BeutiButton
            text={messages['promocode.add.btn']}
            onClick={() => setOpenModal(true)}
          />
        </div>
      </section>
      {filtedList.length >= 1 && (
        <section className="beuti-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">{messages['common.ID']}</TableCell>
                <TableCell align="center">{messages['common.branchname']}</TableCell>
                <TableCell align="center">{messages['common.brandname']}</TableCell>
                <TableCell align="center">{messages['common.mobile number']}</TableCell>
                <TableCell align="center">
                  {messages['common.comissionpercentage']}
                </TableCell>
                <TableCell align="center">
                  {messages['table.spList.header.registrationDate']}
                </TableCell>
                <TableCell align="center" />
              </TableRow>
            </TableHead>
            <TableBody>
              {filtedList?.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell align="center">{branch.id}</TableCell>
                  <TableCell align="center">{branch.name || '-'}</TableCell>
                  <TableCell align="center">{branch.brandName || '-'}</TableCell>
                  <TableCell align="center">{branch.phoneNumber || '-'}</TableCell>
                  <TableCell align="center">
                    {branch.commissionPercentage || '-'}
                  </TableCell>
                  <TableCell align="center">
                    {moment(branch.registrationDate).format('DD/MM/yyyy') || '-'}
                  </TableCell>
                  <TableCell align="center">
                    <div className="beuti-table__actions">
                      <TableAction
                        icon="flaticon-delete"
                        onClick={() =>
                          setSelectedBranches(
                            selectedBranches.filter((ele) => ele.id !== branch.id),
                          )
                        }
                        name="common.delete"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}
    </>
  );
};

export default SelectedBranchesTable;
