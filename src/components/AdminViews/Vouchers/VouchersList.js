import React, { useContext, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { Routes } from 'constants/Routes';
import { BranchesContext } from 'providers/BranchesSelections';
import BeutiButton from 'Shared/inputs/BeutiButton';
import { useHistory, useParams } from 'react-router-dom';
import BeutiPagination from 'components/shared/BeutiPagination';
import { CallAPI } from '../../../utils/API/APIConfig';

import VouchersTable from './VoucherList/VouchersTable';
import NoOffersYet from './VoucherList/NoVouchersYet';
import { slicePagination } from '../../../functions/SlicePagination';
import './Voucher.scss';
import MultiSelectDD from '../../shared/MultiSelectDD';
const VouchersList = () => {
  const { messages } = useIntl();
  const { page } = useParams();
  const history = useHistory();
  const { branches } = useContext(BranchesContext);
  const [paginationController, setPaginationController] = useState({
    pagesMax: 10,
    pageNumber: +page || 0,
  });
  const [statusFilterationValue, setStatusFilterationValue] = useState([1, 2]);
  const [allVouchers, setAllVouchers] = useState([]);

  const { data: vouchers, isFetching } = CallAPI({
    name: 'getAllVouchers',
    url: '/Voucher/getAll',
    enabled: true,
    select: (data) => data.data.data.list,
    refetchOnWindowFocus: false,
  });

  /* -------------------------------------------------------------------------- */
  /*                             Search In Products                            */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    history.push(`/voucherList/${paginationController.pageNumber}`);
  }, [paginationController]);
  useEffect(() => {
    if (branches) {
      setPaginationController({
        ...paginationController,
        pageNumber: 0,
      });
    }
  }, [branches]);

  /* -------------------------------------------------------------------------- */
  /*                                   Delete                                   */
  /* -------------------------------------------------------------------------- */

  const statusFilteration = [
    { id: 1, label: messages['offers.table.status.upcoming'] },
    { id: 2, label: messages['offers.table.status.active'] },
    { id: 3, label: messages['offers.table.status.expired'] },
  ];
  useEffect(() => {
    if (vouchers?.length) {
      setPaginationController({
        ...paginationController,
        pageNumber: 0,
      });

      if (!statusFilterationValue.length) {
        return setAllVouchers(vouchers);
      }

      return setAllVouchers(
        vouchers.filter(
          (voucher) =>
            !!statusFilterationValue.find((selected) => +selected === +voucher.status),
        ),
      );
    }
    return null;
  }, [statusFilterationValue, vouchers]);
  return (
    <Row className="settings">
      <Col xs="12">
        <Row className="justify-content-between align-items-center py-3">
          <Col xs="auto">
            <h3 className="settings__section-title">{messages['voucher.title']}</h3>
            <p className="settings__section-description">
              {messages['voucher.description']}
            </p>
          </Col>

          <Col xs="auto" className="d-flex">
            <BeutiButton
              text={messages['voucher.addVoucher']}
              type="button"
              className="settings-employee_header-add"
              onClick={() => history.push(Routes.addVoucher)}
            />
          </Col>
        </Row>
        <Row className="mb-3 justify-content-between align-items-center">
          <Col />
          <Col xs="2">
            <MultiSelectDD
              list={statusFilteration}
              selectedStatus={statusFilterationValue}
              setSelectedStatus={setStatusFilterationValue}
              className="w-100"
            />
          </Col>
        </Row>
      </Col>
      {(!!allVouchers?.length || isFetching) && (
        <Col xs="12">
          <VouchersTable
            vouchers={slicePagination(
              allVouchers,
              paginationController.pagesMax,
              paginationController.pageNumber,
            )}
            vouchersLoading={isFetching}
          />
          {allVouchers?.length > 10 && (
            <section className="beuti-table__footer">
              <BeutiPagination
                count={allVouchers?.length}
                setPaginationController={setPaginationController}
                paginationController={paginationController}
              />
            </section>
          )}
        </Col>
      )}
      {!allVouchers?.length && !isFetching && (
        <Col xs="12">
          <NoOffersYet />
        </Col>
      )}
    </Row>
  );
};

export default VouchersList;
