/* eslint-disable */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Col, Modal, Row } from 'react-bootstrap';
import moment from 'moment';
import { TableCell, TableRow, TableHead, Table, TableBody } from '@material-ui/core';
import SearchInput from '../../../shared/searchInput';
import { CallAPI } from '../../../../utils/API/APIConfig';
import BeutiPagination from '../../../shared/BeutiPagination';
import BeutiButton from '../../../../Shared/inputs/BeutiButton';
import RangeDateSelect from 'Shared/inputs/RangeDateSelect';
import { toADayFormat } from 'functions/MomentHandlers';
import {
  handleCheckById,
  handleCheckByDate,
  handleCheckByCommission,
} from './QueryHelper';
import BeutiInput from 'Shared/inputs/BeutiInput';

export function ServiceProvidersModal({
  openModal,
  setOpenModal,
  selectedBranches,
  setSelectedBranches,
}) {
  const { messages } = useIntl();
  const [selectedDate, setSelectedDate] = useState({
    start: moment(new Date(2015, 0, 1)).format('YYYY-MM-DD'),
    end: moment(new Date()).format('YYYY-MM-DD'),
  });
  const [branches, setBranches] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [paginationController, setPaginationController] = useState({
    pagesMax: 10,
    pageNumber: 0,
  });
  const [selectedCommission, setSelectedCommission] = useState({
    min: 0,
    max: 100,
  });
  const handleChangeDate = ([startDay, endDay]) => {
    setSelectedDate({
      ...selectedDate,
      start: toADayFormat(startDay),
      end: endDay && toADayFormat(endDay),
    });
  };
  CallAPI({
    name: [
      'getCustomerBannerAll',
      searchValue,
      paginationController.pageNumber,
      paginationController.pagesMax,
      selectedDate.start,
      selectedDate.end,
      selectedCommission.min,
      selectedCommission.max,
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
      $filter: `(contains(name,'${searchValue}') or contains(phoneNumber,'${searchValue}') or contains(brandName,'${searchValue}') ${handleCheckById(
        searchValue,
      )}) ${handleCheckByDate(
        selectedDate.start,
        selectedDate.end,
      )} ${handleCheckByCommission(selectedCommission.min, selectedCommission.max)}`,
    },
  });
  const { data: countData } = CallAPI({
    name: [
      'getCustomerBannerCount',
      searchValue,
      paginationController.pagesMax,
      selectedDate.start,
      selectedDate.end,
      selectedCommission.min,
      selectedCommission.max,
    ],
    url: '/BannerServiceProviderOData/$count?',
    baseURL: process.env.REACT_APP_ODOMAIN,
    enabled: true,
    select: (data) => data.data.data.list,
    refetchOnWindowFocus: false,
    query: {
      $filter: `(contains(name,'${searchValue}') or contains(phoneNumber,'${searchValue}') or contains(brandName,'${searchValue}') ${handleCheckById(
        searchValue,
      )}) ${handleCheckByDate(
        selectedDate.start,
        selectedDate.end,
      )} ${handleCheckByCommission(selectedCommission.min, selectedCommission.max)}`,
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
      <Modal
        onHide={() => {
          setOpenModal(false);
        }}
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing serviceprovider-list"
      >
        <Modal.Body>
          {' '}
          <>
            <Row className="mb-1 align-items-end justify-content-between">
              <Col xs="4">
                <SearchInput
                  handleChange={setSearchValue}
                  searchValue={searchValue}
                  placeholder={messages['canbaner.search.branch']}
                  className="mb-1"
                />
              </Col>
              <Col xs="3">
                <div className="beuti-date-range-input">
                  <label className="beuti-input__label" htmlFor="text">
                    {messages['table.spList.header.registrationDate']}
                  </label>
                  <RangeDateSelect
                    startDate={new Date(selectedDate.start)}
                    endDate={selectedDate.end && new Date(selectedDate.end)}
                    onChange={handleChangeDate}
                  />
                </div>
              </Col>
              <Col xs="auto">
                <Row className="align-items-end">
                  <Col xs="5">
                    <BeutiInput
                      type="text"
                      label={messages['common.comissionpercentage']}
                      value={selectedCommission.min}
                      onChange={(e) =>
                        setSelectedCommission({
                          ...selectedCommission,
                          min: e.target.value,
                        })
                      }
                    />
                  </Col>
                  <Col xs="auto" className="mb-3">
                    {messages['common.to']}
                  </Col>
                  <Col xs="5">
                    <BeutiInput
                      type="text"
                      value={selectedCommission.max}
                      onChange={(e) =>
                        setSelectedCommission({
                          ...selectedCommission,
                          max: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            <section className="beuti-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">{messages['common.ID']}</TableCell>
                    <TableCell align="center">{messages['common.branchname']}</TableCell>
                    <TableCell align="center">{messages['common.brandname']}</TableCell>
                    <TableCell align="center">
                      {messages['common.mobile number']}
                    </TableCell>
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
                  {branches.map((branch) => (
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
                        <BeutiButton
                          disabled={selectedBranches.find(({ id }) => id === branch.id)}
                          text={messages['common.select']}
                          onClick={() => {
                            setSelectedBranches([...selectedBranches, branch]);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>
          </>
          {countData > 10 && (
            <section className="beuti-table__footer">
              <BeutiPagination
                count={countData}
                setPaginationController={setPaginationController}
                paginationController={paginationController}
              />
            </section>
          )}
        </Modal.Body>
        <Modal.Footer className="pt-3">
          <button
            type="button"
            className="px-4 cancel"
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <FormattedMessage id="common.cancel" />
          </button>
          <button
            type="button"
            onClick={() => {
              setOpenModal(false);
            }}
            className="px-4 confirm"
          >
            <FormattedMessage id="common.confirm" />
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ServiceProvidersModal.propTypes = {
  setPayload: PropTypes.func,
  Id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  selectedBranches: PropTypes.array,
  setSelectedBranches: PropTypes.func,
};
