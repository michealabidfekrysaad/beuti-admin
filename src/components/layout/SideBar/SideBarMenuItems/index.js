import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Menu, Icon, Image, Segment, Grid } from 'semantic-ui-react';
import { redirectUser } from 'functions/redirectUser';
import { UserContext } from 'providers/UserProvider';
import { Routes } from 'constants/Routes';
import logo from 'images/logo.png';
import LocaleToggle from 'components/localeToggle';
import { BranchesContext } from 'providers/BranchesSelections';

function SideBar() {
  const { User, setUser } = useContext(UserContext);
  const { setBranches } = useContext(BranchesContext);

  const { messages } = useIntl();
  const location = useLocation();

  function logUserOut() {
    setUser({ access_token: null, userData: null });
    localStorage.clear();
    redirectUser(location, '/login');
    setBranches([]);
  }

  return (
    <>
      <Image src={logo} id="menu-logo" />
      {User.userData && User.userData.isSuperAdmin
        ? superAdminMenuItems.map((item) => menuItemView(item, messages))
        : adminMenuItems.map((item) => menuItemView(item, messages))}
      <Segment basic textAlign="center">
        <Grid centered columns={2} textAlign="center">
          <Grid.Row centered>
            <Grid.Column textAlign="center">
              <LocaleToggle color="#eeeeee" flag />
            </Grid.Column>
            <Grid.Column>
              <div
                role="button"
                tabIndex="0"
                onClick={logUserOut}
                onKeyDown={logUserOut}
                className="locale-toggle"
                style={{ color: '#eeeeee' }}
              >
                {messages['navbar.logout']}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </>
  );
}

const superAdminScope = 'sidebar.sadmin';
const adminScope = 'sidebar.admin';
const superAdminMenuItems = [
  {
    message: `${superAdminScope}.serviceProviders`,
    icon: 'users',
    link: '/service-providers/view/1',
  },
  {
    message: `${superAdminScope}.WalletRechargetransactions`,
    icon: 'money bill alternate icon',
    link: '/wallet-recharge/view/1',
  },
  {
    message: `${superAdminScope}.generalCenterType`,
    icon: 'fork',
    link: Routes.generalCenterType,
  },
  {
    message: `${superAdminScope}.CenterType`,
    icon: 'gg',
    link: Routes.centerType,
  },
  {
    message: `${superAdminScope}.categories`,
    icon: 'tags',
    link: Routes.categories,
  },
  {
    message: `${superAdminScope}.cities`,
    icon: 'map',
    link: Routes.cities,
  },
  {
    message: `${superAdminScope}.bookings`,
    icon: 'ticket',
    link: Routes.bookingsList,
  },

  {
    message: `${superAdminScope}.cancelledBookings`,
    icon: 'cancel',
    link: Routes.cancelledBookingsList,
  },
  {
    message: `${superAdminScope}.promoCodes`,
    icon: 'certificate',
    link: Routes.promoCodes,
  },
  {
    message: `${superAdminScope}.announces`,
    icon: 'send',
    link: Routes.announces,
  },
];

const adminMenuItems = [
  {
    message: `${adminScope}.employeesList`,
    icon: 'users',
    link: Routes.employeesList,
  },
  {
    message: `sAdmin.spDetails.services.table.services`,
    icon: 'tags',
    link: Routes.servicesList,
  },
  {
    message: `sAdmin.spDetails.services.table.bookings`,
    icon: 'ticket',
    link: Routes.dayBookings,
  },
  {
    message: 'products.sidebar',
    icon: 'boxes',
    link: Routes.productList,
  },
  {
    message: 'spAdmin.bookings.customersList',
    icon: 'user',
    link: Routes.customersList,
  },
  {
    message: 'voucher.title',
    icon: 'gift',
    link: Routes.voucherList,
  },
  {
    message: `offersList`,
    icon: 'percent',
    link: Routes.offersList,
  },
  {
    message: `kpis.chairs`,
    icon: 'map marker alternate',
    link: Routes.chairsList,
  },
];

function menuItemView(item, messages) {
  const { message, icon, link } = item;
  return (
    <Link to={link} key={item.icon}>
      <Menu.Item as="h4">
        <Icon name={`${icon}`} className="menu-icon" />
        {messages[message]}
      </Menu.Item>
    </Link>
  );
}

export default SideBar;
