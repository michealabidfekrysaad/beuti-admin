/* eslint-disable  */
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import { Routes } from 'constants/Routes';
import { CallAPI } from '../../../utils/API/APIConfig';

import { tofullISOString } from '../../../functions/MomentHandlers';
import { AddEditCustomerSchema } from './AddEditCustomer/AddEditCustomerSchema';
import AddEditCustomerForm from './AddEditCustomer/AddEditCustomerForm';
const AddEditCustomer = () => {
  moment.locale('en');

  const { messages } = useIntl();
  const [existUser, setExistUser] = useState(false);
  const history = useHistory();
  const { customerId } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(AddEditCustomerSchema),
    defaultValues: {
      dateOfBirth: null,
    },
  });

  const { refetch: addEditCustomerCall, isFetching: addEditCustomerLoading } = CallAPI({
    name: 'addEditCustomer',
    url: customerId ? 'AnonymousCustomer/Edit' : 'AnonymousCustomer/Add',
    method: customerId ? 'put' : 'post',
    body: {
      ...watch(),
      name: watch('name') || null,
      phone: watch('phone') ? `05${watch('phone')}` : null,
      email: watch('email') || null,
      notes: watch('notes'),
      dateOfBirth:
        tofullISOString(watch('dateOfBirth')) !== 'Invalid date'
          ? tofullISOString(watch('dateOfBirth'))
          : null,
      id: customerId || undefined,
    },
    onSuccess: (res) => {
      if (res?.data?.data?.success) {
        history.push(Routes.settingCustomers);
        toast.success(
          customerId
            ? messages['setting.customer.update.success']
            : messages['setting.customer.add.success'],
        );
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  const { data: customerData } = CallAPI({
    name: ['GetCustomerById', customerId],
    url: 'AnonymousCustomer/GetById',
    refetchOnWindowFocus: false,
    enabled: !!customerId,
    query: {
      id: customerId,
    },
    onSuccess: (res) => {
      setValue('name', res.name || '');
      setValue('phone', res.phone?.substring(2) || '');
      setValue('email', res.email || '');
      setValue('notes', res.notes || '');
      setValue('dateOfBirth', res.dateOfBirth || null);

      if (res.dateOfBirth) {
        setValue('endDate', res.dateOfBirth);
      }
    },
    select: (data) => data?.data?.data,
  });
  CallAPI({
    name: ['GetCustomerById', watch('phone')],
    url: 'AnonymousCustomer/GetByPhone',
    refetchOnWindowFocus: false,
    enabled:
      watch('phone')?.length === 8 && `05${watch('phone')}` !== customerData?.phone,
    query: {
      phone: `05${watch('phone')}`,
    },
    onSuccess: (res) => {
      setExistUser(res.id);
    },
    select: (data) => data?.data?.data,
    onError: (err) => setExistUser(false),
  });
  useEffect(() => {
    register('dateOfBirth', { value: null });
  }, []);

  const emptyNameAndPhone = (e) => {
    if (!watch('phone') && !watch('name')) {
      toast.error(messages['setting.customer.empty.name.phone']);
    }
  };
  useEffect(() => {
    if (watch) {
      const subscription = watch((input, { name }) => {
        if (name === 'phone') {
          setExistUser(false);
        }
      });
      return () => subscription.unsubscribe();
    }
    return null;
  }, [watch]);

  return (
    <form onSubmit={handleSubmit(addEditCustomerCall, emptyNameAndPhone)}>
      <Row className="settings">
        <Col xs={12} className="settings__section">
          <AddEditCustomerForm
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            customerId={customerId}
            existUser={existUser}
            customerData={customerData}
          />
        </Col>
      </Row>

      <section className="settings__submit">
        <button
          className="beutibuttonempty mx-2 action"
          type="button"
          onClick={() => history.goBack()}
          disabled={addEditCustomerLoading}
        >
          {messages['common.cancel']}
        </button>
        <button
          className="beutibutton action"
          type="submit"
          disabled={addEditCustomerLoading}
        >
          {messages['common.save']}
        </button>
      </section>
    </form>
  );
};

export default AddEditCustomer;
