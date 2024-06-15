/* eslint-disable */

import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { CallAPI } from 'utils/API/APIConfig';
import VerifyFreelanceNumber from 'containers/Settings-new-design/VerifyFreelanceNumber';
import { SP_GET_USER_BRANCHES } from 'utils/API/EndPoints/BranchManager';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import SectionSetting from './SectionSetting';
import { settingRoutes } from './Routes';

export default function SettingsNewDesgin() {
  const [openModal, setOpenModal] = useState(false);
  const { messages } = useIntl();

  const { isLoading, data: isBrandOwner } = CallAPI({
    name: 'getAllBranches',
    url: SP_GET_USER_BRANCHES,
    refetchOnWindowFocus: false,
    enabled: true,
    select: (res) => res.data.data.isBrandOwner,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  return (
    <>
      {!isLoading && (
        <>
          <div className="setting">
            <Row>
              {settingRoutes?.map((section) => (
                <Col xs={12} lg={section.width} className="setting--section">
                  <div className="setting--section__wrapper">
                    {section.hasHeader && (
                      <div className="setting--section__header">
                        <h3>{messages[section.title]}</h3>
                        <p>{messages[section.description]}</p>
                      </div>
                    )}
                    <Row>
                      {section?.tabs?.map((tab) =>
                        !tab.isBranchOwnerRequired ? (
                          <Col xs={12} lg={section.width === 12 ? 6 : 12}>
                            <SectionSetting
                              image={tab.image}
                              header={messages[tab.header]}
                              info={messages[tab.info]}
                              link={tab.link}
                              onClick={
                                tab?.onClick && tab.onClick(() => setOpenModal(true))
                              }
                            />
                          </Col>
                        ) : isBrandOwner ? (
                          <Col xs={12} lg={section.width === 12 ? 6 : 12}>
                            <SectionSetting
                              image={tab.image}
                              header={messages[tab.header]}
                              info={messages[tab.info]}
                              link={tab.link}
                            />
                          </Col>
                        ) : (
                          <></>
                        ),
                      )}
                    </Row>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
          <VerifyFreelanceNumber setOpenModal={setOpenModal} openModal={openModal} />
        </>
      )}

      {isLoading && <div className="loading mt-5 pt-5"></div>}
    </>
  );
}
