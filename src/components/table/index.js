import React from 'react';
import { Icon, Label, Menu, Table } from 'semantic-ui-react';
import { useIntl } from 'react-intl';

function TableExamplePagination() {
  const { locale } = useIntl();

  return (
    <Table celled basic="very" unstackable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Header</Table.HeaderCell>
          <Table.HeaderCell>Header</Table.HeaderCell>
          <Table.HeaderCell>Header</Table.HeaderCell>
          <Table.HeaderCell>Header</Table.HeaderCell>
          <Table.HeaderCell>Header</Table.HeaderCell>
          <Table.HeaderCell>Header</Table.HeaderCell>
          <Table.HeaderCell>Header</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <Label ribbon>First</Label>
          </Table.Cell>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
        </Table.Row>
      </Table.Body>

      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="3">
            <Menu floated="right" pagination>
              <Menu.Item as="a" icon>
                <Icon name={`chevron ${locale === 'en' ? 'left' : 'right'}`} />
              </Menu.Item>
              <Menu.Item as="a">1</Menu.Item>
              <Menu.Item as="a">2</Menu.Item>
              <Menu.Item as="a">3</Menu.Item>
              <Menu.Item as="a">4</Menu.Item>
              <Menu.Item as="a" icon>
                <Icon name={`chevron ${locale === 'en' ? 'right' : 'left'}`} />
              </Menu.Item>
            </Menu>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
}

export default TableExamplePagination;
