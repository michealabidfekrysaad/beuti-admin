import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import useAPI, { get, post } from 'hooks/useAPI';
import { CircularProgress, FormControl } from '@material-ui/core';
import { useIntl } from 'react-intl';
import { Card, Button, Row } from 'react-bootstrap';
import Alert from '@material-ui/lab/Alert';

import moment from 'moment';
import CloseBackIcon from 'components/shared/CloseBackIcon';
import {
  AddNewServiceContext,
  ClearLocalStorage,
  SetLocalStorage,
} from '../../../providers/AddNewServiceProvider';
import { HandleSuccessAndErrorMsg } from '../../../functions/HandleSuccessAndErrorMsg';

import GeneralInfo from './AddServiceSections/GeneralInfo';
import AddEmployeeService from './AddServiceSections/AddEmployeeService';
import OnlineReserve from './AddServiceSections/OnlineReserve';
import ComissionService from './AddServiceSections/ComissionService';
import PaymentOptions from './AddServiceSections/PaymentOptions';
import Additionaltime from './AddServiceSections/Additionaltime';
import AddVoucher from './AddServiceSections/AddVoucher';

function AddService() {
  const { selectedService } = useContext(AddNewServiceContext);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [atSalon, setAtSalon] = useState(true);
  const [atHome, setAtHome] = useState(true);
  const [allowOnlineReserve, setAllowOnlineReserve] = useState(true);
  const [allowAddTime, setAllowAddTime] = useState(true);
  const [allowVoucher, setAllowVoucher] = useState(true);
  const [allowComission, setAllowComission] = useState(true);
  const [gctDD, setGctDD] = useState([]);
  const [ctDD, setCtDD] = useState([]);
  const [catDD, setCatDD] = useState([]);
  const [empDD, setEmpDD] = useState([]);
  const [minutesSelection, setMinutesSelection] = useState('');
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
  const [generalCenterTypeId, setGeneralCenterTypeId] = useState(null); // userSelection
  const [centerTypeId, setCenterTypeId] = useState(null); // userSelection
  const [categoryid, setCategoryId] = useState(null); // userSelection
  const [ServiceIdFromParent, setServiceIdFromParent] = useState(null); // userSelection
  const [priceValue, setPriceValue] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [duration, setDuration] = useState('');
  const [nameARError, setnameARError] = useState(false);
  const [nameEnError, setnameEnError] = useState(false);
  const [nameAR, setnameAR] = useState('');
  const [nameEn, setnameEn] = useState('');
  const [durationError, setDurationError] = useState(true);
  const [responseError, setResponseError] = useState('');
  const [payload, setPayload] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [voucherDate, setVoucherDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [fixedPrice, setFixedPrice] = useState(0);
  const [specialFixedPrice, setSpecialFixedPrice] = useState(0);

  const [gctApi, add] = ['GeneralCenterType/AllGeneralCenterTypes', 'Service/AddService'];
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

  useEffect(() => {
    // the GCT , CT come from tables page to predefined it here
    if (selectedService?.serviceIDFromSameLevel) {
      SetLocalStorage('serviceIDFromSameLevel', selectedService?.serviceIDFromSameLevel);
      setServiceIdFromParent(selectedService.serviceIDFromSameLevel);
    }
  }, [selectedService]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGCTUserSelection = (value) => {
    setCtDD([]);
    setEmpDD([]);
    setCatDD([]);
    setEmployeeList([]);
    setCtDD([]);
    setCenterTypeId(null);
    if (!value) {
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

  //   const handleEmployeeSelector = (value) => {
  //     //   value is the whole object for employee
  //     // setEmployeeList([...employeeList, value]);
  //     const objIndex = empDD.findIndex((obj) => obj.id === value.id);
  //     // setIsEnabled(!value.ischecked);
  //   };
  //   const handleSelectAll = () => {
  //     // put all employee in the array for payload
  //     // setEmployeeList([...empDD]);
  //     setIsChecked(!isChecked && true);
  //   };

  const handleSelectUser = (event) => {
    const userId = +event.target.value;

    if (!selectedUsers.includes(userId)) {
      setSelectedUsers([...selectedUsers, userId]);
      // change the setEmployeeList
      setEmployeeList([...employeeList, empDD.find((emp) => emp.id === userId)]);
    } else {
      setSelectedUsers(
        selectedUsers.filter((selectedUserId) => selectedUserId !== userId),
      );
      setEmployeeList(employeeList.filter((emp) => emp.id !== userId));
    }
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length < empDD.length) {
      setSelectedUsers(empDD.map(({ id }) => id));
      setEmployeeList(empDD);
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
  } = useAPI(get, `Service/getServiceById?serviceId=${ServiceIdFromParent}`);

  const { response: gctList, isLoading: gettingGCT, setRecall: getGct } = useAPI(
    get,
    gctApi,
  );

  const { response: addCatResponse, isLoading: adding, setRecall: addService } = useAPI(
    post,
    add,
    payload,
  );

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
  }, []);

  useEffect(() => {
    if (categoryid) {
      getEmployees(true);
    }
  }, [categoryid]);

  // need to handle the logic due to input ui changes
  //   useEffect(() => {
  //     if (inputList || minutesSelection) {
  //       const newDuration = [inputList, minutesSelection];
  //       setDurationError(
  //         !inputList ||
  //           !minutesSelection ||
  //           // eslint-disable-next-line eqeqeq
  //           (inputList == 0 && minutesSelection == 0),
  //       );
  //       setDuration(newDuration.join(':'));
  //     }
  //   }, [inputList, minutesSelection]);

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
      setSelectedUsers(employeesList.data?.list.map(({ id }) => id));
    }
  }, [employeesList]);

  useEffect(() => {
    if (generalCenterTypeId && gctList?.data?.list) {
      setCtDD(
        gctList?.data?.list.find((gct) => gct.id === +generalCenterTypeId)?.centerTypes,
      );
    }
  }, [generalCenterTypeId, gettingGCT]);

  useEffect(() => {
    if (gctList?.data?.list) {
      setGctDD(gctList.data.list.filter((gct) => gct.centerTypes.length > 0));
    }
  }, [gctList]);

  // call same GCT, CT, category then select it in dropdown
  useEffect(() => {
    if (ServiceIdFromParent && !serviceData) {
      getServiceData(true);
    }
    if (serviceData) {
      handleGCTUserSelection(serviceData?.data?.generalCenterTypeID);
      handleCTUserSelection(serviceData?.data?.centerTypeID);
      setCategoryId(serviceData?.data?.categoryID);
    }
  }, [ServiceIdFromParent, serviceData]);

  /* -------------------------------------------------------------------------- */
  /*                                Handle Submit                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (submit) {
      const generatedPayload = {
        categoryid,
        duration: String(duration),
        employeeServices: employeeList.map((emp) => ({
          employeeID: emp.id,
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
      addService(true);
      setSubmit(false);
    }
  }, [payload]);

  useEffect(() => {
    if (addCatResponse?.error) {
      HandleSuccessAndErrorMsg(setResponseError, addCatResponse.error?.message);
    }
    if (addCatResponse?.data?.id) {
      setSuccess(true);
      setTimeout(() => {
        history.goBack();
      }, 4000);
    }
  }, [addCatResponse]);

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
                  adding ||
                  gettingGCT ||
                  !generalCenterTypeId ||
                  !centerTypeId ||
                  !nameAR ||
                  !nameEn ||
                  nameARError ||
                  nameEnError ||
                  durationError ||
                  responseError ||
                  priceValue < 1 ||
                  success
                }
                onClick={() => {
                  ClearLocalStorage('serviceIDFromSameLevel');
                  setSubmit(true);
                }}
              >
                {adding || gettingGCT ? (
                  <CircularProgress size={24} style={{ color: '#fff' }} />
                ) : (
                  messages['spAdmin.service.add.btn']
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
          {/* Error And Success  */}
          {responseError && (
            <Alert className="mb-3" severity="error">
              {responseError}
            </Alert>
          )}
          {success && (
            <Alert className="mb-3" severity="success">
              {messages['spAdmin.serviceAdd.successMsg']}
            </Alert>
          )}
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

export default AddService;
