/* eslint-disable no-return-assign */
import React from 'react';
import { Grid } from 'semantic-ui-react';
import RegKPI from 'components/SuperAdminViews/KPIS/RegKPI';
import PromoRefferalKPI from 'components/SuperAdminViews/KPIS/PromoRefferalKPI';
import SpsKpi from 'components/SuperAdminViews/KPIS/SpsKpi';
import CityKPI from 'components/SuperAdminViews/KPIS/CityKPI';
import BookingsCountValueKPI from 'components/SuperAdminViews/KPIS/BookingsCountValueKPI';
import ClientsMonthlyKPI from 'components/SuperAdminViews/KPIS/CientsMonthlyKPI';
import MonthlyCommisionKPI from 'components/SuperAdminViews/KPIS/MonthlyCommissionKPI';
import GrossMerchandiseValue from 'components/SuperAdminViews/KPIS/GrossMerchandiseValue';
import InActiveUsersCounts from 'components/SuperAdminViews/KPIS/InActiveUsersCounts';
import GetActiveUsersCounts from 'components/SuperAdminViews/KPIS/GetActiveUsersCounts';
import GetAverageRevenue from 'components/SuperAdminViews/KPIS/GetAverageRevenue';
import RatingsKPI from 'components/SuperAdminViews/KPIS/RatingsKPI';

function SuperAminHomePage() {
  return (
    <Grid columns={3} style={{ marginBottom: '3em' }}>
      <Grid.Row>
        <Grid.Column width={4}>
          <RegKPI />
        </Grid.Column>
        <Grid.Column width={6}>
          <ClientsMonthlyKPI />
        </Grid.Column>
        <Grid.Column width={6}>
          <PromoRefferalKPI />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={10}>
          <SpsKpi />
        </Grid.Column>
        <Grid.Column width={6}>
          <CityKPI />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={10}>
          <BookingsCountValueKPI />
        </Grid.Column>
        <Grid.Column width={6}>
          <GrossMerchandiseValue />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={6}>
          <GetAverageRevenue />
        </Grid.Column>
        <Grid.Column width={10}>
          <GetActiveUsersCounts />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={5}>
          <RatingsKPI />
        </Grid.Column>
        <Grid.Column width={6}>
          <MonthlyCommisionKPI />
        </Grid.Column>
        <Grid.Column width={5}>
          <InActiveUsersCounts />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default SuperAminHomePage;
