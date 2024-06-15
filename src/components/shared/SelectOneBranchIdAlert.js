import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import PropTypes from 'prop-types';

export default function SelectOneBranchIdAlert({ chidlren }) {
  const { messages } = useIntl();
  const [focusClass, setFocusClass] = useState('');

  return (
    <button
      type="button"
      className="overlay-DD-branch-select"
      onClick={() => {
        setFocusClass('focused');
        setTimeout(() => {
          setFocusClass('');
        }, 2000);
      }}
    >
      <div className={`${focusClass} overlay-DD-branch-select--body`}>
        {chidlren}
        <div>
          <h5>{messages['multi-select-dialoug-info']}</h5>
        </div>
      </div>
    </button>
  );
}

SelectOneBranchIdAlert.propTypes = {
  chidlren: PropTypes.node,
};
