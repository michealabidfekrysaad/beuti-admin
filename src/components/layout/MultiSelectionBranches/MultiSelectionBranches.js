/* eslint-disable  */
/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useContext, useState } from 'react';
import { BranchesContext } from 'providers/BranchesSelections';
import { matchPath, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { useIntl } from 'react-intl';
import Input from '@material-ui/core/Input';
import { CallAPI } from 'utils/API/APIConfig';
import { toast } from 'react-toastify';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { UserContext } from 'providers/UserProvider';
import {
  SP_GET_USER_BRANCHES,
  SP_GET_Branches_missing,
} from 'utils/API/EndPoints/BranchManager';
import SelectInputMUI from '../../../Shared/inputs/SelectInputMUI';
import SelectBranchSideIcon from '../../shared/SelectBranchSideIcon/SelectBranchSideIcon';

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};

export default function MultiSelectionBranches() {
  const { User, setUser } = useContext(UserContext);
  const history = useHistory();
  const { messages } = useIntl();
  const fullLocation = useLocation();
  const {
    setBranchesDDChanges,
    singleBranchesArr,
    hideBranchesArr,
    callProfileCompleted,
    setCallProfileCompleted,
    branches,
    setBranches,
    allBranchesData,
    setAllBranchesData,
  } = useContext(BranchesContext);
  const [singleBranchSelector, setSingleBranchSelector] = useState(false);
  const [hideBranchSelector, setHideBranchSelector] = useState(false);
  const handleRouteChecker = (urlPaths, setter) => {
    for (let route of urlPaths) {
      const routeMatch = matchPath(history.location.pathname, {
        path: route,
        exact: true,
        strict: false,
      });
      if (routeMatch?.isExact) return setter(routeMatch?.isExact);
    }
    return setter(false);
  };
  const { refetch: recallProfileCompleted } = CallAPI({
    name: 'userCompleteProfileOrNot',
    url: SP_GET_Branches_missing,
    refetchOnWindowFocus: false,
    cacheTime: 1000,
    onSuccess: (res) => {
      if (res) {
        if (res?.data?.data) {
          // add here if the user is complete profile or not
          setUser({
            ...User,
            userData: {
              ...User.userData,
              profileCompleted: res.data.data?.list?.length === 0,
              notCompletedBranches:
                res.data.data?.list?.length > 0 &&
                res.data.data.list.map((bran, index) => ({
                  ...bran,
                  key: index + 1,
                })),
            },
          });
        }
      }
    },
  });

  const { refetch } = CallAPI({
    name: 'getAllBranches',
    url: SP_GET_USER_BRANCHES,
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      if (res?.data?.data?.list) {
        setAllBranchesData(
          res.data.data.list.map((singleBranch, index) => ({
            ...singleBranch,
            key: index + 1,
          })),
        );

        setBranches(
          JSON.parse(localStorage.getItem('selectedBranches')) || [
            res?.data?.data?.list[0]?.id,
          ],
        );
        setCallProfileCompleted(false);
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  useEffect(() => {
    if (refetch && !User?.userData?.isSuperAdmin) {
      refetch();
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                     show the  selected branches in  DD                     */
  /* -------------------------------------------------------------------------- */
  const handleSelectBranches = (event) => {
    if (event.target.value.length > 0) {
      singleBranchSelector
        ? setBranches(JSON.parse('[' + event.target.value + ']'))
        : setBranches(event.target.value);
    } else {
      singleBranchSelector
        ? setBranches(JSON.parse('[' + event.target.value + ']'))
        : setBranches([allBranchesData[0].id]);
    }
  };

  // work when change dropdown from ask to complete info for wizard
  //   main idea work on change branch manager from table of branches
  // useEffect(() => {
  //   if (localStorage.getItem('selectedBranches')) {
  //     setBranches(JSON.parse(localStorage.getItem('selectedBranches')));
  //   }
  // }, [localStorage.getItem('selectedBranches')]);

  //   call request of GetBranchesWithMissingInfo by flag from branchSelection provider
  useEffect(() => {
    if (
      localStorage.getItem('userData') &&
      callProfileCompleted &&
      !hideIfSuperAdmin() &&
      recallProfileCompleted
    ) {
      recallProfileCompleted();
    }
  }, [localStorage.getItem('userData'), callProfileCompleted]);
  /* -------------------------------------------------------------------------- */
  /*               save the data to the localSrorage every change               */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (
      branches.length > 0 &&
      !hideIfSuperAdmin() &&
      !fullLocation?.pathname?.includes('information')
    ) {
      localStorage.setItem('selectedBranches', JSON.stringify(branches));
    }
    setBranchesDDChanges(true);
    // add label all branches selected in dom when user select all branches for multiple
    if (
      allBranchesData?.length > 1 &&
      allBranchesData?.length === branches?.length &&
      document.querySelector('#mutiple-name-DD')
    ) {
      const element = document.querySelector('#mutiple-name-DD');
      //  bec. dom render with span at first then text to prevent crash
      if (document.querySelector('#mutiple-name-DD').children?.length === 0) {
        element.innerHTML = messages['mulit-select-all-selected'];
      }
    }
  }, [branches, hideIfSuperAdmin]);

  const hideIfSuperAdmin = () =>
    User?.userData?.isSuperAdmin && 'hide-dropdown-multi-select';
  /* -------------------------------------------------------------------------- */
  /*               check if url found in array of single branch id              */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    handleRouteChecker(singleBranchesArr, setSingleBranchSelector);
    handleRouteChecker(hideBranchesArr, setHideBranchSelector);
    history.listen(() => {
      handleRouteChecker(singleBranchesArr, setSingleBranchSelector);
      handleRouteChecker(hideBranchesArr, setHideBranchSelector);
    });
  }, []);

  return (
    <>
      {!!allBranchesData.length && (
        <div className={hideIfSuperAdmin() || 'DD-select-branch '}>
          {singleBranchSelector ? (
            <SelectInputMUI
              list={allBranchesData.map((branch) => ({
                id: branch.id,
                text: branch.name,
              }))}
              className="w-100"
              value={branches.length === 1 ? branches[0] : ''}
              onChange={handleSelectBranches}
              disabled={hideBranchSelector}
            />
          ) : (
            <div className="beutiselect">
              <Select
                className="beutiselect-dropdown"
                labelId="mutiple-name-label"
                id="mutiple-name-DD"
                multiple
                value={branches}
                onChange={handleSelectBranches}
                input={<Input />}
                MenuProps={MenuProps}
                disabled={hideBranchSelector}
              >
                {allBranchesData.map((name) => (
                  <MenuItem key={name.key} value={name.id}>
                    {name.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}
        </div>
      )}
      {/* {!hideBranchSelector && !!allBranchesData.length && (
          <SelectBranchSideIcon
            allBranchesDD={allBranchesData}
            branches={branches}
            setBranches={setBranches}
            singleBranchSelector={singleBranchSelector}
          />
        )} */}
    </>
  );
}
