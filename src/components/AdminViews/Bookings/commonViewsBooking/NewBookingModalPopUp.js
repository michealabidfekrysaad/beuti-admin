import React, { useEffect, useState } from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import { DatePicker } from '@material-ui/pickers';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import useAPI, { get, post } from 'hooks/useAPI';
import { isNumbersOnly } from 'functions/validate';
import { startsWith05, isPhoneLengthValid } from 'validations/validate';
import Alert from '@material-ui/lab/Alert';
import { tofullISOString } from '../../../../functions/MomentHandlers';

export default function NewBooking({
  open,
  setOpen,
  clickInfo,
  offDays,
  TotalServices,
  setNewBookingPayload,
}) {
  const [date, setDate] = useState(null);
  const [homeServices, setHomeServices] = useState(null);
  const [SalonServices, setSalonServices] = useState(null);
  const [serviceID, setServiceID] = useState(null);
  const [availableEmployeesOnDate, setAvailableEmployeesOnDate] = useState([]);
  const [EmpDuration, setEmpDuration] = useState([]);
  const [serviceDuration, setServiceDuration] = useState(null);
  const [errorEmployeeOnDate, SetErrorEmployeeOnDate] = useState(null);
  const [ErrorChair, setErrorChair] = useState(null);
  const [phone, setPhone] = useState(null);
  const [selectedEmpDuration, setSelectedEmpDuration] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [customerName, setCustomerName] = useState(null);
  const [voucher, setVoucher] = useState([]);
  const [chairs, setChairs] = useState(null);
  const [selectedChair, setSelectedChair] = useState(null);
  const [chairPayload, setChairPayload] = useState({ date: null, serviceTimes: null });
  const [serAtHome, setSerAtHome] = useState(null);
  const [serAtSalon, setSerAtSalon] = useState(null);
  const [request, setRequest] = useState({
    paymentMetodID: 1,
    requestDateTime: clickInfo?.dayEl?.dataset?.date,
  });
  const { messages } = useIntl();
  const booking = 'spAdmin.bookingsService';
  const {
    response: availableEmployees,
    isLoading: gettingAvailableEmployees,
    setRecall: requestAvailableEmployees,
  } = useAPI(
    get,
    `Booking/GetServiceEmployees?serviceID=${serviceID}&bookingTime=${date}`,
  );
  const { response: isOldCustomer, setRecall: requestUserHistory } = useAPI(
    get,
    `Booking/checkAnonymousCustomerPhoneExist?phoneNumber=${phone}`,
  );

  // to get all vouchers
  const { response: voucherRes, setRecall: recallVoucher } = useAPI(
    get,
    `Voucher/GetActiveVoucher?bookingDate=${date}`,
  );
  // to get availablee chair for home booking
  const { response: availableChairs, setRecall: recallChairs } = useAPI(
    post,
    'ServiceProvider/GetAvailableChairs',
    chairPayload,
  );
  useEffect(() => {
    if (open) {
      TotalServices?.map((singleObj) => {
        if (singleObj.atHome) {
          setHomeServices(
            singleObj.centerTypeCategoryList.map((el) => el.serviceList).flat(),
          );
        } else {
          setSalonServices(
            singleObj.centerTypeCategoryList.map((el) => el.serviceList).flat(),
          );
        }
        return null;
      });
      setDate(clickInfo?.dayEl?.dataset?.date);
      setRequest({
        ...request,
        requestDateTime: clickInfo?.dayEl?.dataset?.date,
      });
      setChairPayload({
        ...chairPayload,
        date: clickInfo?.dayEl?.dataset?.date,
      });
    }
  }, [open]);
  useEffect(() => {
    if (serviceID && date) {
      requestAvailableEmployees(true);
    }
  }, [serviceID, date]);
  //   get all active voucher depends on date
  useEffect(() => {
    if (date) {
      recallVoucher(true);
    }
  }, [date]);
  // send request for number to get  userName
  useEffect(() => {
    if (
      phone &&
      startsWith05(phone) &&
      isPhoneLengthValid(phone) &&
      isNumbersOnly(phone)
    ) {
      requestUserHistory(true);
    } else {
      setCustomerName(null);
    }
  }, [phone]);
  //  set the userName when make request by number
  useEffect(() => {
    if (isOldCustomer?.data?.isFound && isOldCustomer?.data?.userData) {
      setCustomerName(isOldCustomer?.data?.userData?.name);
      setRequest({
        ...request,
        anonymousUser: {
          name: isOldCustomer?.data?.userData?.name,
          phone,
        },
        isCustomer: false,
      });
    } else {
      setCustomerName(null);
      setRequest({
        ...request,
        anonymousUser: {
          name: '',
          phone,
        },
        isCustomer: false,
      });
    }
  }, [isOldCustomer]);

  useEffect(() => {
    if (availableEmployees?.data) {
      setAvailableEmployeesOnDate(
        // availableEmployees?.data?.list.filter((emp) => emp.freeSlots),
        availableEmployees?.data?.list,
      );
    }

    if (availableEmployees && availableEmployees.error) {
      SetErrorEmployeeOnDate(availableEmployees.error.message);
    }
  }, [availableEmployees]);
  // get response of voucher and sace it
  useEffect(() => {
    if (voucherRes && voucherRes.data) {
      setVoucher(voucherRes.data.list);
    }
  }, [voucherRes]);

  useEffect(() => {
    if (chairPayload.date && chairPayload.serviceTimes) {
      recallChairs(true);
    }
  }, [chairPayload]);

  useEffect(() => {
    if (availableChairs?.data?.list) {
      setChairs(availableChairs?.data?.list);
    }

    if (availableChairs && availableChairs.error) {
      setErrorChair(availableChairs.error.message);
    }
  }, [availableChairs]);

  // when  change the date
  const handleDayPicker = (value) => {
    setAvailableEmployeesOnDate([]);
    setChairs(null);
    setEmpDuration([]);
    setSelectedEmpDuration(null);
    setSerAtSalon(null);
    setSerAtHome(null);
    setSelectedChair(null);
    setSelectedEmployee(null);
    const start = moment(value).format('YYYY-MM-DD');
    setRequest({
      ...request,
      requestDateTime: tofullISOString(value),
    });
    setChairPayload({
      ...chairPayload,
      date: tofullISOString(value),
    });
    setDate(start);
  };
  // when select service name to can display the employees dropdown
  const handleServiceSelection = (value) => {
    setEmpDuration([]);
    setSelectedEmployee(null);
    setChairs(null);
    setSelectedEmpDuration(null);
    setSerAtHome(null);
    setSerAtSalon(null);
    setSelectedChair(null);
    setAvailableEmployeesOnDate([]);
    setServiceID(value);
    setSerAtHome(homeServices?.find((ser) => +ser.id === +value) || null);
    setSerAtSalon(SalonServices?.find((ser) => +ser.id === +value) || null);
    const atHome = homeServices?.find((ser) => +ser.id === +value);
    const atSalon = SalonServices?.find((ser) => +ser.id === +value);
    if (atHome) {
      setServiceDuration(atHome.duration);
      setRequest({
        ...request,
        serviceBookingModel: [
          {
            serviceId: atHome.id,
            price: atHome.price,
            employeeID: null,
          },
        ],
        location: {
          address: 'طريق العروبة، الورود، الرياض 12215، السعودية',
          long: 46.673583,
          lat: 24.713405,
        },
      });
    } else {
      setServiceDuration(atSalon.duration);
      setRequest({
        ...request,
        serviceBookingModel: [
          {
            serviceId: atSalon.id,
            price: atSalon.price,
            employeeID: null,
          },
        ],
        location: null,
        chairReservation: null,
      });
    }
  };
  // when select employee to display it's time if found
  const employeeSelection = (value) => {
    setEmpDuration([]);
    const employee = availableEmployeesOnDate.find((emp) => +emp.employeeID === +value);
    setSelectedEmployee(employee);
    const addEmpId = {
      price: request.serviceBookingModel[0].price,
      serviceId: request.serviceBookingModel[0].serviceId,
      employeeID: employee.employeeID,
    };
    if (employee?.freeSlots) {
      setEmpDuration(employee?.freeSlots);
      setRequest({
        ...request,
        isQueue: false,
        serviceBookingModel: [addEmpId],
      });
    } else {
      setEmpDuration([]);
      setRequest({
        ...request,
        isQueue: true,
        serviceBookingModel: [addEmpId],
      });
    }
  };

  const handleSelectedslot = (value) => {
    const addEmpSlot = {
      price: request.serviceBookingModel[0].price,
      serviceId: request.serviceBookingModel[0].serviceId,
      employeeID: request.serviceBookingModel[0].employeeID,
      employeeSlot: {
        from: value.split('-')[0],
        to: value.split('-')[1],
      },
    };
    if (serAtHome) {
      setChairPayload({
        ...chairPayload,
        serviceTimes: [{ from: value.split('-')[0], to: value.split('-')[1] }],
      });
    }
    setRequest({
      ...request,
      serviceBookingModel: [addEmpSlot],
    });
    setSelectedEmpDuration(true);
  };
  const handleAddVoucher = (value) => {
    if (value !== 'no-voucher') {
      setRequest({
        ...request,
        voucherId: Number(value),
      });
    } else {
      setRequest({
        ...request,
        voucherId: null,
      });
    }
  };

  const handleSelectChair = (value) => {
    const chairSelectDD = chairs.find((chair) => +chair.id === +value);
    setSelectedChair(value);
    setRequest({
      ...request,
      chairReservation: {
        chairServiceProviderId: +value,
        totalPrice: chairSelectDD.totalPriceWithVAT,
      },
    });
  };

  // when close the modal
  const closeModal = () => {
    setOpen(false);
  };

  // making new booking
  const handleAddBooking = () => {
    setNewBookingPayload(request);
    closeModal();
  };
  return (
    <Modal
      onHide={() => {
        closeModal();
      }}
      show={open}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="bootstrap-modal-customizing"
    >
      <div className="employee-box">
        <div className="employee-box__title mb-3">
          {messages[`${booking}.newBooking`]}
        </div>
        <Modal.Body>
          {errorEmployeeOnDate && (
            <Alert className="mb-3" severity="error">
              {errorEmployeeOnDate}
            </Alert>
          )}
          {ErrorChair && (
            <Alert className="mb-3" severity="error">
              {ErrorChair}
            </Alert>
          )}
          <div className="employee-box__controllers">
            <Row className="align-items-start">
              <Col xs={12} sm={12} md={4} className="mb-2">
                <div>
                  <DatePicker
                    value={date}
                    label={messages['spAdmin.bookings.bookingDate']}
                    format="dd/MM/yyyy"
                    shouldDisableDate={(day) =>
                      day.getDay() ===
                      offDays?.data?.find((data) => data === day.getDay())
                    }
                    onChange={(e) => handleDayPicker(e)}
                    autoOk="true"
                    okLabel={null}
                    disablePast="true"
                    helperText={messages[`${booking}.DateError`]}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </div>
              </Col>
              <Col xs={12} sm={12} md={4} className="mb-2">
                <div>
                  <label htmlFor="service" className="employee-box__controllers__label">
                    {messages[`service.name`]}
                  </label>
                  <select
                    id="service"
                    className="form-select w-100 employee-box__controllers-select"
                    aria-label="Default select example"
                    onChange={(e) => handleServiceSelection(e.target.value)}
                  >
                    <option selected disabled>
                      {messages[`${booking}.chooseService`]}
                    </option>
                    {SalonServices && (
                      <option className="service-header" disabled>
                        {messages['booking.selectService.atSalonService']}
                      </option>
                    )}
                    {SalonServices?.map((ser) => (
                      <option className="font-size" key={ser.id} value={ser.id}>
                        {ser.name}
                      </option>
                    ))}
                    {homeServices && (
                      <option className="service-header" disabled>
                        {messages['booking.selectService.atHomeService']}
                      </option>
                    )}
                    {homeServices?.map((ser) => (
                      <option className="font-size" key={ser.id} value={ser.id}>
                        {ser.name}
                      </option>
                    ))}
                  </select>
                  {serviceDuration && (
                    <small>
                      {messages['common.duration']} : {serviceDuration.split(':')[0][1]}
                      {messages['time.hours.short']} {serviceDuration.split(':')[1]}
                      {messages['time.minutes.short']}
                    </small>
                  )}
                </div>
              </Col>
              <Col xs={12} sm={12} md={4} className="mb-2">
                <div>
                  <label htmlFor="service" className="employee-box__controllers__label">
                    {messages[`common.customerNumber`]}
                  </label>
                  <input
                    className={`employee-box__controllers-input `}
                    name="employeeNameB"
                    type="tel"
                    placeholder={messages[`common.customerNumber`]}
                    value={phone}
                    onChange={(e) =>
                      isNumbersOnly(e.target.value) && e.target.value.length <= 10
                        ? setPhone(e.target.value)
                        : null
                    }
                  />
                  {customerName && (
                    <small>
                      {messages['common.customerName']} : {customerName}
                    </small>
                  )}
                </div>
              </Col>
            </Row>
            <Row className="align-items-start">
              <Col xs={12} sm={12} md={6} className="mb-2">
                <div>
                  <label htmlFor="service" className="employee-box__controllers__label">
                    {messages[`${booking}.EmployeeName`]}
                  </label>
                  <select
                    id="service"
                    className="form-select w-100 employee-box__controllers-select"
                    aria-label="Default select example"
                    onChange={(e) => employeeSelection(e.target.value)}
                    disabled={
                      !serviceID ||
                      gettingAvailableEmployees ||
                      availableEmployeesOnDate.length === 0
                    }
                  >
                    {!availableEmployees?.data && (
                      <option selected disabled>
                        {messages[`${booking}.EmployeeName`]}
                      </option>
                    )}
                    {availableEmployeesOnDate.map((singleEmp, index) => (
                      <>
                        {index === 0 && (
                          <option selected={index === 0} disabled>
                            {messages[`${booking}.EmployeeName`]}
                          </option>
                        )}
                        <option Key={singleEmp.employeeID} value={singleEmp.employeeID}>
                          {singleEmp.employeeName}
                        </option>
                      </>
                    ))}
                    {availableEmployeesOnDate.length === 0 && availableEmployees?.data && (
                      <option selected disabled>
                        {messages[`${booking}.EmployeeNotFound`]}
                      </option>
                    )}
                  </select>
                </div>
              </Col>
              <Col xs={12} sm={12} md={6} className="mb-2">
                <div>
                  <label htmlFor="service" className="employee-box__controllers__label">
                    {messages[`${booking}.empDuration`]}
                  </label>
                  <select
                    id="service"
                    className="form-select w-100 employee-box__controllers-select"
                    aria-label="Default select example"
                    onChange={(e) => handleSelectedslot(e.target.value)}
                    disabled={EmpDuration.length === 0}
                  >
                    {EmpDuration.length === 0 && (
                      <option selected disabled>
                        {messages[`${booking}.empDuration`]}
                      </option>
                    )}
                    {EmpDuration.map((duration, index) => (
                      <>
                        {index === 0 && (
                          <option selected={index === 0} disabled>
                            {messages[`${booking}.empDuration`]}
                          </option>
                        )}
                        <option
                          Key={duration.from}
                          value={`${duration.from}-${duration.to}`}
                        >
                          {duration.from} - {duration.to}
                        </option>
                      </>
                    ))}
                  </select>
                  {EmpDuration.length === 0 && (
                    <small> {messages[`${booking}.EmployeeQueue`]}</small>
                  )}
                </div>
              </Col>
            </Row>
            <Row className="align-items-start">
              <Col xs={12} sm={12} md={6} className="mb-2">
                <div>
                  <label htmlFor="service" className="employee-box__controllers__label">
                    {messages[`voucher.title`]}
                  </label>
                  <select
                    id="service"
                    className="form-select w-100 employee-box__controllers-select"
                    aria-label="Default select example"
                    onChange={(e) => handleAddVoucher(e.target.value)}
                  >
                    <option selected value="no-voucher">
                      {messages[`${booking}.voucher`]}
                    </option>
                    {voucher.map((singleVoucher) => (
                      <>
                        <option Key={singleVoucher.id} value={singleVoucher.id}>
                          {singleVoucher.code}
                        </option>
                      </>
                    ))}
                  </select>
                </div>
              </Col>
              <Col xs={12} sm={12} md={6} className="mb-2">
                {selectedEmployee && serAtHome && chairs && (
                  <div>
                    <label htmlFor="service" className="employee-box__controllers__label">
                      {messages[`${booking}.chair`]}
                    </label>
                    <select
                      id="service"
                      className="form-select w-100 employee-box__controllers-select"
                      aria-label="Default select example"
                      onChange={(e) => handleSelectChair(e.target.value)}
                    >
                      {chairs && (
                        <option selected disabled>
                          {messages[`booking.header.selectLocation`]}
                        </option>
                      )}
                      {chairs.map((chair) => (
                        <>
                          <option Key={chair.id} value={chair.id}>
                            {chair.name}
                            {/* : &nbsp;&nbsp;&nbsp;{' '}
                            {locale === 'ar' && messages['common.sar']}{' '}
                            {chair.totalPriceWithVAT}{' '}
                            {locale === 'en' && messages['common.sar']} */}
                          </option>
                        </>
                      ))}
                    </select>
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer
          style={{
            display: 'block',
          }}
        >
          <div className="text-center w-50 mx-auto">
            <button
              type="button"
              className="w-50 btn btn-primary p-3 font-weight-bold"
              onClick={() => handleAddBooking()}
              disabled={
                !serviceID ||
                !phone ||
                !date ||
                !selectedEmployee ||
                (selectedEmployee?.freeSlots && !selectedEmpDuration) ||
                (serAtHome && !selectedChair)
              }
            >
              {messages['sidebar.admin.quickBooking']}
            </button>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

NewBooking.propTypes = {
  clickInfo: PropTypes.object,
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  offDays: PropTypes.bool,
  TotalServices: PropTypes.array,
  setNewBookingPayload: PropTypes.func,
};
