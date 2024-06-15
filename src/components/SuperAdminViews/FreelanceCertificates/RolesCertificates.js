/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import useAPI, { get } from 'hooks/useAPI';
import {
  Accordion,
  AccordionSummary,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import CategoriesCertificates from './CategoriesCertificates';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(25),
    flexBasis: '60.33%',
    paddingTop: '1em',
    paddingBottom: '1em',
    paddingLeft: '0.5em',
    paddingRight: '0.5em',
    flexShrink: 0,
  },
  body: {
    padding: '1em 4em',
    paddingBottom: '2em',
  },
}));

const RolesCertificates = ({
  roles,
  loadingRoles,
  recallApprovedSpeciality,
  expanded,
  setExpanded,
  selectedRoleID,
  setSelectedRoleID,
}) => {
  const classes = useStyles();
  const { messages } = useIntl();
  const [category, setCategory] = useState([]);
  const freelanceCertificate = 'freelance.certificate';

  const {
    response: categoriesRes,
    isLoading: loadingCategory,
    setRecall: recallCategories,
  } = useAPI(get, `FreelanceCertificate/GetCategories?roleId=${selectedRoleID}`);

  useEffect(() => {
    if (selectedRoleID) {
      recallCategories(true);
    }
  }, [selectedRoleID]);

  useEffect(() => {
    if (categoriesRes?.data) {
      setCategory(categoriesRes?.data?.categories);
    }
  }, [categoriesRes]);

  const handleChange = (panel) => (event, isExpanded) => {
    setSelectedRoleID(panel.slice(5));
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <>
      {roles && !loadingRoles ? (
        roles.length > 0 ? (
          roles.map((singleRole) => (
            <Accordion
              key={singleRole.id}
              expanded={expanded === `panel${singleRole.id}`}
              onChange={handleChange(`panel${singleRole.id}`)}
              className="certificates-accordion"
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={`${classes.heading}`}>
                  {singleRole.name}
                </Typography>
              </AccordionSummary>
              <section className={`${classes.body}`}>
                <CategoriesCertificates
                  roleID={singleRole.id}
                  category={category}
                  loadingCategory={loadingCategory}
                  recallApprovedSpeciality={recallApprovedSpeciality}
                />
              </section>
            </Accordion>
          ))
        ) : (
          <div className="text-center iconColor">
            {messages[`${freelanceCertificate}.noDataFound`]}{' '}
          </div>
        )
      ) : (
        <div className="text-center">
          <CircularProgress size={24} color="secondary" />
        </div>
      )}
    </>
  );
};
RolesCertificates.propTypes = {
  roles: PropTypes.array,
  loadingRoles: PropTypes.bool,
  recallApprovedSpeciality: PropTypes.func,
  expanded: PropTypes.string,
  setExpanded: PropTypes.func,
  selectedRoleID: PropTypes.number,
  setSelectedRoleID: PropTypes.func,
};

export default RolesCertificates;
