import React, { useEffect, useState } from 'react';
import SVG from 'react-inlinesvg';
import { Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import useAPI, { get, put } from 'hooks/useAPI';
import RolesCertificates from './RolesCertificates';
import { toAbsoluteUrl } from '../../../functions/toAbsoluteUrl';
import { DisableSpecialityModal } from './DisableSpecialityModal';

const FreelanceCertificates = () => {
  const { messages, locale } = useIntl();
  const [roles, setRoles] = useState([]);
  const [approvedSpec, setApprovedSpec] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const [success, setSucces] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRoleID, setSelectedRoleID] = useState(null);
  const [specId, setSpecId] = useState(null);
  const [selectedRoleIDPreperation, setSelectedRoleIDPreperation] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const freelanceCertificate = 'freelance.certificate';
  const btnStyle = { minWidth: '190px', minHeight: '27px' };

  const {
    response: getRolesRes,
    isLoading: loadingRoles,
    setRecall: recallRoles,
  } = useAPI(get, `FreelanceCertificate/GetRoles`);

  const {
    response: updateCertificateRes,
    isLoading: loadingUpdate,
    setRecall: recallUpdateCertificate,
  } = useAPI(put, `FreelanceCertificate/UpdateFreelanceCertificateValidity`);

  const { response: approvedSpecialityRes, setRecall: recallApprovedSpeciality } = useAPI(
    get,
    `FreelanceCertificate/GetFreelanceApprovedSpeciality`,
  );

  const { response: disableSpec, setRecall: recallDisableSpec } = useAPI(
    put,
    `FreelanceCertificate/DisableSpeciality?specialityId=${specId}`,
  );

  useEffect(() => {
    recallRoles(true);
    recallApprovedSpeciality(true);
  }, []);

  useEffect(() => {
    if (getRolesRes?.data) {
      setRoles(getRolesRes?.data?.roles);
    }
  }, [getRolesRes]);

  useEffect(() => {
    if (approvedSpecialityRes?.data?.list) {
      setApprovedSpec(approvedSpecialityRes?.data?.list);
    } else if (approvedSpecialityRes?.error) {
      notify(approvedSpecialityRes?.error?.message, 'error');
    }
  }, [approvedSpecialityRes]);

  useEffect(() => {
    if (updateCertificateRes?.data?.success) {
      setSucces(true);
      setTimeout(() => {
        setSucces(false);
      }, [3000]);
      notify(messages[`freelance.certificate.autoCheckSuccess`]);
    } else if (updateCertificateRes?.error) {
      notify(updateCertificateRes?.error?.message, 'error');
    }
  }, [updateCertificateRes]);

  /* -------------------------------------------------------------------------- */
  /*                  used for disable speciality on the x btn                  */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    //   after success diasble close the accordion and call whole role to render
    if (disableSpec?.data?.success) {
      recallApprovedSpeciality(true);
      setExpanded('panel0');
      setSelectedRoleID(selectedRoleIDPreperation);
      notify(messages[`${freelanceCertificate}.disable.success`]);
      setSpecId(null);
    } else if (disableSpec?.error?.message) {
      notify(disableSpec?.error?.message, 'error');
      setSpecId(null);
    }
  }, [disableSpec]);

  function handleBtnTop() {
    setScrollY(window.pageYOffset);
    const topBtn = document.querySelector('#topBtn');
    if (topBtn) {
      if (scrollY > 400) {
        topBtn.style.display = 'block';
      } else {
        topBtn.style.display = 'none';
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleBtnTop);
  });

  const notify = (message, error) => {
    if (error) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  return (
    <>
      <Card className="mb-5">
        <Card.Header>
          <div className="title">{messages['sidebar.sadmin.FreelanceCertificates']}</div>
          <Button
            variant="primary"
            style={btnStyle}
            className="px-4 text-center"
            disabled={loadingUpdate || success}
            onClick={() => {
              recallUpdateCertificate(true);
            }}
          >
            {messages['freelance.certificate.auto.check']}
          </Button>
        </Card.Header>
        <Card.Body className="freelance-certificates">
          <Card.Title className="mb-2">
            {approvedSpec?.length > 0 &&
              approvedSpec.map((singleSpec) => (
                <>
                  <span
                    key={singleSpec.id}
                    className={`rounded-approved-specialities p-2 ${
                      locale === 'ar' ? 'ml-3' : 'mr-3'
                    }`}
                  >
                    {locale === 'ar'
                      ? singleSpec.specialityName
                      : singleSpec.specialityNameEN}{' '}
                    <button
                      title={messages['freelance.certificate.disable']}
                      className="delete-speciality"
                      type="button"
                      onClick={() => {
                        setOpenDeleteModal(true);
                        setSpecId(singleSpec.specialityId);
                        setSelectedRoleIDPreperation(singleSpec.roleId);
                      }}
                    >
                      x{' '}
                    </button>
                  </span>
                </>
              ))}
          </Card.Title>
          <RolesCertificates
            roles={roles}
            loadingRoles={loadingRoles}
            recallApprovedSpeciality={recallApprovedSpeciality}
            expanded={expanded}
            setExpanded={setExpanded}
            selectedRoleID={selectedRoleID}
            setSelectedRoleID={setSelectedRoleID}
          />
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
      <DisableSpecialityModal
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        recallDisableSpec={recallDisableSpec}
        setSpecId={setSpecId}
        message="freelance.certificate.confirm.disable.home"
      />
    </>
  );
};

export default FreelanceCertificates;
