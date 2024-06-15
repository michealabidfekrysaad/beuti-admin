import React, { useEffect, useState } from 'react';
import { FormControl, FormHelperText, TextField } from '@material-ui/core';
import { useIntl } from 'react-intl';
import { Button, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import useAPI, { post } from 'hooks/useAPI';
import { HandleSuccessAndErrorMsg } from 'functions/HandleSuccessAndErrorMsg';

const AddAdvertiser = ({
  callAdvertisersList,
  AdvertisersListLoading,
  UpdateAdvertisersLoading,
  setAddSuccess,
  setAddError,
}) => {
  const [advertiserName, setAdvertiserName] = useState('');

  const {
    response: addAdvertiserRes,
    isLoading: addAdvertiserLoading,
    setRecall: addAdvertiserCall,
  } = useAPI(post, 'Operator/Add', {
    name: advertiserName,
  });
  useEffect(() => {
    if (addAdvertiserRes?.data) {
      callAdvertisersList(true);
      HandleSuccessAndErrorMsg(setAddSuccess, true);
      setAdvertiserName('');
    }
    if (addAdvertiserRes?.error) {
      HandleSuccessAndErrorMsg(setAddError, addAdvertiserRes?.error?.message);
    }
  }, [addAdvertiserRes]);
  const { messages } = useIntl();
  useEffect(() => {});
  return (
    <form
      className="row"
      onSubmit={(e) => {
        e.preventDefault();
        addAdvertiserCall(true);
      }}
    >
      <Col xs="8" xl="9">
        <FormControl fullWidth>
          <TextField
            id="standard-basic"
            value={advertiserName}
            label={messages['sidebar.advertisers.add']}
            onChange={(e) => setAdvertiserName(e.target.value)}
            error={advertiserName && advertiserName.length < 3}
          />
        </FormControl>
      </Col>
      <Col xs="4" xl="3">
        <Button
          className="w-100 h-100"
          type="submit"
          disabled={
            advertiserName.length < 3 ||
            addAdvertiserLoading ||
            callAdvertisersList ||
            AdvertisersListLoading ||
            UpdateAdvertisersLoading
          }
        >
          {messages['common.add']}
        </Button>
      </Col>
    </form>
  );
};
AddAdvertiser.propTypes = {
  callAdvertisersList: PropTypes.func,
  AdvertisersListLoading: PropTypes.bool,
  UpdateAdvertisersLoading: PropTypes.bool,
  setAddSuccess: PropTypes.func,
  setAddError: PropTypes.func,
};

export default AddAdvertiser;
