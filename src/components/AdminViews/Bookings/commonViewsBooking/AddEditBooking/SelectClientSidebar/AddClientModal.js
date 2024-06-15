/* eslint-disable */

import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Modal } from 'react-bootstrap';
import { CallAPI } from 'utils/API/APIConfig';
import BeutiInput from 'Shared/inputs/BeutiInput';
import { useForm } from 'react-hook-form';
import { AddClientSchema } from './Schema/AddClientSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { BookingContext } from 'providers/BookingProvider';

export function AddCustomerModal({
  openModal,
  setOpenModal,
  loading,
  setSearchFoucs,
  seNewClient,
  searchValue = '',
  setSalesData = () => {},
  salesData = false,
  isPOS,
}) {
  const { messages } = useIntl();
  const [existUser, setExistUser] = useState(false);
  const { booking, setBooking } = useContext(BookingContext);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(AddClientSchema),
  });
  const emptyNameAndPhone = (e) => {
    if (!watch('phone') && !watch('name')) {
      toast.error(messages['setting.customer.empty.name.phone']);
    }
  };

  const { isFetching: checkingPhoneNumber } = CallAPI({
    name: ['GetCustomerById', watch('phone')],
    url: 'AnonymousCustomer/GetByPhone',
    refetchOnWindowFocus: false,
    baseURL: !isPOS
      ? `${process.env.REACT_APP_DOMAIN}1`
      : `${process.env.REACT_APP_POS_URL}/api/v1`,
    enabled: watch('phone')?.length === 8,
    query: {
      phone: `05${watch('phone')}`,
    },
    onSuccess: (res) => {
      setExistUser(res);
    },
    select: (data) => data?.data?.data,
    onError: (err) => setExistUser(false),
  });

  const { refetch: addCustomerCall, isFetching: addCustomerLoading } = CallAPI({
    name: 'AddCustomer',
    url: 'AnonymousCustomer/Add',
    method: 'post',
    baseURL: !isPOS
      ? `${process.env.REACT_APP_DOMAIN}1`
      : `${process.env.REACT_APP_POS_URL}/api/v1`,
    body: {
      name: watch('name') || null,
      phone: watch('phone') ? `05${watch('phone')}` : null,
    },
    onSuccess: (res) => {
      if (res) {
        toast.success(messages['setting.customer.add.success']);
        setBooking({
          ...booking,
          brandCustomerId: res.id,
          customer: { ...res, phoneNumber: res?.phone },
        });
        setSalesData({
          ...salesData,
          brandCustomerId: res.id,
          customer: { ...res, phoneNumber: res?.phone },
        });
        seNewClient({ ...res, phoneNumber: res?.phone });
        setOpenModal(false);
        setSearchFoucs(false);
      }
    },
    select: (data) => data.data.data,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

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

  useEffect(() => {
    if (!openModal && !searchValue?.length) {
      setValue('name', '');
      setValue('phone', '');
      clearErrors();
    }
  }, [openModal]);

  //   put  the entered data from search to add customer modal
  useEffect(() => {
    if (searchValue?.length && openModal) {
      if (/^05[0-9]{0,8}\s*$/.test(searchValue)) {
        setValue('phone', searchValue?.replace('05', ''));
        setValue('name', '');
      } else {
        setValue('phone', '');
        setValue('name', searchValue);
      }
    } else {
      setValue('name', '');
      setValue('phone', '');
      clearErrors();
    }
  }, [searchValue, openModal]);

  const clickSubmit = () => {
    if (existUser && salesData) {
      setSalesData({
        ...salesData,
        brandCustomerId: existUser.id,
        customer: { ...existUser, phoneNumber: existUser?.phone },
      });
      seNewClient({ ...existUser, phoneNumber: existUser?.phone });
      setOpenModal(false);
      setSearchFoucs(false);
    } else {
      addCustomerCall();
    }
  };

  return (
    <>
      <Modal
        onHide={() => {
          setOpenModal(false);
        }}
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing importmodal"
      >
        <form onSubmit={handleSubmit(clickSubmit, emptyNameAndPhone)}>
          <Modal.Header className="pt-0">
            <Modal.Title className="title">
              {messages['booking.sidebar.create.customer']}
            </Modal.Title>
          </Modal.Header>
          <div className="phonenumber-start">
            <BeutiInput
              type="text"
              label={messages['common.mobile number']}
              useFormRef={register('phone')}
              error={!!existUser || errors?.phone?.message}
            />
            <label htmlFor="minimumPrice" className="icon">
              05 |
            </label>
          </div>
          {existUser && (
            <p className="beuti-input__errormsg text-danger">
              {
                messages[
                  `${
                    salesData
                      ? 'booking.sidebar.create.customer.exit.sale'
                      : 'booking.sidebar.create.customer.exit'
                  }`
                ]
              }
            </p>
          )}
          <div className="mt-4 mb-5">
            <BeutiInput
              type="text"
              label={messages['setting.customer.name']}
              useFormRef={register('name')}
              error={errors?.name?.message}
              disabled={salesData && existUser}
            />
          </div>

          <Modal.Footer className="pt-3 justify-content-end">
            <div>
              <button
                type="button"
                className="px-4 cancel mx-2"
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                {messages['common.cancel']}
              </button>
              <button
                type="submit"
                className="px-4 confirm"
                disabled={
                  loading ||
                  addCustomerLoading ||
                  checkingPhoneNumber ||
                  (existUser && !salesData)
                }
              >
                {loading || addCustomerLoading || checkingPhoneNumber ? (
                  <div className="spinner-border spinner-border-sm mb-1" role="status" />
                ) : (
                  messages[
                    `${
                      salesData && existUser
                        ? 'booking.sidebar.create.customer.exit.sale.add.btn'
                        : 'common.add'
                    }`
                  ]
                )}
              </button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

AddCustomerModal.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  setSearchFoucs: PropTypes.func,
  searchValue: PropTypes.string,
  loading: PropTypes.bool,
  isPOS: PropTypes.bool,
};
