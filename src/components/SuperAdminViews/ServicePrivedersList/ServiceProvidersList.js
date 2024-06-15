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
import { ToggleStatusModal } from 'components/SuperAdminViews/ServicePrivedersList/ToggleStatusModal';
import { formatData } from 'functions/formatTableData';
import { emailPattern } from 'constants/regex';
import Fade from '@material-ui/core/Fade';

import SPLoginModal from './SPLoginModal';
import ServiceProviderDataModal from './ServiceProviderDataModal';

export const isValidEmail = (value) => emailPattern.test(value);
function ServiceProvidersList({ allData, requestSpOdata, query, listLoading }) {
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
    { data: 'mobile', message: messages[`${spListScope}.mobile`] },
    { data: 'city', message: messages[`${spListScope}.city`] },
    { data: 'noOfServices', message: messages[`${spListScope}.noOfServices`] },
    { data: 'noOfTotalBooking', message: messages[`${spListScope}.noOfTotalBooking`] },
    // { data: 'noOfClosedBooking', message: messages[`${spListScope}.noOfClosedBooking`] },
    {
      data: 'noOfUpcomingBooking',
      message: messages[`${spListScope}.noOfUpcomingBooking`],
    },
    // { data: 'noOfCustomers', message: messages[`${spListScope}.noOfCustomers`] },
    { data: 'walletBalance', message: messages[`${spListScope}.walletBlance`] },
    {
      data: 'firstActivationDate',
      message: messages[`${spListScope}.firstActivationDate`],
    },
    // {
    //   data: 'startCommissionDate',
    //   message: messages[`${spListScope}.startCommissionDate`],
    // },
    { data: 'registrationDate', message: messages[`${spListScope}.registrationDate`] },
    { data: 'actions', message: messages[`${spListScope}.actions`] },
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
      name: 'toggleState',
      element: (id) => {
        const sp = allData.find((data) => data.id === id);
        return (
          <ToggleStatusModal
            id={id}
            key={id}
            setConfirmModalOpen={setConfirmModalOpen}
            setErrorMessage={setErrorMessage}
            isEnable={sp.isEnable}
            setTogglePayload={setTogglePayload}
            messages={messages}
            toggleResponse={toggleResponse}
            requestSpOdata={requestSpOdata}
          />
        );
      },
    },

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
            onClick={() => history.push(`/service-providers/sp/${id}`)}
          >
            <i className="flaticon2-user text-primary"></i>
          </button>
        </Tooltip>
      ),
    },
    {
      name: 'loginAsSp',
      element: (id) => <SPLoginModal key={id + 2} id={id} />,
    },
    {
      name: 'missedData',
      element: (id) => {
        const sp = allData.find((data) => data.id === id);
        return Object.values(sp.profileData).some((val) => val !== true) ? (
          <ServiceProviderDataModal
            sp={sp}
            key={id + 3}
            id={id}
            allData={allData}
            setSelected={setSelected}
            selected={selected}
          />
        ) : (
          <></>
        );
      },
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
              <TableCell key={el.data}>{el.message}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody className="spList">
          {allData?.length > 0 && !listLoading ? (
            allData.map((pieceOfData) => (
              <TableRow key={pieceOfData.id}>
                {tableGuide.map((rowData) => (
                  <TableCell key={rowData.data}>
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
                {query.length > 0 ? (
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
    </>
  );
}

ServiceProvidersList.propTypes = {
  allData: PropTypes.array,
  requestSpOdata: PropTypes.func,
  listLoading: PropTypes.bool,
  query: PropTypes.string,
};

export default ServiceProvidersList;
