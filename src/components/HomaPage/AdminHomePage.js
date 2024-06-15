import React, { useMemo } from 'react';
import { Switch, useLocation } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PageTabs from 'Shared/PageTabs/PageTabs';
import { AdminRoute } from 'Routes/PrivateRoute';
import { Routes } from 'constants/Routes';
import FinancialTabStatistics from './FinancialTabStatistics';
import ReportsTabStatistics from './ReportsTabStatistics';

function AdminHomePage() {
  const { messages } = useIntl();
  const location = useLocation();

  const tabsArray = useMemo(
    () => [
      {
        key: 1,
        message: 'admin.settings.general.finance',
        link: Routes.home,
      },
      {
        key: 2,
        message: 'admin.reports',
        link: Routes.reportsStatisctics,
      },
    ],
    [],
  );

  return (
    <>
      <Card>
        <Card.Header>
          <div className="title">
            {Routes.home === location.pathname
              ? messages['sAdmin.spDetails.details']
              : messages['admin.reports']}
          </div>
          <PageTabs tabsArray={tabsArray} />
        </Card.Header>
      </Card>

      <Switch>
        <AdminRoute exact path={Routes.home}>
          <FinancialTabStatistics />
        </AdminRoute>
        <AdminRoute exact path={Routes.reportsStatisctics}>
          <ReportsTabStatistics />
        </AdminRoute>
      </Switch>
    </>
  );
}

export default AdminHomePage;
