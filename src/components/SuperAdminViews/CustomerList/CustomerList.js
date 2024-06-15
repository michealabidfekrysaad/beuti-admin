/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import useAPI, { put } from 'hooks/useAPI';
import { formatData } from 'functions/formatTableData';
import { emailPattern } from 'constants/regex';
import Fade from '@material-ui/core/Fade';

export const isValidEmail = (value) => emailPattern.test(value);
function CustomerList({ allData, requestSpOdata, query, listLoading }) {
  const spListScope = 'table.spList.header';
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const toggleStatusAPI = `ServiceProvider/ActivateDeactivateServiceProvider`;
  const { messages, locale } = useIntl();
  const [togglePayload, setTogglePayload] = useState(null);
  const [selected, setSelected] = useState(null);

  const { response: toggleResponse, setRecall: toggleStatus } = useAPI(
    put,
    toggleStatusAPI,
    togglePayload,
  );
  const tableGuide = [
    { data: 'id', message: messages[`${spListScope}.id`] },
    { data: 'name', message: messages[`${spListScope}.name`] },
    { data: 'phoneNumber', message: messages[`${spListScope}.mobile`] },
    { data: 'email', message: messages[`${spListScope}.email`] },
    { data: 'registerationDate', message: messages[`${spListScope}.registrationDate`] },
    {
      data: 'registerationMethod',
      message: messages[`${spListScope}.RegistrationMethod`],
    },
    { data: 'noOfClosedBookings', message: messages[`${spListScope}.ClosedBookings`] },
    {
      data: 'lastClosedBookingDate',
      message: messages[`${spListScope}.LastClosedBooking`],
    },
    {
      data: 'nextUpcomingBookingDate',
      message: messages[`${spListScope}.NextUpcomingBooking`],
    },
    {
      data: 'walletBalance',
      message: messages[`${spListScope}.WalletBalance`],
    },
    { data: 'actions', message: messages[`${spListScope}.Details`] },
  ];
  const history = useHistory();

  useEffect(() => {
    if (togglePayload) {
      toggleStatus(true);
    }
  }, [togglePayload]);
  useEffect(() => {
    if (toggleResponse?.data) {
      if (toggleResponse.data.success === true) {
        requestSpOdata(true);
      }
    }
  }, [toggleResponse]);

  const actions = [
    {
      name: 'viewSpDetails',
      element: (id) => (
        <Tooltip
          arrow
          TransitionComponent={Fade}
          key={id + 1}
          title={messages['common.showDetails']}
        >
          <button
            type="button"
            className="icon-wrapper-btn btn-icon-primary mx-1"
            onClick={() => history.push(`/customer-list/view/${id}`)}
          >
            <i className="flaticon2-user text-primary"></i>
          </button>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      {errorMessage && (
        <Alert className="mb-3" severity="error">
          {errorMessage}
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
        <TableBody className="spList">
          {allData?.length > 0 ? (
            allData.map((pieceOfData) => (
              <TableRow key={pieceOfData.id}>
                {tableGuide.map((rowData) => (
                  <TableCell key={rowData.data} align="center">
                    <div className={`spList-${rowData.data}`}>
                      {formatData(pieceOfData, rowData, locale, actions, messages)}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="13" align="center" className="text-info pt-5">
                {query?.length > 0 ? (
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
      </Table>{' '}
    </>
  );
}

CustomerList.propTypes = {
  allData: PropTypes.array,
  requestSpOdata: PropTypes.func,
  listLoading: PropTypes.bool,
  query: PropTypes.string,
};

export default CustomerList;
