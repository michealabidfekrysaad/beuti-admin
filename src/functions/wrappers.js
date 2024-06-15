/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext } from 'react';
import { UserContext } from 'providers/UserProvider';
import MainLayout from 'containers/MainLayout';
import SettingsLayout from 'containers/Settings/SettingsLayout';
import BeutiBreadCrumbProvider from '../providers/SiteBreadCurmb';

/**
 * @description Wraps component with Main Layout (Pusher and pushable)
 * @param {Element} component
 * @returns {jsx}
 */

export const wrapWithMainLayout = (component, full) => (
  <MainLayout>
    <div
      className={full ? 'beuti-container' : 'beutiresoulation'}
      style={{ marginTop: '95px' }}
    >
      <BeutiBreadCrumbProvider>{component}</BeutiBreadCrumbProvider>
    </div>
  </MainLayout>
);

export const wrapWithFullLayout = (component, full) => (
  <MainLayout>
    <div className="beuti-container" style={{ marginTop: '95px' }}>
      <BeutiBreadCrumbProvider>{component}</BeutiBreadCrumbProvider>
    </div>
  </MainLayout>
);

export const withoutWrap = (component) => (
  <div className="without-side-nav-container">{component}</div>
);
