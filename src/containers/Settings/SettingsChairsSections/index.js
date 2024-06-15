import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Card, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import useAPI, { get, post } from 'hooks/useAPI';
import NavbarForNoWrapViews from 'components/shared/NavbarForNoWrapViews';
import { isNumbersWithoutDash } from 'functions/validate';

export default function SettingsChairsSections() {
  const { messages } = useIntl();
  const history = useHistory();
  const [id, setId] = useState(null);
  const [chairPrice, setChairPrice] = useState('');
  const [noOfChairs, setNoOfChairs] = useState('');
  const [predefinedData, setPredefinedDate] = useState({
    price: 0,
    number: 0,
  });
  const [validationNumber, setValidationNumber] = useState(false);
  const [validationPrice, setValidationPrice] = useState(false);
  const [payload, setPayload] = useState(null);

  const {
    response: currentDetails,
    isLoading: getting,
    setRecall: callCurrentDetails,
  } = useAPI(get, 'SPChair/Get');

  const {
    response: editResponse,
    isLoading: editing,
    setRecall: callEditStatus,
  } = useAPI(post, 'SPChair/Update', payload);

  useEffect(() => {
    if (editResponse?.error) {
      notify(editResponse?.error?.message, 'err');
    }
  }, [editResponse]);
  useEffect(() => {
    if (editResponse?.data?.success) {
      notify(messages[`admin.settings.onlineBookingChairs.success`]);
      setTimeout(() => {
        history.goBack();
      }, 2000);
    }
  }, [editResponse]);

  useEffect(() => {
    if (payload) {
      callEditStatus(true);
    }
  }, [payload]);

  useEffect(() => {
    if (currentDetails?.data) {
      setNoOfChairs(currentDetails.data.noOfChairs);
      setChairPrice(currentDetails.data.chairPrice);
      setId(currentDetails.data.id);
      setPredefinedDate({
        price: currentDetails.data.chairPrice,
        number: currentDetails.data.noOfChairs,
      });
    }
  }, [currentDetails]);

  useEffect(() => {
    callCurrentDetails(true);
  }, []);

  const validateOnchairsNo = (e) => {
    if (+e.target.value >= 100) {
      setNoOfChairs(99);
    } else if (+e.target.value <= 0) {
      setNoOfChairs(null);
      setValidationNumber(true);
    } else {
      setNoOfChairs(+e.target.value);
      setValidationNumber(false);
    }
  };

  const validateOnChairsPrice = (e) => {
    if (+e.target.value <= 0) {
      setChairPrice(null);
      setValidationPrice(true);
    } else if (+e.target.value >= 1000) {
      setChairPrice(999);
    } else {
      setChairPrice(+e.target.value);
      setValidationPrice(false);
    }
  };

  const notify = (message, err) => {
    if (err) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  const handleSubmit = () => {
    setPayload({ id, isEnabled: true, noOfChairs, chairPrice });
  };

  return (
    <>
      <NavbarForNoWrapViews
        button={messages['common.save']}
        disabled={
          getting ||
          editing ||
          validationNumber ||
          validationPrice ||
          predefinedData?.price === noOfChairs ||
          predefinedData?.number === chairPrice
        }
        submited={handleSubmit}
      />
      <Card className="mb-5 p-5 card-special">
        <Card.Header>
          <div className="title"> {messages['admin.settings.general.chairs']}</div>
        </Card.Header>
        <Card.Body>
          <Row className="container-box">
            <Col className="input-box__controllers mt-2 mb-2" lg={6} xs={12}>
              <label htmlFor="chairsNum" className="input-box__controllers__label w-100">
                {messages['settings.chairsNumber']}
              </label>
              <input
                className={`input-box__controllers-input w-50 ${
                  validationNumber ? 'input-box__controllers-input--error' : ''
                }`}
                id="chairsNum"
                placeholder={messages['settings.chairsNumber']}
                onChange={(e) =>
                  isNumbersWithoutDash(e.target.value) ? validateOnchairsNo(e) : null
                }
                value={noOfChairs || ''}
              ></input>
            </Col>
            <Col className="input-box__controllers mt-2 mb-2" lg={6} xs={12}>
              <label htmlFor="chairPrice" className="input-box__controllers__label w-100">
                {messages['stAdmin.charis.chair.pricePerHour']}
              </label>
              <input
                className={`input-box__controllers-input w-50 ${
                  validationPrice ? 'input-box__controllers-input--error' : ''
                }`}
                id="chairPrice"
                placeholder={messages['stAdmin.charis.chair.pricePerHour']}
                onChange={(e) =>
                  isNumbersWithoutDash(e.target.value) ? validateOnChairsPrice(e) : null
                }
                value={chairPrice || ''}
              ></input>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
