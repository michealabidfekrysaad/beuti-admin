import React, { useContext, useEffect, useState } from 'react';
import { SideBarContext } from 'providers/SideBarProvider';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Routes } from 'constants/Routes';
import { Card } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '../../functions/toAbsoluteUrl';
import ChangeUsername from '../../components/AdminViews/Settings/ChangeUsername';
import ChangeEmail from '../../components/AdminViews/Settings/ChangeEmail';
import ChangeLocation from '../../components/AdminViews/Settings/ChangeLocation';
import ChangeCity from '../../components/AdminViews/Settings/ChangeCity';
import CertificateNumber from '../../components/AdminViews/Settings/CertificateNumber';
import SPImages from '../../components/AdminViews/Settings/SPImages';
import WorkingHours from '../../components/AdminViews/Settings/WorkingHours/index';
import PrivatePlaces from '../../components/AdminViews/Settings/PrivatePlaces';
import CustomerAppBooking from '.../../components/AdminViews/Settings/CustomerAppBooking/index';
import ChairBooking from '../../components/AdminViews/Settings/ChairBooking';
import EmployeeCommission from '../../components/AdminViews/Settings/EmployeeCommission';
import VAT from '../../components/AdminViews/Settings/VAT';
import SPBookingWizard from '../../components/AdminViews/Settings/SPBookingWizard';
import ReferralCode from '../../components/AdminViews/Settings/ReferralCode';
import ChangeSlogan from '../../components/AdminViews/Settings/Slogan';
import MinPriceHomeService from '../../components/AdminViews/Settings/MinPriceHomeService';
import { breadCrumbContext } from '../../providers/SiteBreadCurmb';

const SettingsLayout = () => {
  const history = useHistory();
  const [scrollY, setScrollY] = useState(0);
  const [expanded, setExpanded] = useState('panel100');
  const scope = 'admin.settings.general';
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function handleBtnTop() {
    setScrollY(window.pageYOffset);
    const topBtn = document.querySelector('#topBtn');
    if (topBtn) {
      if (scrollY > 350) {
        topBtn.style.display = 'block';
      } else {
        topBtn.style.display = 'none';
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleBtnTop);
  });

  const { messages } = useIntl();
  const { sideBar } = useContext(SideBarContext);

  //   const allData = [
  //     {
  //       title: `${messages['admin.settings.ChangeUsername']}`,
  //       icon: `/assets/icons/General/User.svg`,
  //       body: <ChangeUsername callApi={expanded === 'panel0' && 'ture'} />,
  //     },
  //     {
  //       title: `${messages['admin.settings.ChangeEmail']}`,
  //       icon: `/assets/icons/Communication/Readed-mail.svg`,
  //       body: <ChangeEmail callApi={expanded === 'panel1' && 'ture'} />,
  //     },
  //     {
  //       title: `${messages['admin.settings.SalonLocation']}`,
  //       icon: `/assets/icons/Map/Marker1.svg`,
  //       body: <ChangeLocation callApi={expanded === 'panel2' && 'ture'} />,
  //     },
  //     {
  //       title: `${messages['admin.settings.ChangeCity']}`,
  //       icon: `/assets/icons/Layout/Layout-right-panel-1.svg`,
  //       body: <ChangeCity callApi={expanded === 'panel3' && 'ture'} />,
  //     },
  //     {
  //       title: `${messages['admin.settings.CertificateNumber']}`,
  //       icon: `/assets/icons/Files/Selected-file.svg`,
  //       body: <CertificateNumber callApi={expanded === 'panel4' && 'ture'} />,
  //     },
  //     {
  //       title: `${messages['admin.settings.minPrice']}`,
  //       icon: `/assets/icons/Shopping/Dollar.svg`,
  //       body: <MinPriceHomeService callApi={expanded === 'panel5' && 'ture'} />,
  //     },
  //     {
  //       title: `${messages['admin.settings.SPImages']}`,
  //       icon: `/assets/icons/Design/Image.svg`,
  //       body: <SPImages callApi={expanded === 'panel6' && 'ture'} />,
  //     },
  //     {
  //       title: `${messages['common.workingHours']}`,
  //       icon: `/assets/icons/Devices/Watch2.svg`,
  //       body: <WorkingHours callApi={expanded === 'panel7' && 'ture'} />,
  //     },
  //     {
  //       title: `${messages['admin.settings.TogglePrivatePlacesStatus']}`,
  //       icon: `/assets/icons/Map/Direction2.svg`,
  //       body: <PrivatePlaces callApi={expanded === 'panel8' && 'ture'} />,
  //     },
  //     {
  //       title: `${messages['admin.settings.onlineBookingStatus']}`,
  //       icon: `/assets/icons/Shopping/Wallet.svg`,
  //       body: <CustomerAppBooking callApi={expanded === 'panel9' && 'ture'} />,
  //     },
  //     {
  //       title: `${messages['spAdmin.bookings.chairsList']}`,
  //       icon: `/assets/icons/Home/Chair1.svg`,
  //       body: <ChairBooking callApi={expanded === 'panel10' && 'ture'} />,
  //     },
  //     {
  //       title: `${messages['admin.settings.employeeCommision.header']}`,
  //       icon: `/assets/icons/Shopping/Money.svg`,
  //       body: <EmployeeCommission callApi={expanded === 'panel11' && 'ture'} />,
  //     },
  //     {
  //       title: `${messages['common.vat']}`,
  //       icon: `/assets/icons/Design/Pen-tool-vector.svg`,
  //       body: <VAT callApi={expanded === 'panel12' && 'ture'} />,
  //     },
  //     {
  //       title: `${messages['admin.settings.bookinglink']}`,
  //       icon: `/assets/icons/Navigation/Up-right.svg`,
  //       body: <SPBookingWizard callApi={expanded === 'panel13' && 'ture'} />,
  //     },
  //     {
  //       title: `${messages['admin.settings.ReferralCode']}`,
  //       icon: `/assets/icons/Shopping/Barcode.svg`,
  //       body: <ReferralCode callApi={expanded === 'panel14' && 'ture'} />,
  //     },
  //     {
  //       title: `${messages['admin.settings.Slogan']}`,
  //       icon: `/assets/icons/Communication/Write.svg`,
  //       body: <ChangeSlogan callApi={expanded === 'panel15' && 'ture'} />,
  //     },
  //   ];

  const dataSectionsGeneral = [
    {
      title: `${messages[`${scope}.SP`]}`,
      route: Routes.settingsSP,
      details: `${messages[`${scope}.SP.details`]}`,
    },
    {
      title: `${messages[`${scope}.home`]}`,
      route: Routes.settingSectionCenter,
      details: `${messages[`${scope}.home.details`]}`,
    },
    {
      title: `${messages[`sAdmin.spDetails.images`]}`,
      //   icon: `/assets/icons/General/User.svg`,
      route: Routes.settingSectionImages,
      details: `${messages[`${scope}.images.details`]}`,
    },
    {
      title: `${messages[`${scope}.finance`]}`,
      route: Routes.settingSectionFinance,
      details: `${messages[`${scope}.finance.details`]}`,
    },
    {
      title: `${messages[`${scope}.online.reserve`]}`,
      //   icon: `/assets/icons/General/User.svg`,
      body: <ChangeEmail callApi={expanded === 'panel1' ? 'ture' : false} />,
      route: Routes.settingSectionOnline,
      details: `${messages[`${scope}.online.reserve.details`]}`,
    },
  ];
  const statusSection = [
    {
      title: `${messages[`${scope}.status`]}`,
      route: Routes.settingSectionStatus,
      details: `${messages[`${scope}.SP.details`]}`,
    },
  ];

  const chairsSections = [
    {
      title: `${messages[`${scope}.chairs`]}`,
      route: Routes.settingSectionChairs,
      details: `${messages[`${scope}.chairs.details`]}`,
    },
  ];
  const { setBreadCrumbController } = useContext(breadCrumbContext);
  useEffect(() => {
    setBreadCrumbController({ tabs: ['setting'], type: 1 });
    return () => setBreadCrumbController({ type: 0 });
  }, []);
  return (
    <>
      <Card className="mb-5">
        <Card.Header>
          <h3 className="title">{messages['sidebar.admin.spSettings']}</h3>
        </Card.Header>
        <Card.Body>
          <div className="title-primary">
            {messages['admin.settings.general.settings']}
          </div>
          {dataSectionsGeneral.map((data, index) => (
            <div
              key={data.title}
              //   expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              onClick={() => history.push(data.route)}
              role="presentation"
              className="settings-design"
            >
              <>
                <h3 className="settings-design__header">{data.title}</h3>
                <p className="settings-design__details">{data.details}</p>
              </>
            </div>
          ))}
        </Card.Body>
        <Card.Body className="mt-5">
          <div className="title-primary">
            {messages['admin.settings.status.settings']}
          </div>
          {statusSection.map((data, index) => (
            <div
              key={data.title}
              //   expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              onClick={() => history.push(data.route)}
              role="presentation"
              className="settings-design"
            >
              <div>
                <h3 className="settings-design__header">{data.title}</h3>
                <p className="settings-design__details">{data.details}</p>
              </div>
            </div>
          ))}
        </Card.Body>
        <Card.Body className="mt-5">
          <div className="title-primary">{messages['spAdmin.bookings.chairsList']}</div>
          {chairsSections.map((data, index) => (
            <div
              key={data.title}
              onChange={handleChange(`panel${index}`)}
              onClick={() => history.push(data.route)}
              role="presentation"
              className="settings-design"
            >
              <div>
                <h3 className="settings-design__header">{data.title}</h3>
                <p className="settings-design__details">{data.details}</p>
              </div>
            </div>
          ))}
        </Card.Body>
      </Card>
      <button
        className="alignBtn"
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }}
        type="button"
        id="topBtn"
      >
        <SVG src={toAbsoluteUrl(`/assets/icons/Navigation/Arrow-to-up.svg`)} />
      </button>
    </>
  );
};

export default SettingsLayout;
