import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Table, List } from 'semantic-ui-react';
import { useIntl } from 'react-intl';

export const EmployeeList = ({ employeTypes }) => {
  const { messages } = useIntl();
  return (
    <Grid.Row>
      <Grid.Column className="col-12">
        <Table celled selectable unstackable structured>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">
                {messages['sAdmin.spDetails.employees.table.name']}
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                {messages['sAdmin.spDetails.employees.table.employeeType']}
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                {messages['sAdmin.spDetails.services.table.services']}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {employeTypes.map(({ id, name, type, serviceNames }) => (
              <Table.Row key={id}>
                <Table.Cell textAlign="center">{name}</Table.Cell>
                <Table.Cell textAlign="center">{type}</Table.Cell>
                <Table.Cell textAlign="center">
                  <List>
                    {serviceNames.length > 0 &&
                      serviceNames.map((service) => <List.Item>{service}</List.Item>)}
                  </List>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Grid.Column>
    </Grid.Row>
  );
};

EmployeeList.propTypes = {
  employeTypes: PropTypes.array,
};
