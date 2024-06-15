/* eslint-disable prefer-template */
import React, { useState, useMemo, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Routes } from 'constants/Routes';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import useApi, { get, post } from 'hooks/useAPI';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import BeutiInput from 'Shared/inputs/BeutiInput';
import SelectInputMUI from 'Shared/inputs/SelectInputMUI';
import { SchemaAddBranches } from './SchemaAddBranches';

export default function AddNewBranch() {
  const history = useHistory();
  const { messages } = useIntl();
  const [existOrNew, setExistOrNew] = useState('exist');
  const [listManager, setListManager] = useState([]);
  const [businessCategoryDD, setBusinessCategoryDD] = useState([]);
  const [phoneExistingErr, setPhoneExistingErr] = useState(false);
  const [completeData, setCompleteData] = useState(false);
  const [payload, setPayload] = useState(false);
  const [businessCategory, setBusinessCategory] = useState(0);
  const [existingManager, setExistingManager] = useState(0);
  const schemaValidations = SchemaAddBranches(existOrNew);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields, isDirty },
    clearErrors,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schemaValidations),
    mode: 'onChange',
  });

  /* -------------------------------------------------------------------------- */
  /*                             API calling prepare                            */
  /* -------------------------------------------------------------------------- */
  const { response: allManagers, setRecall: recallManager } = useApi(
    get,
    `Brand/GetBrandManagers`,
  );
  const { response: allBusinessCat, setRecall: recallBusinessCat } = useApi(
    get,
    `BusinessCategory/GetBussinessCategoriesOrderedByName`,
  );
  const {
    response: phoneNumAvailable,
    isLoading: checkPhoneAvailable,
    setRecall: recallPhoneNumAvailable,
  } = useApi(get, `Brand/IsManagerPhoneNumberAvailable?phoneNumber=${watch('phoneNum')}`);
  const {
    response: addBranchRes,
    isLoading: addBranchLoad,
    setRecall: recallAddBranch,
  } = useApi(post, `Brand/AddBranch`, payload);

  /* -------------------------------------------------------------------------- */
  /*                          calling API first render                          */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    recallManager(true);
    recallBusinessCat(true);
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                       display the data come from API                       */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (allManagers?.data) {
      setListManager(
        allManagers?.data?.list.map((manager) => ({
          id: manager.userId,
          key: manager.userId,
          text: manager.name + ' - ' + manager.phoneNumber,
        })),
      );
    }
    if (allBusinessCat?.data) {
      setBusinessCategoryDD(
        allBusinessCat?.data?.list.map((cat) => ({
          id: cat.id,
          key: cat.id,
          text: cat.name,
        })),
      );
    }
  }, [allManagers, allBusinessCat]);

  useEffect(() => {
    setPhoneExistingErr(false);
    if (watch('phoneNum')?.length === 10 && !errors?.phoneNum) {
      recallPhoneNumAvailable(true);
    } else {
      recallPhoneNumAvailable(false);
    }
  }, [watch('phoneNum'), errors?.phoneNum?.message]);

  useEffect(() => {
    if (phoneNumAvailable?.error) {
      setCompleteData(false);
      setPhoneExistingErr(phoneNumAvailable?.error?.message);
    }
    if (phoneNumAvailable?.data?.success) {
      setCompleteData(true);
    }
  }, [phoneNumAvailable]);

  useEffect(() => {
    if (payload) {
      recallAddBranch(true);
    }
  }, [payload]);

  useEffect(() => {
    if (addBranchRes?.data?.success) {
      notify(messages[`common.success`]);
      setTimeout(() => {
        history.push(Routes.settingAllBrsanches);
      }, 3000);
    }
    if (addBranchRes?.error) {
      notify(addBranchRes?.error?.message, 'err');
    }
  }, [addBranchRes]);

  const handleChange = (event) => {
    reset(
      {
        phoneNum: '',
        managerNameAR: '',
        managerNameEN: '',
      },
      {
        keepErrors: false,
      },
    );
    setExistOrNew(event.target.value);
  };
  function handleSelectBusiness(e) {
    setBusinessCategory(e.target.value);
  }
  function handleExistingManager(e) {
    setExistingManager(e.target.value);
  }

  const notify = (message, err) => {
    if (err) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  const submitForm = (data) => {
    setPayload({
      nameAr: data?.branchNameAr,
      nameEn: data?.branchNameEn,
      businessCategoryId: +businessCategory,
      managerMobile: existOrNew !== 'exist' ? data?.phoneNum : null,
      managerNameAr: existOrNew !== 'exist' ? data?.managerNameAR : null,
      managerNameEn: existOrNew !== 'exist' ? data?.managerNameEN : null,
      managerUserId: existOrNew === 'exist' ? existingManager : null,
    });
  };
  return (
    <Row className="settings">
      <Col xs="12">
        <form onSubmit={handleSubmit(submitForm)} method="post">
          <div className="add-branch ">
            <Row className="border-bottom pb-3">
              <Col xs={12} className="settings__section pb-0">
                <div className="d-flex justify-content-between">
                  <section>
                    <p className="title">{messages['branches.add.branch.title']}</p>
                  </section>
                </div>
              </Col>
            </Row>
            <Row className="branch-header">
              <Col xs="12" className="mb-3">
                <p className="title">{messages['branches.add.new.details']}</p>
              </Col>
              <Col lg={6} xs={12} className="mb-2">
                <BeutiInput
                  type="text"
                  label={`${messages['branches.add.new.branch.name.ar']} *`}
                  useFormRef={register('branchNameAr')}
                  error={errors?.branchNameAr?.message && errors?.branchNameAr?.message}
                />
              </Col>
              <Col lg={6} xs={12} className="mb-2">
                <BeutiInput
                  type="text"
                  label={`${messages['branches.add.new.branch.name.en']} *`}
                  useFormRef={register('branchNameEn')}
                  error={errors?.branchNameEn?.message && errors?.branchNameEn?.message}
                />
              </Col>
              <Col lg={6} xs={12} className="mb-2">
                <SelectInputMUI
                  label={messages['branches.add.new.branch.business.category']}
                  list={businessCategoryDD}
                  onChange={handleSelectBusiness}
                  value={businessCategory}
                  disabled={businessCategoryDD.length === 0}
                />
              </Col>
            </Row>
            <Row className="branch-header">
              <hr className="w-100" />
              <Col xs={12} className="mb-4">
                <p className="title">{messages['branches.add.new.manager.branch']}</p>
                <p className="sub-title">
                  {messages['branches.add.new.manager.branch.info']}
                </p>
              </Col>
              <Col xs={12} className="pb-5">
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="gender"
                    name="gender1"
                    value={existOrNew}
                    onChange={handleChange}
                  >
                    <Col xs={5} className="mb-2">
                      <FormControlLabel
                        className="radio-label"
                        value="exist"
                        control={<Radio />}
                        label={messages['branches.add.new.manager.exist']}
                      />
                      <SelectInputMUI
                        className="mt-0"
                        label={messages['branches.add.new.manager.exist.select']}
                        list={listManager}
                        onChange={handleExistingManager}
                        value={existingManager}
                        disabled={existOrNew !== 'exist'}
                        labelClass={existOrNew !== 'exist' ? 'disabledInputLabel' : ''}
                      />
                    </Col>
                    <Col id="or" xs={1}>
                      {messages['common.or']}
                    </Col>
                    <Col xs={6} className="mb-2">
                      <FormControlLabel
                        className="radio-label"
                        value="new"
                        control={<Radio />}
                        label={messages['branches.add.new.manager.new']}
                      />
                      <div className="mb-2">
                        <BeutiInput
                          type="text"
                          label={messages['branches.add.new.manager.new.mobile']}
                          useFormRef={register('phoneNum')}
                          error={
                            (errors?.phoneNum?.message && errors?.phoneNum?.message) ||
                            phoneExistingErr
                          }
                          disabled={existOrNew === 'exist' || checkPhoneAvailable}
                          labelClass={existOrNew === 'exist' ? 'disabledInputLabel' : ''}
                        />
                        {phoneExistingErr && (
                          <p className="error-phone-api">{phoneExistingErr}</p>
                        )}
                        {checkPhoneAvailable && (
                          <div
                            className="spinner-border spinner-border-sm error-phone-api"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        )}
                      </div>
                      <div className="mb-2">
                        <BeutiInput
                          type="text"
                          label={messages['branches.add.new.manager.new.name.ar']}
                          useFormRef={register('managerNameAR')}
                          error={
                            errors?.managerNameAR?.message &&
                            errors?.managerNameAR?.message
                          }
                          disabled={
                            existOrNew === 'exist' || !completeData || checkPhoneAvailable
                          }
                          labelClass={existOrNew === 'exist' ? 'disabledInputLabel' : ''}
                        />
                      </div>
                      <div className="mb-2">
                        <BeutiInput
                          type="text"
                          label={messages['branches.add.new.manager.new.name.en']}
                          useFormRef={register('managerNameEN')}
                          error={
                            errors?.managerNameEN?.message &&
                            errors?.managerNameEN?.message
                          }
                          disabled={
                            existOrNew === 'exist' || !completeData || checkPhoneAvailable
                          }
                          labelClass={existOrNew === 'exist' ? 'disabledInputLabel' : ''}
                        />
                      </div>
                    </Col>
                  </RadioGroup>
                </FormControl>
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
                type="submit"
                className="beutibutton action"
                disabled={
                  errors?.branchNameAr ||
                  errors?.branchNameEn ||
                  (existOrNew === 'new' && errors?.managerNameAR) ||
                  (existOrNew === 'new' && errors?.managerNameEN) ||
                  (existOrNew === 'new' && errors?.phoneNum) ||
                  (existOrNew === 'new' && !isValid) ||
                  (existOrNew === 'exist' && !existingManager) ||
                  !businessCategory ||
                  addBranchLoad
                }
              >
                {!addBranchLoad ? (
                  messages['common.save']
                ) : (
                  <CircularProgress size={15} className="mx-auto" color="inherit" />
                )}
              </button>
            </section>
          </div>
        </form>
      </Col>
    </Row>
  );
}
