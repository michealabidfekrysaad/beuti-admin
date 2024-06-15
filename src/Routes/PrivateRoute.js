/* eslint-disable indent */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useEffect, Suspense } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Redirect,
  useRouteMatch,
  useLocation,
  matchPath,
  useHistory,
} from 'react-router-dom';
import { UserContext } from 'providers/UserProvider';
import { BranchesContext } from 'providers/BranchesSelections';
import { Routes } from 'constants/Routes';
import { redirectUser } from 'functions/redirectUser';
import MultiSelectionBranches from 'components/layout/MultiSelectionBranches/MultiSelectionBranches';
import SelectOneBranchIdAlert from 'components/shared/SelectOneBranchIdAlert';
import { LocaleContext } from 'providers/LanguageProvider';
const { login } = Routes;

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}
const acceptedPathes = (loca, query) => {
  if (
    loca?.pathname?.includes('/booking/calendar/') ||
    loca?.pathname?.includes('/calendar/sp/') ||
    !!query.get('pos')
  ) {
    return true;
  }
  return false;
};

export function PrivateRoute({ children, ...rest }) {
  const history = useHistory();

  const { User, setUser } = useContext(UserContext);
  const { setLocale } = useContext(LocaleContext);
  const fullLocation = useLocation();
  const query = useQuery();

  useEffect(() => {
    if (acceptedPathes(fullLocation, query)) {
      setLocale(query.get('locale'));
      setUser({
        ...User,
        access_token: query.get('auth'),
      });
      localStorage.setItem('selectedBranches', query.get('selectedBranches'));
    }
  }, [fullLocation]);
  useEffect(() => {
    if (
      history?.location?.pathname === '/' &&
      User.access_token &&
      User.userData &&
      !User.userData.isSuperAdmin
    ) {
      history.push('/booking');
    }
  }, []);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        User.access_token ||
        User.userData ||
        location?.pathname?.includes('/booking/calendar/') ||
        location?.pathname?.includes('/calendar/sp/') ||
        !!query.get('pos') ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export function AdminRoute({ children, ...rest }) {
  let foundOrNot = false;
  const { setBranchesDDChanges, branchesDDChanges, singleBranchesArr } = React.useContext(
    BranchesContext,
  );
  const { User } = useContext(UserContext);

  singleBranchesArr.forEach((element) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const routeMatch = useRouteMatch({
      path: element,
    });
    if (routeMatch?.isExact) foundOrNot = routeMatch?.isExact;
  });

  const checkIfRouteNeedSingleId = () =>
    foundOrNot && JSON.parse(localStorage.getItem('selectedBranches'))?.length > 1;

  useEffect(() => {
    if (branchesDDChanges) {
      setBranchesDDChanges(false);
    }
  }, [branchesDDChanges]);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (checkIfRouteNeedSingleId()) {
          return (
            <>
              <Suspense>{children}</Suspense>
              <SelectOneBranchIdAlert chidlren={<MultiSelectionBranches />} />
            </>
          );
        }
        if (User.access_token && User.userData && !User.userData.isSuperAdmin) {
          return children;
        }
        if (!User.access_token || !User.userData) {
          return redirectUser(location, login);
        }
      }}
    />
  );
}

export function SuperAdminRoute({ children, ...rest }) {
  const { User } = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (User.access_token && User.userData && User.userData.isSuperAdmin) {
          return children;
        }
        if (!User.access_token || !User.userData) {
          return redirectUser(location, login);
        }
      }}
    />
  );
}

PrivateRoute.propTypes = {
  children: PropTypes.element,
};

AdminRoute.propTypes = {
  children: PropTypes.element,
};

SuperAdminRoute.propTypes = {
  children: PropTypes.element,
};
