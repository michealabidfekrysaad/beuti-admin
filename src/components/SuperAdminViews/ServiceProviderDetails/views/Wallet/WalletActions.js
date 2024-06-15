import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const WalletAction = ({
  setOpenModal,
  setChangeBalancePayload,
  changeBalancePayload,
}) => {
  const { messages } = useIntl();

  return (
    <Button.Group>
      <Button
        positive
        onClick={() => {
          setChangeBalancePayload({
            ...changeBalancePayload,
            sign: 1,
          });
          setOpenModal(true);
        }}
      >
        {messages['sAdmin.spDetails.walletIncrease']}
      </Button>
      <Button.Or text={messages['common.or']} />
      <Button
        onClick={() => {
          setChangeBalancePayload({
            ...changeBalancePayload,
            sign: 2,
          });
          setOpenModal(true);
        }}
        negative
      >
        {messages['sAdmin.spDetails.walletdecrease']}
      </Button>
    </Button.Group>
  );
};
WalletAction.propTypes = {
  setOpenModal: PropTypes.func,
  setChangeBalancePayload: PropTypes.func,
  changeBalancePayload: PropTypes.object,
};
export default WalletAction;
