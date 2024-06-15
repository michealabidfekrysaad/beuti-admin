import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

function Loading({ small }) {
  return (
    <Segment basic padded={false}>
      <div className="wrapper">
        <div className="comment br animate w80"></div>
        {!small && <div className="comment br animate"></div>}
        <div className="comment br animate"></div>
        <div className="comment br animate w80"></div>
        {!small && <div className="comment br animate"></div>}
        {!small && <div className="comment br animate"></div>}
        {!small && <div className="comment br animate w80"></div>}
      </div>
    </Segment>
  );
}

Loading.propTypes = {
  small: PropTypes.bool,
};

export default Loading;
