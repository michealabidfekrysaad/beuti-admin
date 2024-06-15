/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { Table, TableRow, TableCell, TableBody, TableHead } from '@material-ui/core';
import { useIntl } from 'react-intl';
import BeutiButton from 'Shared/inputs/BeutiButton';
import { CallAPI } from 'utils/API/APIConfig';
import SearchInput from 'components/shared/searchInput';
import BeutiPagination from 'components/shared/BeutiPagination';

const CAServiceProviderTable = ({ setValue, watch }) => {
  const { messages } = useIntl();
  const [branches, setBranches] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [paginationController, setPaginationController] = useState({
    pagesMax: 10,
    pageNumber: 0,
  });
  const handleCheckById = () =>
    searchValue && !!searchValue.match(/^[0-9]*$/) ? `or id eq ${searchValue}` : '';
  CallAPI({
    name: [
      'getCustomerBannerAll',
      searchValue,
      paginationController.pageNumber,
      paginationController.pagesMax,
    ],
    url: '/BannerServiceProviderOData',
    baseURL: process.env.REACT_APP_ODOMAIN,
    enabled: true,
    select: (data) => data.data.data.list,
    onSuccess: (list) => {
      setBranches(list);
    },
    refetchOnWindowFocus: false,
    query: {
      $skip: paginationController.pageNumber * paginationController.pagesMax,
      $top: paginationController.pagesMax,
      $filter: `contains(name,'${searchValue}') or contains(phoneNumber,'${searchValue}') or contains(brandName,'${searchValue}') ${handleCheckById()}`,
    },
  });
  const { data: countData } = CallAPI({
    name: ['getCustomerBannerCount', searchValue],
    url: '/BannerServiceProviderOData/$count?',
    baseURL: process.env.REACT_APP_ODOMAIN,
    enabled: true,
    select: (data) => data.data.data.list,
    refetchOnWindowFocus: false,
    query: {
      $filter: `contains(name,'${searchValue}') or contains(phoneNumber,'${searchValue}') or contains(brandName,'${searchValue}') ${handleCheckById()}`,
    },
  });
  useEffect(() => {
    if (searchValue !== null) {
      setPaginationController({
        ...paginationController,
        pageNumber: 0,
      });
    }
  }, [searchValue]);
  return (
    <>
      <section className="w-50 mb-3">
        <SearchInput
          handleChange={setSearchValue}
          searchValue={searchValue}
          placeholder={messages['canbaner.search.branch']}
        />
      </section>
      <section className="beuti-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{messages['common.branchname']}</TableCell>
              <TableCell>{messages['common.mobile number']}</TableCell>
              <TableCell align="center">{messages['common.ID']}</TableCell>
              <TableCell align="center" />
            </TableRow>
          </TableHead>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell>{branch.name || '-'}</TableCell>
                <TableCell>{branch.phoneNumber || '-'}</TableCell>
                <TableCell align="center">{branch.id}</TableCell>
                <TableCell align="center">
                  <BeutiButton
                    disabled={watch('branch')?.id === branch.id}
                    text={messages['common.select']}
                    onClick={() => {
                      setValue('promoCodeId', null);
                      setValue('branch', branch);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
      {countData > 10 && (
        <section className="beuti-table__footer">
          <BeutiPagination
            count={countData}
            setPaginationController={setPaginationController}
            paginationController={paginationController}
          />
        </section>
      )}
    </>
  );
};

export default CAServiceProviderTable;
