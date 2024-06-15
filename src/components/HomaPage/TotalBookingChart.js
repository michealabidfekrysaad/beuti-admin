/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import useAPI, { get } from 'hooks/useAPI';
import { Doughnut, Bar, Line, Pie } from 'react-chartjs-2';
import { FormattedMessage, useIntl } from 'react-intl';
import { CircularProgress } from '@material-ui/core';
export default function TotalBookingChart() {
  const { messages } = useIntl();
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  const adminHomePage = 'admin.homePage';
  const {
    response: dailyIncomeRes,
    isLoading: gettingStatisticsIncome,
    setRecall: recallDailyIncome,
  } = useAPI(get, `ServiceProvider/GetCurrentDailyIncome`);

  useEffect(() => {
    recallDailyIncome(true);
  }, []);

  useEffect(() => {
    if (dailyIncomeRes?.data) {
      setError(false);
      setChartData({
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: 'first line',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
          {
            label: 'second line',
            data: [10, 12, 30, 5, 12, 6],
            backgroundColor: ['blue'],
            borderColor: ['#78b3ff'],
            borderWidth: 1,
          },
        ],
      });
    } else if (dailyIncomeRes?.error) {
      setError(dailyIncomeRes?.error?.message);
    }
  }, [dailyIncomeRes]);
  return (
    <>
      <Col lg={12} xs={12} style={{ minHeight: '300px', background: 'white' }}>
        {!error ? (
          gettingStatisticsIncome ? (
            <div className="text-center mt-5">
              <CircularProgress className="mx-auto mt-5" color="secondary" />
            </div>
          ) : (
            <>
              <div>
                <p className="title-primary p-4">{messages['common.booking.count']}</p>
              </div>
              <Line
                data={chartData}
                height={100}
                options={{
                  //   maintainAspectRatio: false,
                  grid: {
                    borderWidth: {
                      top: 1,
                      right: 0,
                      bottom: 0,
                      left: 1,
                    },
                    borderColor: '#6B7280',
                  },
                  scales: {
                    yAxes: {
                      ticks: {
                        color: '#000',
                        // display: false, remove label for y axis
                        beginAtZero: true,
                        // display: false,
                        weight: 900,
                        // color: 'blue',
                        showLabelBackdrop: true,
                        textStrokeColor: 'rgba(0, 0, 0, 0.1)',
                        z: 10,
                        // forces step size to be 150 units
                        stepSize: 150, // <----- This prop sets the stepSize
                      },
                      gridLines: {
                        // color: 'yellow',
                        borderDash: [2, 5],
                      },
                      //   display: false,
                      //   stacked: true,
                      //   reverse: true,
                      alignToPixels: true,
                      weight: 900,
                    },
                  },
                }}
              ></Line>
              <div className="text-center d-flex justify-content-center">
                <p className="p-4" style={{ color: 'rgba(255, 99, 132, 1)' }}>
                  - <FormattedMessage id="customerApp" />
                </p>
                <p className="p-4" style={{ color: '#78b3ff' }}>
                  - <FormattedMessage id="serviceProvidersApp" />
                </p>
                <p className="p-4">
                  - <FormattedMessage id="bookingWizardApp" />
                </p>
                <p className="p-4">
                  - <FormattedMessage id="totalBookings" />
                </p>
              </div>
            </>
          )
        ) : (
          <div className="text-center">
            <h2
              role="presentation"
              className="try-again"
              onMouseUp={() => null}
              onClick={() => !gettingStatisticsIncome && recallDailyIncome(true)}
            >
              {gettingStatisticsIncome ? (
                <span>{messages[`common.loading`]}</span>
              ) : (
                messages[`${adminHomePage}.error`]
              )}
            </h2>
          </div>
        )}{' '}
      </Col>
    </>
  );
}
