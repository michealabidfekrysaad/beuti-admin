import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import useApi, { get } from 'hooks/useAPI';
import { expectedObj } from 'components/AdminViews/Services/ServiceExpectedObj';
import { useIntl } from 'react-intl';
import { formatDuration } from 'functions/timeFunctions';
import CloseBackIcon from 'components/shared/CloseBackIcon';
import { CircularProgress } from '@material-ui/core';

export function ServiceDetails() {
  const { serviceId } = useParams();
  const [serviceDetails, setServiceDetails] = useState(expectedObj);
  const disableAll = true;
  const { messages, locale } = useIntl();
  const history = useHistory();

  const hrAlign = locale === 'ar' ? 'right' : 'left';
  const [colorChange, setColorchange] = useState(false);
  const changeNavbarColor = () => {
    if (window.scrollY >= 80) {
      setColorchange(true);
    } else {
      setColorchange(false);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', changeNavbarColor);
  });

  const serviceDetailsAPI = `Service/getServiceById?serviceId=${serviceId}`;
  const { response: serviceDetailsRes, isLoading, setRecall: request } = useApi(
    get,
    serviceDetailsAPI,
  );

  useEffect(() => {
    if (serviceDetailsRes?.data) {
      setServiceDetails(serviceDetailsRes.data);
    }
  }, [serviceDetailsRes]);

  useEffect(() => {
    request(true);
  }, []);

  return (
    <>
      <div className={`close-save-nav ${colorChange ? 'nav__white' : ''}`}>
        <div className="d-flex justify-content-between">
          <div>
            <button type="button" className="btn btn-primary" disabled={disableAll}>
              {isLoading ? (
                <CircularProgress size={24} style={{ color: '#fff' }} />
              ) : (
                messages['serviceDetails.header']
              )}
            </button>
          </div>

          <CloseBackIcon />
        </div>
      </div>
      <Card className="mb-5 p-5 card-special">
        <Card.Header>
          <div className="title">{messages['serviceDetails.header']}</div>
        </Card.Header>
        <Card.Body>
          {isLoading ? (
            <div className="text-center">
              <CircularProgress size={24} color="secondary" />
            </div>
          ) : (
            <>
              <Row className="container-box">
                <Col xs={12}>
                  <p className="container-box__controllers--header">
                    {messages['spAdmin.service.add.general.info']}
                  </p>
                </Col>
                <Col className="container-box__controllers mt-2 mb-2" lg={6} xs={12}>
                  <label
                    htmlFor="GCT"
                    className="container-box__controllers--label w-100"
                  >
                    {messages['table.categories.generalCenterType']}
                  </label>
                  <input
                    className="input-box__controllers-input w-75"
                    id="GCT"
                    disabled={disableAll}
                    value={serviceDetails.generalCenterTypeName || ''}
                    readOnly
                  ></input>
                </Col>
                <Col className="container-box__controllers mt-2 mb-2" lg={6} xs={12}>
                  <label
                    htmlFor="centerType"
                    className="container-box__controllers--label w-100"
                  >
                    {messages['table.categories.centerType']}
                  </label>
                  <input
                    className="input-box__controllers-input w-75"
                    id="centerType"
                    disabled={disableAll}
                    value={serviceDetails.centerTypeName || ''}
                    readOnly
                  ></input>
                </Col>
                <Col className="container-box__controllers mt-2 mb-2" lg={6} xs={12}>
                  <label
                    htmlFor="category"
                    className="container-box__controllers--label w-100"
                  >
                    {messages['table.categories.categories']}
                  </label>
                  <input
                    className="input-box__controllers-input w-75"
                    id="category"
                    disabled={disableAll}
                    value={serviceDetails.categoryName || ''}
                    readOnly
                  ></input>
                </Col>
                <Col className="container-box__controllers mt-2 mb-2" lg={6} xs={12}>
                  <label
                    htmlFor="status"
                    className="container-box__controllers--label w-100"
                  >
                    {messages['serviceDetails.status']}
                  </label>
                  <input
                    className="input-box__controllers-input w-75"
                    id="status"
                    disabled={disableAll}
                    value={
                      (serviceDetailsRes?.data && serviceDetails.isActive
                        ? messages['common.Active']
                        : messages['common.InActive']) || ''
                    }
                    readOnly
                  ></input>
                </Col>
                <Col className="container-box__controllers mt-2 mb-2" lg={6} xs={12}>
                  <label
                    htmlFor="arName"
                    className="container-box__controllers--label w-100"
                  >
                    {messages['serviceDetails.serviceNameAr']}
                  </label>
                  <input
                    className="input-box__controllers-input w-75"
                    id="arName"
                    disabled={disableAll}
                    value={serviceDetails.arName || ''}
                    readOnly
                  ></input>
                </Col>
                <Col className="container-box__controllers mt-2 mb-2" lg={6} xs={12}>
                  <label
                    htmlFor="enName"
                    className="container-box__controllers--label w-100"
                  >
                    {messages['serviceDetails.serviceNameAr']}
                  </label>
                  <input
                    className="input-box__controllers-input w-75"
                    id="enName"
                    disabled={disableAll}
                    value={serviceDetails.enName || ''}
                    readOnly
                  ></input>
                </Col>
                <Col className="container-box__controllers mt-2 mb-2" lg={6} xs={12}>
                  <label
                    htmlFor="serviceDuration"
                    className="container-box__controllers--label w-100"
                  >
                    {messages['serviceDetails.serviceDuration']}
                  </label>
                  <input
                    className="input-box__controllers-input w-75"
                    id="serviceDuration"
                    disabled={disableAll}
                    value={
                      (serviceDetails.duration &&
                        formatDuration(serviceDetails.duration, locale, messages)) ||
                      ''
                    }
                    readOnly
                  ></input>
                </Col>
                <Col className="container-box__controllers mt-2 mb-2" lg={6} xs={12}>
                  <label
                    htmlFor="serPrice"
                    className="container-box__controllers--label w-100"
                  >
                    {messages['serviceDetails.servicePrice']}
                  </label>
                  <input
                    className="input-box__controllers-input w-75"
                    id="serPrice"
                    disabled={disableAll}
                    value={
                      (serviceDetails.priceValue &&
                        serviceDetails.priceValue + messages['common.currency']) ||
                      ''
                    }
                    readOnly
                  ></input>
                </Col>
              </Row>

              <hr className="hr-style" align={hrAlign} />

              <Row className="container-box">
                <Col xs={12}>
                  <p className="container-box__controllers--header">
                    {messages['spAdmin.service.add.employees']}
                  </p>
                </Col>
                {serviceDetails.employeeList.map((emp) => (
                  <Col
                    xs={3}
                    key={emp.id}
                    title={messages['serviceDetails.emp.details']}
                    className="emp-service-details"
                    onClick={() => history.push(`/employees/${emp.id}`)}
                  >
                    <h4 className="pb-1">{emp.name}</h4>
                    <p>{messages['sAdmin.spDetails.employees.table.employeeType']}</p>
                    <p>{emp.typeName}</p>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
}
