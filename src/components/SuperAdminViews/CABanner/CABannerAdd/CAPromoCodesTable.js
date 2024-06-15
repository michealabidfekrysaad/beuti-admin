/* eslint-disable react/prop-types */

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  MenuItem,
  FormControl,
  Select,
} from '@material-ui/core';
import { useIntl } from 'react-intl';
import BeutiButton from 'Shared/inputs/BeutiButton';
import { CallAPI } from 'utils/API/APIConfig';
import Pagination from '@material-ui/lab/Pagination';
import SearchInput from '../../../shared/searchInput';

const CAPromoCodesTable = ({ setValue, watch }) => {
  const { messages } = useIntl();
  const [dataCount, setDataCount] = useState(0);
  const [filterdPromoCodes, setFilterPromoCodes] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pagesMax, setPagesMax] = useState(10);
  const [chunks, setChunks] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const { data: promoCodes } = CallAPI({
    name: 'getCustomerBannerAll',
    url: 'BookingPromoCode/ViewAll',
    enabled: true,
    onSuccess: (list) => setFilterPromoCodes(list),
    select: (data) =>
      data.data.data.list.filter((promocode) => promocode.promoCodeStatus === 2),
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (filterdPromoCodes) {
      const createdChunks = [];
      for (let i = 0; i < filterdPromoCodes.length; i += pagesMax) {
        if (filterdPromoCodes.length > pagesMax) {
          const temparray = filterdPromoCodes.slice(i, i + pagesMax);
          createdChunks.push(temparray);
          setPageNumber(0);
        } else {
          createdChunks.push(filterdPromoCodes.slice(i, i + filterdPromoCodes.length));
          setPageNumber(0);
        }
      }
      setChunks(createdChunks);
      setDataCount(Math.ceil(filterdPromoCodes.length / pagesMax));
    }
  }, [pagesMax, filterdPromoCodes]);

  useEffect(() => {
    setFilterPromoCodes(
      promoCodes?.filter(
        (promo) =>
          promo?.id?.toString()?.includes(searchValue) ||
          promo?.code?.includes(searchValue),
      ),
    );
  }, [searchValue]);
  return (
    <>
      <section className="w-50 mb-3">
        <SearchInput
          handleChange={setSearchValue}
          searchValue={searchValue}
          placeholder={messages['canbaner.search.promocode']}
        />
      </section>
      <section className="beuti-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell> {messages['promocodes.sidebar.promocode']}</TableCell>
              <TableCell>{messages['promocodes.percentage']}</TableCell>
              <TableCell align="center">{messages['common.ID']}</TableCell>
              <TableCell align="center" />
            </TableRow>
          </TableHead>
          <TableBody>
            {chunks[pageNumber]?.map((promoCode) => (
              <TableRow key={promoCode.id}>
                <TableCell>{promoCode.code}</TableCell>
                <TableCell>{promoCode.percentgeValue} %</TableCell>
                <TableCell align="center">{promoCode.id}</TableCell>
                <TableCell align="center">
                  <BeutiButton
                    disabled={watch('promoCodeId')?.id === promoCode.id}
                    text={messages['common.select']}
                    onClick={() => {
                      setValue('promoCodeId', promoCode);
                      setValue('branch', null);
                    }}
                  />{' '}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
      <section className="beuti-table__footer">
        {dataCount >= 1 && (
          <>
            <FormControl variant="outlined" className="maxPage-manage-categories">
              <Select
                value={pagesMax}
                onChange={(e) => {
                  setPagesMax(e.target.value);
                  setPageNumber(0);
                }}
                className="maxPage"
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>

            <Pagination
              count={dataCount}
              color="secondary"
              showFirstButton
              showLastButton
              className="mx-2"
              variant="outlined"
              shape="rounded"
              page={pageNumber + 1}
              onChange={(e, value) => setPageNumber(value - 1)}
            />
          </>
        )}
      </section>
    </>
  );
};

export default CAPromoCodesTable;
