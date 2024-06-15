import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingProfile } from 'components/shared/Shimmer';
import { Card, Icon, Grid, List, Tab, Divider } from 'semantic-ui-react';
import { Button, Col, Row } from 'react-bootstrap';
import moment from 'moment';

import useApi, { get, put } from 'hooks/useAPI';
import { expectedObj } from 'components/SuperAdminViews/ServiceProviderDetails/serviceProviderDataObj';
import { useIntl } from 'react-intl';
import elliot from 'assets/img/elliot.jpg';
import StarRatings from 'react-star-ratings';
import {
  WorkingDaysTable,
  EmployeeList,
  ServicesCategoriesList,
  SPStatistics,
  ImagesList,
} from './views';
import Wallet from './views/Wallet';
import AccountManage from './views/AccountManage';
import SPCommission from './views/Commission';

export function SPDetails() {
  const { serviceProviderId } = useParams();
  const [spDetails, setSpDetails] = useState(expectedObj);
  const { messages } = useIntl();
  const [toggleSpIsEnabled, SetToggleSpIsEnabled] = useState('');
  const spData = `ServiceProvider/GetSPDetails?serviceProviderId=${serviceProviderId}`;

  const { response: spDataRes, isLoading, setRecall: request } = useApi(get, spData);
  const {
    response: updateSPStatusRes,
    isLoading: updateSPStatusLoading,
    setRecall: updateSPStatusRecall,
  } = useApi(
    put,
    `ServiceProvider/UpdateEnableServiceProvider?serviceProviderId=${serviceProviderId}&isEnabled=${toggleSpIsEnabled}`,
  );

  const {
    generalCenterTypeList,
    workDaysList,
    employeTypes,
    name,
    city,
    address,
    mobile,
    userRateNo,
    status,
    isBusy,
    totalBooking,
    totalClients,
    totalCommission,
    totalProfit,
    totalServices,
    imageURLsList,
    id,
    isManuallyAdded,
    businessCategoryName,
  } = spDetails;
  useEffect(() => {
    if (toggleSpIsEnabled !== '') {
      updateSPStatusRecall(true);
    }
  }, [toggleSpIsEnabled]);
  useEffect(() => {
    if (updateSPStatusRes?.data) {
      request(true);
    }
  }, [updateSPStatusRes]);
  const rating = (
    <div dir="ltr" style={{ margin: '1em' }}>
      <StarRatings rating={userRateNo || 0.01} starDimension="15px" starSpacing="5px" />
    </div>
  );

  // Status and availability
  const meta = (
    <>
      <div className="header" style={{ margin: '0.25em 0em' }}>
        {businessCategoryName}
      </div>
      <div className="meta extra-meta-bigger" style={{ margin: '0.25em 0em' }}>
        <Icon name="user" color={status ? 'green' : 'red'} />
        <span className="mx-1">
          {status
            ? messages['sAdmin.spList.search.dropdown.activeOnly']
            : messages['sAdmin.spList.search.dropdown.inactiveOnly']}
        </span>
      </div>
      <div className="meta extra-meta-bigger">
        <Icon name={isBusy ? 'x' : 'check'} color={isBusy ? 'red' : 'green'} />
        <span className="mx-1">
          {messages['sAdmin.spDetails.workingDays.data.onlineBookingStatus']}
        </span>
      </div>
    </>
  );

  const extra = (
    // CITY
    <div as="h3" className="extra-meta-bigger">
      <Icon name="map marker alternate" />
      {city}
    </div>
  );

  const panes = [
    {
      menuItem: messages['sAdmin.spDetails.details'],
      render: () => (
        <Tab.Pane basic attached={false} className="mb-2" verticalAlign="middle">
          <List>
            <List.Item as="h3" icon="map" content={address} />
            <List.Item as="h3" icon="mobile" content={mobile} />
            <SPCommission />
            <Row
              className="beuti-commission mt-2"
              style={{
                background: `${
                  moment(spDetails.startCommissionDate).isSameOrBefore(moment())
                    ? '#368B85'
                    : '#FFB740'
                }`,
                color: '#fff',
              }}
            >
              <Col xs="auto">
                <p>
                  {messages['table.spList.header.startCommissionDate']} :
                  {spDetails.startCommissionDate ? (
                    <>{moment(spDetails.startCommissionDate).format('DD/MM/YYYY')}</>
                  ) : (
                    <>{messages['table.spList.header.noStartCommissionDate']}</>
                  )}
                </p>
              </Col>
            </Row>
            {isManuallyAdded && !spDetails.startCommissionDate && (
              <Row className="mt-2">
                <Col xs="auto">
                  <Button
                    className="px-5 py-2"
                    variant={status ? 'success' : 'danger'}
                    disabled={updateSPStatusLoading || isLoading}
                    onClick={() => {
                      SetToggleSpIsEnabled(!status);
                    }}
                  >
                    {status
                      ? messages['sAdmin.spList.search.dropdown.activeOnly']
                      : messages['sAdmin.spList.search.dropdown.inactiveOnly']}
                  </Button>
                </Col>
              </Row>
            )}
            <Divider section />
            <SPStatistics
              totalBooking={totalBooking}
              totalClients={totalClients}
              totalCommission={totalCommission}
              totalProfit={totalProfit}
              totalServices={totalServices}
            />
          </List>
        </Tab.Pane>
      ),
    },
    {
      menuItem: messages['sAdmin.spDetails.workingDays.table.header'],
      render: () => (
        <Tab.Pane basic attached={false} className="mb-2">
          <WorkingDaysTable workDaysList={workDaysList} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: messages['sAdmin.spDetails.employees.table.header'],
      render: () => (
        <Tab.Pane basic attached={false} className="mb-2">
          <EmployeeList employeTypes={employeTypes} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: messages['sAdmin.spDetails.services.table.services'],
      render: () => (
        <Tab.Pane basic attached={false} className="mb-2">
          <ServicesCategoriesList generalCenterTypeList={generalCenterTypeList} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: messages['sAdmin.spDetails.images'],
      render: () => (
        <Tab.Pane basic attached={false} className="mb-2">
          <ImagesList images={imageURLsList} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: messages['sAdmin.spDetails.wallet'],
      render: () => (
        <Tab.Pane basic attached={false} className="mb-2">
          <Wallet />
        </Tab.Pane>
      ),
    },
    {
      menuItem: messages['sAdmin.spDetails.manageAccount'],
      render: () => (
        <Tab.Pane basic attached={false} className="mb-2">
          <AccountManage mobile={mobile} id={id} />
        </Tab.Pane>
      ),
    },
  ];

  useEffect(() => {
    if (spDataRes && spDataRes.data) {
      setSpDetails(spDataRes.data);
    }
  }, [spDataRes]);

  useEffect(() => {
    request(true);
  }, []);

  return isLoading ? (
    <LoadingProfile type="profile" fluid />
  ) : (
    <>
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column width={5}>
            <Card
              image={spDetails.profileImage || elliot}
              header={name}
              meta={meta}
              description={rating}
              extra={extra}
            />
          </Grid.Column>
          <Grid.Column verticalAlign="top" width={11}>
            <Tab menu={{ pointing: true }} panes={panes} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Divider section hidden />
    </>
  );
}
