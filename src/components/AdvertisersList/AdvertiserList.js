/* eslint-disable  */

import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Switch,
} from '@material-ui/core';
import useAPI, { put, get } from 'hooks/useAPI';
import TableLoader from 'components/shared/TableLoader';
import Alert from '@material-ui/lab/Alert';
import AddAdvertiser from './AddAdvertiser';
import { HandleSuccessAndErrorMsg } from '../../functions/HandleSuccessAndErrorMsg';

const AdvertiserList = () => {
  const { messages } = useIntl();
  const [advertisersList, setAdvertisersList] = useState([]);

  const [addError, setAddError] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [toggleToken, setToggleToken] = useState({
    id: '',
    isEnabled: false,
  });

  /* -------------------------------------------------------------------------- */
  /*                  Fuction to redirect to RW For Advertisers                 */
  /* -------------------------------------------------------------------------- */
  const handleUrlRW = (token) => `${process.env.REACT_APP_RW_URL}?adv=${token}`;
  /* -------------------------------------------------------------------------- */
  /*                     Getting All Advertiser From BackEnd                    */
  /* -------------------------------------------------------------------------- */

  const {
    response: AdvertisersListRes,
    isLoading: AdvertisersListLoading,
    setRecall: AdvertisersListCall,
  } = useAPI(get, `Operator/Get`);

  useEffect(() => {
    AdvertisersListCall(true);
  }, []);

  useEffect(() => {
    if (AdvertisersListRes?.data) {
      setAdvertisersList(AdvertisersListRes?.data?.list);
    }
  }, [AdvertisersListRes]);

  /* -------------------------------------------------------------------------- */
  /*                 Switch Between Disable And Enable The Token                */
  /* -------------------------------------------------------------------------- */

  const {
    response: updateAdvertiserRes,
    isLoading: updateAdvertiserLoading,
    setRecall: updateAdvertiserCall,
  } = useAPI(
    put,
    `Operator/Update?id=${toggleToken?.id}&isEnabled=${toggleToken?.isEnabled}`,
  );
  useEffect(() => {
    if (toggleToken?.id) {
      updateAdvertiserCall(true);
    }
  }, [toggleToken]);

  /* -------------------------------------------------------------------------- */
  /*                 Handle The Loading And Response Of  Update                 */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (updateAdvertiserRes?.data) {
      AdvertisersListCall(true);
      HandleSuccessAndErrorMsg(setUpdateSuccess, true);
    }
    if (updateAdvertiserRes?.error) {
      HandleSuccessAndErrorMsg(setUpdateError, updateAdvertiserRes?.error?.message);
    }
  }, [updateAdvertiserRes]);
  /* -------------------------------------------------------------------------- */
  /*                                Loader Handle                               */
  /* -------------------------------------------------------------------------- */

  return (
    <Card className="mb-5">
      <Card.Header className="align-items-end">
        <Row className="w-100 align-items-end justify-content-between">
          <Col xs="12" sm="12" md="auto" className="px-0">
            <div className="title"> {messages['sidebar.sadmin.advertisers']}</div>
          </Col>
          <Col xs="12" sm="12" md="6">
            <AddAdvertiser
              callAdvertisersList={AdvertisersListCall}
              setAddError={setAddError}
              setAddSuccess={setAddSuccess}
              AdvertisersListLoading={AdvertisersListLoading}
              UpdateAdvertisersLoading={updateAdvertiserLoading}
            />
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {addSuccess && (
          <Alert className="align-items-center" severity="success">
            {messages['advertisers.add.success']}
          </Alert>
        )}
        {addError && (
          <Alert className="align-items-center" severity="error">
            {addError}
          </Alert>
        )}
        {updateSuccess && (
          <Alert className="align-items-center" severity="success">
            {messages['advertisers.update.success']}
          </Alert>
        )}
        {updateError && (
          <Alert className="align-items-center" severity="error">
            {updateError}
          </Alert>
        )}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">{messages['sidebar.advertisers.name']}</TableCell>
              <TableCell align="center">{messages['sidebar.advertisers.link']}</TableCell>
              <TableCell align="center">{messages['common.actions']}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!AdvertisersListLoading &&
              advertisersList?.map((adv) => (
                <TableRow key={adv.id}>
                  <TableCell align="center">{adv.name}</TableCell>
                  <TableCell align="center">
                    <a href={handleUrlRW(adv.code)}>{handleUrlRW(adv.code)}</a>
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={adv.isEnabled}
                      onChange={() => {
                        setToggleToken({
                          id: adv.id,
                          isEnabled: !adv.isEnabled,
                        });
                      }}
                      name="toggleisEnabled"
                    />
                  </TableCell>
                </TableRow>
              ))}
            {(advertisersList?.length === 0 || AdvertisersListLoading) && (
              <TableLoader colSpan="3" noData={!AdvertisersListLoading} />
            )}
          </TableBody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default AdvertiserList;
