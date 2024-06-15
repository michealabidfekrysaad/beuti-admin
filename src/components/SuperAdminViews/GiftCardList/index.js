import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import Pagination from '@material-ui/lab/Pagination';
import { GiftCardList } from './GiftCardList';
import useOdata, { get } from '../../../hooks/useOdata';

const GiftCard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState('');
  const { messages } = useIntl();

  /* -------------------------------------------------------------------------- */
  /*                              Prepare API CALLS                             */
  /* -------------------------------------------------------------------------- */

  const { response: getGiftRes, setRecall: recallGift } = useOdata(
    get,
    `GiftCardOData/count`,
  );

  /* -------------------------------------------------------------------------- */
  /*                          CALL COUNT FOR PAGINATION                         */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    recallGift(true);
  }, []);
  useEffect(() => {
    if (getGiftRes?.data) {
      setTotalPages(getGiftRes.data.data);
    }
  }, [getGiftRes]);
  return (
    <Card className="mb-5">
      <Card.Header>
        <div className="title">{messages['sidebar.sadmin.giftCard']}</div>
      </Card.Header>
      <Card.Body>
        <GiftCardList currentPage={currentPage} />
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
  );
};

export default GiftCard;
