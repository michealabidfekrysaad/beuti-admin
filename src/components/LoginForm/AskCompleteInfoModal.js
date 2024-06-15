/* eslint-disable prefer-template */
import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from 'providers/UserProvider';
import { BranchesContext } from 'providers/BranchesSelections';
import { Routes } from 'constants/Routes';
import { useHistory } from 'react-router-dom';
import { FormControl, Select, Input, MenuItem } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';
import image from 'images/completeInfo.png';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';

import { Modal } from 'react-bootstrap';

export function AskCompleteInfoModal({ openModal, setOpenModal }) {
  const { User, setUser } = useContext(UserContext);
  const { setBranchesDDChanges } = useContext(BranchesContext);
  const [branches, setBranches] = useState([]);
  const [onlyOneBranch, setOnlyOneBranch] = useState(false);
  const [allBranchesDD, setAllBranchesDD] = useState([]);
  const history = useHistory();
  const { messages } = useIntl();
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 8,
        width: 250,
      },
    },
  };

  const handleSelectBranches = (event) => {
    setBranches(JSON.parse('[' + event.target.value + ']'));
  };

  useEffect(() => {
    if (branches.length > 0) {
      localStorage.setItem('selectedBranches', JSON.stringify(branches));
    }
    setBranchesDDChanges(true);
  }, [branches]);

  useEffect(() => {
    if (
      !User?.userData?.profileCompleted &&
      User?.userData?.notCompletedBranches?.length > 0
    ) {
      // if has only one branch not show DD
      if (User?.userData?.notCompletedBranches?.length === 1) {
        setBranches(
          JSON.parse(localStorage.getItem('selectedBranches')) || [
            User?.userData?.notCompletedBranches[0].id,
          ],
        );
        setAllBranchesDD(User?.userData?.notCompletedBranches);
        setOnlyOneBranch(
          User?.userData?.notCompletedBranches?.find(
            (data) =>
              data.id ===
              ((JSON.parse(localStorage.getItem('selectedBranches')) &&
                JSON.parse(localStorage.getItem('selectedBranches'))[0]) ||
                User?.userData?.notCompletedBranches[0]?.id),
          ),
        );
      } else {
        if (User?.userData?.notCompletedBranches?.length > 1) {
          setBranches(
            JSON.parse(localStorage?.getItem('selectedBranches'))[0] || [
              User?.userData?.notCompletedBranches[0].id,
            ],
          );
        }
        // save to localStorage if morethan one branch selected from previous page
        localStorage.setItem(
          'selectedBranches',
          '[' + JSON.parse(localStorage.getItem('selectedBranches'))[0] + ']',
        );
        setAllBranchesDD(User?.userData?.notCompletedBranches);
      }
    }
  }, [User]);

  return (
    <>
      <Modal
        onHide={() => {
          setOpenModal(false);
          setUser({
            ...User,
            userData: { ...User.userData, profileCompleted: true },
          });
        }}
        show={openModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="bootstrap-modal-customizing"
      >
        <Modal.Body className="text-center">
          {/* <img alt="notFound-img" src={image} /> */}
          <SVG src={toAbsoluteUrl('/compeleteprofile.svg')} />
          <h3 className="py-2">{messages['complete.info.title']}</h3>
          <p className="py-2 w-50 mx-auto font-weight-bold">
            {messages['complete.info.sub.title']}
          </p>
          {!onlyOneBranch ? (
            <FormControl className="multi-select-branches">
              <Select
                className="label-place"
                labelId="mutiple-name-label"
                id="mutiple-name-DD"
                value={branches}
                onChange={handleSelectBranches}
                input={<Input />}
                MenuProps={MenuProps}
              >
                {allBranchesDD?.map((name) => (
                  <MenuItem key={name.key} value={name.id}>
                    {name.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <p>
              {messages['complete.info.branch.found']} : {onlyOneBranch.name}
            </p>
          )}
        </Modal.Body>
        <Modal.Footer className="pt-3">
          <button
            type="button"
            className="px-4 cancel"
            onClick={() => {
              setOpenModal(false);
              setUser({
                ...User,
                userData: { ...User.userData, profileCompleted: true },
              });
            }}
          >
            <FormattedMessage id="common.skip.now" />
          </button>
          <button
            type="button"
            onClick={() => {
              history.push(Routes.spinformationwizardStepOne);
              setUser({
                ...User,
                userData: { ...User.userData, profileCompleted: true },
              });
            }}
            className="px-4 confirm"
          >
            <FormattedMessage id="common.setup.now" />
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

AskCompleteInfoModal.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
};
