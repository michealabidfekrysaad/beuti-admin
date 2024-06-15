import React from 'react';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';
import { useIntl } from 'react-intl';

const LoaderExampleText = () => {
  const { messages } = useIntl();
  return (
    <>
      <Segment basic>
        <Dimmer active inverted>
          <Loader inverted>{messages['loader.message']}</Loader>
        </Dimmer>
      </Segment>
    </>
  );
};

export default LoaderExampleText;
