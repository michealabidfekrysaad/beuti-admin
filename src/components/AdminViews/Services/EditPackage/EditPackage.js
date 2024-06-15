import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { CallAPI } from 'utils/API/APIConfig';
import { Routes } from 'constants/Routes';
import {
  EDIT_PACKAGE,
  GET_PACKAGE_DETAILS,
  SERVICE_BY_LOCATION,
  SERVICE_PROVIDER_CATEGORIES,
  SP_GET_CATEGORIES_BY_BRANCH,
  SP_GET_CATEGORY_OPTIONS,
  SP_VAT,
} from 'utils/API/EndPoints/ServiceProviderEP';
import { BranchesContext } from 'providers/BranchesSelections';
import { Col, Row } from 'react-bootstrap';
import BeutiButton from 'Shared/inputs/BeutiButton';
import PackageDetails from '../AddNewPackage/PackageDetails';
import CategoryModalForPackage from '../AddNewPackage/CategoryModalForPackage';
import EditPackageSchema from './EditPackageSchema';
import PackageLocations from '../AddNewPackage/PackageLocations';
import PackagePricing from '../AddNewPackage/PackagePricing';
import PackageDescription from '../AddNewPackage/PackageDescription';
import PackageRequirements from '../AddNewPackage/PackageRequirements';
import PackageOnlineBooking from '../AddNewPackage/PackageOnlineBooking';
import PackageServices from '../AddNewPackage/PackageServices';
import PackageAddServices from '../AddNewPackage/PackageAddServices';

export default function EditPackage() {
  const history = useHistory();
  const { packID } = useParams();
  const { messages, locale } = useIntl();
  const { branches } = useContext(BranchesContext);
  const schemaForEdit = EditPackageSchema();
  const [nameAR, setnameAR] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [toggleOnline, setToggleOnline] = useState(true);
  const [pricingOptions, setPricingOptions] = useState([]);
  const [openModalForServices, setOpenModalForServices] = useState(false);
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
    mode: 'onChange',
    resolver: yupResolver(schemaForEdit),
  });

  const { isFetching, data: packageData } = CallAPI({
    name: 'getPackageDetails',
    url: GET_PACKAGE_DETAILS,
    refetchOnWindowFocus: false,
    enabled: true,
    query: {
      Id: packID,
    },
    onSuccess: (res) => {
      const validate = { shouldValidate: true };
      setValue('packageAr', res?.nameAR, validate);
      setnameAR(res?.nameAR);
      setValue('packageEn', res?.nameEn, validate);
      setValue('categoryID', res?.categoryId?.toString(), validate);
      setValue('packageLocation', res?.location.toString(), validate);
      setValue('price', +res?.price, validate);
      setValue('descriptionAr', res?.descriptionAr || '', validate);
      setValue('descriptionEn', res?.descriptionEn || '', validate);
      setValue('requirementsAr', res?.requirementsAr || '', validate);
      setValue('requirementsEn', res?.requirementsEn || '', validate);
      setToggleOnline(res?.onlineBookings);
      //   it is necessary to put services after putting location
      setTimeout(() => {
        getAllCatSerOpt();
      }, 500);
    },
    select: (res) => res?.data?.data,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  const { data: BClist, refetch: getBC, isFetching: BCloading } = CallAPI({
    name: 'getAllCatforEditPackageAfterAdded',
    url: SP_GET_CATEGORIES_BY_BRANCH,
    query: {
      branchId: branches?.map((el) => el).toString(),
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

  const { data: allCategories, isFetching: allCatFetching } = CallAPI({
    name: 'getAllCategoriesForTheEditedPackage',
    url: SERVICE_PROVIDER_CATEGORIES,
    refetchOnWindowFocus: false,
    enabled: true,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    select: (res) =>
      res?.data?.data.map((el) => ({
        ...el,
        name: locale === 'ar' ? el.nameAr : el.nameEn,
      })),
  });

  const { data: vatPercentage } = CallAPI({
    name: 'getVatForEditPAckage',
    url: SP_VAT,
    enabled: true,
    refetchOnWindowFocus: false,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    select: (res) => +res?.data?.data?.vatValue / 100,
  });

  //   this API called when click on add new services
  const {
    data: serviceList,
    refetch: getServices,
    isFetching: serviceFetching,
  } = CallAPI({
    name: 'servicesForEditPackage',
    url: SP_GET_CATEGORY_OPTIONS,
    query: {
      locationId: watch('packageLocation'),
    },
    refetchOnWindowFocus: false,
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
  useEffect(() => {
    if ((packageData, vatPercentage)) {
      setValue(
        'priceWithVat',
        (+packageData?.price + +packageData?.price * vatPercentage).toFixed(2),
      );
    }
  }, [vatPercentage, packageData]);

  const putCatIdOrNot = (catID, allServicesInCat, allOptionsSaved) => {
    let lengthOptionsInsideServiceInsideCategory = 0;
    let lengthOptionsInsideSameService = 0;
    allServicesInCat?.forEach((singleSer) => {
      allOptionsSaved.forEach((singleOpt) => {
        lengthOptionsInsideServiceInsideCategory += singleSer?.options?.length;
        lengthOptionsInsideSameService += allOptionsSaved.filter(
          (opt) => +opt?.serviceId === +singleSer?.id,
        )?.length;
      });
    });
    if (lengthOptionsInsideServiceInsideCategory === lengthOptionsInsideSameService) {
      return catID?.toString();
    }
    return false;
  };
  const {
    data: allCatWithSerWithOpt,
    refetch: getAllCatSerOpt,
    isFetching: catSerOptFetch,
  } = CallAPI({
    name: 'allCatSerOpt',
    url: SP_GET_CATEGORY_OPTIONS,
    query: {
      locationId: getValues('packageLocation'),
    },
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      if (res?.length >= 1) {
        setValue(
          'servicesOptions',
          packageData?.serviceOptions
            ?.sort((a, b) => +a?.id - +b?.id)
            ?.map((el) => ({
              categoryID: false,
              services: el?.categoryServiceDto?.map((singleSer) => ({
                id: singleSer?.options?.filter((opt) => opt?.isEnabled)?.length
                  ? singleSer?.id
                  : false,
                options: singleSer?.options?.map((singleOpt) => ({
                  serviceOptionID: singleOpt?.isEnabled && singleOpt?.priceOptionID,
                  count: singleOpt?.isEnabled && singleOpt?.count,
                })),
              })),
            })),
        );

        setPricingOptions(
          res
            ?.flat()
            ?.map((el) => el.categoryServiceDto)
            ?.flat()
            ?.map((el) => el?.options)
            ?.flat(),
        );
      } else {
        toast.error(messages['services.not.found']);
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    select: (res) => res?.data?.data?.list,
  });

  const { refetch: addPackage, isFetching: packageFetching } = CallAPI({
    name: 'SendTheEditedPackage',
    url: EDIT_PACKAGE,
    retry: false,
    body: {
      ...payload,
    },
    method: 'put',
    onSuccess: (res) => {
      toast.success(messages['common.success']);
      history.push(Routes.servicesList);
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  useEffect(() => {
    if (payload) {
      addPackage();
    }
  }, [payload]);

  const handleEnNameInput = (value) => {
    setValue('packageEn', value, { shouldValidate: true });
  };

  const submitClicked = (data) => {
    // console.log(data);
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
      id: packID,
    });
  };

  return (
    <form onSubmit={handleSubmit(submitClicked)} className="addPackage">
      {isFetching || allCatFetching ? (
        <div className="loading"></div>
      ) : (
        <>
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
            BClist={allCategories}
            EditView
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

          {/* need to refactor from beginnig */}
          <hr className="w-100" />
          <PackageServices
            watch={watch}
            errors={errors}
            serviceFetching={serviceFetching}
            getServices={getServices}
            serviceList={
              serviceList || packageData?.serviceOptions.sort((a, b) => +a?.id - +b?.id)
            }
            pricingOptions={pricingOptions}
            getValues={getValues}
            setValue={setValue}
            clearErrors={clearErrors}
            catSerOptFetch={catSerOptFetch}
            editPackage
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
                onClick={() => history.push(Routes.servicesList)}
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
        </>
      )}
    </form>
  );
}
