/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { CircularProgress } from '@material-ui/core';
import SpecialitesCertificate from './SpecialitesCertificate';

const CategoriesCertificates = ({
  category,
  loadingCategory,
  roleID,
  recallApprovedSpeciality,
}) => {
  const { messages } = useIntl();
  const freelanceCertificate = 'freelance.certificate';

  return (
    <>
      {category && !loadingCategory ? (
        category.length > 0 ? (
          <>
            <SpecialitesCertificate
              allCategories={category}
              roleID={roleID}
              recallApprovedSpeciality={recallApprovedSpeciality}
            />
          </>
        ) : (
          <div className="text-center">
            <h3>{messages[`${freelanceCertificate}.noDataFound.Category`]}</h3>
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
CategoriesCertificates.propTypes = {
  category: PropTypes.array,
  loadingCategory: PropTypes.bool,
  roleID: PropTypes.number,
  recallApprovedSpeciality: PropTypes.func,
};

export default CategoriesCertificates;
