/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import {
  CircularProgress,
  Switch,
  Accordion,
  AccordionSummary,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useAPI, { get, post, put } from 'hooks/useAPI';
import { toast } from 'react-toastify';
import { DisableSpecialityModal } from './DisableSpecialityModal';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(25),
    flexBasis: '60.33%',
    paddingTop: '0.3em',
    paddingBottom: '0.3em',
    paddingLeft: '0.5em',
    paddingRight: '0.5em',
    flexShrink: 0,
  },
  body: {
    padding: '1em 4em',
    paddingBottom: '2em',
  },
}));

const SpecialitesCertificate = ({ allCategories, roleID, recallApprovedSpeciality }) => {
  const classes = useStyles();
  const { locale, messages } = useIntl();
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [specialites, setSpecialites] = useState([]);
  const [expanded, setExpanded] = useState('panel0');
  const [toggleClicked, setToggleClicked] = useState(null);
  const [payloadEnable, setPayloadEnable] = useState(null);
  const [specId, setSpecId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const freelanceCertificate = 'freelance.certificate';
  const {
    response: specialitesRes,
    isLoading: loadingSpecialites,
    setRecall: recallSpecialites,
  } = useAPI(
    get,
    `FreelanceCertificate/GetCategorySpecialities?categoryId=${selectedCatId}`,
  );
  const {
    response: enableSpec,
    isLoading: lodaingEnableSpec,
    setRecall: recallEnableSpec,
  } = useAPI(post, `FreelanceCertificate/EnableSpeciality`, payloadEnable);

  const {
    response: disableSpec,
    isLoading: lodaingDisableSpec,
    setRecall: recallDisableSpec,
  } = useAPI(put, `FreelanceCertificate/DisableSpeciality?specialityId=${specId}`);

  const {
    response: certificateUsedRes,
    isLoading: loadCertificateUsed,
    setRecall: recallCertificateUsed,
  } = useAPI(get, `FreelanceCertificate/IsCertificateTypeUsed?specialityId=${specId}`);

  /* -------------------------------------------------------------------------- */
  /*         calling first api to get specialities of specific category         */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (selectedCatId) {
      recallSpecialites(true);
    }
  }, [selectedCatId]);

  useEffect(() => {
    if (specialitesRes?.data) {
      setSpecialites(specialitesRes?.data?.specialities);
      setToggleClicked(false);
    } else if (specialitesRes?.error) {
      notify(specialitesRes?.error?.message, 'error');
    }
  }, [specialitesRes]);

  /* -------------------------------------------------------------------------- */
  /*              calling after enable the certificate specialties              */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (payloadEnable) {
      recallEnableSpec(true);
    }
  }, [payloadEnable]);

  useEffect(() => {
    if (enableSpec?.data?.success) {
      recallSpecialites(true);
      recallApprovedSpeciality(true);
      notify(messages[`${freelanceCertificate}.enable.success`]);
      setPayloadEnable(null);
    } else if (enableSpec?.error?.message) {
      notify(enableSpec?.error?.message, 'error');
      setPayloadEnable(null);
    }
  }, [enableSpec]);

  /* -------------------------------------------------------------------------- */
  /*              calling after disable the certificate specialties             */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (specId) {
      recallCertificateUsed(true);
    }
  }, [specId]);

  //   to show the modal
  useEffect(() => {
    if (certificateUsedRes) {
      if (certificateUsedRes?.data) {
        setOpenDeleteModal(true);
      } else if (!certificateUsedRes?.data) {
        recallDisableSpec(true);
      } else if (certificateUsedRes?.error?.message) {
        notify(disableSpec?.error?.message, 'error');
      }
    }
  }, [certificateUsedRes]);

  useEffect(() => {
    if (disableSpec?.data?.success) {
      recallSpecialites(true);
      recallApprovedSpeciality(true);
      notify(messages[`${freelanceCertificate}.disable.success`]);
      setSpecId(null);
    } else if (disableSpec?.error?.message) {
      notify(disableSpec?.error?.message, 'error');
      setSpecId(null);
    }
  }, [disableSpec]);

  const chooseCategory = (categoryId, panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    setSelectedCatId(isExpanded ? categoryId : null);
  };
  const handleToggleChange = (singleCategory, singleSpec) => {
    if (!singleSpec.is_enabled) {
      setPayloadEnable({
        roleId: roleID,
        categoryId: singleCategory.id,
        specialityId: singleSpec.id,
        specialityName: singleSpec.name,
        specialityNameEN: singleSpec.name_en,
      });
    } else {
      setSpecId(singleSpec.id);
    }
    setToggleClicked(true);
  };

  const notify = (message, error) => {
    if (error) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  return (
    <>
      {allCategories.map((singleCat) => (
        <Accordion
          key={singleCat.id}
          expanded={expanded === `panel${singleCat.id}`}
          onChange={chooseCategory(singleCat.id, `panel${singleCat.id}`)}
          className="specialites-accordion"
        >
          <AccordionSummary>
            <Typography className={`${classes.heading} category-click`}>
              - {locale === 'ar' ? singleCat.name : singleCat.name_en}
            </Typography>
          </AccordionSummary>
          <section className={`${classes.body}`}>
            {specialites && !loadingSpecialites ? (
              specialites.length > 0 ? (
                specialites.map((singleSpec) => (
                  <div
                    key={singleSpec.id}
                    style={{
                      marginRight: `${locale === 'ar' && '4em'}`,
                      marginLeft: `${locale === 'en' && '4em'}`,
                    }}
                    className="d-flex justify-content-between justify-content-md-start d-flex align-items-md-center mt-2"
                  >
                    <h5 className={`${singleSpec.is_enabled && 'colorPrimary'}`}>
                      {locale === 'ar' ? singleSpec.name : singleSpec.name_en}
                    </h5>
                    <Switch
                      checked={singleSpec.is_enabled && true}
                      onChange={() => handleToggleChange(singleCat, singleSpec)}
                      name="toggleisEnabled"
                      disabled={
                        lodaingEnableSpec ||
                        loadingSpecialites ||
                        lodaingDisableSpec ||
                        loadCertificateUsed
                      }
                    />
                  </div>
                ))
              ) : (
                <div className="text-center">
                  {messages[`${freelanceCertificate}.noDataFound`]}{' '}
                </div>
              )
            ) : toggleClicked ? (
              specialites.map((singleSpec) => (
                <div
                  key={singleSpec.id}
                  style={{
                    marginRight: `${locale === 'ar' && '4em'}`,
                    marginLeft: `${locale === 'en' && '4em'}`,
                  }}
                  className="d-flex justify-content-between justify-content-md-start d-flex align-items-md-center mt-2"
                >
                  <h5 className={`${singleSpec.is_enabled && 'colorPrimary'}`}>
                    {locale === 'ar' ? singleSpec.name : singleSpec.name_en}
                  </h5>
                  <Switch
                    checked={singleSpec.is_enabled && true}
                    onChange={() => handleToggleChange(singleCat, singleSpec)}
                    name="toggleisEnabled"
                    disabled={
                      lodaingEnableSpec ||
                      loadingSpecialites ||
                      lodaingDisableSpec ||
                      loadCertificateUsed
                    }
                  />
                </div>
              ))
            ) : (
              <div className="text-center">
                <CircularProgress size={24} color="secondary" />
              </div>
            )}
          </section>
        </Accordion>
      ))}
      <DisableSpecialityModal
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        recallDisableSpec={recallDisableSpec}
        setSpecId={setSpecId}
        message="freelance.certificate.confirm.disable"
      />
    </>
  );
};
SpecialitesCertificate.propTypes = {
  allCategories: PropTypes.object,
  roleID: PropTypes.number,
  recallApprovedSpeciality: PropTypes.func,
};

export default SpecialitesCertificate;
