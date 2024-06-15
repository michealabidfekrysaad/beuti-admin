import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useAPI, { get, put } from 'hooks/useAPI';
import { CircularProgress, FormControl } from '@material-ui/core';
import CloseBackIcon from 'components/shared/CloseBackIcon';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import { Card, Button, Row } from 'react-bootstrap';
import moment from 'moment';
import GeneralInfo from './AddServiceSections/GeneralInfo';
import OnlineReserve from './AddServiceSections/OnlineReserve';
import AddEmployeeService from './AddServiceSections/AddEmployeeService';
import ComissionService from './AddServiceSections/ComissionService';
import PaymentOptions from './AddServiceSections/PaymentOptions';
import Additionaltime from './AddServiceSections/Additionaltime';
import AddVoucher from './AddServiceSections/AddVoucher';

function EditService() {
  const { serviceId } = useParams();
  const [gctDD, setGctDD] = useState([]);
  const [ctDD, setCtDD] = useState([]);
  const [catDD, setCatDD] = useState([]);
  const [empDD, setEmpDD] = useState([]);
  const [minutesSelection, setMinutesSelection] = useState('');
  const [hoursSelection, setHoursSelection] = useState('');
  const [generalCenterTypeId, setGeneralCenterTypeId] = useState(''); // userSelection
  const [centerTypeId, setCenterTypeId] = useState(''); // userSelection
  const [categoryid, setCategoryId] = useState(''); // userSelection
  const [priceValue, setPriceValue] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [nameAR, setnameAR] = useState('');
  const [nameEn, setnameEn] = useState('');
  const [duration, setDuration] = useState('');
  const [nameARError, setnameARError] = useState(false);
  const [nameEnError, setnameEnError] = useState(false);
  const [durationError, setDurationError] = useState(true);
  const [payload, setPayload] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [atSalon, setAtSalon] = useState(true);
  const [atHome, setAtHome] = useState(true);
  const [allowOnlineReserve, setAllowOnlineReserve] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allowComission, setAllowComission] = useState(true);
  const [inputList, setInputList] = useState([
    {
      hours: null,
      selectedOption: null,
      from: null,
      to: null,
      fixedPrice: 0,
      advancedOptionModal: {},
    },
  ]);
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState(null);
  const [fixedPrice, setFixedPrice] = useState(0);
  const [specialFixedPrice, setSpecialFixedPrice] = useState(0);
  const [allowAddTime, setAllowAddTime] = useState(true);
  const [allowVoucher, setAllowVoucher] = useState(true);
  const [voucherDate, setVoucherDate] = useState(moment(new Date()).format('YYYY-MM-DD'));

  const history = useHistory();
  const { messages, locale } = useIntl();
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

  /* -------------------------------------------------------------------------- */
  /*                            Handle Input Changes                            */
  /* -------------------------------------------------------------------------- */

  const handleGCTUserSelection = (value) => {
    setCtDD([]);
    setEmpDD([]);
    setEmployeeList([]);
    setCatDD([]);
    setCtDD([]);
    if (value) {
      setCategoryId(null);
      setCenterTypeId(null); // if they want the last selection to be auto selected comment this line.
    }
    setGeneralCenterTypeId(value);
  };
  const handleCTUserSelection = (value) => {
    setCatDD([]);
    if (!value) {
      setCategoryId(null);
    }
    setCenterTypeId(value);
  };

  const handleSelectUser = (event) => {
    const userId = +event.target.value;

    if (!selectedUsers.includes(userId)) {
      setSelectedUsers([...selectedUsers, userId]);
      // change the setEmployeeList
      setEmployeeList([...selectedUsers, userId]);
    } else {
      setSelectedUsers(
        selectedUsers.filter((selectedUserId) => selectedUserId !== userId),
      );
      setEmployeeList(
        selectedUsers.filter((selectedUserId) => selectedUserId !== userId),
      );
    }
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length < empDD.length) {
      setSelectedUsers(empDD.map(({ id }) => id));
      setEmployeeList(empDD.map(({ id }) => id));
    } else {
      setSelectedUsers([]);
      setEmployeeList([]);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                            Prepare The API CALLS                           */
  /* -------------------------------------------------------------------------- */

  const {
    response: serviceData,
    isLoading: gettingServiceData,
    setRecall: getServiceData,
  } = useAPI(get, `Service/getServiceById?serviceId=${serviceId}`);

  const { response: gctList, isLoading: gettingGCT, setRecall: getGct } = useAPI(
    get,
    'GeneralCenterType/AllGeneralCenterTypes',
  );
  const {
    response: editServiceRes,
    isLoading: editing,
    setRecall: editServiceCall,
  } = useAPI(put, 'Service/EditService', payload);

  const {
    response: employeesList,
    isLoading: gettingEmployees,
    setRecall: getEmployees,
  } = useAPI(get, `Employee/GetEmployeesByCategory?centerTypeCategoryID=${categoryid}`);

  const {
    response: categoryRes,
    isLoading: gettingCategory,
    setRecall: getCategory,
  } = useAPI(get, `Category/GetCenterTypeCategories?centerTypeList=${centerTypeId}`);

  /* -------------------------------------------------------------------------- */
  /*                      handle The Response Of Service ID                     */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    getGct(true);
    getServiceData(true);
  }, []);

  useEffect(() => {
    if (serviceData?.data) {
      setGeneralCenterTypeId(serviceData.data.generalCenterTypeID);
      setnameAR(serviceData.data.arName);
      setnameEn(serviceData.data.enName);
      setPriceValue(serviceData.data.priceValue);
      setDuration(serviceData.data.duration);
      setCenterTypeId(serviceData.data.centerTypeID);
      setCategoryId(serviceData.data.categoryID);
      setMinutesSelection(serviceData.data.duration.split(':')[1]);
      setHoursSelection(serviceData.data.duration.split(':')[0]);
      setEmployeeList(serviceData.data.employeeList.map((emp) => emp.id));
      setSelectedUsers(serviceData.data.employeeList.map((emp) => emp.id));
    }
  }, [serviceData]);

  useEffect(() => {
    if (categoryid) {
      getEmployees(true);
    }
  }, [categoryid]);

  useEffect(() => {
    if (hoursSelection || minutesSelection) {
      const newDuration = [hoursSelection, minutesSelection];
      setDurationError(
        !hoursSelection ||
          !minutesSelection ||
          // eslint-disable-next-line eqeqeq
          (hoursSelection == 0 && minutesSelection == 0),
      );
      setDuration(newDuration.join(':'));
    }
  }, [hoursSelection, minutesSelection]);

  useEffect(() => {
    if (categoryRes?.data?.list?.length > 0) {
      setCatDD(categoryRes.data.list[0].categories);
    }
  }, [categoryRes]);

  useEffect(() => {
    if (centerTypeId) {
      getCategory(true);
    }
  }, [centerTypeId]);

  useEffect(() => {
    if (employeesList?.data) {
      setEmpDD(employeesList.data?.list);
    }
  }, [employeesList]);

  useEffect(() => {
    if (generalCenterTypeId && serviceData?.data?.list) {
      setCtDD(
        serviceData.data.list.find((gct) => gct.id === generalCenterTypeId).centerTypes,
      );
    }
    if (generalCenterTypeId && gctList?.data?.list) {
      setCtDD(
        gctList.data.list.find((gct) => gct.id === generalCenterTypeId).centerTypes,
      );
    }
  }, [generalCenterTypeId, centerTypeId, gctList]);

  useEffect(() => {
    if (gctList?.data?.list) {
      setGctDD(gctList.data.list.filter((gct) => gct.centerTypes.length > 0));
    }
  }, [gctList]);

  /* -------------------------------------------------------------------------- */
  /*                               Submit The Edit                              */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (submit) {
      const generatedPayload = {
        id: serviceId,
        categoryid,
        duration: String(duration),
        employeeServices: employeeList.map((emp) => ({
          employeeID: emp,
        })),
        priceUnitID: 1,
        nameAR,
        nameEn,
        priceValue,
      };
      setPayload(generatedPayload);
    }
  }, [submit]);

  useEffect(() => {
    if (payload) {
      editServiceCall(true);
      setSubmit(false);
    }
  }, [payload]);

  useEffect(() => {
    if (editServiceRes?.error) {
      notify(editServiceRes.error?.message, 'err');
    }
    if (editServiceRes?.data?.id) {
      notify(messages[`spAdmin.serviceEdit.successMsg`]);
      setTimeout(() => {
        history.goBack();
      }, 4000);
    }
  }, [editServiceRes]);

  const notify = (message, err) => {
    if (err) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  return (
    <>
      <div className={`close-save-nav ${colorChange ? 'nav__white' : ''}`}>
        <div className="d-flex justify-content-between">
          <div>
            <FormControl component="fieldset" fullWidth>
              <Button
                type="submit"
                className="px-4 py-2"
                disabled={
                  editing ||
                  gettingGCT ||
                  !generalCenterTypeId ||
                  !centerTypeId ||
                  !nameAR ||
                  !nameEn ||
                  nameARError ||
                  nameEnError ||
                  durationError ||
                  priceValue < 1 ||
                  employeeList.length === 0
                }
                onClick={() => setSubmit(true)}
              >
                {editing || gettingGCT || gettingServiceData || gettingEmployees ? (
                  <CircularProgress size={24} style={{ color: '#fff' }} />
                ) : (
                  messages['common.save']
                )}
              </Button>
            </FormControl>
          </div>

          <CloseBackIcon />
        </div>
      </div>
      <Card className="mb-5 p-5 card-special">
        <Card.Header>
          <div className="title"> {messages['spAdmin.service.add.header']}</div>
        </Card.Header>
        <Card.Body>
          <Row className="container-box">
            <GeneralInfo
              handleGCTUserSelection={handleGCTUserSelection}
              generalCenterTypeId={generalCenterTypeId}
              gctDD={gctDD}
              handleCTUserSelection={handleCTUserSelection}
              centerTypeId={centerTypeId}
              ctDD={ctDD}
              setCategoryId={setCategoryId}
              categoryid={categoryid}
              catDD={catDD}
              setnameARError={setnameARError}
              setnameEnError={setnameEnError}
              setnameAR={setnameAR}
              setnameEn={setnameEn}
              nameAR={nameAR}
              nameARError={nameARError}
              nameEn={nameEn}
              nameEnError={nameEnError}
              atSalon={atSalon}
              atHome={atHome}
              setAtSalon={setAtSalon}
              setAtHome={setAtHome}
            />
          </Row>
          <hr className="hr-style" align={hrAlign} />

          {/* the second section */}
          <Row className="container-box">
            <OnlineReserve
              allowOnlineReserve={allowOnlineReserve}
              setAllowOnlineReserve={setAllowOnlineReserve}
            />
          </Row>
          <hr className="hr-style" align={hrAlign} />

          {/* the third section */}
          <Row className="container-box">
            <AddEmployeeService
              empDD={empDD}
              selectedUsers={selectedUsers}
              handleSelectAllUsers={handleSelectAllUsers}
              handleSelectUser={handleSelectUser}
            />
          </Row>
          <hr className="hr-style" align={hrAlign} />

          {/* the fourth section */}

          <Row className="container-box">
            <ComissionService
              allowComission={allowComission}
              setAllowComission={setAllowComission}
            />
          </Row>

          <hr className="hr-style" align={hrAlign} />
          {/* the price section wich include add price option */}
          <Row className="container-box">
            <PaymentOptions
              setInputList={setInputList}
              inputList={inputList}
              setMinutesSelection={setMinutesSelection}
              minutesSelection={minutesSelection}
              setFromTime={setFromTime}
              setToTime={setToTime}
              fromTime={fromTime}
              toTime={toTime}
              setFixedPrice={setFixedPrice}
              fixedPrice={fixedPrice}
              setSpecialFixedPrice={setSpecialFixedPrice}
              specialFixedPrice={specialFixedPrice}
            />
          </Row>
          <hr className="hr-style" align={hrAlign} />
          <Row className="container-box">
            <Additionaltime
              allowAddTime={allowAddTime}
              setAllowAddTime={setAllowAddTime}
            />
          </Row>

          <hr className="hr-style" align={hrAlign} />
          <Row className="container-box">
            <AddVoucher
              setAllowVoucher={setAllowVoucher}
              allowVoucher={allowVoucher}
              voucherDate={voucherDate}
              setVoucherDate={setVoucherDate}
            />
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

export default EditService;
