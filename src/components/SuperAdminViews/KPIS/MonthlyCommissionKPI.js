import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Header } from 'semantic-ui-react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import useAPI, { get } from 'hooks/useAPI';
import Loading from 'components/AdminViews/NewBooking/Loading/shimmer';
import MonthYearSelection from 'components/MonthYearSelection';
import { Card } from 'react-bootstrap';
const newDate = new Date();
// SUPER ADMIN
export default function MonthlyCommisionKPI() {
  const [year, setYear] = useState(newDate.getFullYear());
  const [month, setMonth] = useState(newDate.getMonth() + 1);
  const { response, setRecall, isLoading } = useAPI(
    get,
    `Commission/GetSPCommission?year=${year}&month=${month}`,
  );

  useEffect(() => {
    setRecall(true);
  }, [year, month]);

  return (
    <>
      <Card className="h-100">
        <Card.Header className="border-bottom-0 pb-0">
          <div className="title">
            <FormattedMessage id="kpis.commisions" />
          </div>
        </Card.Header>
        <Card.Body>
          <MonthYearSelection
            year={year}
            setYear={setYear}
            setMonth={setMonth}
            month={month}
          />
          {isLoading ? (
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
                    <FormattedMessage id="theValue" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="theAverage" />
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell align="center">
                    <Header as="h4" image>
                      <Header.Content>
                        <FormattedMessage id="customerApp" />
                      </Header.Content>
                    </Header>
                  </TableCell>
                  <TableCell>
                    <Header.Content>
                      {response && response.data.customerCommission.count}
                    </Header.Content>
                  </TableCell>
                  <TableCell>
                    <Header.Content>
                      {response && response.data.customerCommission.value}
                    </Header.Content>
                  </TableCell>
                  <TableCell>
                    <Header.Content>
                      {response && response.data.customerCommission.average.toFixed(2)}
                    </Header.Content>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">
                    <Header as="h4" image>
                      <Header.Content>
                        <FormattedMessage id="bookingWizardApp" />
                      </Header.Content>
                    </Header>
                  </TableCell>
                  <TableCell>
                    <Header.Content>
                      {response && response.data.bwCommission.value}
                    </Header.Content>
                  </TableCell>
                  <TableCell>
                    <Header.Content>
                      {response && response.data.bwCommission.count}
                    </Header.Content>
                  </TableCell>
                  <TableCell>
                    <Header.Content>
                      {response && response.data.bwCommission.average}
                    </Header.Content>
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
