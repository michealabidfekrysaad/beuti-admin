import useAPI, { put } from 'hooks/useAPI';
import useOdata, { get } from 'hooks/useOdata';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Message as Alert, Message, Segment } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';

import WalletBlanceList from './WalletList';
import WalletBalanceControllerModal from './WalletBalanceControllerModal';
import WalletAction from './WalletActions';

const Wallet = () => {
  const { serviceProviderId } = useParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [WalletHistory, setWalletHistory] = useState([]);
  const [WalletBalance, setWalletBalance] = useState(0);
  const [WalletHistoryCount, setWalletHistoryCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [responseError, setResponseError] = useState('');
  const [changeBalancePayload, setChangeBalancePayload] = useState({
    serviceProviderId,
    amount: null,
    sign: 0,
    note: '',
  });

  // Prepare Wallet History And Wallet Count Api Calls
  const {
    response: WalletHistoryRes,
    isLoading: WalletHistoryLoading,
    setRecall: CallWalletHistory,
  } = useOdata(
    get,
    `WalletTransactionOdata?serviceProviderId=${serviceProviderId}&$orderby=id desc&$skip=${
      pageNumber - 1 === 0 ? 0 : (pageNumber - 1) * 10
    }`,
  );

  const {
    response: WalletBalanceAndCountRes,
    isLoading: WalletBalanceLoading,
    setRecall: CallWalletBalanceAndCount,
  } = useAPI(get, `ServiceProvider/WalletInfo?ServiceProviderId=${serviceProviderId}`);

  const {
    response: ChangeWalletBalanceRes,
    isLoading: ChangeWalletBalanceLoading,
    setRecall: CallChangeWalletBalance,
  } = useAPI(put, `SP_WalletHistory/UpdateSPWalletByAdmin`, changeBalancePayload);

  // Call Wallet History And Count And Wallet Balance
  useEffect(() => {
    CallWalletBalanceAndCount(true);
    CallWalletHistory(true);
  }, []);

  // Call Api For Pagaination
  useEffect(() => {
    CallWalletHistory(true);
  }, [pageNumber]);

  // Store the Data In State
  useEffect(() => {
    if (WalletHistoryRes && WalletHistoryRes.data)
      setWalletHistory(WalletHistoryRes.data.list);
  }, [WalletHistoryRes]);

  useEffect(() => {
    if (WalletBalanceAndCountRes && WalletBalanceAndCountRes.data) {
      setWalletBalance(WalletBalanceAndCountRes.data.walletBalance);
      setWalletHistoryCount(WalletBalanceAndCountRes.data.historyCount);
    }
  }, [WalletBalanceAndCountRes]);

  // increase or decrease Balance

  function handleSubmit() {
    CallChangeWalletBalance(true);
    setOpenModal(false);
  }
  // After increase or decrease Balance
  useEffect(() => {
    if (ChangeWalletBalanceRes && ChangeWalletBalanceRes.data) {
      CallWalletHistory(true);
      CallWalletBalanceAndCount(true);
    }
    if (ChangeWalletBalanceRes && ChangeWalletBalanceRes.error) {
      setResponseError(ChangeWalletBalanceRes.error.message);
      setTimeout(() => {
        setResponseError(false);
      }, 4000);
    }
    setChangeBalancePayload({
      serviceProviderId,
      amount: null,
      sign: 0,
      note: '',
    });
  }, [ChangeWalletBalanceRes]);

  return (
    <>
      <Segment basic vertical loading={WalletBalanceLoading || WalletHistoryLoading}>
        {responseError && <Message error header={responseError} />}
        <WalletAction
          setOpenModal={setOpenModal}
          setChangeBalancePayload={setChangeBalancePayload}
          changeBalancePayload={changeBalancePayload}
        />
        <Alert className="wallet-message">
          <FormattedMessage
            id="sAdmin.spDetails.walletbalance"
            values={{ balance: WalletBalance }}
          />
        </Alert>
        <WalletBlanceList
          historylist={WalletHistory}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          totalCount={WalletHistoryCount}
        />
      </Segment>
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

export default Wallet;
