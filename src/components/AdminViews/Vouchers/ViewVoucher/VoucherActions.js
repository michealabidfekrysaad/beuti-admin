import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import BeutiButton from 'Shared/inputs/BeutiButton';
import SearchInput from 'components/shared/searchInput';
import { VIEW_VOUCHER_MODE, EDIT_VOUCHER_MODE } from '../Helper/Modes';

const VoucherActions = ({
  mode,
  getVoucherLoading,
  setSearchValue,
  searchValue,
  setMode,
  voucher,
  setOpenDeleteModal,
}) => {
  const { messages } = useIntl();
  return (
    <Row className="align-items-center justify-content-between">
      <Col lg={8} md={6} xs={12} className="mb-3">
        <h3 className="voucherdetails__title">
          {mode === VIEW_VOUCHER_MODE
            ? messages['sidebar.sadmin.customerList']
            : messages['voucher.send']}
        </h3>
      </Col>
      {mode === VIEW_VOUCHER_MODE ? (
        <Col xs="4" className="voucherdetails__price mb-3">
          <button
            type="button"
            className="voucherdetails__delete"
            disabled={getVoucherLoading || !!voucher?.customers?.length}
            onClick={() => setOpenDeleteModal(true)}
          >
            {messages['voucher.delete']}
          </button>
          <BeutiButton
            text={messages['voucher.send']}
            type="button"
            disabled={getVoucherLoading || voucher?.status !== 2}
            loading={getVoucherLoading}
            className="voucherdetails__send"
            onClick={() => setMode(EDIT_VOUCHER_MODE)}
          />
        </Col>
      ) : (
        <Col xs="3" className="mb-3">
          <SearchInput
            handleChange={setSearchValue}
            searchValue={searchValue}
            placeholder={messages['setting.customer.search']}
          />
        </Col>
      )}
    </Row>
  );
};
VoucherActions.propTypes = {
  mode: PropTypes.bool,
  searchValue: PropTypes.string,
  setSearchValue: PropTypes.func,
  setMode: PropTypes.func,
  getVoucherLoading: PropTypes.bool,
  voucher: PropTypes.object,
  setOpenDeleteModal: PropTypes.func,
};
export default VoucherActions;
