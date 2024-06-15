/* eslint-disable no-nested-ternary */
/* eslint-disable  */
import React from 'react';
import { dayIndexEquivalent } from 'functions/timeFunctions';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import moment from 'moment';
import 'moment/locale/ar';
import { workingDays } from 'constants/defaultWorkingTimeEmp';
import { useIntl } from 'react-intl';
import BeutiPagination from '../../../shared/BeutiPagination';
import { defaultDayObject } from '../Helper/AddWHFunction';
import { currentAcion } from '../Helper/AddWHFunction';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import { Image } from 'react-bootstrap';
import { convertSingleNextDayDate } from '../Helper/AddWHFunction';

const EmployeesWHTable = ({
  employeeTotal,
  workingTimeSalon,
  countData,
  setPaginationController,
  paginationController,
  setValue,
  setOpenUpdateModal,
  setAddOrEdit,
}) => {
  const { locale, messages } = useIntl();

  return (
    <>
      <section className="beuti-table workingdate-table">
        <Table style={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell colSpan={2} size="small">
                {messages[`admin.homePage.employeeName`]}
              </TableCell>
              {workingDays.map((el) => (
                <TableCell size="small" key={el.data}>
                  {locale === 'en'
                    ? dayIndexEquivalent(el.message, locale).substring(0, 3)
                    : dayIndexEquivalent(el.message, locale)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {employeeTotal?.map((employee) => {
              return (
                <React.Fragment key={employee.id}>
                  <TableRow style={{ height: '1px' }}>
                    <TableCell style={{ padding: '18px' }} colSpan={2}>
                      <section className="employeetable-name">
                        <div className="employeetable-name__image">
                          <Image src={employee?.image || toAbsoluteUrl('/Avatar.png')} />
                        </div>
                        <div className="employeetable-name__info">
                          <p>
                            <span>{employee?.name}</span>
                          </p>
                        </div>
                      </section>
                    </TableCell>
                    {employee?.employeesWorkDays?.map((day, key) => (
                      <TableCell className="workingdate-tableCell">
                        {day?.shifts?.map((shift, index) => (
                          <button
                            type="button"
                            className="workingdate-tableCell__shift"
                            onClick={(e) => {
                              e.stopPropagation();
                              setValue('day', JSON.parse(JSON.stringify(day)));
                              setOpenUpdateModal(true);
                              setValue('employee', employee);
                              setAddOrEdit(currentAcion.edit);
                            }}
                            key={shift?.id || index}
                          >
                            <p>
                              {moment(shift?.startTime, 'hh:mm:ss')
                                .locale(locale)
                                .format('hh:mm a')}
                            </p>
                            <p>
                              {moment(
                                convertSingleNextDayDate(shift?.endTime),
                                'hh:mm:ss',
                              )
                                .locale(locale)
                                .format('hh:mm a')}
                            </p>
                            {shift?.isNextDay && (
                              <p className="nextday">
                                {messages['setting.employee.wh.nextday']}
                              </p>
                            )}
                          </button>
                        ))}
                        {day?.shifts.length === 0 && (
                          <button
                            type="button"
                            className="workingdate-tableCell__add"
                            key={key}
                            onClick={(e) => {
                              if (workingTimeSalon[day?.day]) {
                                const dayObject = {
                                  ...JSON.parse(JSON.stringify(day)),
                                  shifts: JSON.parse(
                                    JSON.stringify(workingTimeSalon[day?.day].shifts),
                                  ),
                                };
                                setValue('day', dayObject);
                              } else {
                                const dayObject = {
                                  ...JSON.parse(JSON.stringify(day)),
                                  shifts: JSON.parse(
                                    JSON.stringify(defaultDayObject.shifts),
                                  ),
                                };
                                setValue('day', dayObject);
                              }
                              setAddOrEdit(currentAcion.add);
                              setOpenUpdateModal(true);
                              setValue('employee', employee);
                            }}
                          >
                            <i className="flaticon2-add-1 text-default px-2"></i>
                          </button>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </section>
      {countData > 10 && (
        <section className="beuti-table__footer">
          <BeutiPagination
            count={countData}
            setPaginationController={setPaginationController}
            paginationController={paginationController}
          />
        </section>
      )}
    </>
  );
};

export default EmployeesWHTable;
