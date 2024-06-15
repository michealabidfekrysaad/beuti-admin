/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useIntl } from 'react-intl';
import {
  SP_CAN_CHANGE_SER_LOCATION,
  SP_CAN_DELETE_PRICE_OPTION,
  SP_EDIT_SERVICE,
  SP_GET_CATEGORIES_BY_BRANCH,
  SP_GET_EMP_BT_BRANCH,
  SP_GET_SERVICE_BY_ID,
  SP_REQUIRE_LOCATION_UPDATE,
  SP_VAT,
} from 'utils/API/EndPoints/ServiceProviderEP';
import { CallAPI } from 'utils/API/APIConfig';
import { Row, Col } from 'react-bootstrap';
import BeutiButton from 'Shared/inputs/BeutiButton';
import { SP_GET_USER_BRANCHES } from 'utils/API/EndPoints/BranchManager';
import { createTimeDuration } from 'constants/hours';
import moment from 'moment';
import { CheckLocationResponseModal } from 'components/SPInformationWizard/components/step3-services-categories/CheckLocationRsponseModal';
import CategoryModal from '../AddNewService/CategoryModal';
import SchemaEditNewService from './EditNewServiceSchema';
import ServiceNames from '../AddNewService/ServiceNames';
import { BranchesContext } from '../../../../providers/BranchesSelections';
import ServiceLocationEdit from './ServiceLocationEdit';
import { PackagesForLocation } from './PackagesForLocation';
import { PackagesForPriceChanges } from './PackagesForPriceChanges';
import EmployeeEditService from './EmployeeEditService';
import ServiceDescription from '../AddNewService/ServiceDescription';
import ServiceRequirements from '../AddNewService/ServiceRequirements';
import ServiceOnlineBooking from '../AddNewService/ServiceOnlineBooking';
import ServiceTimingOptions from '../AddNewService/ServiceTimingOptions';
import PriceAndDurationEdit from './PriceAndDurationEdit';

export default function EditServiceNewBranches() {
  const history = useHistory();
  const { messages, locale } = useIntl();
  const { branches } = useContext(BranchesContext);
  const [openModal, setOpenModal] = useState(false);
  const { servID } = useParams();
  const [nameAR, setnameAR] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedBC, setSelectedBC] = useState({ id: '', name: '', description: '' });
  const [BranchFromAccordion, setBranchFromAccordion] = useState();
  const [indexing, setIndexing] = useState(branches[0]);
  const [branchesFullDataPricing, setBranchesFullDataPricnig] = useState([]);
  const [allBranches, setAllBranches] = useState([]);
  const [originalLocation, setOriginalLocation] = useState(false);
  const [serLocation, setSerLocation] = useState(false);
  const [checkFirstTime, setcheckFirstTime] = useState(false);
  const [packageServiceOpen, setPackageServiceOpen] = useState(false);
  const [packages, setPackages] = useState(null);
  const [packagesOption, setPackagesOption] = useState(null);
  const [msgPackage, setMsgPackage] = useState('');
  const [msgPackageIndexing, setMsgPackageIndexing] = useState('');
  const [allEmployees, setAllEmployees] = useState(false);
  const durationService = createTimeDuration({ messages, minDuration: 5 });
  const [allEmpForAllBranches, setAllEmpForAllBranches] = useState([]);
  const [toggleCustomerApp, setToggleCustomerApp] = useState(true);
  const [processingTimes, setProcessingTimes] = useState([{ duration: '', start: '' }]);
  const [errorBufferTime, setErrorBufferTime] = useState(false);
  const [intersectionError, setIntersectionError] = useState(false);
  const [lowestSerDurMin, setLowestSerDurMin] = useState();
  const [priceIdToCheck, setPriceIdToCheck] = useState(false);
  const [priceOptName, setPriceOptName] = useState(null);
  const [indexPriceDelete, setIndexPriceDelete] = useState(false);
  const [canDeletePrice, setCanDeletePrice] = useState(false);
  const [titleWhenDeletePrice, setTitleWhenDeletePrice] = useState(false);
  const [addPayload, setAddPayload] = useState(false);
  //   used in check service location confirmation
  const [checkEditLocation, setCheckEditLocation] = useState(false);
  const [openCheckingModal, setOpenCheckingModal] = useState(null);
  const [messageFromBE, setMessageFromBE] = useState(false);
  const [allPricesOptionIdSavedInBE, setAllPricesOptionsIdSavedInBE] = useState([]);
  const [priceOption, setPriceOption] = useState(false);
  const [callPackageForPrice, setcallPackageForPrice] = useState(0);
  const [allAffectedPackages, setAllAffectedPackages] = useState([]);
  const [openAffectedPackagesModal, setOpenAffectedPackagesModal] = useState(false);
  const [affectedPackages, setAffectedPackages] = useState([]);

  const addNewServiceSchemaValidations = SchemaEditNewService(true);
  const priceObject = {
    duration: '00:05:00',
    priceType: 2,
    price: 0,
    priceWithVat: 0,
    pricingNameAr: '',
    pricingNameEn: '',
    employeePriceOptions: [],
  };

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(addNewServiceSchemaValidations),
    defaultValues: {
      //   pricing: [],
      //   serLocation: '3',
    },
  });
  const { isFetching, data: serviceData } = CallAPI({
    name: 'getServiceDetails',
    url: SP_GET_SERVICE_BY_ID,
    refetchOnWindowFocus: false,
    enabled: true,
    cacheTime: 0,
    query: {
      Id: servID,
    },
    onSuccess: (res) => {
      const shouldValidate = { shouldValidate: true };
      setValue('serviceAr', res?.nameAR, shouldValidate);
      setnameAR(res?.nameAR);
      setValue('serviceEn', res?.nameEn, shouldValidate);
      setValue('serLocation', res?.locationId.toString(), shouldValidate);
      setOriginalLocation(res?.locationId.toString());
      setSerLocation(res?.locationId.toString());
      setValue(`branchesCheckboxes[0].branchID`, branches[0], shouldValidate);
      setValue(
        `branchesCheckboxes[0].employees`,
        res?.employees?.map((el) => el?.employeeID.toString()),
        shouldValidate,
      );
      getEmp();
      callCategories();
      //   check if emp type is free
      const freeThenChangeTypeEmp = (empPrice) => {
        if (+empPrice?.priceType === 1) {
          return '';
        }
        return empPrice?.price.toString();
      };
      res.priceOptions.forEach((priceOpt, idx) => {
        // eslint-disable-next-line no-shadow
        setAllPricesOptionsIdSavedInBE((allPricesOptionIdSavedInBE) => [
          ...allPricesOptionIdSavedInBE,
          priceOpt?.serviceOptionId,
        ]);
        setValue(`pricing[${idx}].priceOptionId`, priceOpt?.serviceOptionId);
        setValue(`pricing[${idx}].duration`, priceOpt?.duration);
        setValue(`pricing[${idx}].priceType`, priceOpt?.priceType);
        setValue(`pricing[${idx}].price`, priceOpt?.price?.toString());
        setValue(`pricing[${idx}].pricingNameAr`, priceOpt?.pricingNameAr || '');
        setValue(`pricing[${idx}].pricingNameEn`, priceOpt?.pricingNameEn || '');
        priceOpt.employeeOptions.forEach((empPrice, index) => {
          setValue(
            `pricing[${idx}].employeePriceOptions[${0}].emp[${index}].branchId`,
            empPrice?.branchId,
          );
          setValue(
            `pricing[${idx}].employeePriceOptions[${0}].emp[${index}].duration`,
            `${empPrice?.duration}${empPrice?.isDefaultDuration ? 'Default' : ''}`,
          );
          setValue(
            `pricing[${idx}].employeePriceOptions[${0}].emp[${index}].price`,
            empPrice?.isDefaultPrice ? '' : freeThenChangeTypeEmp(empPrice),
          );
          setValue(
            `pricing[${idx}].employeePriceOptions[${0}].emp[${index}].priceType`,
            `${empPrice?.priceType}${empPrice?.isDefaultPriceType ? 'Default' : ''}`,
          );
          setValue(
            `pricing[${idx}].employeePriceOptions[${0}].emp[${index}].isDefaultDuration`,
            empPrice?.isDefaultDuration,
          );
          setValue(
            `pricing[${idx}].employeePriceOptions[${0}].emp[${index}].isDefaultPrice`,
            empPrice?.isDefaultPrice,
          );
          setValue(
            `pricing[${idx}].employeePriceOptions[${0}].emp[${index}].isDefaultPriceType`,
            empPrice?.isDefaultPriceType,
          );
        });
      });
      setValue(`descrAr`, res?.descriptionAr || '');
      setValue(`descrEn`, res?.descriptionEn || '');
      setValue(`requireAr`, res?.requirementsAr || '');
      setValue(`requireEn`, res?.requirementsEn || '');
      setToggleCustomerApp(res?.onlineBookings);
      setValue(`BlockedTime`, res?.blockedTime);
      setValue(`BufferTime`, res?.bufferTime);
      if (res?.processingTime?.length > 0) {
        setProcessingTimes(
          res?.processingTime?.map((el) => ({
            start: el?.from,
            duration: putCorrectDuration(el),
          })),
        );
      }
      const lowestDurPriceOpt = res?.priceOptions
        ?.map((el) => +el?.duration.split(':')[0] * 60 + +el?.duration.split(':')[1])
        ?.reduce((a, b) => Math.min(a, b));
      const lowestDurationEmp = res?.priceOptions
        ?.map((price) =>
          price?.employeeOptions
            ?.map((emp) => {
              if (emp?.isDefaultDuration) {
                return (
                  +price?.duration.split(':')[0] * 60 + +price?.duration.split(':')[1]
                );
              }
              return emp?.duration.split(':')[0] * 60 + +emp?.duration.split(':')[1];
            })
            .flat(),
        )
        ?.flat()
        ?.reduce((a, b) => Math.min(a, b));
      setLowestSerDurMin(Math.min(+lowestDurPriceOpt, +lowestDurationEmp));
    },
    select: (res) => res?.data?.data,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  const putCorrectDuration = (el) => {
    const start = moment(`${moment().format('YYYY-MM-DD')} ${el?.from}`);
    const end = moment(`${moment().format('YYYY-MM-DD')} ${el?.to}`);
    const diff = end.diff(start);
    const f = moment.utc(diff).format('HH:mm:ss');
    return f;
  };

  /* -------------------------------------------------------------------------- */
  /*                        get categroy for each branch                        */
  /* -------------------------------------------------------------------------- */
  const { data: BClist, refetch: getBC, isFetching: BCloading } = CallAPI({
    name: 'getCategoriesForEditService',
    url: SP_GET_CATEGORIES_BY_BRANCH,
    refetchOnWindowFocus: false,
    cacheTime: 0,
    query: {
      branchId: branches[0],
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
  //   get all categories  to can get the name of  the selected category by id
  const { data: catList, refetch: callCategories, isFetching: getAllCat } = CallAPI({
    name: 'catForServices',
    url: SP_GET_CATEGORIES_BY_BRANCH,
    cacheTime: 0,
    enabled: true,
    refetchOnWindowFocus: false,
    query: {
      branchId: branches[0],
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    select: (res) => res?.data?.data?.list,
  });

  /* -------------------------------------------------------------------------- */
  /*                              get all branches                              */
  /* -------------------------------------------------------------------------- */
  const { isFetching: fetchingBranches } = CallAPI({
    name: 'allBracnhesForAddCat',
    url: SP_GET_USER_BRANCHES,
    refetchOnWindowFocus: false,
    enabled: true,
    onSuccess: (res) => {
      if (res?.list?.length) {
        setAllBranches(
          res?.list
            .map((branch) => ({
              value: branch.id,
              branchId: branch.id,
              name: branch.name,
              address: branch.address,
              image: branch?.bannerImage,
              selected: branch.id === branches.find((el) => el === branch.id),
            }))
            .sort((a, b) => {
              if (a?.selected && !b?.selected) return -1;
              if (!a?.selected && b?.selected) return 1;
              return 0;
            }),
        );
        setBranchesFullDataPricnig(
          res?.list
            .map((branch) => ({
              value: branch.id,
              branchId: branch.id,
              name: branch.name,
              address: branch.address,
              image: branch?.bannerImage,
              selected: branch.id === branches.find((el) => el === branch.id),
            }))
            .sort((a, b) => {
              if (a?.selected && !b?.selected) return -1;
              if (!a?.selected && b?.selected) return 1;
              return 0;
            }),
        );
      }
    },
    select: (res) => res?.data?.data,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  /* -------------------------------------------------------------------------- */
  /*                    can change location of service or not                   */
  /* -------------------------------------------------------------------------- */
  const { refetch: canchangeCall, isFetching: fetchCanOrNot } = CallAPI({
    name: 'checkCanchangeLocationOfService',
    url: SP_CAN_CHANGE_SER_LOCATION,
    query: {
      serviceId: servID,
    },
    onSuccess: (res) => {
      if (!res?.hasPackages) {
        setValue('serLocation', serLocation);
        setcheckFirstTime(true);
      } else {
        if (res?.packages?.length > 0) setMsgPackage('edit.service.package.hint');
        if (res?.packageOptions?.length > 0)
          setMsgPackage('edit.service.package.option.hint');
        setPackageServiceOpen(true);
        setSerLocation(originalLocation);
        if (res?.packages?.length > 0) setPackages(res?.packages);
        if (res?.packageOptions?.length > 0) setPackagesOption(res?.packageOptions);
        //   appear the modal for package
      }
    },
    onError: (err) => toast.error(err?.message),
    select: (res) => res?.data?.data,
  });

  /* -------------------------------------------------------------------------- */
  /*                        get employee for each branch                        */
  /* -------------------------------------------------------------------------- */
  const { data: EmpListFromBE, refetch: getEmp, isFetching: EmpFetching } = CallAPI({
    name: 'getEmpforBranchEditService',
    url: SP_GET_EMP_BT_BRANCH,
    refetchOnWindowFocus: false,
    query: {
      branchId: branches[0],
    },
    onSuccess: (res) => {
      if (watch('serLocation') && +watch('serLocation') !== 3) {
        setAllEmployees(
          res.filter(
            (emp) => +emp.locationId === +watch('serLocation') || +emp.locationId === 3,
          ),
        );
      } else {
        setAllEmployees(res);
      }
      setAllEmpForAllBranches([...res]);
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    select: (res) => res?.data?.data?.list,
  });

  /* -------------------------------------------------------------------------- */
  /*                             get the vat for SP                             */
  /* -------------------------------------------------------------------------- */
  const { data: vatFromBE } = CallAPI({
    name: 'getVatForSpEditService',
    url: SP_VAT,
    enabled: true,
    refetchOnWindowFocus: false,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    select: (res) => +res?.data?.data?.vatValue / 100,
  });

  const handleEnNameInput = (value) => {
    setValue('serviceEn', value, { shouldValidate: true });
  };

  /* -------------------------------------------------------------------------- */
  /*                      check can delete priceOptionOrNot                     */
  /* -------------------------------------------------------------------------- */
  const {
    data: removePriceCheck,
    refetch: callCanRemovePrice,
    isFetching: priceCkechFetching,
  } = CallAPI({
    name: 'checkForDeletePrice',
    url: SP_CAN_DELETE_PRICE_OPTION,
    refetchOnWindowFocus: false,
    // retry: 1,
    query: {
      serviceOptionId: priceIdToCheck,
    },
    onSuccess: (res) => {
      if (res?.length > 0) {
        setPackageServiceOpen(true);
        if (!priceOptName?.length) {
          setMsgPackageIndexing({
            msg: 'edit.service.price.options.delete',
            index: indexPriceDelete + 1,
          });
        } else {
          setMsgPackageIndexing({
            msg: 'edit.service.price.options.delete.name',
            index: priceOptName,
          });
        }

        setTitleWhenDeletePrice('newService.price.title');
        setPackages(res);
      } else {
        setCanDeletePrice(true);
      }
      setPriceIdToCheck(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error?.message);
      setPriceIdToCheck(null);
    },
    select: (res) => res?.data?.data,
  });

  /* -------------------------------------------------------------------------- */
  /*               check change price affect in any package or not              */
  /* -------------------------------------------------------------------------- */
  const {
    data: priceChangedAffectPackage,
    refetch: checkAffectOfPriceChangeAnyPackage,
    isFetching: fetchingAffectOfPriceInPackage,
  } = CallAPI({
    name: ['chekChangePriceAffectAnyPackage', priceOption],
    url: SP_CAN_DELETE_PRICE_OPTION,
    refetchOnWindowFocus: false,
    enabled: !!priceOption,
    // retry: 0,
    query: {
      serviceOptionId: priceOption,
    },
    onSuccess: (res) => {
      if (res?.length > 0) {
        setAllAffectedPackages([
          ...allAffectedPackages,
          {
            res,
            priceOption,
          },
        ]);
      }
      setcallPackageForPrice(callPackageForPrice + 1);
      setPriceOption(0);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error?.message);
      setPriceOption(0);
    },
    select: (res) => res?.data?.data,
  });

  useEffect(() => {
    if (allPricesOptionIdSavedInBE?.length) {
      setPriceOption(allPricesOptionIdSavedInBE[callPackageForPrice]);
    }
  }, [allPricesOptionIdSavedInBE, callPackageForPrice]);

  /* -------------------------------------------------------------------------- */
  /*               check for location before edit service location              */
  /* -------------------------------------------------------------------------- */
  const {
    data: branchNameWithNewLocation,
    refetch: checkLocationWhenEdit,
    isFetching: fetchingcheckLocationEdit,
  } = CallAPI({
    name: 'checkLocationEditWhenEditService',
    url: SP_REQUIRE_LOCATION_UPDATE,
    method: 'post',
    // retry: 1,
    refetchOnWindowFocus: false,
    body: { ...checkEditLocation },
    onSuccess: (res) => {
      if (!res?.length > 0) {
        // if response can delete ok trigger payload update
        editService();
      } else {
        // else show confirmation message if confirm trigger update if cancel do nothing
        setOpenCheckingModal(true);
        setMessageFromBE('service.location.with.emp.location');
        setOpenModal(false);
        setSearchValue('');
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    select: (res) => res?.data?.data,
  });

  /* -------------------------------------------------------------------------- */
  /*                            edit the service API                            */
  /* -------------------------------------------------------------------------- */

  const { refetch: editService, isFetching: fetchEditingService } = CallAPI({
    name: 'editServiceAPI',
    url: SP_EDIT_SERVICE,
    refetchOnWindowFocus: false,
    // retry: 1,
    method: 'put',
    body: {
      ...addPayload,
    },
    onSuccess: (res) => {
      toast.success(messages['common.edited.success']);
      history.goBack();
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  useEffect(() => {
    if (
      (branches?.length > 0 && !catList?.length) ||
      (branches?.length > 0 && !EmpListFromBE?.length)
    ) {
      callCategories();
      getEmp();
    }
  }, [branches?.length]);

  useEffect(() => {
    if (catList && serviceData) {
      if (catList?.length > 0 && serviceData) {
        const data = catList?.find((el) => +el?.id === serviceData?.categoryId);
        setValue(
          `branchesCheckboxes[${0}].categoryID`,
          `${[data?.id, locale === 'ar' ? data?.nameAr : data?.nameEn]}`,
        );
      }
    }
  }, [catList?.length, serviceData?.categoryId]);

  useEffect(() => {
    if ((vatFromBE || +vatFromBE === 0) && serviceData?.priceOptions) {
      //   need to enter to emp then calculate vat
      serviceData.priceOptions.forEach((price, idx) => {
        setValue(
          `pricing[${idx}].priceWithVat`,
          (price.price + price?.price * vatFromBE).toFixed(2),
        );
        price.employeeOptions.forEach((priceEmp, index) => {
          if (priceEmp?.isDefaultPrice) {
            setValue(
              `pricing[${idx}].employeePriceOptions[${0}].emp[${index}].priceWithVat`,
              '',
            );
          }
          if (!priceEmp?.isDefaultPrice && priceEmp?.price >= 0) {
            setValue(
              `pricing[${idx}].employeePriceOptions[${0}].emp[${index}].priceWithVat`,
              (priceEmp.price + priceEmp?.price * vatFromBE).toFixed(2),
            );
          }
          if (!priceEmp?.isDefaultPrice && priceEmp?.price < 0) {
            setValue(
              `pricing[${idx}].employeePriceOptions[${0}].emp[${index}].priceWithVat`,
              '',
            );
          }
        });
      });
    }
  }, [serviceData?.priceOptions, vatFromBE]);

  //   call API to check before delete price
  useEffect(() => {
    if (priceIdToCheck) {
      callCanRemovePrice();
    }
  }, [priceIdToCheck]);

  const priceWithBranchEmployeePricing = (data) => {
    const selectedBranchesWithEmpData = data?.branchesCheckboxes.filter(
      (el) => el?.branchID,
    );
    // console.log(data?.pricing[1]?.employeePriceOptions?.filter((el) => el?.emp));
    return data?.pricing?.map((priceOpt) => ({
      ...priceOpt,
      id: priceOpt?.priceOptionId,
      price: +priceOpt?.priceType === 1 ? 0 : priceOpt?.price,
      priceWithVat: +priceOpt?.priceType === 1 ? 0 : priceOpt?.priceWithVat,
      employeePriceOptions: AdvancePriceLogic(
        priceOpt,
        priceOpt?.employeePriceOptions?.filter((el) => el?.emp),
        selectedBranchesWithEmpData,
      ),
    }));
  };

  const AdvancePriceLogic = (priceOpt, advancePriceArray, branchWithEmp) => {
    if (advancePriceArray[0]?.emp?.length > 0 && allBranches?.length > 1) {
      // enter here if the user open the modal for advance price with multiple branches
      //   check if the added employee has data or no inisde priceType, duration
      return [
        branchWithEmp
          ?.map((el, index) =>
            el?.employees?.map((singleEmp, idx) => ({
              branchId: +el?.branchID,
              employee: +singleEmp,
              price: checkPriceChanging(
                priceOpt?.priceType,
                priceOpt?.price,
                advancePriceArray,
                index,
                idx,
              ),
              isDefaultPrice: checkDefaultPriceOrNot(
                priceOpt?.priceType,
                priceOpt?.price,
                advancePriceArray,
                index,
                idx,
              ),
              priceType: advancePriceArray[index]?.emp[idx]
                ? advancePriceArray[index]?.emp[idx]?.priceType?.includes('Default')
                  ? priceOpt?.priceType
                  : advancePriceArray[index]?.emp[idx]?.priceType
                : priceOpt?.priceType,
              isDefaultPriceType: advancePriceArray[index]?.emp[idx]
                ? !!(
                    advancePriceArray[index]?.emp[idx]?.priceType?.includes('Default') ||
                    !advancePriceArray[index]?.emp[idx]?.priceType
                  )
                : true,
              duration: advancePriceArray[index]?.emp[idx]
                ? advancePriceArray[index]?.emp[idx]?.duration?.includes('Default')
                  ? priceOpt?.duration
                  : advancePriceArray[index]?.emp[idx]?.duration
                : priceOpt?.duration,
              isDefaultDuration: advancePriceArray[index]?.emp[idx]
                ? !!(
                    advancePriceArray[index]?.emp[idx]?.duration?.includes('Default') ||
                    !advancePriceArray[index]?.emp[idx]?.duration
                  )
                : true,
            })),
          )
          .flat(),
      ].flat();
    }

    if (advancePriceArray[0]?.emp?.length > 0 && allBranches?.length === 1) {
      // enter here if the user open the modal for advance price with only one branch
      return [
        branchWithEmp
          ?.map((el, index) =>
            el?.employees?.map((singleEmp, idx) => ({
              branchId: +el?.branchID,
              employee: +singleEmp,
              price: checkPriceChanging(
                priceOpt?.priceType,
                priceOpt?.price,
                advancePriceArray,
                index,
                idx,
              ),
              isDefaultPrice: checkDefaultPriceOrNot(
                priceOpt?.priceType,
                priceOpt?.price,
                advancePriceArray,
                index,
                idx,
              ),
              priceType: advancePriceArray[index]?.emp[idx]
                ? advancePriceArray[index]?.emp[idx]?.priceType?.includes('Default')
                  ? priceOpt?.priceType
                  : advancePriceArray[index]?.emp[idx]?.priceType
                : priceOpt?.priceType,
              isDefaultPriceType: advancePriceArray[index]?.emp[idx]
                ? !!(
                    advancePriceArray[index]?.emp[idx]?.priceType?.includes('Default') ||
                    !advancePriceArray[index]?.emp[idx]?.priceType
                  )
                : true,
              duration: advancePriceArray[index]?.emp[idx]
                ? advancePriceArray[index]?.emp[idx]?.duration?.includes('Default')
                  ? priceOpt?.duration
                  : advancePriceArray[index]?.emp[idx]?.duration
                : priceOpt?.duration,
              isDefaultDuration: advancePriceArray[index]?.emp[idx]
                ? !!(
                    advancePriceArray[index]?.emp[idx]?.duration?.includes('Default') ||
                    !advancePriceArray[index]?.emp[idx]?.duration
                  )
                : true,
            })),
          )
          .flat(),
      ].flat();
    }
    // use this if user not open the advance modal
    return [
      branchWithEmp
        ?.map((el) =>
          el?.employees?.map((singleEmp) => ({
            branchId: +el?.branchID,
            employee: +singleEmp,
            price: +priceOpt?.priceType === 1 ? 0 : priceOpt?.price,
            isDefaultPrice: true,
            priceType: priceOpt?.priceType,
            isDefaultPriceType: true,
            duration: priceOpt?.duration,
            isDefaultDuration: true,
          })),
        )
        .flat(),
    ].flat();
  };

  const checkDefaultPriceOrNot = (
    priceType,
    oldPrice,
    advanceArray,
    indexBranchEmp,
    empIndex = -1,
    // eslint-disable-next-line consistent-return
  ) => {
    if (+priceType === 1 && +advanceArray[indexBranchEmp]?.priceType === 1) {
      return true;
    }
    if (+priceType !== 1 && +advanceArray[indexBranchEmp]?.priceType === 1) {
      return true;
    }
    if (empIndex < 0) {
      return !advanceArray[indexBranchEmp]?.price;
    }
    if (empIndex >= 0) {
      return !advanceArray[indexBranchEmp]?.emp[empIndex]?.price;
    }
  };
  const checkPriceChanging = (
    priceType,
    oldPrice,
    advanceArray,
    indexBranchEmp,
    empIndex = -1,
    // eslint-disable-next-line consistent-return
  ) => {
    if (+priceType === 1 && +advanceArray[indexBranchEmp]?.priceType === 1) {
      return 0;
    }
    if (+priceType !== 1 && +advanceArray[indexBranchEmp]?.priceType === 1) {
      return 0;
    }
    if (empIndex < 0) {
      return advanceArray[indexBranchEmp]?.price
        ? +advanceArray[indexBranchEmp]?.price
        : +oldPrice;
    }
    if (empIndex >= 0) {
      return advanceArray[indexBranchEmp]?.emp[empIndex]?.price
        ? +advanceArray[indexBranchEmp]?.emp[empIndex]?.price
        : +oldPrice;
    }
  };
  const checkForProcessingTimes = () => {
    if (processingTimes[0]?.duration && processingTimes[0]?.start) {
      return [
        ...processingTimes?.map((time) => {
          if (time?.duration?.split(':')?.reduce((a, b) => a + b, 0) > 0) {
            const duration = time.duration.split(':');
            const start = time.start.split(':');
            const endTime = duration.map((num, i) => +num + +start[i]);
            if (endTime[1] >= 60) {
              endTime[0] += 1;
              endTime[1] -= 60;
            }
            return {
              From: time.start,
              To: endTime.map((el) => (el < 10 ? 0 + el?.toString() : el)).join(':'),
            };
          }
          return null;
        }),
      ];
    }
    return [];
  };
  useEffect(() => {
    if (addPayload && +watch('serLocation') === 3) checkLocationWhenEdit();
    if (addPayload && +watch('serLocation') !== 3) editService();
  }, [addPayload]);

  const submitClicked = (data) => {
    if (!errorBufferTime && !intersectionError) {
      const branchesSelected = getValues('branchesCheckboxes').filter(
        (branch) => branch.branchID,
      );
      branchesSelected.map((branch) => {
        const arrayOfEmp = [];
        if (typeof branch?.employees === 'string') {
          arrayOfEmp.push(branch?.employees);
        } else {
          branch?.employees?.map((emp) => arrayOfEmp.push(emp));
        }
        return {
          branchId: branch.branchID,
          categoryId: branch.categoryID,
          employees: arrayOfEmp,
        };
      });
      setCheckEditLocation({
        serviceId: servID,
        branchEmployees: branchesSelected.map((branch) => {
          const arrayOfEmp = [];
          if (typeof branch?.employees === 'string') {
            arrayOfEmp.push(+branch?.employees);
          } else {
            branch?.employees.map((emp) => arrayOfEmp.push(+emp));
          }
          return {
            branchId: +branch?.branchID,
            branchName: allBranches?.find((el) => +el?.branchId === +branch?.branchID)
              ?.name,
            employeeIds: arrayOfEmp,
          };
        }),
      });
      setAddPayload({
        id: servID,
        nameAR,
        nameEn: data?.serviceEn,
        location: +data?.serLocation,
        categoryId: branchesSelected?.map(
          (branch) => +branch?.categoryID.split(',')[0],
        )[0],
        employees: branchesSelected?.map((branch) => branch?.employees).flat(),
        descriptionAr: data?.descrAr,
        descriptionEn: data?.descrEn,
        requirementsAr: data?.requireAr,
        requirementsEn: data?.requireEn,
        onlineBookings: toggleCustomerApp,
        priceOptions: priceWithBranchEmployeePricing(data),
        BufferTime: data?.BufferTime || '00:00:00',
        BlockedTime: data?.BlockedTime || '00:00:00',
        ProcessingTime: checkForProcessingTimes()?.filter((el) => el),
      });
    }
  };

  return !isFetching && !getAllCat && !fetchingBranches && !EmpFetching ? (
    <form onSubmit={handleSubmit(submitClicked)} className="addNewService">
      <ServiceNames
        handleEnNameInput={handleEnNameInput}
        setnameAR={setnameAR}
        nameAR={nameAR}
        register={register}
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        errors={errors}
      />
      {/* edit category for service */}
      <Row className="pt-2">
        <Col xs={12} className="mb-2">
          <p
            className={`branchEdit__business ${
              errors?.branchesCheckboxes && errors?.branchesCheckboxes[0]?.categoryID
                ? 'labelCatError'
                : ''
            }`}
          >
            {messages[`category.DD.label`]}
          </p>
          <button
            type="button"
            className={`beuti-dropdown-modal mt-3 ${
              errors?.branchesCheckboxes && errors?.branchesCheckboxes[0]?.categoryID
                ? 'categoryError'
                : ''
            }`}
            onClick={getBC}
            disabled={BCloading}
          >
            <span>
              {BCloading ? (
                <div className="spinner-border spinner-border-sm mb-1" />
              ) : (
                watch(`branchesCheckboxes[${0}].categoryID`) &&
                watch(`branchesCheckboxes[${0}].categoryID`).split(',')[1]
              )}
            </span>
            <span className="select-category ">{messages['common.edit']}</span>
          </button>
          {!watch(`branchesCheckboxes[${0}].categoryID`) && (
            <span onClick={getBC} className="placeholder-category-select">
              {messages['category.place.holder.select']}
            </span>
          )}
          {errors?.branchesCheckboxes && (
            <>
              <p className="branches-err-message" style={{ top: '83px' }}>
                {errors?.branchesCheckboxes[0]?.categoryID?.message}
              </p>
            </>
          )}
        </Col>
      </Row>
      {/* location for service */}
      <hr className="w-100" />
      <ServiceLocationEdit
        register={register}
        errors={errors}
        watch={watch}
        originalLocation={originalLocation}
        setOriginalLocation={setOriginalLocation}
        canchangeCall={canchangeCall}
        fetchCanOrNot={fetchCanOrNot}
        setSerLocation={setSerLocation}
        serLocation={serLocation}
        checkFirstTime={checkFirstTime}
        setcheckFirstTime={setcheckFirstTime}
        setValue={setValue}
      />

      <hr className="w-100" />
      <EmployeeEditService
        allEmployees={allEmployees}
        setAllEmployees={setAllEmployees}
        register={register}
        EmpListFromBE={EmpListFromBE}
        watch={watch}
        checkFirstTime={checkFirstTime}
        reset={reset}
        errors={errors}
      />

      <hr className="w-100" />
      <PriceAndDurationEdit
        durationService={durationService}
        register={register}
        watch={watch}
        errors={errors}
        priceObject={priceObject}
        setValue={setValue}
        getValues={getValues}
        vatFromBE={vatFromBE}
        allBranches={allBranches}
        allEmpForAllBranches={allEmpForAllBranches}
        callCanRemovePrice={callCanRemovePrice}
        priceCkechFetching={priceCkechFetching}
        setPriceIdToCheck={setPriceIdToCheck}
        setPriceOptName={setPriceOptName}
        priceIdToCheck={priceIdToCheck}
        setIndexPriceDelete={setIndexPriceDelete}
        indexPriceDelete={indexPriceDelete}
        setCanDeletePrice={setCanDeletePrice}
        canDeletePrice={canDeletePrice}
        fetchingAffectOfPriceInPackage={fetchingAffectOfPriceInPackage}
        setOpenAffectedPackagesModal={setOpenAffectedPackagesModal}
        setAffectedPackages={setAffectedPackages}
        allAffectedPackages={allAffectedPackages}
      />

      <hr className="w-100" />
      <ServiceDescription register={register} errors={errors} />
      <hr className="w-100" />
      <ServiceRequirements register={register} errors={errors} />
      <hr className="w-100" />
      <ServiceOnlineBooking
        toggleCustomerApp={toggleCustomerApp}
        setToggleCustomerApp={setToggleCustomerApp}
      />

      <hr className="w-100" />
      <ServiceTimingOptions
        durationService={durationService}
        register={register}
        watch={watch}
        errors={errors}
        processingTimes={processingTimes}
        setProcessingTimes={setProcessingTimes}
        errorBufferTime={errorBufferTime}
        setErrorBufferTime={setErrorBufferTime}
        setValue={setValue}
        intersectionError={intersectionError}
        setIntersectionError={setIntersectionError}
        setLowestSerDurMin={setLowestSerDurMin}
        lowestSerDurMin={lowestSerDurMin}
        servID={servID}
      />

      {/* the footer for submit service */}
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
            loading={fetchEditingService || fetchingcheckLocationEdit}
            disabled={fetchEditingService || fetchingcheckLocationEdit}
          />
        </Col>
      </Row>
      <CategoryModal
        show={openModal}
        setShow={setOpenModal}
        list={BClist}
        selectedBC={selectedBC}
        setSelectedBC={setSelectedBC}
        register={register}
        BranchFromAccordion={BranchFromAccordion}
        indexing={branches[0]}
        allBranches={allBranches}
        setValue={setValue}
        getValues={getValues}
        control={control}
      />
      <PackagesForLocation
        packagesData={packages}
        packagesOption={packagesOption}
        Id={servID}
        openModal={packageServiceOpen}
        setOpenModal={setPackageServiceOpen}
        message={msgPackage}
        messageWithIndex={msgPackageIndexing}
        title={titleWhenDeletePrice}
        setMsgPackageIndexing={setMsgPackageIndexing}
        setMsgPackage={setMsgPackage}
        setTitleWhenDeletePrice={setTitleWhenDeletePrice}
        setPackages={setPackages}
        setPackagesOption={setPackagesOption}
      />
      <CheckLocationResponseModal
        title="newService.location.title"
        message={messageFromBE}
        openModal={openCheckingModal}
        setOpenModal={setOpenCheckingModal}
        refetchUpdateService={editService}
        editedService
        branchNameWithNewLocation={branchNameWithNewLocation}
      />
      <PackagesForPriceChanges
        setOpenAffectedPackagesModal={setOpenAffectedPackagesModal}
        openAffectedPackagesModal={openAffectedPackagesModal}
        affectedPackages={affectedPackages}
        setAffectedPackages={setAffectedPackages}
      />
    </form>
  ) : (
    <div className="loading"></div>
  );
}
