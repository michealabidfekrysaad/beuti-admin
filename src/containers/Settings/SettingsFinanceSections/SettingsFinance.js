import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { CircularProgress } from '@material-ui/core';
import CloseBackIcon from 'components/shared/CloseBackIcon';
import { Card, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import useAPI, { get, put } from 'hooks/useAPI';
import EmployeeCommission from 'components/AdminViews/Settings/EmployeeCommission';
import Vat from '../../../components/AdminViews/Settings/VAT';

export default function SettingsFinance() {
  const { messages } = useIntl();
  const history = useHistory();
  const [colorChange, setColorchange] = useState(false);
  const [vatValue, setVatValue] = useState('');
  const [notifyshow, setNotifyShow] = useState(false);
  const [certificateNumber, setcertificateNumber] = useState('');
  const [employeeCommisionValue, setEmployeeCommisionValue] = useState('');
  const [payload, setPayload] = useState(null);
  const countOfCertificateNumber = 15;

  const { response: currentVat, isLoading: getting, setRecall: callCurrentVat } = useAPI(
    get,
    'ServiceProvider/GetSPVAT',
  );

  const { response: editResponse, isLoading: editing, setRecall: callEditVat } = useAPI(
    put,
    'ServiceProvider/SetSPVAT',
    payload,
  );

  const {
    response: currentEmployeeCommision,
    isLoading: gettingEmpComission,
    setRecall: callCurrentEmployeeCommision,
  } = useAPI(get, 'EmployeeCommission/GetCommissionValue');

  //   const {
  //     response: editResponseEmpComission,
  //     isLoading: editingLoading,
  //     setRecall: callEditEmployeeCommision,
  //   } = useAPI(put, 'EmployeeCommission/UpdateCommissionValue', payload);

  useEffect(() => {
    if (editResponse?.error) {
      notify(editResponse?.error?.message, 'err');
    }
    if (editResponse?.success) {
      notify(messages[`admin.settings.vat.success`]);
      setTimeout(() => {
        history.goBack();
      }, 2000);
    }
  }, [editResponse]);

  useEffect(() => {
    if (payload) {
      callEditVat(true);
    }
  }, [payload]);

  //   useEffect(() => {
  //     if (editResponseEmpComission?.error) {
  //   notify(editResponseEmpComission?.error?.message,'err');
  //     }
  //     if (editResponseEmpComission?.data?.data) {
  //   notify(messages[`admin.settings.employeeCommision.success`]);
  //   setTimeout(() => {
  // 	history.goBack();
  //   }, 2000);
  //     }
  //   }, [editResponseEmpComission]);

  //   useEffect(() => {
  //     if (payload) {
  //       callEditEmployeeCommision(true);
  //     }
  //   }, [payload]);

  //   const handleSubmit = () => {
  //     setSubmit(true);
  //     setPayload({
  //       commissionPercentage: employeeCommisionValue,
  //     });
  //   };

  /* -------------------------------------------------------------------------- */
  /*                put the initial vatValue, number from the DB                */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (currentVat && currentVat.data && currentVat.data.vatValue > -1) {
      setVatValue(currentVat.data.vatValue);
      if (currentVat.data.certificateNumber) {
        setcertificateNumber(currentVat.data.certificateNumber);
      }
    }
  }, [currentVat]);

  useEffect(() => {
    if (currentEmployeeCommision?.data) {
      setEmployeeCommisionValue(currentEmployeeCommision.data.data);
    }
  }, [currentEmployeeCommision]);

  useEffect(() => {
    callCurrentVat(true);
    callCurrentEmployeeCommision(true);
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                      send the payload for vat & number                     */
  /* -------------------------------------------------------------------------- */

  const handleCertificateSubmit = () => {
    if (
      (!certificateNumber || certificateNumber.length < countOfCertificateNumber) &&
      vatValue === '0'
    ) {
      setPayload({
        vatValue,
        certificateNumber: null,
      });
    } else if (certificateNumber.length === countOfCertificateNumber) {
      setPayload({
        vatValue,
        certificateNumber,
      });
    } else {
      setNotifyShow(true);
      notify(messages['admin.setttings.vat.certificate.error'], 'err');
      setTimeout(() => {
        setNotifyShow(false);
      }, 3000);
    }
  };

  const notify = (message, err) => {
    if (err) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

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

  return (
    <>
      <div className={`close-save-nav ${colorChange ? 'nav__white' : ''}`}>
        <div className="d-flex justify-content-between">
          <div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                !vatValue ||
                vatValue < 0 ||
                vatValue > 99 ||
                getting ||
                editing ||
                certificateNumber.length > countOfCertificateNumber ||
                notifyshow
              }
              onClick={handleCertificateSubmit}
            >
              {getting || editing || gettingEmpComission ? (
                <CircularProgress size={24} style={{ color: '#fff' }} />
              ) : (
                messages['common.save']
              )}
            </button>
          </div>
          <CloseBackIcon />
        </div>
      </div>
      <Card className="mb-5 p-5 card-special">
        <Card.Header>
          <div className="title">{messages['admin.settings.general.finance.header']}</div>
        </Card.Header>
        <Card.Body>
          <Row className="container-box">
            <Vat
              vatValue={vatValue}
              setVatValue={setVatValue}
              countOfCertificateNumber={countOfCertificateNumber}
              certificateNumber={certificateNumber}
              setcertificateNumber={setcertificateNumber}
            />
          </Row>
          <EmployeeCommission
            employeeCommisionValue={employeeCommisionValue}
            setEmployeeCommisionValue={setEmployeeCommisionValue}
          />
        </Card.Body>
      </Card>
    </>
  );
}
