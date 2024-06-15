import React from 'react';
import { Image, Message as Alert, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

export function ImagesList({ images }) {
  const { messages } = useIntl();

  return (
    <>
      {images && images.length > 0 ? (
        <Segment basic>
          <Image.Group size="medium">
            {images.map((image) => (
              <Image src={image} />
            ))}
          </Image.Group>
        </Segment>
      ) : (
        <Segment basic>
          <Alert> {messages['common.noData']}</Alert>
        </Segment>
      )}
    </>
  );
}

ImagesList.propTypes = {
  images: PropTypes.array,
};
