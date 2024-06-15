import React, { useState } from 'react';
import { Modal, Col, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import PropTypes from 'prop-types';
import { dayIndexEquivalent } from 'functions/timeFunctions';
import { hoursMinutesDropDown, hoursMinutesDropDownAr } from 'constants/hours';
import { DatePicker } from '@material-ui/pickers';
import moment from 'moment';

export default function SeasonalTimeModal({
  workingTime,
  setConfirmOtp,
  setOpenSeason,
  openSeason,
}) {
  const { messages, locale } = useIntl();
  const [deleteDay, setDeleteDay] = useState(100);
  const [seasonStartDate, setSeasonStartDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [seasonEndDate, setSeasonEndDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [arName, setArName] = useState('');
  const [enName, setEnName] = useState('');
  const hoursDD = locale === 'ar' ? hoursMinutesDropDownAr : hoursMinutesDropDown;

  const closeModal = () => {
    setOpenSeason(false);
  };

  return (
    <>
      <Modal
        // onHide={() => {
        //   closeModal();
        // }}
        show={openSeason}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="bootstrap-modal-customizing otp-confirm-modal"
      >
        <div className="otp-box">
          <div className="employee-box__title">
            {messages[`admin.settings.time.season.work`]}
          </div>
          <button onClick={() => closeModal()} type="button" className="close-icon">
            <i className="flaticon2-cancel-music"></i>
          </button>
        </div>
        <Modal.Body>
          <Row>
            <Col className="input-box__controllers mt-2 mb-2" lg={6} xs={12}>
              <label
                htmlFor="seasonArName"
                className="input-box__controllers__label w-100"
              >
                {messages[`admin.settings.time.season.ar.name`]}
              </label>
              <input
                name="seasonArName"
                className="input-box__controllers-input w-75"
                id="seasonArName"
                placeholder={messages[`admin.settings.time.season.ar.name`]}
                onChange={(e) => {
                  setArName(e.target.value);
                }}
                value={arName || ''}
              ></input>
              {arName.length !== 0 && arName.length <= 1 && (
                <p className="pt-2 text-danger">
                  {/* {messages[`${adminSettingsChangeUsername}.error`]} */}
                  error
                </p>
              )}
            </Col>
            <Col className="input-box__controllers mt-2 mb-2" lg={6} xs={12}>
              <label
                htmlFor="seasonEnName"
                className="input-box__controllers__label w-100"
              >
                {messages[`admin.settings.time.season.en.name`]}
              </label>
              <input
                name="seasonEnName"
                className="input-box__controllers-input w-75"
                id="seasonEnName"
                placeholder={messages[`admin.settings.time.season.en.name`]}
                onChange={(e) => {
                  setEnName(e.target.value);
                }}
                value={enName || ''}
              ></input>
              {enName.length !== 0 && enName.length <= 1 && (
                <p className="pt-2 text-danger">
                  {/* {messages[`${adminSettingsChangeUsername}.error`]} */}
                  error
                </p>
              )}
            </Col>
            <Col className="input-box__controllers mt-2 mb-2" lg={6} xs={12}>
              <label
                htmlFor="startSeasonDate"
                className="input-box__controllers__label w-100"
              >
                {messages['admin.settings.time.season.start']}
              </label>
              <DatePicker
                id="startSeasonDate"
                className="date-focus w-75"
                value={seasonStartDate}
                //   label="Booking Day"
                variant="outlined"
                format="dd/MM/yyyy"
                onChange={(value) => {
                  const start = moment(value).format('YYYY-MM-DD');
                  setSeasonStartDate(start);
                }}
                autoOk="true"
                okLabel={null}
                cancelLabel={null}
              />
            </Col>
            <Col className="input-box__controllers mt-2 mb-2" lg={6} xs={12}>
              <label
                htmlFor="endSeasonDate"
                className="input-box__controllers__label w-100"
              >
                {messages['admin.settings.time.season.end']}
              </label>
              <DatePicker
                id="endSeasonDate"
                className="date-focus w-75"
                value={seasonEndDate}
                //   label="Booking Day"
                variant="outlined"
                format="dd/MM/yyyy"
                onChange={(value) => {
                  const start = moment(value).format('YYYY-MM-DD');
                  setSeasonEndDate(start);
                }}
                autoOk="true"
                okLabel={null}
                cancelLabel={null}
              />
            </Col>
            <Col xs={12}>
              <div className="table-responsive">
                <Table>
                  <TableBody>
                    {workingTime.length > 0 ? (
                      workingTime.map((day) => (
                        <TableRow key={day.day} className="work-salon-time">
                          <TableCell className="work-salon-time__cell font-weight-bold">
                            {dayIndexEquivalent(day.day, locale)}
                          </TableCell>
                          <TableCell className="work-salon-time__cell">
                            <div className="work-salon-time__cell--data">
                              <input
                                className="form-check-input custom-color work-salon-time__cell--data__chechbox"
                                type="checkbox"
                                checked={deleteDay !== day.day && day?.startTime}
                                onChange={() => setDeleteDay(day.day)}
                                id="salonTimeAdded"
                              />
                            </div>
                          </TableCell>
                          <TableCell align="center" className="work-salon-time__cell">
                            <div className="work-salon-time__cell--data w-100">
                              <span className="work-salon-time__cell--data__from-to">
                                {messages['common.from']}
                              </span>
                              <select
                                id="startTimeSalon"
                                className="w-100 input-box__controllers-select"
                                //   onChange={(event) => {
                                //     setChangeMyCity(event.target.value);
                                //   }}
                                value={day.startTime}
                              >
                                {hoursDD?.map((hour) => (
                                  <option
                                    className="font-size container-box__controllers-select__options"
                                    key={hour.key}
                                    value={hour.value}
                                  >
                                    {hour.text}
                                  </option>
                                ))}
                              </select>
                              {/* {formatTime(day.startTime, locale)} */}
                            </div>
                          </TableCell>
                          <TableCell align="center" className="work-salon-time__cell">
                            <div className="work-salon-time__cell--data w-100">
                              <span className="work-salon-time__cell--data__from-to">
                                {messages['common.to']}
                              </span>
                              <select
                                id="endTimeSalon"
                                className="w-100 input-box__controllers-select"
                                //   onChange={(event) => {
                                //     setChangeMyCity(event.target.value);
                                //   }}
                                value={day.endTime}
                              >
                                {hoursDD?.map((hour) => (
                                  <option
                                    className="font-size container-box__controllers-select__options"
                                    key={hour.key}
                                    value={hour.value}
                                  >
                                    {hour.text}
                                  </option>
                                ))}
                              </select>
                              {/* {formatTime(day.endTime, locale)} */}
                            </div>
                          </TableCell>
                          <TableCell className="work-salon-time__cell"></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4}>{messages['common.noData']}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setConfirmOtp(true);
              closeModal();
            }}
          >
            {messages['common.save']}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

SeasonalTimeModal.propTypes = {
  setConfirmOtp: PropTypes.func,
  setOpenSeason: PropTypes.func,
  openSeason: PropTypes.bool,
  workingTime: PropTypes.array,
};
