import 'core-js';
import 'regenerator-runtime/runtime';
import 'react-app-polyfill/ie9';
import 'raf/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import App from 'containers/App';
import UserProvider from 'providers/UserProvider';
import BranchesSelections from 'providers/BranchesSelections';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import ToastifyProvider from 'providers/ToastifyProvider';

import DateFnsUtils from '@date-io/date-fns';
import BookingDateProvider from 'providers/BookingDateProvider';
import AddNewServiceProvider from 'providers/AddNewServiceProvider';
import AuthStepsProvider from 'providers/AuthStepsProvider';
import SPInformationWizardProvider from 'providers/SPInformationWizardProvider';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter } from 'react-router-dom';
// import Bugsnag from '@bugsnag/js';
// import BugsnagPluginReact from '@bugsnag/plugin-react';
import LanguageProvider from './providers/LanguageProvider';
import SideBarProvider from './providers/SideBarProvider';
import { translationMessages } from './i18n';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/_Icons/flaticon/flaticon.css';
import './assets/_Icons/flaticon2/flaticon.css';
import './assets/_Icons/line-awesome/css/line-awesome.css';

import './App.scss';

// Bugsnag.start({
//   apiKey: 'e94da94455720a9f922ffdbcdaa931ed',
//   plugins: [new BugsnagPluginReact()],
// });
const MOUNT_NODE = document.getElementById('root');
const queryClient = new QueryClient();
// const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

const render = (messages) => {
  ReactDOM.render(
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BranchesSelections>
          <LanguageProvider messages={messages}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <BrowserRouter>
                <ToastifyProvider>
                  <AuthStepsProvider>
                    <SPInformationWizardProvider>
                      <BookingDateProvider>
                        <AddNewServiceProvider>
                          <SideBarProvider>
                            <App />
                          </SideBarProvider>
                        </AddNewServiceProvider>
                      </BookingDateProvider>
                    </SPInformationWizardProvider>
                  </AuthStepsProvider>
                </ToastifyProvider>
              </BrowserRouter>
              <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
            </MuiPickersUtilsProvider>
          </LanguageProvider>
        </BranchesSelections>
      </UserProvider>
    </QueryClientProvider>,
    MOUNT_NODE,
  );
};

render(translationMessages);
