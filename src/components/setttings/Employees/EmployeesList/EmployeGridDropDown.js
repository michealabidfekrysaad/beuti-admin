import React from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

const EmployeeGridDropDown = ({ handleDelete, id }) => {
  const { messages } = useIntl();
  const history = useHistory();

  return (
    <Dropdown
      id="dropdown-menu-align-end"
      className="employees-grid__item--dropdown"
      drop="ledt"
    >
      <Dropdown.Toggle id="dropdown-autoclose-true">
        <i className="flaticon-more text-default" />
      </Dropdown.Toggle>
      <Dropdown.Menu className="employees-grid__item--dropdown-menu">
        <Dropdown.Item
          as={Button}
          eventKey="1"
          onClick={() => history.push(`/settings/settingEmployees/editEmployee/${id}`)}
        >
          {messages['common.edit']}
        </Dropdown.Item>
        <Dropdown.Item
          as={Button}
          eventKey="2"
          className="text-danger"
          onClick={() => handleDelete(id)}
        >
          {messages['common.delete']}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

EmployeeGridDropDown.propTypes = {
  id: PropTypes.number,
  handleDelete: PropTypes.func,
};
export default EmployeeGridDropDown;
