/* eslint-disable  */

import React from 'react';
import './SelectBranchSideIcon.scss';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import {
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormControl,
} from '@material-ui/core';
import { useState } from 'react';
const findBranch = (branches, branch) => !!branches.find((item) => +item === +branch);
const SelectBranchSideIcon = ({
  allBranchesDD,
  branches,
  setBranches,
  singleBranchSelector,
}) => {
  const [show, setShow] = useState(false);

  const handleMultiSelect = (e) => {
    if (findBranch(branches, e.target.value) && branches.length > 1) {
      return setBranches([...branches.filter((branch) => +branch !== +e.target.value)]);
    }
    if (!findBranch(branches, e.target.value)) {
      return setBranches([...branches, +e.target.value]);
    }
    return null;
  };
  const handleSingleSelect = (e) => {
    return setBranches([+e.target.value]);
  };
  return (
    <section
      className={show ? ' selectbranchside show' : 'selectbranchside'}
      onMouseLeave={() => setShow(false)}
    >
      <button className="selectbranchside_icon" onClick={() => setShow(true)}>
        <SVG src={toAbsoluteUrl('/branches.svg')} />
      </button>
      {singleBranchSelector ? (
        <FormControl component="fieldset">
          <ul className="selectbranchside_list">
            <div className="selectbranchside-title">Branches</div>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={+branches[0]}
              onChange={handleSingleSelect}
            >
              {allBranchesDD.map((branch) => (
                <li className="selectbranchside_list-item">
                  <FormControlLabel
                    value={+branch.id}
                    control={<Radio />}
                    label={branch.name}
                  />
                </li>
              ))}
            </RadioGroup>
          </ul>
        </FormControl>
      ) : (
        <ul className="selectbranchside_list">
          <div className="selectbranchside-title">Branches</div>
          {allBranchesDD.map((branch) => (
            <li className="selectbranchside_list-item">
              <FormControlLabel
                control={<Checkbox onChange={handleMultiSelect} name="checkedA" radio />}
                checked={findBranch(branches, branch.id)}
                id={branch.id}
                label={branch.name}
                value={branch.id}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default SelectBranchSideIcon;
