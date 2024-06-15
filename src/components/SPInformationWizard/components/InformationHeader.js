import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { ConfirmationModal } from '../../shared/ConfirmationModal';

const InformationHeader = () => {
  const { messages } = useIntl();
  const [openModal, setOpenModal] = useState(false);
  const history = useHistory();
  const handleNavigate = () => history.push('/');
  return (
    <>
      <section className="wizardheader">
        <div className="wizardheader-title">{messages['rw.title']}</div>
        <div className="wizardheader-btn">
          <button type="button" onClick={() => setOpenModal(true)}>
            {messages['rw.skip']}
          </button>
        </div>
      </section>
      <ConfirmationModal
        setPayload={handleNavigate}
        openModal={openModal}
        setOpenModal={setOpenModal}
        message="rw.skip.message"
        title="rw.skip.title"
        confirmtext="rw.skip"
      />
    </>
  );
};

export default InformationHeader;
