import React from 'react';
import { Tab, Segment } from 'semantic-ui-react';
import TableExamplePagination from '../table';

const panes = [
  {
    menuItem: 'Tab 1',
    render: () => (
      <Tab.Pane as={Segment}>
        <TableExamplePagination />
      </Tab.Pane>
    ),
  },
  { menuItem: 'Tab 2', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
  { menuItem: 'Tab 3', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
];

const TabExampleBasic = () => (
  <Tab panes={panes} menu={{ color: 'purple', secondary: true, pointing: true }} />
);

export default TabExampleBasic;
