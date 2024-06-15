/* eslint-disable prefer-template */
import React, { useState, useMemo, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Routes } from 'constants/Routes';
import { toast } from 'react-toastify';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { CallAPI } from 'utils/API/APIConfig';
import {
  BRAND_MANAGERS,
  MANAGER_PHONE_AVAILABLE,
  BRAND_CHANGE_BRANCH_MANAGER,
} from 'utils/API/EndPoints/BranchManager';
import { useHistory, useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BeutiInput from 'Shared/inputs/BeutiInput';
import SelectInputMUI from 'Shared/inputs/SelectInputMUI';
import { SchemaManager } from './SchemaManager';

export default function BranchManager() {
  const history = useHistory();
  const { branchID } = useParams();
  const { messages } = useIntl();
  const [existOrNew, setExistOrNew] = useState('exist');
  const [phoneExistingErr, setPhoneExistingErr] = useState(false);
  const [completeData, setCompleteData] = useState(false);
  const [payload, setPayload] = useState(null);
  const [listManager, setListManager] = useState([]);
  const [existingManager, setExistingManager] = useState('');

  const schema = SchemaManager(existOrNew);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields, isDirty },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  /* -------------------------------------------------------------------------- */
  /*                           API calling  component                           */
  /* -------------------------------------------------------------------------- */

  CallAPI({
    name: 'getAllBranchManager',
    url: BRAND_MANAGERS,
    enabled: true,
    onSuccess: (data) => {
      setListManager(data);
    },
    select: (data) =>
      data?.data?.data?.list.map((manager) => ({
        id: manager.userId,
        key: manager.userId,
        text: manager.name + ' - ' + manager.phoneNumber,
      })),
  });

  const { error, refetch, isFetching } = CallAPI({
    name: 'phoneAvailableOrNot',
    url: MANAGER_PHONE_AVAILABLE,
    cacheTime: 1000,
    retry: false,
    query: {
      phoneNumber: watch('phoneNum'),
    },
    onSuccess: (data) => {
      if (data?.data?.data?.success) {
        setCompleteData(true);
      }
    },
  });

  const totalAPI = CallAPI({
    name: 'changeBranchManager',
    url: BRAND_CHANGE_BRANCH_MANAGER,
    body: payload,
    method: 'put',
    // retry: 1,
    cacheTime: 1000,
    onSuccess: (res) => {
      notify(messages[`common.success`]);
      setTimeout(() => {
        history.goBack();
      }, 3000);
    },
  });

  useEffect(() => {
    if (totalAPI?.error?.response?.data?.error?.message) {
      notify(totalAPI?.error?.response?.data?.error?.message, 'err');
    }
  }, [totalAPI?.error?.response?.data?.error?.message]);

  useEffect(() => {
    if (payload) {
      totalAPI.refetch();
    }
  }, [payload]);

  useEffect(() => {
    if (error?.response?.data?.error?.message) {
      setPhoneExistingErr(error?.response?.data?.error?.message);
      setCompleteData(false);
    }
  }, [error?.response?.data?.error?.message]);

  const existOrNewManager = (event) => {
    setCompleteData(false);
    reset(
      {
        phoneNum: '',
        managerNameAR: '',
        managerNameEN: '',
      },
      {
        keepErrors: false,
        // keepDirty: true,
        // keepIsSubmitted: false,
        // keepTouched: false,
        // keepIsValid: false,
        // keepSubmitCount: false,
      },
    );
    setExistOrNew(event.target.value);
  };
  function handleExistingManager(e) {
    setExistingManager(e.target.value);
  }

  const submitForm = (data) => {
    if (existOrNew === 'exist') {
      setPayload({
        managerUserId: existingManager,
        branchID,
        managerNameAR: null,
        managerNameEN: null,
        managerMobile: null,
      });
    } else {
      setPayload({
        branchID,
        managerNameAR: data.managerNameAR,
        managerNameEN: data.managerNameEN,
        managerMobile: data.phoneNum,
        managerUserId: null,
      });
    }
  };

  const notify = (message, err) => {
    if (err) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  useEffect(() => {
    setPhoneExistingErr(false);
    if (watch('phoneNum')?.length === 10 && !errors?.phoneNum) {
      refetch();
    }
  }, [watch('phoneNum'), errors?.phoneNum?.message]);

  return (
    <Row className="settings">
      <Col xs="12">
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="add-branch">
            <Row className="border-bottom pb-3">
              <Col xs={12} className="settings__section pb-0">
                <div className="d-flex justify-content-between">
                  <section>
                    <p className="title">
                      {messages['branches.add.branch.change.manager.title']}
                    </p>
                  </section>
                </div>
              </Col>
            </Row>
            <Row className="branch-header">
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
                    onChange={existOrNewManager}
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
                          disabled={existOrNew === 'exist' || isFetching}
                          labelClass={existOrNew === 'exist' ? 'disabledInputLabel' : ''}
                        />
                        {isFetching && (
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
                          disabled={existOrNew === 'exist' || !completeData || isFetching}
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
                          disabled={existOrNew === 'exist' || !completeData || isFetching}
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
                  (existOrNew === 'new' && errors?.managerNameAR) ||
                  (existOrNew === 'new' && errors?.managerNameEN) ||
                  (existOrNew === 'new' && errors?.phoneNum) ||
                  (existOrNew === 'new' && !isDirty) ||
                  (existOrNew === 'new' && !isValid) ||
                  (existOrNew === 'exist' && !existingManager)
                }
              >
                {messages['common.save']}
              </button>
            </section>
          </div>
        </form>
      </Col>
    </Row>
  );
}
