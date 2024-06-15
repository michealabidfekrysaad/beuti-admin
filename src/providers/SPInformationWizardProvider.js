import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

// This Provider To Share addNew service with predefined centertype, category
export const SPInformationWizardContext = createContext();

const SPInformationWizardProvider = ({ children }) => {
  const [SPInformation, setSPInformation] = useState({
    currentStep: 0,
    percntage: 0,
  });
  const { messages } = useIntl();
  const [steps, setSteps] = useState([
    { name: messages['rw.generaldetails'], step: 0, status: 'idle', percntage: '0%' },
    { name: messages['rw.bussinessHours'], step: 1, status: 'idle', percntage: '27%' },
    { name: messages['rw.addStaff'], step: 2, status: 'idle', percntage: '50%' },
    { name: messages['rw.addservice'], step: 3, status: 'idle', percntage: '73%' },
    { name: messages['rw.uploadphotos'], step: 4, status: 'idle', percntage: '94%' },
  ]);

  useEffect(() => {
    if (SPInformation.currentStep) {
      setSteps(
        steps.map((step) => {
          if (step.step === +SPInformation.currentStep) {
            setSPInformation({ ...SPInformation, percntage: step.percntage });
            return { ...step, status: 'active' };
          }
          if (step.step < +SPInformation.currentStep)
            return { ...step, status: 'success' };
          if (step.step > +SPInformation.currentStep) return { ...step, status: 'idle' };
          return step;
        }),
      );
    }
    return null;
  }, [SPInformation.currentStep]);

  return (
    <SPInformationWizardContext.Provider
      value={{ SPInformation, setSPInformation, steps }}
    >
      {children}
    </SPInformationWizardContext.Provider>
  );
};
SPInformationWizardProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default SPInformationWizardProvider;

export const ClearLocalStorage = (name) => {
  localStorage.removeItem(name);
};

export const SetLocalStorage = (name, data) => {
  localStorage.setItem(name, data);
};
