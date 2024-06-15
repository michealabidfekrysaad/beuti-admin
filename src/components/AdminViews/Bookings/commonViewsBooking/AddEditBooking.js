/* eslint-disable  */

import React, { useContext, useEffect, useState } from 'react';
import NavbarForNoWrapViews from 'components/shared/NavbarForNoWrapViews';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { CallAPI } from 'utils/API/APIConfig';
import { yupResolver } from '@hookform/resolvers/yup';
import { BookingContext } from 'providers/BookingProvider';
import { ConfirmationModal } from 'components/shared/ConfirmationModal';
import BookingFormAndDate from './AddEditBooking/BookingFormAndDate';
import './Style/Booking.scss';
import SelectClientSidebar from './AddEditBooking/SelectClientSidebar';
import { GetQueryFromUrl } from '../../../../functions/GetQueryFromUrl';
import { useLocation } from 'react-router-dom';
import { AddBookingSchema } from './AddEditBooking/SelectClientSidebar/Schema/AddBookingFormSchema';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useRef } from 'react';
import { CUSTOMER_ODATA_EP } from 'utils/API/EndPoints/CustomerEP';
import { handleStartTimeAndStartDate } from './Helper/AddEditHelper';
import { getCurrentServiceByOptionId } from './Helper/AddEditHelper';
import { salesViews } from 'components/AdminViews/sales/Helper/ViewsEnum';

export default function AddEditBooking() {
  const { messages } = useIntl();
  const history = useHistory();
  const empIDorNull = +GetQueryFromUrl('empId');
  const [searchFoucs, setSearchFoucs] = useState('');
  const { booking, setBooking, initalBookingObject } = useContext(BookingContext);
  const [contiuneWithoutLocation, setContiuneWithoutLocation] = useState(false);
  const [tempFees, setTempFees] = useState(0);
  const [feesSelected, setFeesSelected] = useState(0);
  const [openAddLocation, setOpenAddLocation] = useState(false);
  const [addBookingFlag, setAddBookingFlag] = useState(false);
  const formRef = useRef();
  const { search } = useLocation();
  const { bookingId } = useParams();
  const [clientDataForQueryParams, setClientDataForQueryParams] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(AddBookingSchema),
    defaultValues: {
      bookedServices: [
        {
          startTime: GetQueryFromUrl('time'),
          employeeId: +GetQueryFromUrl('empId') ? +GetQueryFromUrl('empId') : '',
        },
      ],
    },
  });

  useEffect(() => {
    setBooking({
      ...booking,
      bookingDate: new URLSearchParams(search).get('startDate'),
      spId: JSON.parse(localStorage.getItem('selectedBranches'))[0],
      brandCustomerId: +new URLSearchParams(search).get('customerId') || null,
      customer: clientDataForQueryParams,
    });
    return () => setBooking({ ...initalBookingObject });
  }, [clientDataForQueryParams]);

  /* -------------------------------------------------------------------------- */
  /*                           Handle Get All Services                          */
  /* -------------------------------------------------------------------------- */

  const { data: allCategories, isFetching: cateLoading } = CallAPI({
    name: ['getAllServices', booking?.bookingDate],
    url: 'Service/GetCategoryServices',
    enabled: (!bookingId && !!booking?.bookingDate) || !!bookingId,
    refetchOnWindowFocus: false,
    query: {
      bookingDate: booking.bookingDate,
    },
    onSuccess: (res) => {
      // to avoid call everytime we change the date
      if (res && !!bookingId && !booking.bookingId) {
        getDetailsCall(true);
      }
    },
    select: (data) => data?.data?.data,
  });

  /* -------------------------------------------------------------------------- */
  /*                         Handle Get single Customer                         */
  /* -------------------------------------------------------------------------- */
  CallAPI({
    name: 'getClientsForQueryParams',
    url: CUSTOMER_ODATA_EP,
    baseURL: process.env.REACT_APP_ODOMAIN,
    enabled: !!new URLSearchParams(search).get('customerId'),
    refetchOnWindowFocus: false,
    onSuccess: (res) =>
      setClientDataForQueryParams(
        res?.find(
          (client) => +client?.id === +new URLSearchParams(search).get('customerId'),
        ),
      ),
    select: (data) => data.data.data.list,
  });

  /* -------------------------------------------------------------------------- */
  /*                          Handle Get All Employees                          */
  /* -------------------------------------------------------------------------- */

  const { data: allEmployees } = CallAPI({
    name: 'getAllEmployees',
    url: 'Employee/GetBranchEmployees',
    enabled: !!booking.spId,
    query: {
      branchId: booking.spId,
    },
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      if (res?.length && empIDorNull) {
        setValue(
          `bookedServices[${0}].employee`,
          res?.find((emp) => emp?.id === empIDorNull),
        );
        setValue(
          `bookedServices[${0}].employeeName`,
          res?.find((emp) => emp?.id === empIDorNull)?.name,
        );
      }
    },
    select: (data) => data?.data?.data?.list,
  });

  /* -------------------------------------------------------------------------- */
  /*                          Add And Edit Booking Call                         */
  /* -------------------------------------------------------------------------- */

  const { refetch } = CallAPI({
    name: 'addbooking',
    url: bookingId ? 'Booking/EditSPBooking' : 'Booking/AddSPBooking',
    method: bookingId ? 'put' : 'post',
    onSuccess: (res) => {
      if (res) {
        if (bookingId) {
          toast.success(messages['booking.edit.successMessage']);
          if (booking.checkoutRedirect) {
            setBooking({
              ...booking,
              checkoutRedirect: false,
              isLocationSelected: false,
            });
            return history.push(`/sale/checkout/${bookingId}`);
          }
          if (history?.location?.state?.prevPath?.includes('sales')) {
            return history.push({
              pathname: '/sales/new',
              state: {
                prevPath: salesViews?.confirmedBooking,
                filter: history?.location?.state?.filter,
              },
            });
          }
          return history.push('/booking');
        } else {
          toast.success(messages['booking.successMessage']);
          if (booking.checkoutRedirect) {
            setBooking({
              ...booking,
              checkoutRedirect: false,
              isLocationSelected: false,
            });
            return history.push(`/sale/checkout/${res.bookingId}`);
          }
          return history.push('/booking');
        }
      }
    },
    select: (data) => data.data.data,
    body: {
      isHomeBooking: booking.isHomeBooking,
      bookedServices: watch('bookedServices')?.flatMap((book) =>
        book.selectId && !book.isPackage
          ? {
              serviceOptionId: book.serviceOptionId,
              serviceId: book.serviceId,
              durationInMinutes: book.durationInMinutes,
              employeeId: book.employeeId,
              bookingServiceId: book?.bookingServiceId,
              serviceName: book?.serviceName,
              selectId: book?.selectId,
              employeeName: book?.employeeName,
              employee: book?.employee,
              ...handleStartTimeAndStartDate(
                book.startTime,
                book.isSameDate
                  ? booking.bookingDate
                  : book.startDate || booking.bookingDate,
              ),
            }
          : [],
      ),
      bookedPackages: watch('bookedServices')?.flatMap((book) =>
        book.isPackage
          ? {
              packageId: book.packageId,
              name: book?.name,
              uniqePackageId: book?.uniqePackageId,
              selectId: book?.selectId,
              packageServices: book.packageServices.map((serv) => ({
                serviceOptionId: serv.serviceOptionId,
                bookingServiceId: serv?.bookingServiceId,
                serviceName: book?.serviceName,
                selectId: book?.selectId,
                employeeName: book?.employeeName,
                employee: book?.employee,
                serviceId: serv.serviceId,
                durationInMinutes: serv.durationInMinutes,
                employeeId: serv.employeeId,
                ...handleStartTimeAndStartDate(
                  serv.startTime,
                  serv.isSameDate
                    ? booking.bookingDate
                    : serv.startDate || booking.bookingDate,
                ),
              })),
            }
          : [],
      ),
      notes: watch('notes'),
      bookingId: booking.bookingId || null,
      brandCustomerId: booking.brandCustomerId || null,
      longitude: booking.isLocationSelected ? booking.longitude : null,
      latitude: booking.isLocationSelected ? booking.latitude : null,
      addressEn: booking.isLocationSelected ? booking.addressEn : null,
      addressAr: booking.isLocationSelected ? booking.addressAr : null,
      cityId: booking.isLocationSelected ? booking.cityId : null,
      bookingDate: booking.bookingDate,
      addressDescription: booking.addressDescription || null,
    },
  });
  const checkIfTimeHasDotOrNot = (time) => {
    if (time?.includes('.')) {
      const splitTime = time.split(':');
      return `${splitTime[0]}:${splitTime[1]}:00`;
    }
    return time;
  };
  /* -------------------------------------------------------------------------- */
  /*                             Get Booking Details                            */
  /* -------------------------------------------------------------------------- */
  const { refetch: getDetailsCall } = CallAPI({
    name: 'getBookingDetails',
    url: 'Booking/GetBookingDetails',
    refetchOnWindowFocus: false,
    query: {
      bookingId,
    },
    onSuccess: (res) => {
      const getAllBookingWithStartTimeAndDate = res.bookedServices.map((service) => ({
        ...service,
        startTime: checkIfTimeHasDotOrNot(service.startTime),
        startDate: moment(service.startDate).format('YYYY-MM-DD'),
        employeeIds: getCurrentServiceByOptionId({
          id: service.selectId,
          allCategories: allCategories,
        }).employeeIds,
      }));
      const getAllPackagesWithStartTimeAndDate = res.bookedPackages.map((pack) => ({
        ...pack,
        isPackage: true,
        startTime: pack?.packageServices[0]?.startTime,
        packageServices: pack.packageServices.map((service) => ({
          ...service,
          startTime: service.startTime,
          startDate: moment(service.startDate).format('YYYY-MM-DD'),
          employeeIds: getCurrentServiceByOptionId({
            id: service.selectId,
            allCategories: allCategories,
          }).employeeIds,
        })),
      }));
      setValue('bookedServices', [
        ...getAllBookingWithStartTimeAndDate,
        ...getAllPackagesWithStartTimeAndDate,
        {
          startTime: moment(res.bookingDate).format('HH:mm:ss'),
        },
      ]);
      setBooking({
        ...booking,
        ...res,
        latitude: res.latitude || 24.7136,
        longitude: res.longitude || 46.6753,
        cityId: res.cityId || 3,
        bookingDate: moment(res.bookingDate).format('YYYY-MM-DD'),
        isLocationSelected: !!(res?.isHomeBooking && res?.latitude && res?.longitude),
      });
      setFeesSelected(res?.cityFees);
    },
    select: (res) => res.data.data,
  });
  const FormSubmit = () => {
    // !searchFoucs bec. when add new customer modal id open it enter here
    // due to nested form inside each other and submit
    if (booking.isHomeBooking && !booking.isLocationSelected && !searchFoucs) {
      return setContiuneWithoutLocation(true);
    }
    if (addBookingFlag) {
      return refetch();
    }
  };
  return (
    <section className="booking">
      <NavbarForNoWrapViews
        button={messages['admin.employees.add']}
        title={
          messages[`${bookingId ? 'booking.sidebar.status.edit' : 'booking.flow.header'}`]
        }
        disabled="true"
        hideBtn
      />
      <form onSubmit={handleSubmit(FormSubmit)} ref={formRef}>
        <section className="booking-view container-fluid">
          <Row>
            <Col lg={8} md={12}>
              <section className="fixed-layout">
                <Row>
                  <BookingFormAndDate
                    register={register}
                    setValue={setValue}
                    watch={watch}
                    errors={errors}
                    openAddLocation={openAddLocation}
                    setOpenAddLocation={setOpenAddLocation}
                    clearErrors={clearErrors}
                    bookingId={bookingId}
                    allEmployees={allEmployees}
                    allCategories={allCategories}
                    setTempFees={setTempFees}
                    setFeesSelected={setFeesSelected}
                    tempFees={tempFees}
                    cateLoading={cateLoading}
                  />
                </Row>
              </section>
            </Col>
            {/* the second card body for add client  */}
            <Col lg={4} md={12}>
              <section className="booking-sidebar">
                <SelectClientSidebar
                  searchFoucs={searchFoucs}
                  setSearchFoucs={setSearchFoucs}
                  watch={watch}
                  feesSelected={feesSelected}
                  setAddBookingFlag={setAddBookingFlag}
                />
              </section>
            </Col>
          </Row>
        </section>
        {searchFoucs && (
          <div className="layout-booking" onClick={() => setSearchFoucs(false)} />
        )}
      </form>
      <ConfirmationModal
        setPayload={refetch}
        openModal={contiuneWithoutLocation}
        setOpenModal={setContiuneWithoutLocation}
        handleCancel={() => setOpenAddLocation(true)}
        confirmtext="common.yes"
        title="booking.no.location.title"
        message="booking.no.location.description"
      />
    </section>
  );
}
