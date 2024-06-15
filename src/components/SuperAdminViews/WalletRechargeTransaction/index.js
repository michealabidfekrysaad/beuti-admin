/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import WalletRechargeList from 'components/SuperAdminViews/WalletRechargeTransaction/WalletRechargeList';
import { Card } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import Pagination from '@material-ui/lab/Pagination';
import useOdata, { get } from 'hooks/useOdata';

export default function WalletRechargeTransaction() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState('');
  const { messages } = useIntl();

  const {
    response: countDataResponse,
    isLoading: noCount,
    setRecall: getCount,
  } = useOdata(get, `CustomerWalletRechargeOdata/count`);
  useEffect(() => {
    getCount(true);
  }, []);
  useEffect(() => {
    if (countDataResponse && countDataResponse.data) {
      setTotalPages(countDataResponse.data.data);
    }
  }, [countDataResponse]);

  return (
    <>
      <Card className="mb-5">
        <Card.Header>
          <div className="title">
            {messages['sidebar.sadmin.WalletRechargetransactions']}
          </div>
        </Card.Header>
        <Card.Body>
          <WalletRechargeList currentPage={currentPage} />
        </Card.Body>
        {Math.ceil(totalPages / 10) > 1 && (
          <Card.Footer>
            <Pagination
              count={Math.ceil(totalPages / 10)}
              color="secondary"
              showFirstButton
              showLastButton
              variant="outlined"
              shape="rounded"
              onChange={(e, value) => setCurrentPage(value)}
            />
          </Card.Footer>
        )}
      </Card>
    </>
  );
}
