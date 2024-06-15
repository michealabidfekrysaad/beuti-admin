import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Routes } from 'constants/Routes';

import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import emp from '../../../assets/img/dashboard/emp.svg';
import alert from '../../../assets/img/dashboard/alert.svg';
import right from '../../../assets/img/dashboard/right.svg';
import info from '../../../assets/img/dashboard/info.svg';
import services from '../../../assets/img/dashboard/services.svg';
import time from '../../../assets/img/dashboard/time.svg';
import images from '../../../assets/img/dashboard/images.svg';

export default function AlertCenterInfo({ profileCompleted }) {
  const { messages } = useIntl();
  const history = useHistory();
  const adminHomePage = 'admin.homePage';

  return (
    <>
      <Row>
        <Col xs={12}>
          <SVG src={toAbsoluteUrl(`${alert}`)} />
          <h3 className="title-information">
            {messages[`${adminHomePage}.completeInfo`]}
          </h3>
          <p className="hint-information">
            {messages[`${adminHomePage}.hintForComplete`]}
          </p>
        </Col>
      </Row>
      <Row className="d-flex justify-content-around mt-3 text-center">
        <Col lg={2} md={6}>
          <Row className="info-card">
            <Col xs={12} className="info-card__img">
              <SVG src={toAbsoluteUrl(`${emp}`)} />
            </Col>
            <Col xs={12} className="info-card__header">
              <p className="info-card__header-label">
                {messages[`${adminHomePage}.addEmployee`]}
              </p>
            </Col>
            <Col xs={12} className="info-card__hint">
              <p className="info-card__hint-label">
                {messages[`${adminHomePage}.addEmployee.hint`]}
              </p>
            </Col>
            <Col xs={12} className="info-card__btn">
              {profileCompleted?.data?.employees ? (
                <SVG src={toAbsoluteUrl(`${right}`)} />
              ) : (
                <button
                  onClick={() => history.push(Routes.employeeAdd)}
                  type="button"
                  className="btn btn-primary"
                >
                  {messages[`common.add`]}
                </button>
              )}
            </Col>
          </Row>
        </Col>
        {/* first comp */}
        <Col lg={2} md={6}>
          <Row className="info-card">
            <Col xs={12} className="info-card__img">
              <SVG src={toAbsoluteUrl(`${info}`)} />
            </Col>
            <Col xs={12} className="info-card__header">
              <p className="info-card__header-label">
                {messages[`${adminHomePage}.generalInforamtion`]}
              </p>
            </Col>
            <Col xs={12} className="info-card__hint">
              <p className="info-card__hint-label">
                {messages[`${adminHomePage}.generalInforamtion.hint`]}
              </p>
            </Col>
            <Col xs={12} className="info-card__btn">
              {profileCompleted?.data?.isProfileCompleted ? (
                <SVG src={toAbsoluteUrl(`${right}`)} />
              ) : (
                <button
                  onClick={() => history.push(Routes.settingsSP)}
                  type="button"
                  className="btn btn-primary"
                >
                  {messages[`common.add`]}
                </button>
              )}
            </Col>
          </Row>
        </Col>
        <Col lg={2} md={6}>
          <Row className="info-card">
            <Col xs={12} className="info-card__img">
              <SVG src={toAbsoluteUrl(`${services}`)} />
            </Col>
            <Col xs={12} className="info-card__header">
              <p className="info-card__header-label">
                {messages[`${adminHomePage}.services`]}
              </p>
            </Col>
            <Col xs={12} className="info-card__hint">
              <p className="info-card__hint-label">
                {messages[`${adminHomePage}.services.hint`]}
              </p>
            </Col>
            <Col xs={12} className="info-card__btn">
              {profileCompleted?.data?.service ? (
                <SVG src={toAbsoluteUrl(`${right}`)} />
              ) : (
                <button
                  onClick={() => history.push(Routes.servicesAdd)}
                  type="button"
                  className="btn btn-primary"
                >
                  {messages[`common.add`]}
                </button>
              )}
            </Col>
          </Row>
        </Col>
        <Col lg={2} md={6}>
          <Row className="info-card">
            <Col xs={12} className="info-card__img">
              <SVG src={toAbsoluteUrl(`${time}`)} />
            </Col>
            <Col xs={12} className="info-card__header">
              <p className="info-card__header-label">
                {messages[`${adminHomePage}.workingTime`]}
              </p>
            </Col>
            <Col xs={12} className="info-card__hint">
              <p className="info-card__hint-label">
                {messages[`${adminHomePage}.workingTime.hint`]}
              </p>
            </Col>
            <Col xs={12} className="info-card__btn">
              {/* {profileCompleted?.data?.service ? (
                <SVG src={toAbsoluteUrl(`${right}`)} />
              ) : (
                <button type="button" className="btn btn-primary">
                  {messages[`${adminHomePage}.services.hint`]}{' '}
                </button>
              )} */}
              miss work time in API
            </Col>
          </Row>
        </Col>
        <Col lg={2} md={6}>
          <Row className="info-card">
            <Col xs={12} className="info-card__img">
              <SVG src={toAbsoluteUrl(`${images}`)} />
            </Col>
            <Col xs={12} className="info-card__header">
              <p className="info-card__header-label">
                {messages[`${adminHomePage}.addImages`]}
              </p>
            </Col>
            <Col xs={12} className="info-card__hint">
              <p className="info-card__hint-label">
                {messages[`${adminHomePage}.addImages.hint`]}
              </p>
            </Col>
            <Col xs={12} className="info-card__btn">
              {profileCompleted?.data?.userImage ? (
                <SVG src={toAbsoluteUrl(`${right}`)} />
              ) : (
                <button
                  onClick={() => history.push(Routes.settingsSP)}
                  type="button"
                  className="btn btn-primary"
                >
                  {messages[`common.add`]}
                </button>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
AlertCenterInfo.propTypes = {
  profileCompleted: PropTypes.object,
};
