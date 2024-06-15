import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { formatDate } from 'functions/timeFunctions';
import { statusColorForWord } from 'functions/statusColor';

const GiftCardListDetails = ({ open, setOpen, currentGift }) => {
  const { locale, messages } = useIntl();
  const listScopeHeader = 'table.spList.header';
  return (
    <Modal
      onHide={() => setOpen(false)}
      show={open}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="bootstrap-modal-customizing"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter" className="title">
          {messages[`common.details`]}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ fontSize: '1.2rem' }}>
        <div className="row">
          <div className="col-12 m-2">
            <div className="row">
              <div className="col-lg-3 col-5">
                {messages[`${listScopeHeader}.gcUniqueNumber`]}
              </div>
              <div className="col-lg-9 col-7">{currentGift?.code}</div>
            </div>
          </div>
          <div className="col-12 m-2">
            <div className="row">
              <div className="col-lg-3 col-5">
                {messages[`${listScopeHeader}.recipientEmailNumber`]}
              </div>
              <div className="col-lg-9 col-7">
                {currentGift?.recipientEmail || currentGift?.recipientMobileNumber}{' '}
              </div>
            </div>
          </div>
          {currentGift?.redemptionDate && (
            <div className="col-12 m-2">
              <div className="row">
                <div className="col-lg-3 col-5">
                  {messages[`${listScopeHeader}.firstActivationDate`]}
                </div>
                <div className="col-lg-9 col-7">
                  {formatDate(currentGift?.redemptionDate.split('T')[0], locale)}{' '}
                  <i className="flaticon2-calendar-5 text-info"></i>
                </div>
              </div>
            </div>
          )}
          {currentGift?.redeemerMobileNumber && (
            <div className="col-12 m-2">
              <div className="row">
                <div className="col-lg-3 col-5">
                  {messages[`${listScopeHeader}.activatedCustomerMobileNumber`]}
                </div>
                <div className="col-lg-9 col-7">
                  {currentGift?.redeemerMobileNumber}{' '}
                  <i className="flaticon-avatar text-info"></i>
                </div>
              </div>
            </div>
          )}
          <div className="col-12 m-2">
            <div className="row">
              <div className="col-lg-3 col-5">
                {messages[`${listScopeHeader}.activationStatus`]}
              </div>
              <div className="col-lg-9 col-7">
                {!currentGift?.isRedeemed ? (
                  <span
                    style={{
                      color: `${statusColorForWord(1)}`,
                      fontWeight: 'bold',
                    }}
                  >
                    {messages[`common.deactivated`]}
                  </span>
                ) : (
                  <span style={{ color: `${statusColorForWord(4)}`, fontWeight: 'bold' }}>
                    {messages[`common.activated`]}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button size="lg" variant="secondary" onClick={() => setOpen(false)}>
          {messages['common.back']}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
GiftCardListDetails.propTypes = {
  setOpen: PropTypes.func,
  //   onDelete: PropTypes.func,
  open: PropTypes.bool,
  currentGift: PropTypes.object,
};
export default GiftCardListDetails;
