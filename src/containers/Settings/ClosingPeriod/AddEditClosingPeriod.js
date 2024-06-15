/* eslint-disable indent */
import React, { useContext, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useIntl, FormattedMessage } from 'react-intl';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import { Routes } from 'constants/Routes';
import ClosingPeriodForm from './AddEditClosingPeriod/ClosingPeriodForm';
import { CallAPI } from '../../../utils/API/APIConfig';
import ClosingPeriodBranches from './AddEditClosingPeriod/ClosingPeriodBranchs';
import { BranchesContext } from '../../../providers/BranchesSelections';
import { AddEditClosingPeriodSchema } from './AddEditClosingPeriod/AddEditClosingPeriodSchema';
import { handleDuration } from './Helper/handleDuration';
import { tofullISOString } from '../../../functions/MomentHandlers';
const AddEditClosingPeriod = () => {
  moment.locale('en');

  const { messages } = useIntl();
  const { branches, allBranchesData } = useContext(BranchesContext);
  const history = useHistory();
  const { closingPeriodId } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,

    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(AddEditClosingPeriodSchema),
  });

  const {
    refetch: addEditClosingTimeCall,
    isFetching: addEditClosingTimeLoading,
  } = CallAPI({
    name: 'addEditClosingTime',
    url: closingPeriodId ? 'SPClosingPeriod/Edit' : 'SPClosingPeriod/Add',
    method: closingPeriodId ? 'put' : 'post',
    body: {
      ...watch(),
      startDate: tofullISOString(watch('startDate')),
      endDate: tofullISOString(watch('endDate')),
      id: closingPeriodId || undefined,
    },
    onSuccess: (res) => {
      if (res?.data?.data?.success) {
        history.push(Routes.workingHours);
        toast.success(
          closingPeriodId
            ? messages['closing.period.add.editedSuccessfully']
            : messages['closing.period.add.addedSuccessfully'],
        );
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  CallAPI({
    name: ['GetClosingPeriodById', closingPeriodId],
    url: 'SPClosingPeriod/GetClosingPeriodById',
    refetchOnWindowFocus: false,
    enabled: !!closingPeriodId,
    query: {
      id: closingPeriodId,
    },
    onSuccess: (res) => {
      setValue('reasonEn', res.reasonEn);
      setValue('reasonAr', res.reasonAr);
      setValue('startDate', res.startDate);
      setValue('endDate', res.endDate);
    },
    select: (data) => data?.data?.data,
  });
  useEffect(() => {
    setValue(
      'branches',
      branches?.map((branch) => branch?.toString()),
    );
  }, [branches]);
  useEffect(() => {
    register('startDate', { value: new Date() });
    register('endDate', { value: new Date() });
  }, []);
  return (
    <form onSubmit={handleSubmit(addEditClosingTimeCall)}>
      <Row className="settings">
        <Col xs={12} className="settings__section">
          <ClosingPeriodForm
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            clearErrors={clearErrors}
          />
          {handleDuration(watch('startDate'), watch('endDate')) && (
            <div className="waning-message-beuti ">
              <FormattedMessage
                id="closing.period.days"
                values={{
                  count: handleDuration(watch('startDate'), watch('endDate')),
                }}
              />
            </div>
          )}
        </Col>
        {allBranchesData?.length > 1 && !closingPeriodId && (
          <Col xs={12} className="settings__section">
            <ClosingPeriodBranches
              errors={errors}
              register={register}
              watch={watch}
              setValue={setValue}
              AllBranches={allBranchesData}
            />
          </Col>
        )}
      </Row>

      <section className="settings__submit">
        <button
          className="beutibuttonempty mx-2 action"
          type="button"
          onClick={() => history.goBack()}
          disabled={addEditClosingTimeLoading}
        >
          {messages['common.cancel']}
        </button>
        <button className="beutibutton action" type="submit">
          {messages['common.save']}
        </button>
      </section>
    </form>
  );
};

export default AddEditClosingPeriod;
