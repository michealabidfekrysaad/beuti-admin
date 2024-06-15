import React, { useState } from 'react';
import { Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import SelectInputMUI from 'Shared/inputs/SelectInputMUI';

const PermissionsView = () => {
  const { messages } = useIntl();
  const [filterPermissions, setFilterPermissions] = useState(0);

  const permissionFilteration = [
    { id: 0, text: messages['common.selectAll'] },
    { id: 1, text: messages['offers.table.status.upcoming'] },
    { id: 2, text: messages['offers.table.status.active'] },
    { id: 3, text: messages['offers.table.status.expired'] },
  ];

  return (
    <div className="roles-views">
      <header className="roles-views__header">
        <div className="roles-views__header-title">
          {messages['roles.route.roles.permissions']}
        </div>
        <div className="roles-views__header-desc">
          <div className="roles-views__header-desc__subtitle">
            {messages['roles.subtitle']}
          </div>
          <div className="roles-views__info-btns">
            <Col xs="12">
              <SelectInputMUI
                list={permissionFilteration}
                value={filterPermissions}
                onChange={(e) => setFilterPermissions(e.target.value)}
              />
            </Col>
          </div>
        </div>
      </header>
      <div className="roles-views__data">PermissionView</div>
    </div>
  );
};

export default PermissionsView;
