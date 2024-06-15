import React, { useEffect, useState } from 'react';
import useAPI, { get } from 'hooks/useAPI';
import { useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { CustomerDetails } from './CustomerDetails';
import { CustomerWalletTran } from './CustomerWalletTrans';

export default function CustomerInfo() {
  const { messages } = useIntl();
  const { customerId } = useParams();
  const [value, setValue] = useState(0);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [callWalletHistory, setCallWalletHistory] = useState(false);

  const { response: customerDetailsRes, isLoading, setRecall: request } = useAPI(
    get,
    `Customer/Get?Id=${customerId}`,
  );
  // call when first load
  useEffect(() => {
    request(true);
  }, []);

  useEffect(() => {
    if (callWalletHistory) {
      request(true);
    }
  }, [callWalletHistory]);

  // after success calling for details
  useEffect(() => {
    if (customerDetailsRes?.data) {
      setCustomerDetails(customerDetailsRes?.data);
      setCallWalletHistory(false);
    }
  }, [customerDetailsRes]);

  const handleChange = (e, index) => {
    setValue(index);
  };

  return (
    <div className="mb-5 card">
      <div className="card-body">
        <div classNamd="row">
          <div className="col-12 customerDetails">
            <AppBar position="static">
              <Tabs value={value} onChange={(e, index) => handleChange(e, index)}>
                <Tab label={`${messages[`customerDetails.header`]}`} />
                <Tab label={`${messages[`customerDetails.headerWallet`]}`} />
              </Tabs>
            </AppBar>
            {value === 0 && (
              <CustomerDetails
                customerDetails={customerDetails}
                isLoading={isLoading}
                setValue={setValue}
              ></CustomerDetails>
            )}
            {value === 1 && (
              <CustomerWalletTran
                customerDetails={customerDetails}
                isLoading={isLoading}
                setCallWalletHistory={setCallWalletHistory}
              ></CustomerWalletTran>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
