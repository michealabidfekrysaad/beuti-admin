import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Routes } from 'constants/Routes';
import Toggle from 'react-toggle';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import noBranchImg from 'images/noBranchImg.png';
import { CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CallAPI } from 'utils/API/APIConfig';
import BeutiInput from 'Shared/inputs/BeutiInput';
import { SP_GET_BRANCHES_INFO } from 'utils/API/EndPoints/BranchManager';

export default function BranchInfoSettings() {
  const { messages, locale } = useIntl();
  const history = useHistory();
  const [branchName, setBranchName] = useState(null);
  const [address, setAddress] = useState(null);
  const [image, setImage] = useState(null);
  const [commNumber, setCommNumber] = useState(null);
  const [businessCat, setBusinessCat] = useState(null);
  const [businessDescEn, setBusinessDescEn] = useState(null);
  const [businessDescAr, setBusinessDescAr] = useState(null);

  /* -------------------------------------------------------------------------- */
  /*                    update branch name in DD when changed                   */
  /* -------------------------------------------------------------------------- */

  const { isFetching: gettingData } = CallAPI({
    name: 'getBranchInfo',
    url: SP_GET_BRANCHES_INFO,
    enabled: true,
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      if (res?.data?.data) {
        setBranchName(
          locale === 'ar' ? res?.data?.data?.nameAR : res?.data?.data?.nameEN,
        );
        setAddress(
          locale === 'ar' ? res?.data?.data?.addressAR : res?.data?.data?.addressEN,
        );
        setCommNumber(res?.data?.data?.communicationNumber);
        setBusinessCat(res?.data?.data?.businessCategory?.name);
        setBusinessDescEn(res?.data?.data?.descriptionEN);
        setBusinessDescAr(res?.data?.data?.descriptionAR);
        setImage(res?.data?.data?.bannerImage);
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  return (
    <>
      <Row className="branchDetails px-3">
        {!gettingData ? (
          <>
            <Col xs={12} className="pb-4">
              <div className="d-flex justify-content-between">
                <section>
                  <p className="title">{messages['settings.branch.header']}</p>
                </section>
                <button
                  onClick={() => history.push(Routes.settingUpdateBranchInfoDetails)}
                  className="btn btn-primary"
                  type="button"
                >
                  {messages['settings.branch.edit.details']}
                </button>
              </div>
            </Col>
            <Col xs={6} className="pb-4">
              {image ? (
                <img
                  alt="thebannerImage"
                  className="branchDetails__branchImg"
                  src={image}
                />
              ) : (
                <img
                  alt="thebannerImage"
                  className="branchDetails__branchImg"
                  src={noBranchImg}
                />
              )}
              <p className="branchDetails__header px-4 mx-1">{branchName}</p>
              <p className="px-4 pb-4 mx-1 branchDetails__info">
                {address || messages['settings.no.information']}
              </p>
            </Col>
            <Col xs={6} className="px-4">
              <Row>
                <Col className="py-4" sm={12} md={12}>
                  <p className="branchDetails__header">
                    {messages['settings.branch.comm.num']}
                  </p>
                  <p className="branchDetails__info">{commNumber}</p>
                </Col>
                <Col className="py-4" sm={12} md={12}>
                  <p className="branchDetails__header">
                    {messages['settings.branch.business.cat']}
                  </p>
                  <p className="branchDetails__info">{businessCat}</p>
                </Col>
              </Row>
            </Col>
            <Col xs={12} className="p-4 border-top mb-4">
              <Row className="p-4 mb-4">
                <Col className="py-4" sm={6}>
                  <p className="branchDetails__header">
                    {messages['settings.branch.desc.en']}
                  </p>
                  <p className="branchDetails__info">
                    {businessDescEn || messages['settings.no.desc']}
                  </p>
                </Col>
                <Col className="py-4" sm={6}>
                  <p className="branchDetails__header">
                    {messages['settings.branch.desc.ar']}
                  </p>
                  <p className="branchDetails__info">
                    {businessDescAr || messages['settings.no.desc']}
                  </p>
                </Col>
              </Row>
            </Col>
          </>
        ) : (
          <Col xs={12} className="text-center mt-5 pt-5">
            <CircularProgress size={24} className="mx-auto" color="secondary" />
          </Col>
        )}
      </Row>
    </>
  );
}
