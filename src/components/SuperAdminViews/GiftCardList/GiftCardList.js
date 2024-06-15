/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Zoom,
} from '@material-ui/core';
import SVG from 'react-inlinesvg';
import { get } from 'hooks/useAPI';
import useOdata from 'hooks/useOdata';
import PropTypes from 'prop-types';
import { statusColorForWord } from 'functions/statusColor';
import { toAbsoluteUrl } from '../../../functions/toAbsoluteUrl';
import { formatDate } from '../../../functions/formatTableData';
import GiftCardListDetails from './GiftCardListDetails';
import TableLoader from '../../shared/TableLoader';

export const GiftCardList = ({ currentPage }) => {
  const { messages, locale } = useIntl();
  const listScopeHeader = 'table.spList.header';
  const [giftList, setGiftList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentGift, setCurrnetGift] = useState(null);

  const {
    response: getGiftCardRes,
    isLoading: loading,
    setRecall: recallGiftCard,
  } = useOdata(
    get,
    `GiftCardOData?$skip=${(currentPage - 1) * 10}&$orderby=purchaseDate desc`,
  );

  /* -------------------------------------------------------------------------- */
  /*                             Get gift card list                             */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    recallGiftCard(true);
  }, [currentPage]);

  useEffect(() => {
    if (getGiftCardRes?.data) {
      setGiftList(getGiftCardRes?.data.list);
    }
  }, [getGiftCardRes]);

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">{messages[`${listScopeHeader}.id`]}</TableCell>
            <TableCell align="center">
              {messages[`${listScopeHeader}.purchaseDateAndTime`]}
            </TableCell>
            <TableCell align="center">{messages[`${listScopeHeader}.valueGC`]}</TableCell>
            <TableCell align="center">
              {messages[`components.ctaButton.payment`]}
            </TableCell>
            <TableCell align="center">{messages[`${listScopeHeader}.fortID`]}</TableCell>
            <TableCell align="center">
              {messages[`${listScopeHeader}.MerchantReferenceNumber`]}
            </TableCell>
            <TableCell align="center">
              {messages[`${listScopeHeader}.purchaserMobile`]}
            </TableCell>
            <TableCell align="center">
              {messages[`${listScopeHeader}.activationStatus`]}
            </TableCell>
            <TableCell align="center">{messages[`common.actions`]}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading &&
            giftList &&
            giftList.map((gift) => (
              <TableRow key={gift.id}>
                <TableCell align="center">{!gift?.id ? '-' : gift.id}</TableCell>
                <TableCell align="center">
                  {!gift.purchaseDate ? (
                    '-'
                  ) : (
                    <>{formatDate(gift.purchaseDate.split('T')[0], locale)}</>
                  )}
                </TableCell>
                <TableCell align="center">
                  {!gift?.value ? (
                    '-'
                  ) : (
                    <>
                      {gift.value}&nbsp;{messages.currency}
                    </>
                  )}
                </TableCell>
                <TableCell align="center" className="table-coloured__method">
                  {gift?.paymentMethod?.name === 'MADA' ||
                  gift?.paymentMethod?.name === 'مدى' ? (
                    <SVG src={toAbsoluteUrl('/mada.svg')} />
                  ) : (
                    <SVG src={toAbsoluteUrl('/applypay.svg')} />
                  )}
                </TableCell>
                <TableCell align="center">{!gift?.fortId ? '-' : gift.fortId}</TableCell>
                <TableCell align="center">
                  {!gift?.merchantReference ? '-' : gift.merchantReference}
                </TableCell>
                <TableCell align="center">
                  {!gift?.purchaserMobileNumber ? '-' : gift.purchaserMobileNumber}
                </TableCell>
                <TableCell align="center">
                  {!gift?.isRedeemed ? (
                    <span
                      style={{
                        color: `${statusColorForWord(1)}`,
                        fontWeight: 'bold',
                      }}
                    >
                      {messages[`common.deactivated`]}
                    </span>
                  ) : (
                    <span
                      style={{ color: `${statusColorForWord(4)}`, fontWeight: 'bold' }}
                    >
                      {messages[`common.activated`]}
                    </span>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Tooltip
                    title={messages[`common.details`]}
                    placement="top"
                    TransitionComponent={Zoom}
                    arrow
                  >
                    <button
                      type="button"
                      className="icon-wrapper-btn btn-icon-primary mx-1"
                      onClick={() => {
                        setCurrnetGift(gift);
                        setOpenModal(true);
                      }}
                    >
                      <i className="flaticon2-notepad text-primary"></i>
                    </button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          {(giftList?.length === 0 || loading) && (
            <TableLoader colSpan="9" noData={!loading} />
          )}
        </TableBody>
      </Table>
      <GiftCardListDetails
        open={openModal}
        setOpen={setOpenModal}
        currentGift={currentGift}
      />
    </>
  );
};
GiftCardList.propTypes = {
  currentPage: PropTypes.number,
};
