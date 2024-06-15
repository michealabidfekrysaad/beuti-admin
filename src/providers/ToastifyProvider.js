import React from 'react';
import { useIntl } from 'react-intl';
import { ToastContainer } from 'react-toastify';
import PropTypes from 'prop-types';

const ToastifyProvider = ({ children }) => {
  const { locale } = useIntl();
  return (
    <>
      <ToastContainer
        autoClose={4000}
        hideProgressBar={false}
        position="top-center"
        newestOnTop
        rtl={locale === 'ar' && true}
        pauseOnFocusLoss={false}
        draggable
        limit={1}
      />
      {children}
    </>
  );
};

ToastifyProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ToastifyProvider;
