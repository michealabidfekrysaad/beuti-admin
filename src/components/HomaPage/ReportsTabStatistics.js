import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Routes } from 'constants/Routes';
import { Col, Row, Card } from 'react-bootstrap';
export default function ReportsTabStatistics() {
  const { messages } = useIntl();
  const scope = 'admin.reports';

  return (
    <>
      <Row className="mb-4">
        {/* the first- colum */}
        <Col xs={12} lg={6}>
          <Row>
            <Col xs={12} className="mt-4">
              <Card>
                <Card.Body>
                  <p className="reports-primary-header">
                    {messages['admin.reports.finance']}
                  </p>
                  <p className="reports-primary-hint">
                    {messages['admin.reports.finance.hint']}
                  </p>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages['admin.reports.finance.summary.repo']}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages['admin.reports.finance.summary.pay']}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages['admin.reports.finance.pay.record']}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages['admin.reports.finance.summary.tax']}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages['admin.reports.finance.summary.sales']}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages['admin.reports.finance.pend.invoice']}
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} className="mt-4">
              <Card>
                <Card.Body>
                  <p className="reports-primary-header">
                    {messages[`${scope}.Inventory`]}
                  </p>
                  <p className="reports-primary-hint">
                    {messages[`${scope}.Inventory.hint`]}
                  </p>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.Inventory.prod.available`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.Inventory.prod.perform`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.Inventory.prod.history`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.Inventory.prod.summary`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.Inventory.prod.cost`]}
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} className="mt-4">
              <Card>
                <Card.Body>
                  <p className="reports-primary-header">{messages[`${scope}.booking`]}</p>
                  <p className="reports-primary-hint">
                    {messages[`${scope}.booking.hint`]}
                  </p>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.booking.appoi.list`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.booking.appoi.summary`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.booking.appoi.cancell`]}
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} className="mt-4">
              <Card>
                <Card.Body>
                  <p className="reports-primary-header">{messages[`${scope}.clients`]}</p>
                  <p className="reports-primary-hint">
                    {messages[`${scope}.clients.hint`]}
                  </p>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.clients.list`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.clients.retention`]}
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* the second- colum */}
        <Col xs={12} lg={6}>
          <Row>
            <Col xs={12} className="mt-4">
              <Card>
                <Card.Body>
                  <p className="reports-primary-header">{messages[`${scope}.sales`]}</p>
                  <p className="reports-primary-hint">
                    {messages[`${scope}.sales.hint`]}
                  </p>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.sales.prod.sale`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.sales.type.sale`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.sales.service.sale`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.sales.website.sale`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.sales.client.sale`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.sales.emp.sale`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.sales.hrs.sale`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.sales.day.sale`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.sales.month.sale`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.sales.quarYear.sale`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.sales.year.sale`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.sales.history.sale`]}
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} className="mt-4">
              <Card>
                <Card.Body>
                  <p className="reports-primary-header">{messages[`${scope}.voucher`]}</p>
                  <p className="reports-primary-hint">
                    {messages[`${scope}.voucher.hint`]}
                  </p>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.voucher.balance`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.voucher.sales`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.voucher.uses`]}
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} className="mt-4">
              <Card>
                <Card.Body>
                  <p className="reports-primary-header">{messages[`${scope}.emp`]}</p>
                  <p className="reports-primary-hint">{messages[`${scope}.emp.hint`]}</p>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.emp.time`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.emp.comission`]}
                  </Link>
                  <Link className="reports-primary-links" to={Routes.reportsStatisctics}>
                    {messages[`${scope}.emp.detailed.comission`]}
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
