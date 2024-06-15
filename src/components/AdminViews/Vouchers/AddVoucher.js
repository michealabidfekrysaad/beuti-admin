import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import BeutiButton from 'Shared/inputs/BeutiButton';
import { CallAPI } from '../../../utils/API/APIConfig';
import { addVoucherSchema } from './AddVoucher/VoucherSchema';
import VoucherDetails from './AddVoucher/VoucherDetails';
import VoucherPeriod from './AddVoucher/VoucherPeriod';

const AddVoucher = () => {
  moment.locale('en');

  const { messages } = useIntl();
  const history = useHistory();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(addVoucherSchema),
  });
  useEffect(() => {
    setValue('startDate', moment(new Date()).format('YYYY-MM-DD'));
    setValue('endDate', moment(new Date()).format('YYYY-MM-DD'));
  }, []);
  const { refetch: addVoucherCall, isFetching: addVoucherLoading } = CallAPI({
    name: 'AddVoucher',
    url: '/Voucher/add',
    method: 'post',
    body: {
      ...watch(),
    },
    onSuccess: (res) => {
      if (res?.data?.data?.success) {
        history.push('/voucherList/0');
        toast.success(messages['common.success']);
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  return (
    <form onSubmit={handleSubmit(addVoucherCall)}>
      <Row className="settings">
        <Col xs={12} className="settings__section">
          <VoucherDetails
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
          />
        </Col>
        <Col xs={12} className="settings__section">
          <VoucherPeriod
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            clearErrors={clearErrors}
          />
        </Col>
      </Row>
      <section className="settings__submit">
        <button
          className="beutibuttonempty mx-2 action"
          type="button"
          onClick={() => history.goBack()}
          disabled={addVoucherLoading}
        >
          {messages['common.cancel']}
        </button>
        <BeutiButton
          text={messages['common.save']}
          type="submit"
          disabled={addVoucherLoading}
          loading={addVoucherLoading}
          className="beutibutton action"
        />
      </section>
    </form>
  );
};

export default AddVoucher;
