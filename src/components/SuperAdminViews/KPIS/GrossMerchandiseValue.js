import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Header } from 'semantic-ui-react';
import useAPI, { get } from 'hooks/useAPI';
import Loading from 'components/AdminViews/NewBooking/Loading/shimmer';
import MonthYearSelection from 'components/MonthYearSelection';
import { Card } from 'react-bootstrap';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
const newDate = new Date();
// SUPER ADMIN
export default function GrossMerchandiseValue() {
  const [year, setYear] = useState(newDate.getFullYear());
  const [month, setMonth] = useState(newDate.getMonth() + 1);
  const { response, setRecall, isLoading } = useAPI(
    get,
    `Booking/GrossMerchandiseValue?year=${year}&month=${month}`,
  );

  useEffect(() => {
    setRecall(true);
  }, [year, month]);

  return (
    <>
      <Card className="h-100">
        <Card.Header className="border-bottom-0 pb-0">
          <div className="title">
            <FormattedMessage id="kpis.GrossMerchandiseValue" />
          </div>
        </Card.Header>
        <Card.Body>
          <MonthYearSelection
            year={year}
            setYear={setYear}
            setMonth={setMonth}
            month={month}
          />
          {isLoading || !response ? (
            <>
              <Loading active />
            </>
          ) : (
            <Table className="mt-5">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <FormattedMessage id="theCount" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="voucher.Value" />
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell align="center">
                    <Header as="h4" image>
                      <Header.Content>
                        <FormattedMessage id="clinicsGCT" />
                      </Header.Content>
                    </Header>
                  </TableCell>
                  <TableCell>
                    <Header.Content>{response.data.clinicsGCT.count}</Header.Content>
                  </TableCell>
                  <TableCell>
                    <Header.Content>{response.data.clinicsGCT.price}</Header.Content>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">
                    <Header as="h4" image>
                      <Header.Content>
                        <FormattedMessage id="centersGST" />
                      </Header.Content>
                    </Header>
                  </TableCell>
                  <TableCell>
                    <Header.Content>{response.data.centersGST.count}</Header.Content>
                  </TableCell>
                  <TableCell>
                    <Header.Content>{response.data.centersGST.price}</Header.Content>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">
                    <Header as="h4" image>
                      <Header.Content>
                        <FormattedMessage id="artistGST" />
                      </Header.Content>
                    </Header>
                  </TableCell>
                  <TableCell>
                    <Header.Content>{response.data.artistGST.count}</Header.Content>
                  </TableCell>
                  <TableCell>
                    <Header.Content>{response.data.artistGST.price}</Header.Content>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">
                    <Header as="h4" image>
                      <Header.Content>
                        <FormattedMessage id="homeServicesGCT" />
                      </Header.Content>
                    </Header>
                  </TableCell>
                  <TableCell>
                    <Header.Content>{response.data.homeServicesGCT.count}</Header.Content>
                  </TableCell>
                  <TableCell>
                    <Header.Content>{response.data.homeServicesGCT.price}</Header.Content>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </>
  );
}
