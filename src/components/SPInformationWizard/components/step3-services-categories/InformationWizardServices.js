import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { CallAPI } from 'utils/API/APIConfig';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { Routes } from 'constants/Routes';
import {
  Accordion,
  CircularProgress,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core';
import {
  SERVICE_PROVIDER_DELETE_CATEGORY,
  SERVICE_PROVIDER_DELETE_SERVICE,
  SERVICE_PROVIDER_SERVICES,
} from 'utils/API/EndPoints/ServiceProviderEP';
import { AddNewCategoryModal } from './AddNewCategoryModal';
import { ConfirmationModal } from '../../../shared/ConfirmationModal';
import { AddNewServiceModal } from './AddNewServiceModal';

export default function InformationWizardServices() {
  const { messages, locale } = useIntl();
  const history = useHistory();
  const [noDataEntered, setNoDataEntered] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allCategoriesWithoutServices, setAllCategoriesWithoutServices] = useState([]);
  //   used  in delete category
  const [deleteCatID, setDeleteCatID] = useState(null);
  const [deleteCatIDPayload, setDeleteCatIDPayload] = useState(null);
  const [openDeleteCatModal, setOpenDeleteCatModal] = useState(null);
  //   used in delete service
  const [deleteSerID, setDeleteSerID] = useState(null);
  const [deleteSerIDPayload, setDeleteSerIDPayload] = useState(null);
  const [openDeleteSerModal, setOpenDeleteSerModal] = useState(null);
  // used in edit saved category
  const [editedCategory, setEditedCategory] = useState(null);
  // used in edit saved service
  const [editedService, setEditedService] = useState(null);
  const [parentCategoryForService, setParentCategoryForService] = useState(null);
  //   used for accordion open close
  const [expanded, setExpanded] = useState('panel0');
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openAddService, setOpenAddService] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                     api to get all the saved categories                    */
  /* -------------------------------------------------------------------------- */
  const { refetch, isLoading: loadAllCategoriesWithServices } = CallAPI({
    name: 'getAllCategoriesWithService',
    url: SERVICE_PROVIDER_SERVICES,
    enabled: true,
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      if (res?.data?.data) {
        setCategories(res?.data?.data?.list);
        setAllCategoriesWithoutServices(
          res?.data?.data?.list.map((cat, index) => ({
            id: cat.id,
            key: index + 1,
            text: locale === 'ar' ? cat.nameAR : cat.nameEn,
          })),
        );
      }
    },
    onError: (err) => toast.error(err?.response?.data || err),
  });

  /* -------------------------------------------------------------------------- */
  /*                           API to  delete category                          */
  /* -------------------------------------------------------------------------- */
  const { refetch: deleteCategory, isLoading: loadForDeletingCat } = CallAPI({
    name: 'deleteSingleCategory',
    url: SERVICE_PROVIDER_DELETE_CATEGORY,
    refetchOnWindowFocus: false,
    method: 'put',
    query: { id: deleteCatIDPayload },
    retry: 0,
    onSuccess: (res) => {
      if (res?.data?.data?.success) {
        refetch();
        setDeleteCatIDPayload(null);
      }
    },
    onError: (err) => {
      setDeleteCatIDPayload(null);
      toast.error(err?.response?.data?.error?.message);
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                           API to  delete service                           */
  /* -------------------------------------------------------------------------- */
  const { refetch: deleteService, isLoading: loadForDeletingSer } = CallAPI({
    name: 'deleteSingleService',
    url: SERVICE_PROVIDER_DELETE_SERVICE,
    refetchOnWindowFocus: false,
    method: 'delete',
    query: { serviceId: deleteSerIDPayload },
    retry: 0,
    onSuccess: (res) => {
      if (res?.data?.success) {
        refetch();
        setDeleteSerIDPayload(null);
      }
    },
    onError: (err) => {
      setDeleteSerIDPayload(null);
      toast.error(err?.message);
    },
  });

  //   open and close the accordion
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const serviceDurationWithEmp = (duration, employees) => {
    const hours = +duration.split(':')[0];
    const minutes = +duration.split(':')[1];
    let emp = '';
    employees.forEach((singleEmp, index) => {
      emp += locale === 'ar' ? singleEmp?.nameAR : singleEmp?.nameEn;
      if (index !== employees?.length - 1) emp += `,${' '}`;
    });
    if (+duration.split(':')[0] >= 1 && +duration.split(':')[1] === 0) {
      return `${hours}${messages['time.hours.short']} ${messages['common.with']} ${emp}`;
    }
    if (+duration.split(':')[0] >= 1 && +duration.split(':')[1] !== 0) {
      return `${hours}${messages['time.hours.short']} ${minutes}${messages['time.minutes.short']} ${messages['common.with']} ${emp}`;
    }
    return `${minutes}${messages['time.minutes.short']} ${messages['common.with']} ${emp}`;
  };

  const {
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    // resolver: yupResolver(schema),
  });

  //   when confirm  delete category then call the API
  useEffect(() => {
    if (deleteCatIDPayload) {
      deleteCategory();
    }
  }, [deleteCatIDPayload]);

  //   when confirm  delete service
  useEffect(() => {
    if (deleteSerIDPayload) {
      deleteService();
    }
  }, [deleteSerIDPayload]);

  //   when click next button end of page
  const submitForm = (data) => {
    const servicesInsideAnyCat = categories.map(
      (singleCat) => singleCat?.categoryServiceDto?.length > 0,
    );
    if (categories.length > 0 && servicesInsideAnyCat.indexOf(true) !== -1) {
      setNoDataEntered(false);
      history.push(Routes.spinformationwizardStepFive);
    } else {
      setNoDataEntered(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(submitForm)}>
        <Row className="addServiceWizard">
          <Col xs={12} className="addServiceWizard__title">
            {messages['wizard.add.service.title']}
          </Col>
          <Col xs={12} className="addServiceWizard__subtitle">
            {messages['wizard.add.service.sub.title']}
          </Col>
          {noDataEntered && (
            <Col xs={12} className="addServiceWizard__alert">
              <div
                className="alert alert-danger w-100 mt-3 mb-0 addServiceWizard__alert--div"
                role="alert"
              >
                {messages['wizard.add.service.error.empty']}
                <button
                  type="button"
                  className="addServiceWizard__alert--btn"
                  onClick={() => setNoDataEntered(false)}
                >
                  x
                </button>
              </div>
            </Col>
          )}
          <Col xs={12} className="addServiceWizard__box">
            <Row>
              {loadAllCategoriesWithServices ? (
                <Col className="text-center">
                  <CircularProgress className="mx-auto" color="secondary" />
                </Col>
              ) : (
                <>
                  <Col xs="12" className="mt-4">
                    <button
                      onClick={() => setOpenAddCategory(true)}
                      className="addServiceWizard__box--addCategory"
                      type="button"
                    >
                      <span className="addServiceWizard__box--addCategory__plus">+</span>
                      {messages['wizard.add.new.category']}
                    </button>
                  </Col>

                  <Col xs="12" className="mt-4">
                    {categories.length > 0 &&
                      !loadAllCategoriesWithServices &&
                      categories.map((singleRow, index) => (
                        <Accordion
                          key={singleRow.id}
                          expanded={expanded === `panel${index}`}
                          onChange={handleChange(`panel${index}`)}
                          className="addServiceWizard__box--categoryServices"
                        >
                          <AccordionSummary
                            // expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                            className="addServiceWizard__box--categoryServices__header"
                          >
                            <div className="addServiceWizard__box--categoryServices__header--title">
                              <i
                                className={`flaticon2-${
                                  expanded === `panel${index}` ? 'up' : 'down'
                                }`}
                              ></i>
                              {locale === 'ar' ? singleRow.nameAR : singleRow.nameEn}
                            </div>
                            <div className="addServiceWizard__box--categoryServices__header--title px-2">
                              <button
                                type="button"
                                className="px-4 icon-wrapper-btn btn-icon-transparent"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditedCategory(singleRow.id);
                                  setOpenAddCategory(true);
                                }}
                              >
                                <i className="flaticon-edit"></i>
                              </button>
                              <button
                                type="button"
                                className="icon-wrapper-btn btn-icon-transparent"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDeleteCatModal(true);
                                  setDeleteCatID(singleRow.id);
                                }}
                              >
                                <i className="flaticon2-cross"></i>
                              </button>
                            </div>
                          </AccordionSummary>
                          <AccordionDetails className="addServiceWizard__box--categoryServices__body">
                            <button
                              onClick={() => {
                                setParentCategoryForService(singleRow.id);
                                setOpenAddService(true);
                              }}
                              className="addServiceWizard__box--addCategory"
                              type="button"
                            >
                              <span className="addServiceWizard__box--addCategory__plusWithoutCircle">
                                +
                              </span>
                              {messages['wizard.add.new.service']}
                            </button>
                            {singleRow?.categoryServiceDto?.map((singleSer) => (
                              <Typography key={singleSer.id}>
                                <span>
                                  {locale === 'ar' ? singleSer.nameAR : singleSer.nameEn}
                                </span>
                                <span>
                                  {serviceDurationWithEmp(
                                    singleSer.duration,
                                    singleSer.employees,
                                  )}
                                </span>
                                <span>
                                  {singleSer.priceValue} {messages['common.currency']}
                                </span>
                                <span>
                                  <button
                                    type="button"
                                    className="icon-wrapper-btn btn-icon-transparent"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditedService(singleSer.id);
                                      setParentCategoryForService(singleRow.id);
                                      setOpenAddService(true);
                                    }}
                                  >
                                    <i className="flaticon-edit"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="icon-wrapper-btn btn-icon-transparent"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenDeleteSerModal(true);
                                      setDeleteSerID(singleSer.id);
                                    }}
                                  >
                                    <i className="flaticon2-cross"></i>
                                  </button>
                                </span>
                              </Typography>
                            ))}
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    {categories.length <= 0 && !loadAllCategoriesWithServices && (
                      <div className="addServiceWizard__box--categoryServices">
                        <div className="addServiceWizard__box--categoryServices__header">
                          <div className="addServiceWizard__box--categoryServices__header--title"></div>
                          <div className="addServiceWizard__box--categoryServices__header--title"></div>
                        </div>
                        <div className="addServiceWizard__box--categoryServices__body">
                          <div className="addServiceWizard__box--categoryServices__body--noDataShape">
                            {messages['wizard.add.service.rule']}
                          </div>
                        </div>
                      </div>
                    )}
                  </Col>
                </>
              )}
            </Row>
          </Col>
          <Col className="text-center my-5" xs="12">
            <button
              className="mx-1 informationwizard__previous"
              onClick={() => history.push(Routes.spinformationwizardStepThree)}
              type="button"
            >
              {messages['common.previous']}
            </button>
            <button
              className="mx-1 informationwizard__submit"
              type="submit"
              disabled={loadForDeletingCat}
            >
              {messages['common.next']}
            </button>
          </Col>
        </Row>
      </form>
      {/* add new  category */}
      <AddNewCategoryModal
        setOpenModal={setOpenAddCategory}
        openModal={openAddCategory}
        title={messages['wizard.add.new.category']}
        editedCategory={editedCategory}
        setEditedCategory={setEditedCategory}
        refetchAllCategories={refetch}
      />
      {/* add new service */}
      <AddNewServiceModal
        setOpenModal={setOpenAddService}
        openModal={openAddService}
        title={
          editedService
            ? messages['wizard.edit.new.service.header']
            : messages['wizard.add.new.service.header']
        }
        editedService={editedService}
        setEditedService={setEditedService}
        allCategoriesWithoutServices={allCategoriesWithoutServices}
        parentCategoryForService={parentCategoryForService}
        refetchAll={refetch}
      />
      {/* delete  category  modal confirmation */}
      <ConfirmationModal
        setPayload={setDeleteCatIDPayload}
        Id={deleteCatID}
        openModal={openDeleteCatModal}
        setOpenModal={setOpenDeleteCatModal}
        message="wizard.delete.new.category"
      />
      {/* delete   service modal confirmation */}
      <ConfirmationModal
        setPayload={setDeleteSerIDPayload}
        Id={deleteSerID}
        openModal={openDeleteSerModal}
        setOpenModal={setOpenDeleteSerModal}
        message="wizard.delete.new.service"
      />
    </>
  );
}
