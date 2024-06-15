import React from 'react';
import PropTypes from 'prop-types';
import { Placeholder } from 'semantic-ui-react';

export function LoadingProfile({ fluid, type }) {
  return type === 'profile' ? (
    <Placeholder fluid={fluid || false}>
      <Placeholder.Header image>
        <Placeholder.Line />
        <Placeholder.Line />
      </Placeholder.Header>
      <Placeholder.Paragraph>
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
      </Placeholder.Paragraph>
    </Placeholder>
  ) : (
    <Placeholder fluid={fluid || false}>
      <Placeholder.Paragraph>
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
      </Placeholder.Paragraph>
      <Placeholder.Paragraph>
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
      </Placeholder.Paragraph>
    </Placeholder>
  );
}

LoadingProfile.propTypes = {
  fluid: PropTypes.bool,
  type: PropTypes.string.isRequired,
};
