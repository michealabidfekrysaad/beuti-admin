/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@material-ui/core';
import { toast } from 'react-toastify';
import { Card } from 'react-bootstrap';
import Pagination from '@material-ui/lab/Pagination';
import Fade from '@material-ui/core/Fade';
import useOdata, { get } from 'hooks/useOdata';
import { useIntl, FormattedMessage } from 'react-intl';
import DeleteModal from 'components/shared/DeleteModal';
import { formatData } from 'functions/formatTableData';
import useAPI, { deleting } from 'hooks/useAPI';
import OfferDetailsModal from './OfferDetailsModal';

function OffersList() {
  const history = useHistory();
  const [allData, setAllData] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [detailsOpenModal, setDetailsOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { messages, locale } = useIntl();
  const [deletePayload, setDeletePayload] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const {
    response: offersListRes,
    isLoading: gettingOfferList,
    setRecall: getData,
  } = useOdata(get, `v1/OfferList?$skip=${(pageNumber - 1) * 10}`);
  const {
    response: totalCountResp,
    isLoading: countLoading,
    setRecall: getTotalCount,
  } = useOdata(get, 'v1/OfferList/count');
  const { response: deleteOfferRes, setRecall: deleteOffer } = useAPI(
    deleting,
    `Offer/deleteOffer?offerId=${deletePayload}`,
  );

  useEffect(() => {
    if (deleteOfferRes?.data?.success) {
      notify(messages[`offer.delete.Success`]);
      setConfirmDelete(false);
      setDeletePayload(null);
      getData(true);
      getTotalCount(true);
    }
    if (deleteOfferRes?.error) {
      notify(deleteOffer?.error?.message, 'err');
    }
  }, [deleteOfferRes]);

  useEffect(() => {
    if (offersListRes?.data) {
      setAllData(offersListRes?.data?.list);
    }
  }, [offersListRes]);

  useEffect(() => {
    getData(true);
    getTotalCount(true);
  }, [pageNumber]);

  useEffect(() => {
    if (totalCountResp?.data?.data) setTotalCount(totalCountResp?.data?.data);
  }, [totalCountResp]);

  useEffect(() => {
    if (confirmDelete) {
      deleteOffer(true);
    }
  }, [confirmDelete]);

  const notify = (message, err) => {
    if (err) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  const tableGuide = [
    { data: 'durationFrom', message: messages[`common.from`] },
    { data: 'durationTo', message: messages[`common.to`] },
    { data: 'percentage', message: messages[`offer.percantage`] },
    { data: 'status', message: messages[`offer.status`] },
    { data: 'actions', message: messages[`common.actions`] },
  ];

  const actions = [
    {
      name: 'Details',
      element: (id) => (
        <Tooltip arrow TransitionComponent={Fade} title={messages['common.showDetails']}>
          <button
            type="button"
            className="icon-wrapper-btn btn-icon-transparent mx-1"
            onClick={() => {
              setSelectedOffer(allData.find((c) => c.id === id));
              setDetailsOpenModal(true);
            }}
          >
            <i className="flaticon2-sheet"></i>
          </button>
        </Tooltip>
      ),
    },
    {
      name: 'delete',
      element: (id) => (
        <Tooltip arrow TransitionComponent={Fade} title={messages['common.delete']}>
          <button
            type="button"
            className="icon-wrapper-btn btn-icon-transparent mx-1"
            onClick={() => {
              setOpenDeleteModal(true);
              setDeletePayload(id);
            }}
          >
            <i className="flaticon2-rubbish-bin"></i>
          </button>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Card className="mb-5">
        <Card.Header>
          <div className="title">{messages.offersList}</div>
        </Card.Header>
        <>
          <div className="d-flex">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => history.push('/offers/add/')}
            >
              {messages['offers.AddOffer']}
            </button>
          </div>
          <Card.Body className="mt-5">
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    {tableGuide.map((data) => (
                      <TableCell align="center" key={data.message}>
                        {data.message}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gettingOfferList || countLoading ? (
                    <TableRow>
                      <TableCell colSpan="12" align="center" className="pt-5">
                        <CircularProgress
                          size={24}
                          className="mx-auto"
                          color="secondary"
                        />
                      </TableCell>
                    </TableRow>
                  ) : allData?.length > 0 ? (
                    allData.map((pieceOfData) => (
                      <TableRow key={pieceOfData.id}>
                        {tableGuide.map((rowData, index) => (
                          <TableCell align="center" key={index}>
                            {formatData(
                              pieceOfData,
                              rowData,
                              locale,
                              actions,
                              messages,
                              false,
                              true, // IS OFFER .. BECAUSE BACK END DIDN'T MAKE THE SAME FORMAT IN EACH RESPONSE
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="12" align="center" className="text-info pt-5">
                        <i className="flaticon-gift la-2x  mx-2"></i>
                        <FormattedMessage id="offers.noOffers" />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          </Card.Body>
        </>

        {totalCount > 10 && (
          <Card.Footer>
            <Pagination
              count={Math.ceil(totalCount / 10)}
              color="secondary"
              showFirstButton
              showLastButton
              variant="outlined"
              shape="rounded"
              onChange={(e, value) => setPageNumber(value)}
            />
          </Card.Footer>
        )}
      </Card>
      <OfferDetailsModal
        selectedOffer={selectedOffer}
        open={detailsOpenModal}
        setOpen={setDetailsOpenModal}
      />
      <DeleteModal
        setOpen={setOpenDeleteModal}
        open={openDeleteModal}
        header="offers.delete.message"
        setConfirmDelete={setConfirmDelete}
      />
    </>
  );
}

OffersList.propTypes = {};

export default OffersList;
