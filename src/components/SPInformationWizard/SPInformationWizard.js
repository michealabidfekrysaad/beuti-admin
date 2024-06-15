import React, { useContext, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Route, Switch, Redirect, useHistory, useParams } from 'react-router-dom';
import { Routes } from 'constants/Routes';
import HorizontalStepper from '../../Shared/Steppers/horintazl-stepper';
import NavBar from '../layout/NavBar/index';
import InformationWizardServices from './components/step3-services-categories/InformationWizardServices';
import InformationHeader from './components/InformationHeader';
import IWGeneralDetails from './components/IWGeneralDetails';
import IWWorkingHours from './components/IWWorkingHours';
import { SPInformationWizardContext } from '../../providers/SPInformationWizardProvider';
import IWEmployees from './components/IWEmployees';
import IWUploadImages from './components/IWUploadImages';

const SPInformationWizard = () => {
  const { step } = useParams();
  const { steps, setSPInformation, SPInformation } = useContext(
    SPInformationWizardContext,
  );
  useEffect(() => {
    setSPInformation({ ...SPInformation, currentStep: step });
  }, [step]);
  return (
    <>
      <NavBar />
      <section style={{ marginTop: '80px' }}>
        <InformationHeader />
        <section style={{ width: '70%' }} className="mx-auto">
          <Row className="mb-5">
            <Col xs={12}>
              <HorizontalStepper steps={steps} percantage={SPInformation.percntage} />
            </Col>
          </Row>
          <Switch>
            <Route
              exact
              path={Routes.spinformationwizardStepOne}
              component={IWGeneralDetails}
            />
            <Route
              exact
              path={Routes.spinformationwizardStepTwo}
              component={IWWorkingHours}
            />
            <Route
              exact
              path={Routes.spinformationwizardStepThree}
              component={IWEmployees}
            />
            <Route
              exact
              path={Routes.spinformationwizardStepFour}
              component={InformationWizardServices}
            />
            <Route
              exact
              path={Routes.spinformationwizardStepFive}
              component={IWUploadImages}
            />
            <Redirect from="/information" to={Routes.home} />
          </Switch>
        </section>
      </section>
    </>
  );
};

export default SPInformationWizard;
