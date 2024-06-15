import React from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

const ImageDropDown = ({ image, makeBannerCall, moveToFeatureCall, deleteImageCall }) => {
  const { messages } = useIntl();
  return (
    <Dropdown
      id="dropdown-menu-align-end"
      className="updatephotos__featured--list-item--dropdown"
      drop="start"
    >
      <Dropdown.Toggle id="dropdown-autoclose-true">
        <i className="flaticon-more text-default" />
      </Dropdown.Toggle>
      <Dropdown.Menu className="updatephotos__featured--list-item--dropdown-menu">
        {image.isFeatured && !image.isDefault && (
          <Dropdown.Item as={Button} eventKey="1" onClick={makeBannerCall}>
            {messages['setting.photos.Banner']}
          </Dropdown.Item>
        )}
        <Dropdown.Item as={Button} eventKey="2" onClick={moveToFeatureCall}>
          {image.isFeatured
            ? messages['setting.photos.move.to.gallary']
            : messages['setting.photos.move.to.featured']}
        </Dropdown.Item>
        <Dropdown.Item as={Button} eventKey="3" onClick={deleteImageCall}>
          {messages['setting.photos.delete']}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
ImageDropDown.propTypes = {
  image: PropTypes.object,
  makeBannerCall: PropTypes.func,
  moveToFeatureCall: PropTypes.func,
  deleteImageCall: PropTypes.func,
};
export default ImageDropDown;
