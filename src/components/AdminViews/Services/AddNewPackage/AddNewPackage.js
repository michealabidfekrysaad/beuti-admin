import React, { useState, useContext, useEffect } from 'react';
import { CallAPI } from 'utils/API/APIConfig';
import { useIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import BeutiButton from 'Shared/inputs/BeutiButton';
import {
  ADD_NEW_PACKAGE,
  SERVICE_BY_LOCATION,
  SP_GET_CATEGORIES_BY_BRANCH,
  SP_GET_CATEGORY_OPTIONS,
  SP_VAT,
} from 'utils/API/EndPoints/ServiceProviderEP';
import AddPackageSchema from './AddPackageSchema';
import PackageDetails from './PackageDetails';
import { BranchesContext } from '../../../../providers/BranchesSelections';
import CategoryModalForPackage from './CategoryModalForPackage';
import PackageLocations from './PackageLocations';
import PackageServices from './PackageServices';
import PackagePricing from './PackagePricing';
import PackageDescription from './PackageDescription';
import PackageRequirements from './PackageRequirements';
import PackageOnlineBooking from './PackageOnlineBooking';
import PackageAddServices from './PackageAddServices';

export default function AddNewPackage() {
  const addPackageSchema = AddPackageSchema();
  const { branches } = useContext(BranchesContext);
  const history = useHistory();
  const { messages } = useIntl();
  const [nameAR, setnameAR] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedBC, setSelectedBC] = useState({ id: '', name: '', description: '' });
  const [openModalForServices, setOpenModalForServices] = useState(false);
  const [toggleOnline, setToggleOnline] = useState(true);
  const [pricingOptions, setPricingOptions] = useState([]);
  const [payload, setPayload] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    control,
    formState: { errors },
    clearErrors,
  } = useForm({
    mode: 'all',
    resolver: yupResolver(addPackageSchema),
    defaultValues: {
      packageLocation: '2',
      servicesOptions: [],
    },
  });

  const handleEnNameInput = (value) => {
    setValue('packageEn', value, { shouldValidate: true });
  };
  const { data: BClist, refetch: getBC, isFetching: BCloading } = CallAPI({
    name: 'getCategoriesForPackageDetails',
    url: SP_GET_CATEGORIES_BY_BRANCH,
    query: {
      branchId: branches.map((el) => el).toString(),
    },
    onSuccess: (res) => {
      if (res?.length >= 1) {
        setOpenModal(true);
      } else {
        toast.error(messages['categories.not.found']);
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    select: (res) => res?.data?.data?.list,
  });

  const {
    data: serviceList,
    refetch: getServices,
    isFetching: serviceFetching,
  } = CallAPI({
    name: 'getServiceForAddPackage',
    url: SP_GET_CATEGORY_OPTIONS,
    query: {
      locationId: watch('packageLocation') || 3,
    },
    onSuccess: (res) => {
      if (res?.length >= 1) {
        setPricingOptions(
          res
            ?.flat()
            ?.map((el) => el.categoryServiceDto)
            ?.flat()
            ?.map((el) => el?.options)
            ?.flat(),
        );
        setOpenModalForServices(true);
      } else {
        toast.error(messages['services.not.found']);
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    select: (res) => res?.data?.data?.list?.sort((a, b) => +a?.id - +b?.id),
  });

  const { data: vatPercentage } = CallAPI({
    name: 'getVatForPAckagePrice',
    url: SP_VAT,
    enabled: true,
    refetchOnWindowFocus: false,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    select: (res) => +res?.data?.data?.vatValue / 100,
    onSuccess: (res) => {
      setValue('servicesOptions', []);
      setValue('categoryID', null);
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                            add  new package API                            */
  /* -------------------------------------------------------------------------- */
  const { refetch: addPackage, isFetching: packageFetching } = CallAPI({
    name: 'addNewPackage',
    url: ADD_NEW_PACKAGE,
    // retry: false,
    body: {
      ...payload,
    },
    method: 'post',
    onSuccess: (res) => {
      toast.success(messages['common.success']);
      history.goBack();
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  useEffect(() => {
    if (payload) {
      addPackage();
    }
  }, [payload]);

  const submitClicked = (data) => {
    setPayload({
      categoryId: +data.categoryID,
      nameEn: data?.packageEn,
      nameAR: data?.packageAr,
      location: +data?.packageLocation,
      servicesOptions: data?.servicesOptions
        ?.flat()
        ?.map((el) => el.services)
        ?.flat()
        ?.map((el) => el?.options)
        ?.flat()
        ?.filter((el) => el?.serviceOptionID)
        ?.map((el) => ({ ...el, priceOptionId: +el?.serviceOptionID })),
      price: data?.price,
      descriptionEn: !data?.descriptionEn?.length ? null : data?.descriptionEn,
      descriptionAr: !data?.descriptionAr?.length ? null : data?.descriptionAr,
      requirementsEn: !data?.requirementsEn?.length ? null : data?.requirementsEn,
      requirementsAr: !data?.requirementsAr?.length ? null : data?.requirementsAr,
      onlineBookings: toggleOnline,
    });
  };

  return (
    <form onSubmit={handleSubmit(submitClicked)} className="addPackage">
      <PackageDetails
        handleEnNameInput={handleEnNameInput}
        setnameAR={setnameAR}
        nameAR={nameAR}
        register={register}
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        errors={errors}
        getBC={getBC}
        BCloading={BCloading}
        watch={watch}
        BClist={BClist}
      />
      <hr className="w-100" />
      <PackageLocations
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
        getValues={getValues}
        control={control}
      />

      <hr className="w-100" />
      <PackageServices
        watch={watch}
        errors={errors}
        serviceFetching={serviceFetching}
        getServices={getServices}
        serviceList={serviceList}
        getValues={getValues}
        setValue={setValue}
        pricingOptions={pricingOptions}
        clearErrors={clearErrors}
      />

      <hr className="w-100" />
      <PackagePricing
        register={register}
        errors={errors}
        vatPercentage={vatPercentage}
        watch={watch}
        setValue={setValue}
      />

      <hr className="w-100" />
      <PackageDescription register={register} errors={errors} />

      <hr className="w-100" />
      <PackageRequirements register={register} errors={errors} />

      <hr className="w-100" />
      <PackageOnlineBooking
        toggleOnline={toggleOnline}
        setToggleOnline={setToggleOnline}
      />

      <Row>
        <Col className="text-center informationwizard__footer" xs="12">
          <button
            type="button"
            onClick={() => history.goBack()}
            className="informationwizard__footer--previous"
          >
            {messages['common.cancel']}
          </button>
          <BeutiButton
            text={messages['common.save']}
            type="submit"
            className="informationwizard__footer--submit"
            loading={packageFetching}
            disabled={packageFetching}
          />
        </Col>
      </Row>
      <CategoryModalForPackage
        show={openModal}
        setShow={setOpenModal}
        list={BClist}
        selectedBC={selectedBC}
        setSelectedBC={setSelectedBC}
        register={register}
        BranchFromAccordion={branches.map((el) => el).toString()}
        setValue={setValue}
        getValues={getValues}
        control={control}
      />

      <PackageAddServices
        show={openModalForServices}
        setShow={setOpenModalForServices}
        list={serviceList}
        register={register}
        setValue={setValue}
        getValues={getValues}
        watch={watch}
      />
    </form>
  );
}
