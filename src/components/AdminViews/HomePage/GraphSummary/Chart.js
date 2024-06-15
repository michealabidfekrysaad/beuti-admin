/* eslint-disable no-nested-ternary */
import React, { useEffect, useRef, useState } from 'react';
import useAPI, { get } from 'hooks/useAPI';
import { Doughnut, Bar, Line, Pie } from 'react-chartjs-2';
import { useIntl } from 'react-intl';
import { CircularProgress } from '@material-ui/core';

export default function Chart() {
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
      setChartData({
        labels: dailyIncomeRes?.data?.list.map(({ date }) =>
          date
            .split('T')[0]
            .replace('2021-', '')
            .replace('2022-', ''),
        ),
        datasets: [
          {
            label: `${messages[`${adminHomePage}.statistics`]}`,
            data: dailyIncomeRes?.data?.list.map(({ income }) => income),
            backgroundColor: ['#a82f96'],
          },
        ],
      });
    } else if (dailyIncomeRes?.error) {
      setError(dailyIncomeRes?.error?.message);
    }
  }, [dailyIncomeRes]);

  return (
    <>
      {!error ? (
        gettingStatisticsIncome ? (
          <div className="text-center mt-5">
            <CircularProgress className="mx-auto mt-5" color="secondary" />
          </div>
        ) : (
          <Line
            data={chartData}
            height={100}
            options={{
              maintainAspectRatio: false,
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
                    // beginAtZero: true,
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
      )}
    </>
  );
}
