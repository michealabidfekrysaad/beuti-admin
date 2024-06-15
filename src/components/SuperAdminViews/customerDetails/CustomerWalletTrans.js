import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import useAPI, { put } from 'hooks/useAPI';
import Pagination from '@material-ui/lab/Pagination';
import { useIntl, FormattedMessage } from 'react-intl';
import { formatDate } from 'functions/formatTableData';
import CustomerWalletActions from './CustomerWalletActions';
import WalletBalanceControllerModal from '../ServiceProviderDetails/views/Wallet/WalletBalanceControllerModal';

export const CustomerWalletTran = ({
  customerDetails,
  isLoading,
  setCallWalletHistory,
}) => {
  const [walletHistories, setWalletHistories] = useState([]);
  const [walletBalance, setWalletBalance] = useState(null);
  const [dataCount, setDataCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [chunks, setChunks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [resError, setResponseError] = useState(false);
  const [sucessUpdateBalance, setSucessUpdatebalance] = useState(false);
  const [changeBalancePayload, setChangeBalancePayload] = useState({
    customerId: customerDetails?.id,
    amount: null,
    sign: 0,
    note: '',
  });
  const pagesMax = 10;
  const customerWalletHistory = 'customerWalletHistory';
  const { response: ChangeWalletBalanceRes, setRecall: CallChangeWalletBalance } = useAPI(
    put,
    `CustomerWallet/UpdateWalletBalance`,
    changeBalancePayload,
  );

  function handleSubmit() {
    CallChangeWalletBalance(true);
    setOpenModal(false);
  }
  useEffect(() => {
    if (ChangeWalletBalanceRes?.data) {
      setSucessUpdatebalance(true);
      setTimeout(() => {
        setCallWalletHistory(true);
        setSucessUpdatebalance(false);
      }, [2000]);
    }
    if (ChangeWalletBalanceRes?.error) {
      setResponseError(ChangeWalletBalanceRes.error.message);
      setTimeout(() => {
        setResponseError(false);
      }, 3000);
    }
    setChangeBalancePayload({
      customerId: customerDetails?.id,
      amount: null,
      sign: 0,
      note: '',
    });
  }, [ChangeWalletBalanceRes]);

  useEffect(() => {
    setWalletBalance(customerDetails?.walletBalance);
    if (customerDetails?.customerWalletHistories.length > 0) {
      setWalletHistories(customerDetails?.customerWalletHistories);
      const dataList = customerDetails?.customerWalletHistories;
      setDataCount(dataList.length);
      const createdChunks = [];
      for (let i = 0; i < dataList.length; i += pagesMax) {
        if (customerDetails?.customerWalletHistories.length > 0) {
          const temparray = dataList.slice(i, i + pagesMax);
          createdChunks.push(temparray);
        }
      }
      setChunks(createdChunks);
      setDataCount(Math.ceil(dataList.length / pagesMax));
    }
  }, [customerDetails]);
  const { messages, locale } = useIntl();
  const tableHeaders = [
    { id: 1, name: null },
    { id: 2, name: messages[`${customerWalletHistory}.tranType`] },
    { id: 3, name: messages[`${customerWalletHistory}.tranDetails`] },
    { id: 4, name: messages[`${customerWalletHistory}.tranDate`] },
    { id: 5, name: messages[`${customerWalletHistory}.tranAmount`] },
    { id: 6, name: messages[`${customerWalletHistory}.tranSource`] },
  ];

  return (
    <>
      {!isLoading ? (
        <div className="row mt-4 customer-wallet-trans">
          <div className="col-lg-12 mt-2">
            {resError && (
              <Alert className="mb-3" severity="error">
                {resError}
              </Alert>
            )}
          </div>
          <div className="col-lg-12 mt-2">
            {sucessUpdateBalance && (
              <Alert className="mb-3" severity="success">
                {messages[`${customerWalletHistory}.updateBalance`]}
              </Alert>
            )}
          </div>
          <div className="col-lg-12 mt-2">
            <CustomerWalletActions
              setOpenModal={setOpenModal}
              setChangeBalancePayload={setChangeBalancePayload}
              changeBalancePayload={changeBalancePayload}
            ></CustomerWalletActions>
          </div>
          <div className="col-lg-12 mt-4">
            <div className="purple-box">
              <FormattedMessage
                id={`${customerWalletHistory}.walletbalance`}
                values={{ balance: walletBalance }}
              />
            </div>
          </div>
          <div className="col-lg-12 mt-4">
            <Table>
              <TableHead>
                <TableRow>
                  {tableHeaders.map((head) => (
                    <TableCell Key={head.id} align="center">
                      {head.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {walletHistories.length > 0 ? (
                  chunks[pageNumber].map((history) => (
                    <TableRow
                      key={history?.id}
                      className={`${
                        +history?.walletAmountSign === 1 ? 'bg-green' : 'bg-red'
                      }`}
                    >
                      <TableCell align="center">
                        {history?.walletAmountSign === 1
                          ? `${messages[`${customerWalletHistory}.positive`]}`
                          : `${messages[`${customerWalletHistory}.negative`]}`}
                      </TableCell>
                      <TableCell align="center">{history?.operationType?.name}</TableCell>
                      <TableCell align="center">{history?.operationDetails}</TableCell>
                      <TableCell align="center">
                        {formatDate(history.operationDate, locale)}
                      </TableCell>
                      <TableCell align="center">
                        {history?.walletAmountSign !== 1
                          ? `-${history.amount}`
                          : `${history.amount}`}
                      </TableCell>
                      <TableCell align="center">{history.operationReason}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="6" align="center" className="title">{`${
                      messages[`${customerWalletHistory}.noBalanceFound`]
                    }`}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {dataCount >= 1 && (
              <div className="align-items-center mt-4 d-flex flex-row-reverse">
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
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center mt-5">
          <CircularProgress size={24} color="secondary" />
        </div>
      )}
      <WalletBalanceControllerModal
        open={openModal}
        setOpen={setOpenModal}
        payload={changeBalancePayload}
        handleSubmit={handleSubmit}
        changePayload={setChangeBalancePayload}
      />
    </>
  );
};
CustomerWalletTran.propTypes = {
  customerDetails: PropTypes.object,
  isLoading: PropTypes.bool,
  setCallWalletHistory: PropTypes.func,
};
