/* eslint-disable indent */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/extensions */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { CallAPI } from 'utils/API/APIConfig';
import { useIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { SP_GET_USER_BRANCHES } from 'utils/API/EndPoints/BranchManager';
import {
  SP_ADD_NEW_SERVICE,
  SP_GET_CATEGORIES_BY_BRANCH,
  SP_GET_EMP_BT_BRANCH,
  SP_REQUIRE_LOCATION_UPDATE,
  SP_VAT,
} from 'utils/API/EndPoints/ServiceProviderEP';
import BeutiButton from 'Shared/inputs/BeutiButton';
import { createTimeDuration } from 'constants/hours';
import SchemaAddNewService from './AddNewServiceSchema';
import CategoryModal from './CategoryModal';
import PriceAndDuration from './PriceAndDuration';
import ServiceNames from './ServiceNames';
import ServiceLocation from './ServiceLocation';
import BranchesSelections from './BranchesAddNewService';
import ServiceDescription from './ServiceDescription';
import ServiceRequirements from './ServiceRequirements';
import ServiceOnlineBooking from './ServiceOnlineBooking';
import ServiceTimingOptions from './ServiceTimingOptions';
import { CheckLocationResponseModal } from '../../../SPInformationWizard/components/step3-services-categories/CheckLocationRsponseModal';

export default function AddNewService() {
  const { messages, locale } = useIntl();
  const history = useHistory();
  const [expanded, setExpanded] = useState('panel-0');
  const [openModal, setOpenModal] = useState(false);
  const [addPayload, setAddPayload] = useState(false);
  const [selectedBC, setSelectedBC] = useState({ id: '', name: '', description: '' });
  const [allBranches, setAllBranches] = useState([]);
  const [branchesFullDataPricing, setBranchesFullDataPricnig] = useState([]);
  const [singleBranId, setSingleBranId] = useState(false);
  const [allEmployees, setAllEmployees] = useState(false);
  const [allEmpForAllBranches, setAllEmpForAllBranches] = useState([]);
  const [BranchFromAccordion, setBranchFromAccordion] = useState();
  const [searchValue, setSearchValue] = useState('');
  const [nameAR, setnameAR] = useState('');
  const [indexing, setIndexing] = useState(null);
  const [toggleCustomerApp, setToggleCustomerApp] = useState(true);
  const [errorBufferTime, setErrorBufferTime] = useState(false);
  const [intersectionError, setIntersectionError] = useState(false);
  const [processingTimes, setProcessingTimes] = useState([{ duration: '', start: '' }]);
  //   const durationService = locale === 'ar' ? durationAr : durationEn;
  const durationService = createTimeDuration({ messages, minDuration: 5 });
  const addNewServiceSchemaValidations = SchemaAddNewService(singleBranId);
  //   used in check service location confirmation
  const [checkEditLocation, setCheckEditLocation] = useState(false);
  const [openCheckingModal, setOpenCheckingModal] = useState(null);
  const [messageFromBE, setMessageFromBE] = useState(false);

  const [lowestSerDurMin, setLowestSerDurMin] = useState();
  const priceObject = {
    duration: '00:05:00',
    priceType: 2,
    price: 0,
    priceWithVat: 0,
    pricingNameAr: '',
    pricingNameEn: '',
    employeePriceOptions: [],
  };

  const handleEnNameInput = (value) => {
    setValue('serviceEn', value, { shouldValidate: true });
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
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
      pricing: [],
      serLocation: '2',
    },
  });

  useEffect(() => {
    if (localStorage.getItem('selectedBranches')) {
      // put initial branches  to the schema
      JSON.parse(localStorage.getItem('selectedBranches')).forEach((branch, index) => {
        setValue(`branchesCheckboxes[${index}].branchID`, branch);
      });
    }
  }, [localStorage.getItem('selectedBranches')]);
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
              selected:
                branch.id ===
                JSON.parse(localStorage.getItem('selectedBranches')).find(
                  (el) => el === branch.id,
                ),
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
              selected:
                branch.id ===
                JSON.parse(localStorage.getItem('selectedBranches')).find(
                  (el) => el === branch.id,
                ),
            }))
            .sort((a, b) => {
              if (a?.selected && !b?.selected) return -1;
              if (!a?.selected && b?.selected) return 1;
              return 0;
            }),
        );
      }
      if (res?.list?.length <= 1) {
        setSingleBranId(res?.list[0]?.id);
        setIndexing(res?.list[0]?.id);
      }
    },
    select: (res) => res?.data?.data,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  /* -------------------------------------------------------------------------- */
  /*                        get categroy for each branch                        */
  /* -------------------------------------------------------------------------- */
  const { data: BClist, refetch: getBC, isFetching: BCloading } = CallAPI({
    name: 'getCategoriesDependOnBranch',
    url: SP_GET_CATEGORIES_BY_BRANCH,
    query: {
      branchId: singleBranId || BranchFromAccordion,
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

  /* -------------------------------------------------------------------------- */
  /*                        get employee for each branch                        */
  /* -------------------------------------------------------------------------- */
  const { data: EmpListFromBE, refetch: getEmp, isFetching: EmpFetching } = CallAPI({
    name: 'getEmpByBranchId',
    url: SP_GET_EMP_BT_BRANCH,
    refetchOnWindowFocus: false,
    query: {
      branchId: singleBranId || BranchFromAccordion,
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
      setAllEmpForAllBranches([...allEmpForAllBranches, ...res]);
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    select: (res) => res?.data?.data?.list,
  });

  const { refetch: addNewService, isFetching: addSerFetching } = CallAPI({
    name: 'addNewServiceForBranches',
    url: SP_ADD_NEW_SERVICE,
    refetchOnWindowFocus: false,
    // retry: false,
    method: 'post',
    body: {
      ...addPayload,
    },
    onSuccess: (res) => {
      toast.success(messages['common.success']);
      history.goBack();
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  /* -------------------------------------------------------------------------- */
  /*                             get the vat for SP                             */
  /* -------------------------------------------------------------------------- */
  const { data: vatFromBE } = CallAPI({
    name: 'getVatForServiceProvider',
    url: SP_VAT,
    enabled: true,
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      if (res || +res === 0) {
        setValue('pricing', [
          {
            ...priceObject,
            priceWithVat: (priceObject.price + priceObject?.price * res).toFixed(2),
          },
        ]);
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
    select: (res) => +res?.data?.data?.vatValue / 100,
  });

  /* -------------------------------------------------------------------------- */
  /*               check for location before edit service location              */
  /* -------------------------------------------------------------------------- */
  const {
    data: branchNameWithNewLocation,
    refetch: checkLocationWhenEdit,
    isFetching: fetchingcheckLocationEdit,
  } = CallAPI({
    name: 'checkLocationEditWhenAddNewService',
    url: SP_REQUIRE_LOCATION_UPDATE,
    // retry: 1,
    method: 'post',
    refetchOnWindowFocus: false,
    body: { ...checkEditLocation },
    onSuccess: (res) => {
      if (!res?.length > 0) {
        // if response can delete ok trigger payload update
        addNewService();
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

  useEffect(() => {
    if (BranchFromAccordion) {
      getEmp();
    }
  }, [BranchFromAccordion]);

  useEffect(() => {
    if (singleBranId) {
      getEmp();
    }
  }, [singleBranId]);
  const checkDefaultPriceOrNot = (
    priceType,
    oldPrice,
    advanceArray,
    indexBranchEmp,
    empIndex = -1,
    // eslint-disable-next-line consistent-return
  ) => {
    if (
      +priceType === 1 &&
      +advanceArray[indexBranchEmp]?.priceType === 1 &&
      empIndex < 0
    ) {
      return true;
    }
    if (
      +priceType === 1 &&
      advanceArray[indexBranchEmp]?.priceType.toString().includes('Default') &&
      empIndex < 0
    ) {
      return true;
    }
    if (+priceType !== 1 && +advanceArray[indexBranchEmp]?.priceType === 1) {
      return false;
    }
    if (
      +advanceArray[indexBranchEmp]?.emp[empIndex]?.priceType === 1 ||
      advanceArray[indexBranchEmp]?.emp[empIndex]?.priceType
        ?.toString()
        ?.includes('1Default')
    ) {
      return false;
    }
    if (empIndex < 0) {
      return !advanceArray[indexBranchEmp]?.price;
    }
    if (empIndex >= 0) {
      return !advanceArray[indexBranchEmp].emp[empIndex]?.price;
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
    const sendZeroIfPriceTypeIsFree = () => {
      if (
        advanceArray[indexBranchEmp].emp[empIndex]?.price &&
        +advanceArray[indexBranchEmp].emp[empIndex]?.priceType !== 1
      ) {
        return advanceArray[indexBranchEmp].emp[empIndex]?.price;
      }
      if (
        advanceArray[indexBranchEmp].emp[empIndex]?.price &&
        (+advanceArray[indexBranchEmp].emp[empIndex]?.priceType === 1 ||
          advanceArray[indexBranchEmp].emp[empIndex]?.priceType
            ?.toString()
            ?.includes('1Default'))
      ) {
        return 0;
      }
      return 0;
    };
    let freePriceTypeEmpOrDefaultFree = '';
    if (empIndex >= 0) {
      freePriceTypeEmpOrDefaultFree =
        +advanceArray[indexBranchEmp]?.emp[empIndex]?.priceType === 1 ||
        advanceArray[indexBranchEmp]?.emp[empIndex]?.priceType
          ?.toString()
          ?.includes('1Default');
    }
    // if (
    //   +priceType === 1 &&
    //   +advanceArray[indexBranchEmp]?.priceType === 1 &&
    //   freePriceTypeEmpOrDefaultFree
    // ) {
    //   return 0;
    // }
    if (
      +advanceArray[indexBranchEmp]?.priceType === 1 &&
      freePriceTypeEmpOrDefaultFree &&
      empIndex >= 0
    ) {
      return 0;
    }
    if (
      +advanceArray[indexBranchEmp]?.priceType === 1 &&
      empIndex >= 0 &&
      freePriceTypeEmpOrDefaultFree
    ) {
      return 0;
    }
    if (
      +priceType !== 1 &&
      +advanceArray[indexBranchEmp]?.priceType === 1 &&
      freePriceTypeEmpOrDefaultFree
    ) {
      return 0;
    }
    if (empIndex < 0) {
      return advanceArray[indexBranchEmp]?.price?.length
        ? +advanceArray[indexBranchEmp]?.price
        : +oldPrice;
    }
    if (empIndex >= 0) {
      return sendZeroIfPriceTypeIsFree();
    }
  };
  const AdvancePriceLogic = (priceOpt, advancePriceArray, branchWithEmp) => {
    if (advancePriceArray?.length > 0 && allBranches?.length > 1) {
      // enter here if the user open the modal for advance price with multiple branches
      return [
        branchWithEmp?.map((el, index) => ({
          branchId: +el?.branchID,
          employee: null,
          price: checkPriceChanging(
            priceOpt?.priceType,
            priceOpt?.price,
            advancePriceArray,
            index,
          ),
          isDefaultPrice: checkDefaultPriceOrNot(
            priceOpt?.priceType,
            priceOpt?.price,
            advancePriceArray,
            index,
          ),
          priceType:
            advancePriceArray[index]?.priceType &&
            advancePriceArray[index]?.priceType?.includes('Default')
              ? priceOpt?.priceType
              : advancePriceArray[index]?.priceType,
          isDefaultPriceType: !!(
            advancePriceArray[index]?.priceType &&
            advancePriceArray[index]?.priceType.includes('Default')
          ),
          duration:
            advancePriceArray[index].duration &&
            advancePriceArray[index].duration.includes('Default')
              ? priceOpt?.duration
              : advancePriceArray[index]?.duration,
          isDefaultDuration: !!(
            advancePriceArray[index]?.duration &&
            advancePriceArray[index]?.duration.includes('Default')
          ),
        })),
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
                ? advancePriceArray[index]?.emp[idx]?.priceType?.includes('Default') ||
                  !advancePriceArray[index]?.emp[idx]?.priceType
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
                ? advancePriceArray[index]?.emp[idx]?.duration?.includes('Default') ||
                  !advancePriceArray[index]?.emp[idx]?.duration
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

    if (advancePriceArray?.length > 0 && allBranches?.length === 1) {
      // enter here if the user open the modal for advance price with only one branch
      return [
        branchWithEmp?.map((el, index) => ({
          branchId: +el?.branchID,
          employee: null,
          price: priceOpt?.price,
          isDefaultPrice: true,
          priceType: priceOpt?.priceType,
          isDefaultPriceType: true,
          duration: priceOpt?.duration,
          isDefaultDuration: true,
        })),
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
                ? advancePriceArray[index]?.emp[idx]?.priceType?.includes('Default') ||
                  !advancePriceArray[index]?.emp[idx]?.priceType
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
                ? advancePriceArray[index]?.emp[idx]?.duration?.includes('Default') ||
                  !advancePriceArray[index]?.emp[idx]?.duration
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
      branchWithEmp?.map((el) => ({
        branchId: +el?.branchID,
        employee: null,
        price: +priceOpt?.priceType === 1 ? 0 : priceOpt?.price,
        isDefaultPrice: true,
        priceType: priceOpt?.priceType,
        isDefaultPriceType: true,
        duration: priceOpt?.duration,
        isDefaultDuration: true,
      })),
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

  const priceWithBranchEmployeePricing = (data) => {
    const selectedBranchesWithEmpData = data?.branchesCheckboxes?.filter(
      (el) => el?.branchID,
    );
    return data?.pricing?.map((priceOpt) => ({
      ...priceOpt,
      price: +priceOpt?.priceType === 1 ? 0 : priceOpt?.price,
      priceWithVat: +priceOpt?.priceType === 1 ? 0 : priceOpt?.priceWithVat,
      employeePriceOptions: AdvancePriceLogic(
        priceOpt,
        priceOpt?.employeePriceOptions?.filter((el) => el?.emp),
        selectedBranchesWithEmpData,
      ),
    }));
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
    if (addPayload && +watch('serLocation') !== 3) addNewService();
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
        nameAR,
        nameEn: data?.serviceEn,
        location: +data?.serLocation,
        branches: branchesSelected.map((branch) => {
          const arrayOfEmp = [];
          if (typeof branch?.employees === 'string') {
            arrayOfEmp.push(branch?.employees);
          } else {
            branch?.employees.map((emp) => arrayOfEmp.push(emp));
          }
          return {
            branchId: branch.branchID,
            categoryId: +branch.categoryID.split(',')[0],
            employees: arrayOfEmp,
          };
        }),
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

  return !fetchingBranches ? (
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
      {allBranches && allBranches.length === 1 && (
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
              <span className="select-category ">{messages['common.select']}</span>
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
      )}
      <hr className="w-100" />
      <ServiceLocation control={control} register={register} errors={errors} />
      <hr className="w-100" />
      <BranchesSelections
        allBranches={allBranches}
        errors={errors}
        expanded={expanded}
        handleChange={handleChange}
        setSingleBranId={setSingleBranId}
        setBranchFromAccordion={setBranchFromAccordion}
        register={register}
        EmpFetching={EmpFetching}
        getBC={getBC}
        BCloading={BCloading}
        allEmployees={allEmployees}
        setAllEmployees={setAllEmployees}
        EmpListFromBE={EmpListFromBE}
        BranchFromAccordion={BranchFromAccordion}
        watch={watch}
        setIndexing={setIndexing}
        reset={reset}
        setExpanded={setExpanded}
      />
      <hr className="w-100" />
      <PriceAndDuration
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
      <>
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
        />
      </>
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
            loading={addSerFetching || fetchingcheckLocationEdit}
            disabled={addSerFetching || fetchingcheckLocationEdit}
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
        indexing={indexing}
        allBranches={allBranches}
        setValue={setValue}
        getValues={getValues}
        control={control}
      />
      <CheckLocationResponseModal
        title="newService.location.title"
        message={messageFromBE}
        openModal={openCheckingModal}
        setOpenModal={setOpenCheckingModal}
        refetchUpdateService={addNewService}
        editedService
        branchNameWithNewLocation={branchNameWithNewLocation}
      />
    </form>
  ) : (
    <div className="loading"></div>
  );
}
