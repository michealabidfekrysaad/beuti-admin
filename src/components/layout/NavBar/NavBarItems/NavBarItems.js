import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Image } from 'react-bootstrap';
import { MenuItem, Menu, Button } from '@material-ui/core';
import { redirectUser } from 'functions/redirectUser';
import { useIntl } from 'react-intl';
import logo from 'images/logo.png';
import { UserContext } from 'providers/UserProvider';
import { BranchesContext } from 'providers/BranchesSelections';
import { SideBarContext } from 'providers/SideBarProvider';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import LocaleSwitch from './LocaleSwitch';
import ConfirmSignOutModal from '../ConfirmSignOutModal';
import MultiSelectionBranches from '../../MultiSelectionBranches/MultiSelectionBranches';
import BookingWizardLinksModal from '../BookingWizardLinksModal';

function NavBarItems() {
  const { messages } = useIntl();
  const { setUser, User } = useContext(UserContext);
  const { toggleSideBar } = useContext(SideBarContext);
  const { setBranches, allBranchesData } = useContext(BranchesContext);
  const [branchesWithLink, setBranchesWithLink] = useState([]);
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [bookingLinksOpen, setBookingLinksOpen] = useState(false);

  const [signOut, confirmSignout] = useState(false);
  useEffect(() => {
    if (allBranchesData.length) {
      setBranchesWithLink(
        allBranchesData.map((branch) => ({
          ...branch,
          link: `${process.env.REACT_APP_BW_URL}/salon/${branch?.nameEn?.replaceAll(
            ' ',
            '%20',
          )}/${branch?.id}/`,
        })),
      );
    }
  }, [allBranchesData]);

  useEffect(() => {
    if (signOut) {
      logUserOut();
    }
  }, [signOut]);

  function logUserOut() {
    setUser({ access_token: null, userData: null });
    localStorage.clear();
    redirectUser(location, '/login');
    setBranches([]);
  }
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Row className="justify-content-between align-items-center w-100">
      <Col xs="auto" style={{ padding: '0px 24px' }}>
        <Image src={logo} className="logo" style={{ width: '94px' }} />
      </Col>
      <Col xs="auto" className="d-flex align-items-center">
        {!User?.userData?.isSuperAdmin && <MultiSelectionBranches />}
        <LocaleSwitch />
        <div>
          <Button
            aria-controls="profileDropdown"
            aria-haspopup="true"
            className="pt-0 pb-0"
            onClick={handleClick}
          >
            <section className="nav-profile">
              <div className="nav-profile__name">
                <span className="nav-profile__name-hello">
                  {messages['navbar.hello']}
                </span>
                <span>{User?.userData?.userName || User?.userData?.data?.userName}</span>
              </div>
              <div className="nav-profile__logo">
                {User?.userData?.logo ? (
                  <Image src={logo} className="image" />
                ) : (
                  <div>
                    {User?.userData?.userName?.charAt(0)?.toUpperCase() ||
                      User?.userData?.data?.userName?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="nav-profile__dropdown">
                <SVG src={toAbsoluteUrl('/assets/icons/dropdown.svg')} />
              </div>
            </section>
          </Button>
          <Menu
            id="profileDropdown"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <MenuItem>
              <div className="nav-profile__logo">
                {User?.userData?.logo ? (
                  <Image src={logo} className="image" />
                ) : (
                  <div>
                    {User?.userData?.userName?.charAt(0)?.toUpperCase() ||
                      User?.userData?.data?.userName?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="nav-profile__name">
                <span>{User?.userData?.userName || User?.userData?.data?.userName}</span>
              </div>
            </MenuItem>
            {!User?.userData?.isSuperAdmin && (
              <MenuItem
                onClick={() => {
                  handleClose();
                  setBookingLinksOpen(true);
                }}
              >
                {' '}
                {messages['navbar.share.link']}
              </MenuItem>
            )}
            <MenuItem
              onClick={() => {
                handleClose();
                setOpen(true);
              }}
            >
              {' '}
              {messages['navbar.logout']}
            </MenuItem>
          </Menu>
        </div>
      </Col>
      <ConfirmSignOutModal
        setOpen={setOpen}
        open={open}
        confirmSignout={confirmSignout}
      />
      <BookingWizardLinksModal
        setOpen={setBookingLinksOpen}
        open={!!branchesWithLink?.length && bookingLinksOpen}
        branches={branchesWithLink}
      />
    </Row>
  );
}

export default NavBarItems;
