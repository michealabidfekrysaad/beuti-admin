/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Card, Button } from 'react-bootstrap';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import useAPI, { get, deleting } from 'hooks/useAPI';
import { formatDate } from 'functions/formatTableData';
import { useHistory } from 'react-router-dom';
import { DeletePromo } from './DeletePromoModal';
import TableLoader from '../../shared/TableLoader';

export function PromoCodesList() {
  const history = useHistory();
  const { locale, messages } = useIntl();
  const [promocodesList, setpromocodesList] = useState([]);
  const [deletePayload, setDeletePayload] = useState('');
  const { response, isLoading, setRecall } = useAPI(get, 'BookingPromoCode/ViewAll');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { response: deleteRes, isLoading: isdDeleting, setRecall: deleteItem } = useAPI(
    deleting,
    `BookingPromoCode/delete?id=${deletePayload}`,
  );

  useEffect(() => {
    if (deletePayload) deleteItem(true);
  }, [deletePayload]);

  useEffect(() => {
    if (deleteRes?.data) {
      setSuccess(true);
      setTimeout(() => {
        setRecall(true);
      }, 3000);
    }
    if (deleteRes?.error) {
      setError(deleteRes?.error?.message);
    }
  }, [deleteRes]);

  useEffect(() => {
    setRecall(true);
  }, []);

  useEffect(() => {
    if (response?.data) {
      setpromocodesList(response?.data?.list);
    }
  }, [response]);

  return (
    <>
      <Card className="mb-5">
        <Card.Header>
          <div className="title"> {messages['promocodes.sidebar.title']}</div>
          <div>
            <Button className="mx-3" onClick={() => history.push('/promocodes/add/')}>
              <FormattedMessage id="promocodes.add.header" />
            </Button>
            <Button onClick={() => history.push('/sppromocodes/')}>
              <FormattedMessage id="promocodes.add.header.sp" />
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {success && (
            <Alert className="align-items-center" severity="success">
              {messages['promocode.deleteSuccess']}
            </Alert>
          )}
          {error && (
            <Alert className="align-items-center" severity="error">
              {error}
            </Alert>
          )}

          <Table celled color="purple" textAlign="center">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  {messages['promocodes.sidebar.promocode']}
                </TableCell>
                <TableCell align="center">{messages['promocodes.duration']}</TableCell>
                <TableCell align="center">{messages['promocodes.percentage']}</TableCell>
                <TableCell align="center">{messages['promocodes.status']}</TableCell>
                <TableCell align="center">{messages['common.actions']}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading &&
                promocodesList &&
                promocodesList.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell align="center">{promo.code}</TableCell>
                    <TableCell align="center">
                      {promo.isAlwaysActive
                        ? messages['common.permentant']
                        : `${messages['common.from']} ${formatDate(
                            promo.validfrom,
                            locale,
                          )} ${messages['common.to']} ${formatDate(
                            promo.validTo,
                            locale,
                          )}`}
                    </TableCell>
                    <TableCell align="center">{promo.percentgeValue} %</TableCell>
                    <TableCell align="center">
                      {promo.promoCodeStatus === 1 && messages['promo.notStarted']}
                      {promo.promoCodeStatus === 2 && messages['promo.active']}
                      {promo.promoCodeStatus === 3 && messages['promo.expired']}
                    </TableCell>
                    <TableCell align="center">
                      <DeletePromo
                        setDeletePayload={setDeletePayload}
                        id={promo.id}
                        setError={setError}
                        setSuccess={setSuccess}
                        isLoading={isdDeleting}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              {(promocodesList?.length === 0 || isLoading) && (
                <TableLoader colSpan="5" noData={!isLoading} />
              )}
            </TableBody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
}
