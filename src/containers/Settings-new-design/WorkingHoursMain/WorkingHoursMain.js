/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Routes } from 'constants/Routes';
import { Row, Col, Dropdown, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Fade from '@material-ui/core/Fade';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@material-ui/core';
import moment from 'moment';
import { CallAPI } from 'utils/API/APIConfig';
import { toast } from 'react-toastify';
import { dayIndexEquivalent } from 'functions/timeFunctions';
import {
  CHECK_DELETE,
  SEASON_DELETE,
  SP_CLOSING_PERIOD_GET,
  SP_GET_ACTIVE_WORKING_TIME,
  WORKING_GET_DAYS,
  WORKING_GET_SEASONS,
} from 'utils/API/EndPoints/WorkingTime';
import { ConfirmationModal } from '../../../components/shared/ConfirmationModal';
import Edit from '../../../assets/img/dashboard/pen.svg';
import Delete from '../../../assets/img/dashboard/trash.svg';

export default function WorkingHoursMain() {
  const history = useHistory();
  const { messages, locale } = useIntl();
  moment.locale(locale === 'ar' ? 'ar' : 'en');
  const [showActiveInfo, setShowActiveInfo] = useState(true);
  const [openModalAfterSecondConfirm, setOpenModalAfterSecondConfirm] = useState(false);
  const [deletedSeasonId, setDeletedSeasonId] = useState(false);
  const [thePayloadForDelete, setThePayloadForDelete] = useState(false);
  const [activeTime, setActiveTime] = useState();
  const [allClosingPeriods, setAllClosingPeriods] = useState([]);
  const defaultArrayDays = [
    { day: 0, name: 'Sunday', dayClosed: true, shifts: [] },
    { day: 1, name: 'Monday', dayClosed: true, shifts: [] },
    { day: 2, name: 'Tuesday', dayClosed: true, shifts: [] },
    { day: 3, name: 'Wednesday', dayClosed: true, shifts: [] },
    { day: 4, name: 'Thursday', dayClosed: true, shifts: [] },
    { day: 5, name: 'Friday', dayClosed: true, shifts: [] },
    { day: 6, name: 'Saturday', dayClosed: true, shifts: [] },
  ];
  const [expDefault, setExpDefault] = useState('');
  const [expSeason, setExpSeason] = useState('');
  const [expClose, setExpClose] = useState('');

  const defaultAccord = (panel) => (event, newExpanded) => {
    setExpDefault(newExpanded ? panel : false);
  };
  const defaultSeason = (panel) => (event, newExpanded) => {
    setExpSeason(newExpanded ? panel : false);
  };
  const defaultClose = (panel) => (event, newExpanded) => {
    setExpClose(newExpanded ? panel : false);
  };

  const { refetch: refetchClosingPeriod, isFetching: fetchingClosingPeriod } = CallAPI({
    name: 'closongPeriods',
    url: SP_CLOSING_PERIOD_GET,
    refetchOnWindowFocus: false,
    enabled: true,
    // retry: 1,
    onSuccess: (res) => {
      setAllClosingPeriods(res);
    },
    select: (res) => res && res?.data?.data?.list,
    onError: (err) => toast.error(err?.response?.data),
  });

  const { isFetching: fetchWorkingHours, data: allWorkingHoursDays } = CallAPI({
    name: 'getDefaultWorkingHours',
    url: WORKING_GET_DAYS,
    select: (res) =>
      defaultArrayDays?.map((singleDay) => {
        const findOrNot = res?.data?.data.find((elm) => elm.day === singleDay?.day);
        return findOrNot || singleDay;
      }),
    enabled: true,
    refetchOnWindowFocus: false,
    // retry: 1,
  });

  const { refetch: refetchChecking } = CallAPI({
    name: 'checkBeforeDeleteSeason',
    url: CHECK_DELETE,
    // retry: 1,
    query: {
      id: deletedSeasonId,
    },
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      if (res?.data?.data?.success) {
        setOpenModalAfterSecondConfirm(true);
      } else {
        refetchDeleteSeason();
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.response?.status);
    },
  });

  const { refetch: refetchDeleteSeason } = CallAPI({
    name: 'deleteSeasonByID',
    url: SEASON_DELETE,
    method: 'delete',
    refetchOnWindowFocus: false,
    // retry: 1,
    query: {
      id: thePayloadForDelete || deletedSeasonId,
    },
    onSuccess: (res) => {
      if (res?.data?.isSuccess) {
        toast.success(messages['delete.success']);
        fetchSeasonsAgain();
        getActivetime();
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.response?.status);
    },
  });

  useEffect(() => {
    if (thePayloadForDelete) {
      refetchDeleteSeason();
    }
  }, [thePayloadForDelete]);

  const {
    isFetching: fetchSeasons,
    refetch: fetchSeasonsAgain,
    data: allSeasons,
  } = CallAPI({
    name: 'getAllSeasons',
    url: WORKING_GET_SEASONS,
    select: (res) => {
      const data = res?.data?.data?.map((singleSea) => {
        const newSeasonWorkingTimes = defaultArrayDays?.map((day) => {
          const findOrNo = singleSea?.workingDays?.find((el) => el.day === day?.day);
          return findOrNo || day;
        });
        return { ...singleSea, workingDays: newSeasonWorkingTimes };
      });
      return data;
    },
    enabled: true,
    refetchOnWindowFocus: false,
    // retry: 1,
  });

  const {
    isFetching: fetchingActiveTime,
    refetch: getActivetime,
    data: activeTimeFromAPI,
  } = CallAPI({
    name: 'whatIsAactiveTimeForSP',
    url: SP_GET_ACTIVE_WORKING_TIME,
    refetchOnWindowFocus: false,
    enabled: true,
    // retry: 1,
    onSuccess: (res) => {
      if (res) {
        if (+res?.activeType === 1) {
          setExpDefault('defaultHours');
          setExpSeason('');
          setExpClose('');
        }
        if (+res?.activeType === 2) {
          setExpSeason('season');
          setExpDefault('');
          setExpClose('');
        }
        if (+res?.activeType === 3) {
          setExpClose('closing');
          setExpSeason('');
          setExpDefault('');
        }
        setActiveTime(res?.message);
        if (res?.message) {
          setShowActiveInfo(true);
        } else {
          setShowActiveInfo(false);
        }
      }
    },
    select: (res) => res && res?.data?.data,
    onError: (err) => toast.error(err?.response?.data),
  });
  /* -------------------------------------------------------------------------- */
  /*                                   Delete                                   */
  /* -------------------------------------------------------------------------- */
  const [openDeletClosingPeriodeModal, setOpenDeletClosingPeriodeModal] = useState(false);
  const [closingPeriodId, setClosingPeriodId] = useState('');
  const { refetch: deleteClosingPeriod } = CallAPI({
    name: 'deleteClosingPeriod',
    url: 'SPClosingPeriod/Delete',
    query: {
      id: closingPeriodId.id,
    },
    method: 'delete',
    onSuccess: (data) => {
      if (data?.data?.data) {
        toast.success(messages['closing.period.deletedSuccessfully']);
        refetchClosingPeriod(true);
        getActivetime();
      }
    },
  });
  const handleDeleteClosingPeriod = (period) => {
    setClosingPeriodId(period);
    setOpenDeletClosingPeriodeModal(true);
  };
  useEffect(() => {
    if (deletedSeasonId) {
      refetchChecking();
    }
  }, [deletedSeasonId]);

  useEffect(() => {
    if (!openModalAfterSecondConfirm) {
      setDeletedSeasonId(false);
    }
  }, [openModalAfterSecondConfirm]);

  return !fetchWorkingHours &&
    !fetchingClosingPeriod &&
    !fetchingActiveTime &&
    !fetchSeasons ? (
    <Row className="settings mb-5 pb-5">
      {showActiveInfo && (
        <Col xs={12} className="settings__informtaionHours">
          <div>{activeTime}</div>
          <button
            onClick={() => setShowActiveInfo(false)}
            className="settings__informtaionHours--close"
            type="button"
          >
            <i className="flaticon2-cross"></i>
          </button>
        </Col>
      )}
      <Col xs={12} className="settings__title mt-4">
        {messages['rw.bussinessHours']}
      </Col>
      <Col xs={12} className="settings__subtitle">
        {messages['workingHours.main.subtitle']}
      </Col>
      <Col xs={12}>
        <Accordion
          expanded={expDefault === 'defaultHours'}
          onChange={defaultAccord('defaultHours')}
          className="settings__accordion"
        >
          <AccordionSummary
            className="settings__accordion--summary"
            aria-controls="panel1a-content"
            id="panel1a-header"
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography className="settings__accordion--summary__heading">
              <div className="d-flex">
                <div>
                  <div className="settings__title">
                    {messages['workingHours.default.main']}
                    {activeTimeFromAPI?.activeType === 1 && (
                      <span className="settings__title--hint">
                        {messages['workingHours.active.now']}
                      </span>
                    )}
                  </div>
                  <div className="settings__subtitle">
                    {messages['workingHours.default.subtitle.main']}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn"
                onClick={() => history.push(Routes.defaultWorkingHours)}
              >
                {messages['workingHours.btn.update.hour']}
              </button>
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="settings__accordion--details">
            {allWorkingHoursDays &&
              allWorkingHoursDays.map((day) => (
                <Typography className="settings__accordion--details__day">
                  <div
                    className={`settings__accordion--details__day--divBoth settings__accordion--details__day${
                      !day?.dayClosed && activeTimeFromAPI?.activeType === 1
                        ? '--greenDiv'
                        : '--greyDiv'
                    }`}
                  >
                    {dayIndexEquivalent(day?.day, locale)}
                  </div>
                  <div className="settings__accordion--details__day--TimeDiv">
                    {day?.shifts.length > 0 ? (
                      day?.shifts.map((shift, index) => (
                        <>
                          <p>{moment(shift.startTime, 'hh:mm:ss').format('hh:mm a')}</p>
                          <p>
                            {moment(shift.endTime, 'hh:mm:ss').format('hh:mm a')}
                            {shift.isNextDay && (
                              <span className="settings__accordion--details__day--TimeDiv__nextDay">
                                {messages['common.next.day']}
                              </span>
                            )}
                          </p>
                          {day?.shifts.length > 1 && index !== 1 && (
                            <hr className="settings__accordion--details__day--TimeDiv__seperator" />
                          )}
                        </>
                      ))
                    ) : (
                      <div className="settings__accordion--details__day--TimeDiv">
                        {messages['common.closed']}
                      </div>
                    )}
                  </div>
                </Typography>
              ))}
          </AccordionDetails>
        </Accordion>
      </Col>
      {/* start of season section */}
      <Col xs={12}>
        <Accordion
          expanded={expSeason === 'season'}
          onChange={defaultSeason('season')}
          className="settings__accordion"
        >
          <AccordionSummary
            className="settings__accordion--summary"
            aria-controls="panel1a-content"
            id="panel1a-header"
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography className="settings__accordion--summary__heading">
              <div className="d-flex">
                <div>
                  <div className="settings__title">
                    {messages['workingHours.season.hours']}{' '}
                    {activeTimeFromAPI?.activeType === 2 && (
                      <span className="settings__title--hint">
                        {messages['workingHours.active.now']}
                      </span>
                    )}
                  </div>
                  <div className="settings__subtitle">
                    {messages['workingHours.season.hours.subtitle']}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn"
                onClick={() => history.push(Routes.seasonalWorkingHours)}
              >
                {messages['workingHours.btn.season.new']}
              </button>
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="settings__accordion--details">
            {allSeasons && allSeasons?.length > 0 ? (
              allSeasons.map((singleSeason) => (
                <>
                  <div className="settings__accordion--details__seasons">
                    <div className="settings__accordion--details__seasons-name">
                      <div className="settings__title">{singleSeason?.name}</div>
                      <div className="settings__subtitle">
                        <FormattedMessage
                          id="workingHours.season.date"
                          values={{
                            startDate: moment(singleSeason?.startDate?.split('T')[0])
                              .locale(locale)
                              .format('DD-MM-YYYY'),
                            endDate: moment(singleSeason?.endDate?.split('T')[0])
                              .locale(locale)
                              .format('DD-MM-YYYY'),
                          }}
                        />
                      </div>
                    </div>
                    <Dropdown
                      id="dropdown-menu-align-end"
                      className="seasonActions"
                      drop="start"
                    >
                      <Dropdown.Toggle
                        className="seasonActions--btn"
                        id="dropdown-autoclose-true"
                      >
                        {messages['common.options']}
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="seasonActions--dropdown">
                        <Dropdown.Item
                          as={Button}
                          eventKey="1"
                          onClick={() => {
                            history.push({
                              pathname: Routes.editSeasonalWorkingHours,
                              state: singleSeason,
                            });
                          }}
                        >
                          {messages['common.edit']}
                        </Dropdown.Item>
                        <Dropdown.Item
                          as={Button}
                          eventKey="2"
                          onClick={() => {
                            setDeletedSeasonId(singleSeason?.id);
                          }}
                        >
                          {messages['common.delete']}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  {singleSeason &&
                    singleSeason?.workingDays &&
                    singleSeason.workingDays.map((workingHours) => (
                      <Typography className="settings__accordion--details__day">
                        <div
                          className={`settings__accordion--details__day--divBoth settings__accordion--details__day${
                            !workingHours?.dayClosed &&
                            activeTimeFromAPI?.activeType === 2 &&
                            singleSeason?.isActive
                              ? '--greenDiv'
                              : '--greyDiv'
                          }`}
                        >
                          {dayIndexEquivalent(workingHours?.day, locale)}
                        </div>
                        <div className="settings__accordion--details__day--TimeDiv">
                          {workingHours?.shifts.length > 0 ? (
                            workingHours?.shifts?.map((shift, index) => (
                              <>
                                <p>
                                  {moment(shift.startTime, 'hh:mm:ss').format('hh:mm a')}
                                </p>
                                <p>
                                  {moment(shift.endTime, 'hh:mm:ss').format('hh:mm a')}
                                  {shift.isNextDay && (
                                    <span className="settings__accordion--details__day--TimeDiv__nextDay">
                                      {messages['common.next.day']}
                                    </span>
                                  )}
                                </p>
                                {workingHours?.shifts.length > 1 && index !== 1 && (
                                  <hr className="settings__accordion--details__day--TimeDiv__seperator" />
                                )}
                              </>
                            ))
                          ) : (
                            <div className="settings__accordion--details__day--TimeDiv">
                              {messages['common.closed']}
                            </div>
                          )}
                        </div>
                      </Typography>
                    ))}
                </>
              ))
            ) : (
              <div className="text-center w-100">
                <div className="settings__title">
                  {messages['admin.header.add.season']}
                </div>
              </div>
            )}
          </AccordionDetails>
        </Accordion>
      </Col>
      {/* start of  closing period  section */}
      <Col xs={12}>
        <Accordion
          expanded={expClose === 'closing'}
          onChange={defaultClose('closing')}
          className="settings__accordion"
        >
          <AccordionSummary
            className="settings__accordion--summary"
            aria-controls="panel1a-content"
            id="panel1a-header"
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography className="settings__accordion--summary__heading">
              <div className="d-flex">
                <div>
                  <div className="settings__title">
                    {messages['workingHours.closing.hours']}{' '}
                    {activeTimeFromAPI?.activeType === 3 && (
                      <span className="settings__title--hint">
                        {messages['workingHours.active.now']}
                      </span>
                    )}
                  </div>
                  <div className="settings__subtitle">
                    {messages['workingHours.closing.hours.subtitle']}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn"
                onClick={() => history.push(Routes.closingPeriodAdd)}
              >
                {messages['workingHours.btn.closing.new']}
              </button>
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="settings__accordion--details">
            {allClosingPeriods && allClosingPeriods.length > 0 ? (
              <Table className="settings__accordion--details__table">
                <TableHead className="settings__accordion--details__table--header">
                  <TableRow>
                    <TableCell className="settings__accordion--details__table--header__cell">
                      {messages['common.reason']}
                    </TableCell>
                    <TableCell className="settings__accordion--details__table--header__cell">
                      {messages['closing.date.range']}
                    </TableCell>
                    <TableCell className="settings__accordion--details__table--header__cell">
                      {messages['common.status']}
                    </TableCell>
                    <TableCell className="settings__accordion--details__table--header__cell">
                      {messages['closing.number.days']}
                    </TableCell>
                    <TableCell className="settings__accordion--details__table--header__cell">
                      {messages['common.options']}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="settings__accordion--details__table--body">
                  {allClosingPeriods &&
                    allClosingPeriods.map((singlePeriod) => (
                      <TableRow>
                        <TableCell className="settings__accordion--details__table--body__cell">
                          {singlePeriod?.reason}
                        </TableCell>
                        <TableCell className="settings__accordion--details__table--body__cell">
                          {moment(singlePeriod?.startDate?.split('T')[0]).format(
                            'ddd, Do MMMM YYYY',
                          )}{' '}
                          -{' '}
                          {moment(singlePeriod?.endDate?.split('T')[0]).format(
                            'ddd, Do MMMM YYYY',
                          )}
                        </TableCell>
                        <TableCell className="settings__accordion--details__table--body__cell">
                          {moment(
                            singlePeriod?.startDate?.split('T')[0],
                            'YYYY-MM-DD',
                          ).isSame(moment().format('YYYY-MM-DD')) ||
                          moment(moment().format('YYYY-MM-DD')).isBetween(
                            singlePeriod?.startDate?.split('T')[0],
                            singlePeriod?.endDate?.split('T')[0],
                          ) ||
                          moment(singlePeriod?.endDate?.split('T')[0]).isSame(
                            moment().format('YYYY-MM-DD'),
                          ) ? (
                            <span className="settings__accordion--details__table--body__cell--started">
                              {messages['closing.period.started']}
                            </span>
                          ) : (
                            <span>
                              <FormattedMessage
                                id="closing.start.from"
                                values={{
                                  days: moment
                                    .duration(
                                      moment(
                                        moment(
                                          singlePeriod?.startDate?.split('T')[0],
                                          'YYYY-MM-DD',
                                        ),
                                      ).diff(moment().format('YYYY-MM-DD')),
                                    )
                                    .asDays(),
                                }}
                              />
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="settings__accordion--details__table--body__cell">
                          {singlePeriod?.noOfDays > 1 ? (
                            <FormattedMessage
                              id="closing.remain.days"
                              values={{ days: singlePeriod?.noOfDays }}
                            />
                          ) : (
                            <FormattedMessage id="closing.remain.day.one" />
                          )}
                        </TableCell>
                        <TableCell className="settings__accordion--details__table--body__cell">
                          <div>
                            <Tooltip
                              arrow
                              TransitionComponent={Fade}
                              title={messages['common.edit']}
                            >
                              <button
                                type="button"
                                className="icon-wrapper-btn btn-icon-transparent"
                                onClick={() =>
                                  history.push(
                                    `/settings/workingHours/closingPeriodEdit/${singlePeriod.id}`,
                                  )
                                }
                              >
                                <img src={Edit} alt="EditIcon" />
                              </button>
                            </Tooltip>
                            <Tooltip
                              arrow
                              TransitionComponent={Fade}
                              title={messages['common.delete']}
                            >
                              <button
                                type="button"
                                className="icon-wrapper-btn btn-icon-transparent mx-2"
                                onClick={() => {
                                  handleDeleteClosingPeriod(singlePeriod);
                                }}
                              >
                                <img src={Delete} alt="DeleteIcon" />
                              </button>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center w-100">
                <div className="settings__title">
                  {messages['admin.header.add.closing']}
                </div>
              </div>
            )}
          </AccordionDetails>
        </Accordion>
      </Col>
      <ConfirmationModal
        setPayload={setThePayloadForDelete}
        Id={deletedSeasonId}
        openModal={openModalAfterSecondConfirm}
        setOpenModal={setOpenModalAfterSecondConfirm}
        message="workingHours.has.booking.old.time"
        title="workingHours.season.delete.header"
      />
      <ConfirmationModal
        setPayload={deleteClosingPeriod}
        openModal={closingPeriodId.id && openDeletClosingPeriodeModal}
        setOpenModal={setOpenDeletClosingPeriodeModal}
        title="closing.period.delete.title"
        message="closing.period.delete.description"
        messageVariables={{
          start: moment(closingPeriodId.startDate).format('D MMM YYYY'),
          end: moment(closingPeriodId.endDate).format('D MMM YYYY'),
        }}
        confirmtext="common.delete"
      />
    </Row>
  ) : (
    <div className="loading mt-5 pt-5"></div>
  );
}
