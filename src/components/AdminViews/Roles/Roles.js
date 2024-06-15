import React, { useState } from 'react';
import { Routes } from 'constants/Routes';
import { Redirect, Route, Switch } from 'react-router-dom';
import RolesRouting from './RolesRouting/RolesRouting';
import RolesView from './RolesView/RolesView';
import PermissionsView from './PermissionsView/PermissionsView';

export default function Roles() {
  const [collapseWidth, setCollapseWidth] = useState(false);

  return (
    <section style={{ marginTop: '-15px' }}>
      <div className={`minmiz-roles ${!collapseWidth ? 'push-roles' : 'no-push'}`}>
        <RolesRouting collapseWidth={collapseWidth} setCollapseWidth={setCollapseWidth} />
        <div className="roles">
          <Switch>
            <Route exact path={Routes.roles} render={() => <RolesView />} />
            <Route exact path={Routes.permissions} render={() => <PermissionsView />} />
            <Redirect from="/" to={Routes.roles} />
          </Switch>
        </div>
      </div>
    </section>
  );
}
