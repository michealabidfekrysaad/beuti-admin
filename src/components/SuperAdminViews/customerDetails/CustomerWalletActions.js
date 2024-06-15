import React from 'react';
import { useIntl } from 'react-intl';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

const CustomerWalletActions = ({
  setOpenModal,
  setChangeBalancePayload,
  changeBalancePayload,
}) => {
  const { messages } = useIntl();

  return (
    <ButtonGroup disableElevation variant="contained" color="primary">
      <div className="d-flex">
        <Button
          onClick={() => {
            setChangeBalancePayload({
              ...changeBalancePayload,
              sign: 1,
            });
            setOpenModal(true);
          }}
          className="custom-btn"
        >
          {messages['sAdmin.spDetails.walletIncrease']}
        </Button>
        <div className="or-design">or</div>
        <Button
          onClick={() => {
            setChangeBalancePayload({
              ...changeBalancePayload,
              sign: 2,
            });
            setOpenModal(true);
          }}
          className="custom-btn"
        >
          {messages['sAdmin.spDetails.walletdecrease']}
        </Button>
      </div>
    </ButtonGroup>
  );
};

CustomerWalletActions.propTypes = {
  setOpenModal: PropTypes.func,
  setChangeBalancePayload: PropTypes.func,
  changeBalancePayload: PropTypes.object,
};
export default CustomerWalletActions;
