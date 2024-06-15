import React, { useEffect, useState } from 'react';
import useAPI, { get, put } from 'hooks/useAPI';
import { useParams } from 'react-router-dom';

import { Col, Row } from 'react-bootstrap';
import { Tooltip } from '@material-ui/core';
import Fade from '@material-ui/core/Fade';
import { useIntl } from 'react-intl';
import Alert from '@material-ui/lab/Alert';
import EditSPCommission from './EditCommissionModal';

const SPCommission = () => {
  const [commissionPercentage, setCommissionPercentage] = useState('');
  const [newCommission, setNewCommission] = useState('');
  const [success, setSuccess] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const { messages } = useIntl();
  const { serviceProviderId } = useParams();

  const {
    response: spCommissionRes,
    isLoading: getting,
    setRecall: spComissionRecall,
  } = useAPI(
    get,
    `Commission/GetSPCommissionPercentage?serviceProviderId=${serviceProviderId}`,
  );

  const {
    response: editComissionRes,
    isLoading: editing,
    setRecall: editComissionRecall,
  } = useAPI(put, `Commission/SetSPCommissionPercentage`, {
    serviceProviderId,
    commissionPercentage: newCommission,
  });

  useEffect(() => {
    spComissionRecall(true);
    if (editComissionRes?.data?.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  }, [editComissionRes]);

  useEffect(() => {
    setCommissionPercentage(spCommissionRes?.data.data);
    setNewCommission(spCommissionRes?.data.data);
  }, [spCommissionRes, editComissionRes]);

  return (
    <>
      {success && (
        <Alert className="align-items-center mb-3" severity="success">
          {messages['common.edited.success']}
        </Alert>
      )}
      <Row className="beuti-commission">
        <Col xs="auto">
          <p>
            {messages['beuti.commission.title']} : {commissionPercentage}%
          </p>
        </Col>
        <Col xs="auto">
          <Tooltip arrow TransitionComponent={Fade} title={`${messages['common.edit']}`}>
            <button
              type="button"
              className="icon-wrapper-btn btn-icon-primary mx-2"
              onClick={() => setOpenModal(true)}
            >
              <i className="flaticon2-pen text-primary"></i>
            </button>
          </Tooltip>
        </Col>
      </Row>
      <EditSPCommission
        open={openModal}
        setOpen={setOpenModal}
        messages={messages}
        isLoading={getting || editing}
        newCommission={newCommission}
        oldCommission={commissionPercentage}
        setNewCommission={setNewCommission}
        handleSubmit={editComissionRecall}
        editComissionRes={editComissionRes}
      />
    </>
  );
};

export default SPCommission;
