/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react';
import { UserContext } from 'providers/UserProvider';
import AdminHomePage from 'components/HomaPage/AdminHomePage';
import SuperAdminHomePage from 'components/HomaPage/SuperAdminHomePage';

function HomePage() {
  const { User } = useContext(UserContext);

  return (
    <>
      <div>
        {User?.userData?.isSuperAdmin ? <SuperAdminHomePage /> : <AdminHomePage />}
      </div>
    </>
  );
}

export default HomePage;
