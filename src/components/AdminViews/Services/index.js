/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Dropdown } from 'react-bootstrap';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Tooltip,
} from '@material-ui/core';
import { toast } from 'react-toastify';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import Fade from '@material-ui/core/Fade';
import { Routes } from 'constants/Routes';
import { useHistory } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  SERVICE_CATEGORIES_GET,
  SP_CHECK_BEFORE_DELETE_SERVICE_INSIDE_PACKAGE,
  SP_DELETE_PACKAGE,
  SP_DELETE_SERVICE,
} from 'utils/API/EndPoints/ServiceProviderEP';
import BeutiButton from 'Shared/inputs/BeutiButton';
import { CallAPI } from '../../../utils/API/APIConfig';
import { ConfirmationModal } from '../../shared/ConfirmationModal';
import PackageServiceModal from './PackageServiceMoadl';
import salon from '../../../assets/img/dashboard/salons.svg';
import home from '../../../assets/img/dashboard/homes.svg';
import Edit from '../../../assets/img/dashboard/edit.svg';
import Delete from '../../../assets/img/dashboard/delete.svg';
import { PackagesOfService } from './PackagesOfService';
import { ConfirmDeleteCat } from './ConfirmDeleteCat';

export default function Services() {
  const [packageServiceOpen, setPackageServiceOpen] = useState(false);
  const [openPackageServiceModal, setOpenPackageServiceModal] = useState(false);
  const [openPackageModalForCat, setOpenPackageModalForCat] = useState(false);
  const history = useHistory();
  const { messages, locale } = useIntl();
  const [catIdForCheck, setCatIdForCheck] = useState(null);
  const [expanded, setExpanded] = useState('');
  const [payloadDeleteSer, setPayloadDeleteSer] = useState(false);
  const [payloadDeletePackage, setPayloadDeletePackage] = useState(false);
  const [openDeletePackageModal, setOpenDeletePackageModal] = useState(null);
  const [packageNameForDelete, setPackageNameForDelete] = useState(false);
  const [packDeleteId, setPackDeleteID] = useState(false);
  const [serDeleteId, setSerDeleteID] = useState(false);
  const [serIDForCheckPackage, setSerIDForCheckPackage] = useState(false);
  const [serNameForDelete, setSerNameForDelete] = useState(false);
  const [openDeleteSerModal, setOpenDeleteSerModal] = useState(null);
  const [openDeleteCatModal, setOpenDeleteCatModal] = useState(null);
  const [catHasServiceForMessages, setCatHasServiceForMessages] = useState(false);
  const [deleteCatHasNoService, setDeleteCatHasNoService] = useState(false);
  const [openConfirmDelCatHasNoPack, setOpenConfirmDelCatHasNoPack] = useState(false);
  const [payloadDelCatNoPack, setPayloadDelCatNoPackage] = useState(false);
  const [msgHeaderForPackagesDeleteSer, setMsgHeaderForPackagesDeleteSer] = useState(
    false,
  );
  /* -------------------------------------------------------------------------- */
  /*                              Prepare API CALLS                             */
  /* -------------------------------------------------------------------------- */

  const { refetch: reftchCat, isFetching, data: allCategoriesWithServices } = CallAPI({
    name: 'getCategoriesWithServices',
    url: SERVICE_CATEGORIES_GET,
    enabled: true,
    refetchOnWindowFocus: false,
    // retry: 2,
    onSuccess: (res) => {
      setExpanded(res[0]?.id.toString() + 0);
    },
    select: (data) => data.data.data.list,
  });

  /* -------------------------------------------------------------------------- */
  /*                             delete the service                             */
  /* -------------------------------------------------------------------------- */
  const { refetch: refetchDeleteService } = CallAPI({
    name: 'deleteServiceAdded',
    url: SP_DELETE_SERVICE,
    refetchOnWindowFocus: false,
    // retry: 2,
    method: 'Delete',
    query: {
      serviceId: payloadDeleteSer,
    },
    onSuccess: (res) => {
      if (res) {
        if (res?.data?.data?.hasBooking) {
          toast.success(messages['service.delete.has.booking']);
        }
        if (!res?.data?.data?.hasBooking && res?.data?.data?.isSucess) {
          toast.success(messages['service.delete.no.booking']);
        }
        if (!res?.data?.data?.isSucess) {
          toast.error(messages['admin.homePage.error']);
        }
        setPayloadDeleteSer(false);
        setSerDeleteID(false);
        setSerIDForCheckPackage(false);
        setSerNameForDelete(false);
        reftchCat();
      }
    },
    onError: (err) => {
      toast.error(err.response.data.error.message);
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                     check if service inside any package                    */
  /* -------------------------------------------------------------------------- */

  const { refetch: insidePackageOrNot, data: packagesData } = CallAPI({
    name: 'checkServiceInsidePackage',
    url: SP_CHECK_BEFORE_DELETE_SERVICE_INSIDE_PACKAGE,
    refetchOnWindowFocus: false,
    // retry: 2,
    method: 'get',
    query: {
      serviceId: serDeleteId,
    },
    onSuccess: (res) => {
      if (res?.packages.length > 0) {
        if (res?.hasMultipleServiceOption) {
          setMsgHeaderForPackagesDeleteSer('service.found.inside.package');
        } else {
          setMsgHeaderForPackagesDeleteSer('service.found.inside.package.single.opt');
        }
        setOpenPackageServiceModal(true);
        setSerIDForCheckPackage(false);
        setSerNameForDelete(false);
      } else {
        setOpenDeleteSerModal(true);
        setSerIDForCheckPackage(false);
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error?.message);
    },
    select: (res) => res?.data?.data,
  });

  /* -------------------------------------------------------------------------- */
  /*                      check  before delete the category                     */
  /* -------------------------------------------------------------------------- */

  const { refetch: checkForCat, isFetching: catFetching, data: packageForCat } = CallAPI({
    name: 'checkBeforeDeleteCategory',
    url: 'ServiceProviderCategory/GetCategoryServicesInOtherPackageCategory',
    refetchOnWindowFocus: false,
    // retry: 2,
    method: 'get',
    query: {
      categoryId: catIdForCheck,
    },
    onSuccess: (res) => {
      if (res.servicePackages.length > 0) {
        setOpenPackageModalForCat(true);
        setCatIdForCheck(false);
      } else {
        setOpenConfirmDelCatHasNoPack(true);
      }
    },
    onError: (err) => {
      toast.error(err.response.data.error.message);
    },
    select: (res) => res?.data?.data,
  });

  /* -------------------------------------------------------------------------- */
  /*              delete the category after check or without  check             */
  /* -------------------------------------------------------------------------- */
  const { refetch: deleteCat, isFetching: deleteCatFetch } = CallAPI({
    name: 'deleteTheCategory',
    url: 'ServiceProviderCategory/DeleteSPCategory',
    refetchOnWindowFocus: false,
    // retry: 2,
    method: 'delete',
    query: {
      id: deleteCatHasNoService || payloadDelCatNoPack,
    },
    onSuccess: (res) => {
      if (res) {
        toast.success(messages['delete.success']);
        reftchCat();
      }
    },
    onError: (err) => {
      toast.error(err.response.data.error.message);
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                             delete the package                             */
  /* -------------------------------------------------------------------------- */

  CallAPI({
    name: ['deletePackage', payloadDeletePackage],
    url: SP_DELETE_PACKAGE,
    refetchOnWindowFocus: false,
    // retry: 2,
    method: 'Delete',
    enabled: !!payloadDeletePackage,
    query: {
      packageId: payloadDeletePackage,
    },
    onSuccess: (res) => {
      if (res) {
        if (res?.isSuccess) {
          if (!res?.hasBooking) {
            toast.success(messages['package.delete.success']);
          } else {
            toast.warning(messages['package.delete.with.booking']);
          }
          setPayloadDeletePackage(false);
          reftchCat();
        }
      }
    },
    onError: (err) => {
      toast.error(err.response.data.error.message);
    },
    select: (res) => res?.data?.data,
  });

  /* -------------------------------------------------------------------------- */
  /*                      the new logic for the new design                      */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (serIDForCheckPackage) insidePackageOrNot();
  }, [serIDForCheckPackage]);

  useEffect(() => {
    if (payloadDeleteSer) refetchDeleteService();
  }, [payloadDeleteSer]);

  //   check  before delete category if has service
  useEffect(() => {
    if (catIdForCheck && catHasServiceForMessages) checkForCat();
  }, [catIdForCheck]);

  //   check  before delete category if has no service
  useEffect(() => {
    if (catIdForCheck && !catHasServiceForMessages) setOpenDeleteCatModal(true);
  }, [catIdForCheck]);

  //   clear the id when click cancel for confirm delete cat with no services
  useEffect(() => {
    if (!openDeleteCatModal) {
      setCatIdForCheck(null);
    }
  }, [openDeleteCatModal]);

  useEffect(() => {
    if (!openConfirmDelCatHasNoPack) setCatIdForCheck(false);
  }, [openConfirmDelCatHasNoPack]);

  //   refetch delete for  category has no service inside
  //   refetch delete cat for category has no package inside
  useEffect(() => {
    if (deleteCatHasNoService || payloadDelCatNoPack) deleteCat(true);
  }, [deleteCatHasNoService, payloadDelCatNoPack]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const returnHoures = (hours) => {
    if (hours) {
      if (+hours.charAt(0) === +0) {
        if (+hours.charAt(1) === +0) return null;
        return hours.charAt(hours?.length - 1);
      }
      return hours;
    }
    return null;
  };

  const returnMinutes = (minutes) => {
    if (minutes) {
      if (+minutes.charAt(0) === +0) {
        if (+minutes.charAt(1) === +0) return null;
        return minutes.charAt(minutes?.length - 1);
      }
      return minutes;
    }
    return null;
  };

  const returnOptionName = (opt, optIndex) => {
    if (locale === 'ar') {
      return opt?.nameAr ? (
        opt?.nameAr
      ) : (
        <FormattedMessage
          id="service.name.opt"
          values={{
            index: optIndex + 1,
          }}
        />
      );
    }
    return opt?.nameEn ? (
      opt?.nameEn
    ) : (
      <FormattedMessage
        id="service.name.opt"
        values={{
          index: optIndex + 1,
        }}
      />
    );
  };
  return (
    <>
      <Row className="mb-5 settings">
        <Col xs={12}>
          <div className="d-flex justify-content-between align-items-center py-3">
            <div>
              <div className="settings__section-title">
                {messages['spAdmin.serviceList.header']}
              </div>
              <div className="settings__section-description">
                {messages['spAdmin.serviceList.subtitle']}
              </div>
            </div>
            {/* <button
              className="btn btn-primary px-5"
              type="button"
              onClick={() => setPackageServiceOpen(true)}
            >
              {messages['spAdmin.serviceList.addServiceBtn.new']}
            </button> */}
            <BeutiButton
              text={messages['spAdmin.serviceList.addServiceBtn.new']}
              type="button"
              className="settings-employee_header-add"
              onClick={() => setPackageServiceOpen(true)}
            />
          </div>
        </Col>
        <Col xs={12} className="mt-4">
          {allCategoriesWithServices &&
            !isFetching &&
            allCategoriesWithServices.length > 0 &&
            allCategoriesWithServices.map((cat, index) => (
              <Accordion
                key={cat?.id}
                expanded={expanded === `${cat?.id.toString() + index}`}
                onChange={handleChange(`${cat?.id.toString() + index}`)}
                className="addServiceWizard__box--categoryServices"
              >
                <AccordionSummary
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  className="addServiceWizard__box--categoryServices__header"
                >
                  <div className="addServiceWizard__box--categoryServices__header--title">
                    {cat?.name}
                  </div>
                </AccordionSummary>
                <AccordionDetails className="addServiceFromList__box--categoryServices__body">
                  <button
                    onClick={() => {
                      history.push(Routes.newService);
                    }}
                    className="addServiceFromList__box--addCategory"
                    type="button"
                  >
                    <span className="addServiceFromList__box--addCategory__plusWithoutCircle">
                      +
                    </span>
                    <span className="font-weight-normal">
                      {messages['spAdmin.serviceList.new.service']}
                    </span>
                  </button>
                  {(cat.services.length > 0 || cat.packages.length > 0) &&
                    cat?.services &&
                    cat?.services?.length > 0 &&
                    cat.services.map((serv) => (
                      <div key={serv?.id} className="serviceDetailsRow">
                        {serv?.options?.length > 1 && (
                          <Row>
                            <Col xs={12} className="ser-name">
                              {serv?.name}
                            </Col>
                            <Col xs={7}>
                              {serv.options &&
                                serv.options.length > 0 &&
                                serv.options.map((singleOpt, idx) => (
                                  <Row className="opt-row">
                                    <Col xs={4} className="opt-row_data">
                                      <span className="opt-row_data-opt--name truncate">
                                        {returnOptionName(singleOpt, idx)}
                                      </span>
                                    </Col>
                                    <Col xs={4} className="opt-row_data">
                                      {!singleOpt?.isDurationFrom ? (
                                        <>
                                          {returnHoures(
                                            singleOpt?.duration.split(':')[0],
                                          ) && (
                                            <FormattedMessage
                                              id="service.duration.in.table.hour"
                                              values={{
                                                hour: returnHoures(
                                                  singleOpt?.duration.split(':')[0],
                                                ),
                                              }}
                                            />
                                          )}{' '}
                                          {returnMinutes(
                                            singleOpt?.duration.split(':')[1],
                                          ) && (
                                            <FormattedMessage
                                              id="service.duration.in.table.min"
                                              values={{
                                                min: returnMinutes(
                                                  singleOpt?.duration.split(':')[1],
                                                ),
                                              }}
                                            />
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          {messages['common.start.from']}{' '}
                                          {returnHoures(
                                            singleOpt?.duration.split(':')[0],
                                          ) && (
                                            <FormattedMessage
                                              id="service.duration.in.table.hour"
                                              values={{
                                                hour: returnHoures(
                                                  singleOpt?.duration.split(':')[0],
                                                ),
                                              }}
                                            />
                                          )}{' '}
                                          {returnMinutes(
                                            singleOpt?.duration.split(':')[1],
                                          ) && (
                                            <FormattedMessage
                                              id="service.duration.in.table.min"
                                              values={{
                                                min: returnMinutes(
                                                  singleOpt?.duration.split(':')[1],
                                                ),
                                              }}
                                            />
                                          )}
                                        </>
                                      )}
                                    </Col>
                                    <Col xs={4} className="opt-row_data">
                                      <FormattedMessage
                                        id="service.emp.in.table"
                                        values={{
                                          num: serv.employeesCount,
                                        }}
                                      />{' '}
                                    </Col>
                                  </Row>
                                ))}
                            </Col>
                            <Col
                              className="d-flex justify-content-center align-items-center"
                              xs={1}
                            >
                              {serv.locationId === 1 && (
                                <SVG src={toAbsoluteUrl(`${home}`)} />
                              )}
                              {serv.locationId === 2 && (
                                <SVG src={toAbsoluteUrl(`${salon}`)} />
                              )}
                              {serv.locationId === 3 && (
                                <>
                                  <SVG src={toAbsoluteUrl(`${salon}`)} /> &nbsp;
                                  <SVG src={toAbsoluteUrl(`${home}`)} />
                                </>
                              )}
                            </Col>
                            <Col
                              className="d-flex align-items-end flex-column justify-content-around"
                              xs={2}
                            >
                              {serv.options &&
                                serv.options.length > 0 &&
                                serv.options.map((opt) => (
                                  <Row className="opt-row">
                                    {!opt.isPriceFrom ? (
                                      <Col xs={12} className="opt-row_price">
                                        {opt.priceWithVat} {messages['common.sar']}
                                      </Col>
                                    ) : (
                                      <Col xs={12} className="opt-row_price">
                                        {messages['common.start.from']} {opt.priceWithVat}{' '}
                                        {messages['common.sar']}
                                      </Col>
                                    )}
                                  </Row>
                                ))}
                            </Col>
                            <Col
                              className="d-flex align-items-center justify-content-end"
                              xs={2}
                            >
                              <Tooltip
                                arrow
                                TransitionComponent={Fade}
                                title={messages['common.edit']}
                              >
                                <button
                                  type="button"
                                  className="icon-wrapper-btn btn-icon-transparent"
                                  onClick={() =>
                                    history.push(`/servicesList/EditService/${serv?.id}`)
                                  }
                                >
                                  <img width="20" alt="Edit" src={Edit} />
                                </button>
                              </Tooltip>
                              <Tooltip
                                arrow
                                TransitionComponent={Fade}
                                title={messages['common.delete']}
                              >
                                <button
                                  type="button"
                                  className="icon-wrapper-btn btn-icon-transparent"
                                  onClick={() => {
                                    setSerIDForCheckPackage(serv?.id);
                                    setSerDeleteID(serv?.id);
                                    setSerNameForDelete(serv?.name);
                                  }}
                                >
                                  <img
                                    width="20"
                                    alt="Delete"
                                    src={Delete}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = Delete;
                                    }}
                                  />
                                </button>
                              </Tooltip>{' '}
                            </Col>
                          </Row>
                        )}
                        {serv?.options?.length === 1 &&
                          serv.options.map((singleOpt, idx) => (
                            <Row className="align-items-center">
                              <Col xs={7}>
                                <Row className="opt-row">
                                  <Col className="ser-name" xs={4}>
                                    {serv?.name}
                                  </Col>
                                  <Col className="opt-row_data" xs={4}>
                                    {!singleOpt?.isDurationFrom ? (
                                      <>
                                        {returnHoures(
                                          singleOpt?.duration.split(':')[0],
                                        ) && (
                                          <FormattedMessage
                                            id="service.duration.in.table.hour"
                                            values={{
                                              hour: returnHoures(
                                                singleOpt?.duration.split(':')[0],
                                              ),
                                            }}
                                          />
                                        )}{' '}
                                        {returnMinutes(
                                          singleOpt?.duration.split(':')[1],
                                        ) && (
                                          <FormattedMessage
                                            id="service.duration.in.table.min"
                                            values={{
                                              min: returnMinutes(
                                                singleOpt?.duration.split(':')[1],
                                              ),
                                            }}
                                          />
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        {returnHoures(
                                          singleOpt?.duration.split(':')[0],
                                        ) && (
                                          <FormattedMessage
                                            id="service.duration.in.table.hour"
                                            values={{
                                              hour: returnHoures(
                                                singleOpt?.duration.split(':')[0],
                                              ),
                                            }}
                                          />
                                        )}{' '}
                                        {returnMinutes(
                                          singleOpt?.duration.split(':')[1],
                                        ) && (
                                          <FormattedMessage
                                            id="service.duration.in.table.min"
                                            values={{
                                              min: returnMinutes(
                                                singleOpt?.duration.split(':')[1],
                                              ),
                                            }}
                                          />
                                        )}
                                      </>
                                    )}
                                  </Col>
                                  <Col className="opt-row_data" xs={4}>
                                    <FormattedMessage
                                      id="service.emp.in.table"
                                      values={{
                                        num: serv.employeesCount,
                                      }}
                                    />{' '}
                                  </Col>
                                </Row>
                              </Col>
                              <Col
                                xs={1}
                                className="d-flex justify-content-center align-items-center"
                              >
                                {+serv.locationId === 1 && (
                                  <SVG src={toAbsoluteUrl(`${home}`)} />
                                )}
                                {+serv.locationId === 2 && (
                                  <SVG src={toAbsoluteUrl(`${salon}`)} />
                                )}
                                {+serv.locationId === 3 && (
                                  <>
                                    <SVG src={toAbsoluteUrl(`${salon}`)} /> &nbsp;
                                    <SVG src={toAbsoluteUrl(`${home}`)} />
                                  </>
                                )}
                              </Col>
                              <Col xs={2} className="d-flex align-items-end flex-column">
                                {serv.options &&
                                  serv.options.length > 0 &&
                                  serv.options.map((opt) => (
                                    <Row className="opt-row">
                                      {!opt.isPriceFrom ? (
                                        <Col xs={12} className="opt-row_price">
                                          {opt.priceWithVat} {messages['common.sar']}
                                        </Col>
                                      ) : (
                                        <Col xs={12} className="opt-row_price">
                                          {messages['common.start.from']}{' '}
                                          {opt.priceWithVat} {messages['common.sar']}
                                        </Col>
                                      )}
                                    </Row>
                                  ))}
                              </Col>
                              <Col
                                className="d-flex align-items-center justify-content-end"
                                xs={2}
                              >
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
                                        `/servicesList/EditService/${serv?.id}`,
                                      )
                                    }
                                  >
                                    <img width="20" alt="Edit" src={Edit} />
                                  </button>
                                </Tooltip>
                                <Tooltip
                                  arrow
                                  TransitionComponent={Fade}
                                  title={messages['common.delete']}
                                >
                                  <button
                                    type="button"
                                    className="icon-wrapper-btn btn-icon-transparent"
                                    onClick={() => {
                                      setSerIDForCheckPackage(serv?.id);
                                      setSerDeleteID(serv?.id);
                                      setSerNameForDelete(serv?.name);
                                    }}
                                  >
                                    <img
                                      width="20"
                                      alt="Delete"
                                      src={Delete}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = Delete;
                                      }}
                                    />
                                  </button>
                                </Tooltip>{' '}
                              </Col>
                            </Row>
                          ))}
                      </div>
                    ))}
                  {(cat.services.length > 0 || cat.packages.length > 0) &&
                    cat?.packages &&
                    cat?.packages?.length > 0 &&
                    cat.packages.map((pack) => (
                      <div key={pack?.id} className="serviceDetailsRow">
                        <Row className="align-items-center">
                          <Col xs={7}>
                            <Row>
                              <Col xs={4} className="pack">
                                <p>{pack?.name}</p>
                                <p className="serNo">
                                  <FormattedMessage
                                    id="count.ser.inside.package"
                                    values={{
                                      count: pack?.servicesCount,
                                    }}
                                  />
                                </p>{' '}
                              </Col>
                              <Col className="opt-row_data" xs={4}>
                                <>
                                  {messages['common.start.from']}{' '}
                                  {/* check if package time more than one day */}
                                  {returnHoures(pack?.minDuration.split(':')[0]) &&
                                    (returnHoures(
                                      pack?.minDuration.split(':')[0],
                                    )?.includes('.') ? (
                                      <FormattedMessage
                                        id="service.duration.in.table.hour"
                                        values={{
                                          hour:
                                            returnHoures(
                                              pack?.minDuration.split(':')[0],
                                            )?.split('.')[0] *
                                              24 +
                                            +returnHoures(
                                              pack?.minDuration.split(':')[0],
                                            )?.split('.')[1],
                                        }}
                                      />
                                    ) : (
                                      <FormattedMessage
                                        id="service.duration.in.table.hour"
                                        values={{
                                          hour: returnHoures(
                                            pack?.minDuration.split(':')[0],
                                          ),
                                        }}
                                      />
                                    ))}{' '}
                                  {returnMinutes(pack?.minDuration.split(':')[1]) && (
                                    <FormattedMessage
                                      id="service.duration.in.table.min"
                                      values={{
                                        min: returnMinutes(
                                          pack?.minDuration.split(':')[1],
                                        ),
                                      }}
                                    />
                                  )}
                                </>
                              </Col>
                              <Col xs={4} className="d-flex align-items-center">
                                <span className="package">
                                  {messages['spAdmin.serviceList.Package.ser.package']}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          <Col
                            xs={1}
                            className="d-flex justify-content-center align-items-center"
                          >
                            {+pack?.locationId === 1 && (
                              <SVG src={toAbsoluteUrl(`${home}`)} />
                            )}
                            {+pack?.locationId === 2 && (
                              <SVG src={toAbsoluteUrl(`${salon}`)} />
                            )}
                            {+pack?.locationId === 3 && (
                              <>
                                <SVG src={toAbsoluteUrl(`${home}`)} /> &nbsp;
                                <SVG src={toAbsoluteUrl(`${salon}`)} />
                              </>
                            )}
                          </Col>
                          <Col
                            xs={2}
                            className="d-flex align-items-end justify-content-center flex-column"
                          >
                            <Row>
                              <Col xs={12} className="servicePrice">
                                {pack?.priceBeforeWithVat !== pack?.priceAfterWithVat && (
                                  <>
                                    <span className="servicePrice-priceBeforeForPackage">
                                      {pack?.priceBeforeWithVat} {messages['common.sar']}
                                    </span>{' '}
                                  </>
                                )}
                                &nbsp;&nbsp;
                                {pack?.priceAfterWithVat} {messages['common.sar']}
                              </Col>
                            </Row>
                          </Col>
                          <Col
                            xs={2}
                            className="d-flex align-items-center justify-content-end"
                          >
                            <Tooltip
                              arrow
                              TransitionComponent={Fade}
                              title={messages['common.edit']}
                            >
                              <button
                                type="button"
                                className="icon-wrapper-btn btn-icon-transparent"
                                onClick={(e) => {
                                  history.push(`/servicesList/EditPackage/${pack.id}`);
                                }}
                              >
                                <img width="20" alt="Edit" src={Edit} />
                              </button>
                            </Tooltip>
                            <Tooltip
                              arrow
                              TransitionComponent={Fade}
                              title={messages['common.delete']}
                            >
                              <button
                                type="button"
                                className="icon-wrapper-btn btn-icon-transparent"
                                onClick={() => {
                                  setOpenDeletePackageModal(true);
                                  setPackageNameForDelete(pack?.name);
                                  setPackDeleteID(pack?.id);
                                }}
                              >
                                <img width="20" alt="Delete" src={Delete} />
                              </button>
                            </Tooltip>
                          </Col>
                        </Row>
                      </div>
                    ))}
                </AccordionDetails>
                <div className="addServiceWizard__box--categoryServices__header--title px-2 btnOverAccordion">
                  <button type="button" className="actionCategory">
                    <Dropdown
                      id="dropdown-menu-align-end"
                      className="showActionsCategory"
                      drop="start"
                    >
                      <Dropdown.Toggle
                        className="showActionsCategory--btn"
                        id="dropdown-autoclose-true"
                      >
                        <i className="flaticon-more-v2" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="showActionsCategory--dropdown">
                        <Dropdown.Item
                          as={Button}
                          eventKey="1"
                          onClick={(e) => {
                            history.push({
                              pathname: Routes.EditCategory,
                              state: cat?.id,
                            });
                          }}
                        >
                          {messages['spAdmin.serviceList.edit.category']}
                        </Dropdown.Item>
                        <Dropdown.Item
                          as={Button}
                          eventKey="2"
                          onClick={(e) => {
                            setCatIdForCheck(cat?.id);
                            setCatHasServiceForMessages(
                              cat?.services?.length > 0 || cat?.packages?.length > 0,
                            );
                          }}
                        >
                          {messages['spAdmin.serviceList.delete.category']}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </button>
                </div>
              </Accordion>
            ))}
          {allCategoriesWithServices &&
            !isFetching &&
            allCategoriesWithServices.length === 0 && (
              <div className="addServiceWizard__box--categoryServices">
                <div className="addServiceWizard__box--categoryServices__header">
                  <div className="addServiceWizard__box--categoryServices__header--title"></div>
                  <div className="addServiceWizard__box--categoryServices__header--title"></div>
                </div>
                <div className="addServiceWizard__box--categoryServices__body">
                  <div className="addServiceWizard__box--categoryServices__body--noDataShape">
                    {messages['wizard.add.service.rule']}
                  </div>
                </div>
              </div>
            )}
          {isFetching && <div className="loading mt-5"></div>}
        </Col>
      </Row>

      {/* show package names before confirm delete service */}
      <PackagesOfService
        packagesData={packagesData?.packages}
        Id={serDeleteId}
        openModal={openPackageServiceModal}
        setOpenModal={setOpenPackageServiceModal}
        message={msgHeaderForPackagesDeleteSer}
        hasMultipleServiceOption={packagesData?.hasMultipleServiceOption}
      />

      <ConfirmationModal
        setPayload={setPayloadDeleteSer}
        openModal={openDeleteSerModal}
        setOpenModal={setOpenDeleteSerModal}
        message="service.delete.confirmation"
        Id={serDeleteId}
        messageVariables={{ serName: serNameForDelete }}
      />

      <ConfirmationModal
        setPayload={setPayloadDeletePackage}
        openModal={openDeletePackageModal}
        setOpenModal={setOpenDeletePackageModal}
        message="package.delete.confirmation"
        Id={packDeleteId}
        messageVariables={{ packName: packageNameForDelete }}
      />

      {/* show package names before confirm delete category */}
      <PackagesOfService
        packagesData={packageForCat?.servicePackages}
        Id={payloadDeleteSer}
        openModal={openPackageModalForCat}
        setOpenModal={setOpenPackageModalForCat}
        message="delete.category.package.sub.title"
        title="delete.category.package.title"
      />

      {/* show  confirm delete cat which has no service inside */}
      <ConfirmDeleteCat
        setPayload={setDeleteCatHasNoService}
        openModal={openDeleteCatModal}
        setOpenModal={setOpenDeleteCatModal}
        message="category.delete.confirmation"
        Id={catIdForCheck}
        title="delete.category.package.title"
      />

      {/* show  confirm delete cat which has no package inside */}
      <ConfirmDeleteCat
        setPayload={setPayloadDelCatNoPackage}
        openModal={openConfirmDelCatHasNoPack}
        setOpenModal={setOpenConfirmDelCatHasNoPack}
        message="delete.cat.has.no.packages"
        Id={catIdForCheck}
        showCheckbox
        title="delete.category.package.title"
      />

      {packageServiceOpen && (
        <PackageServiceModal open={packageServiceOpen} setOpen={setPackageServiceOpen} />
      )}
    </>
  );
}
