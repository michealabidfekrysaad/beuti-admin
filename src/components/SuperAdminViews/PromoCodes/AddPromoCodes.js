/* eslint-disable indent */
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import { useHistory } from 'react-router-dom';
import { isNumbersOnly } from 'validations/validate';
import moment from 'moment';
import { Row, Col } from 'react-bootstrap';
import BeutiInput from 'Shared/inputs/BeutiInput';
import RangeDateSelect from 'Shared/inputs/RangeDateSelect';
import { toADayFormat } from 'functions/MomentHandlers';
import { DatePicker } from '@material-ui/pickers';
import { toast } from 'react-toastify';
import { CallAPI } from '../../../utils/API/APIConfig';
import { ServiceProvidersModal } from './AddPromoCodes/ServiceProviderModal';
import SelectedBranchesTable from './AddPromoCodes/SelectedBranches';

export function AddPromoCodes() {
  moment.locale('en');

  const history = useHistory();

  const { messages } = useIntl();
  const [promocode, setPromocode] = useState('');
  const [percentage, setPercentage] = useState('');
  const [regexError, setRegexError] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    start: moment(new Date()).format('YYYY-MM-DD'),
    end: moment(new Date()).format('YYYY-MM-DD'),
  });
  const [endDate, setEndDate] = useState(selectedDate.endDate || new Date());
  const { refetch: addPromoCall } = CallAPI({
    name: 'addPromoCode',
    url: 'BookingPromoCode/Add',
    method: 'post',
    body: {
      lastDayToUse: endDate,
      validfrom: selectedDate.start,
      validTo: selectedDate.end,
      code: promocode,
      percentgeValue: percentage,
      isForSelectedSP: selectedBranches.length >= 1,
      selectedSPs: selectedBranches.map((branch) => branch?.id),
    },
    onSuccess: (res) => {
      if (res.data.data) {
        toast.success(messages['promocodes.successMessage']);
        history.goBack();
      }
    },
    onError: (err) => {
      toast.error(err.response.data.error.message);
    },
  });

  const handleValidationForPromo = (value) => {
    if (!/^[a-zA-Z0-9-\u0621-\u064A\u0660-\u0669]*$/.test(value)) {
      setRegexError(true);
    } else {
      setRegexError(false);
    }
    setPromocode(value);
  };
  const handleChangeDate = ([startDay, endDay]) => {
    setSelectedDate({
      ...selectedDate,
      start: toADayFormat(startDay),
      end: endDay && toADayFormat(endDay),
    });
  };
  return (
    <>
      <Row className="settings">
        <Col xs={12} className="settings__section">
          <Row>
            <Col lg={12} md={6} xs={12} className="mb-5">
              <h3 className="settings__section-title">
                {messages['promocodes.add.header']}
              </h3>
              <p className="settings__section-description">
                {messages['promocode.add.description']}
              </p>
            </Col>
            <Col lg={8} md={8} xs={12}>
              <Row className="mb-4">
                <Col xs="6" className="mb-4">
                  <BeutiInput
                    type="tel"
                    value={promocode}
                    label={messages[`promocodes.sidebar.promocode`]}
                    onChange={(e) => {
                      handleValidationForPromo(e.target.value);
                    }}
                    error={
                      (promocode.length > 30 &&
                        messages['promocodes.maxlength.validation']) ||
                      (regexError && messages['promocodes.sidebar.promocode.validation'])
                    }
                  />
                </Col>
                <Col xs="6" className="mb-4">
                  <BeutiInput
                    type="tel"
                    value={percentage}
                    label={messages[`promocodes.percentage`]}
                    onChange={(e) =>
                      isNumbersOnly(e.target.value) ? setPercentage(e.target.value) : null
                    }
                    error={
                      (Number(percentage) < 0 || Number(percentage) > 99) &&
                      messages['promocodes.percentage.errorMessage']
                    }
                  />
                </Col>
                <Col xs="6" className="mb-4">
                  <div className="beuti-date-range-input">
                    <label className="beuti-input__label" htmlFor="text">
                      {messages['common.during']}{' '}
                    </label>
                    <RangeDateSelect
                      startDate={new Date(selectedDate.start)}
                      endDate={selectedDate.end && new Date(selectedDate.end)}
                      onChange={handleChangeDate}
                    />
                  </div>
                </Col>
                <Col xs="6" className="mb-4">
                  <div className="beuti-input">
                    <label htmlFor="test" className="beuti-input__label">
                      {messages['promocode.lastday']}
                    </label>
                    <DatePicker
                      className="beuti-input__field "
                      value={endDate}
                      variant="inline"
                      format="do MMMM yyyy"
                      onChange={(date) => setEndDate(date)}
                      autoOk="true"
                      minDate={selectedDate.start}
                      maxDate={selectedDate.end}
                      helperText={messages['promocode.date.error.start']}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs="12">
              <SelectedBranchesTable
                selectedBranches={selectedBranches}
                setSelectedBranches={setSelectedBranches}
                setOpenModal={setOpenModal}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <section className="settings__submit">
        <button
          className="beutibuttonempty mx-2 action"
          type="button"
          onClick={() => history.goBack()}
        >
          {messages['common.cancel']}
        </button>
        <button
          className="beutibutton action"
          type="submit"
          disabled={
            promocode.length < 1 ||
            promocode.length > 30 ||
            Number(percentage) < 1 ||
            Number(percentage) > 99 ||
            regexError ||
            !promocode ||
            !selectedDate.start ||
            !selectedDate.end ||
            !endDate
          }
          onClick={() => addPromoCall(true)}
        >
          {messages['common.save']}
        </button>
      </section>
      <ServiceProvidersModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedBranches={selectedBranches}
        setSelectedBranches={setSelectedBranches}
      />
    </>
  );
}
