/* eslint-disable react/prop-types */
/* eslint-disable indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import useOdata, { get } from 'hooks/useOdata';
import SVG from 'react-inlinesvg';
import { formatDate } from '../../../functions/formatTableData';
import { toAbsoluteUrl } from '../../../functions/toAbsoluteUrl';

function WalletRechargeList({ currentPage }) {
  const spListScope = 'table.spList.header';
  const { messages, locale } = useIntl();
  const [allData, setAllData] = useState([]);
  const {
    response: walletOdataResponse,
    isLoading: listLoading,
    setRecall: requestWalletOdata,
  } = useOdata(
    get,
    `CustomerWalletRechargeOdata?$orderby=purchaseDate desc&$skip=${(currentPage - 1) *
      10}`,
  );

  useEffect(() => {
    requestWalletOdata(true);
  }, [currentPage]);

  useEffect(() => {
    if (walletOdataResponse && walletOdataResponse.data) {
      setAllData(walletOdataResponse.data.list);
    }
  }, [walletOdataResponse]);

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">{messages[`${spListScope}.id`]}</TableCell>
            <TableCell align="center">
              {messages[`${spListScope}.PurchaserName`]}
            </TableCell>
            <TableCell align="center">
              {messages[`${spListScope}.purchaserMobile`]}
            </TableCell>
            <TableCell align="center">
              {messages[`${spListScope}.purchaseDate`]}
            </TableCell>
            <TableCell align="center">{messages[`${spListScope}.Value`]}</TableCell>
            <TableCell align="center">
              {messages[`${spListScope}.paymentMethod`]}
            </TableCell>
            <TableCell align="center">
              {messages[`${spListScope}.MerchantReferenceNumber`]}
            </TableCell>
            <TableCell align="center">{messages[`${spListScope}.fortID`]}</TableCell>

            <TableCell align="center">
              {messages[`${spListScope}.BalanceBefore`]}
            </TableCell>
            <TableCell align="center">
              {messages[`${spListScope}.BalanceAfter`]}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allData.map((pieceOfData) => (
            <TableRow key={pieceOfData.id} className="table-coloured">
              <TableCell align="center" className="table-coloured__id">
                {pieceOfData.id}
              </TableCell>
              <TableCell align="center">{pieceOfData.purchaserName}</TableCell>
              <TableCell align="center">{pieceOfData.purchaserMobile}</TableCell>
              <TableCell align="center">
                {formatDate(pieceOfData.purchaseDate.split('T')[0], locale)}
                <br />
                {pieceOfData.purchaseDate.split('T')[1].split('.')[0]}
              </TableCell>
              <TableCell align="center">{pieceOfData.amount} SAR</TableCell>
              <TableCell align="center" className="table-coloured__method">
                {pieceOfData.paymentMethod.name === 'MADA' ||
                pieceOfData.paymentMethod.name === 'مدى' ? (
                  <SVG src={toAbsoluteUrl('/mada.svg')} />
                ) : (
                  <SVG src={toAbsoluteUrl('/applypay.svg')} />
                )}
              </TableCell>
              <TableCell align="center">
                {pieceOfData.merchantReference ? pieceOfData.merchantReference : '-'}
              </TableCell>
              <TableCell align="center">{pieceOfData.fortID}</TableCell>

              <TableCell align="center" className="table-coloured__before">
                {pieceOfData.balanceBefore}
              </TableCell>
              <TableCell align="center" className="table-coloured__after">
                {pieceOfData.balanceAfter}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default WalletRechargeList;
