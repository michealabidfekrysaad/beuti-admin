import React, { useContext } from 'react';
/* eslint-disable indent */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Col, Row, Image, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { Routes } from 'constants/Routes';
import { Tooltip } from '@material-ui/core';
import Fade from '@material-ui/core/Fade';
import logo from 'images/logo.png';
import SVG from 'react-inlinesvg';
import { SideBarContext } from 'providers/SideBarProvider';
import { UserContext } from 'providers/UserProvider';
import { useIntl } from 'react-intl';
import { adminMenuItems, superAdminMenuItems } from './RouteUrls';
// import spimage from './../../../../../public/spimage.png';
import { toAbsoluteUrl } from '../../../../functions/toAbsoluteUrl';
import DownloadStores from './DownloadStores';

const SidebarCustomized = () => {
  const { sideBar, toggleSideBar } = useContext(SideBarContext);
  const { User } = useContext(UserContext);
  const { messages } = useIntl();
  return (
    <>
      <div className="sidebar sidebar-minimize">
        <section className="sidebar-body">
          <div className="px-0" style={{ width: 'calc(100% - 20px)' }}>
            {User?.userData?.isSuperAdmin
              ? superAdminMenuItems.map((item) => (
                  <Tooltip
                    arrow
                    TransitionComponent={Fade}
                    placement="left"
                    key={item.link}
                    title={
                      <div className="tootltip-sideBar">{messages[item.message]}</div>
                    }
                  >
                    <NavLink
                      to={item.link}
                      activeClassName="sidebar-links-active"
                      className="sidebar-links "
                    >
                      <SVG src={toAbsoluteUrl(item.icon)} />
                      <div className="sidebar-links_title">{messages[item.message]}</div>
                    </NavLink>
                  </Tooltip>
                ))
              : adminMenuItems.map((item) => (
                  <Tooltip
                    arrow
                    TransitionComponent={Fade}
                    placement="left"
                    key={item.link}
                    title={
                      <div className="tootltip-sideBar">{messages[item.message]}</div>
                    }
                  >
                    <NavLink
                      to={item.link}
                      activeClassName="sidebar-links-active"
                      className={`sidebar-links ${item.className}`}
                      exact={item.link === Routes.home}
                    >
                      <SVG src={toAbsoluteUrl(item.icon)} />
                      <div className="sidebar-links_title">{messages[item.message]}</div>
                    </NavLink>
                  </Tooltip>
                ))}
          </div>
          {/* <Col>
            <DownloadStores />
          </Col> */}
        </section>
      </div>
    </>
  );
};

export default SidebarCustomized;
