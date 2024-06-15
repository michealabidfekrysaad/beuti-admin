import React, { useState, useEffect } from 'react';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Fade,
} from '@material-ui/core';

import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import useAPI, { post } from 'hooks/useAPI';
import { ReportedReviewsInfo } from 'components/SuperAdminViews/ReportedReviews/ReportedReviewsInfo';
import { formatData } from 'functions/formatTableData';
import { Card } from 'react-bootstrap';
import Pagination from '@material-ui/lab/Pagination';
import Alert from '@material-ui/lab/Alert';

function ReportedReviewsListTable({
  allData,
  listLoading,
  getReviews,
  recallCount,
  totalPages,
  setCurrentPage,
}) {
  const reported = 'table.reportedReviews';
  const { messages, locale } = useIntl();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [actionSelected, setActionSelected] = useState({});
  const [data, setData] = useState(false);
  const reportedReviewsLink = 'SPReviewReport/UpdateReportStatus';
  const { response: reviewsAction, setRecall: recallAction } = useAPI(
    post,
    reportedReviewsLink,
    actionSelected,
  );

  useEffect(() => {
    if (reviewsAction?.error) {
      setError(reviewsAction.error.message);
      setTimeout(() => {
        setError('');
      }, 3000);
    }

    if (reviewsAction?.data?.success) {
      setSuccess(true);
      recallCount(true);
      getReviews(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  }, [reviewsAction]);

  useEffect(() => {
    if (actionSelected?.reportId) {
      recallAction(true);
    }
  }, [actionSelected]);

  // the headers of the table
  const tableGuide = [
    {
      data: 'customerName',
      message: messages[`${reported}.customerName`],
    },
    { data: 'customerPhoneNumber', message: messages[`${reported}.customerMobile`] },
    { data: 'spName', message: messages[`${reported}.SPName`] },
    { data: 'serviceReceivedDate', message: messages[`${reported}.ServiceReceivedDate`] },
    { data: 'rate', message: messages['common.rating'] },
    { data: 'actions', message: messages['common.actions'] },
  ];

  // the button of actions
  const actions = [
    {
      name: 'delete',
      element: (id, dataPiece) => (
        <Tooltip
          placement="top"
          arrow
          TransitionComponent={Fade}
          key={id + 1}
          title={messages['table.reportedReviews.comments']}
        >
          <button
            type="button"
            className="icon-wrapper-btn btn-icon-info mx-1"
            onClick={() => {
              setOpenModal(true);
              setData(dataPiece);
            }}
          >
            <i className="flaticon-comment text-info"></i>
          </button>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Card className="mb-5">
        <Card.Header>
          <div className="title"> {messages['sidebar.sadmin.ReportedReviews']}</div>
        </Card.Header>
        <Card.Body>
          {success && (
            <Alert className="align-items-center" severity="success">
              {messages[`${reported}.success`]}
            </Alert>
          )}
          {error && (
            <Alert className="align-items-center" severity="error">
              {error}
            </Alert>
          )}
          <Table>
            <TableHead>
              <TableRow>
                {tableGuide.map((el) => (
                  <TableCell key={el.data} align="center">
                    {el.message}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {allData?.length > 0 && !listLoading ? (
                allData.map((pieceOfData) => (
                  <TableRow key={pieceOfData.Id}>
                    {tableGuide.map((rowData) => (
                      <TableCell key={rowData.data} align="center">
                        {formatData(pieceOfData, rowData, locale, actions, messages)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan="13" className="text-info pt-5">
                    {!listLoading ? (
                      <>
                        <i className="flaticon-gift la-2x  mx-2"></i>
                        {messages['common.noDataFound']}
                      </>
                    ) : (
                      <CircularProgress size={24} className="mx-auto" color="secondary" />
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* open the modal for comments, rating */}
          <ReportedReviewsInfo
            open={openModal}
            setOpen={setOpenModal}
            dataPiece={data}
            setActionSelected={setActionSelected}
          />
        </Card.Body>{' '}
        {Math.ceil(totalPages / 10) > 1 && (
          <Card.Footer>
            <Pagination
              count={Math.ceil(totalPages / 10)}
              color="secondary"
              showFirstButton
              showLastButton
              variant="outlined"
              shape="rounded"
              onChange={(e, value) => {
                setCurrentPage(value);
              }}
            />
          </Card.Footer>
        )}
      </Card>
    </>
  );
}

ReportedReviewsListTable.propTypes = {
  allData: PropTypes.array,
  listLoading: PropTypes.bool,
  getReviews: PropTypes.func,
  recallCount: PropTypes.func,
  totalPages: PropTypes.number,
  setCurrentPage: PropTypes.func,
};

export default ReportedReviewsListTable;
