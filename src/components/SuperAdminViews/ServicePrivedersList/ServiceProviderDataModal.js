import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { Tooltip } from '@material-ui/core';
import Fade from '@material-ui/core/Fade';

const ServiceProviderDataModal = ({ id, selected, setSelected, sp }) => {
  const [open, setOpen] = useState(false);
  const { messages } = useIntl();

  return (
    <>
      <Tooltip arrow TransitionComponent={Fade} title={messages['common.profileC']}>
        <button
          type="button"
          className="icon-wrapper-btn btn-icon-warning mx-1"
          onClick={() => {
            setOpen(true);
            setSelected(id);
          }}
        >
          <i className="flaticon-questions-circular-button text-warning"></i>
        </button>
      </Tooltip>
      <Modal
        show={open}
        size="lg"
        onHide={() => setOpen(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="bootstrap-modal-customizing"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter" className="title">
            <FormattedMessage id="common.profileC" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <section>
            {selected &&
              Object.entries(sp.profileData).map((data) => (
                <div key={data[0]} className="mb-1">
                  {/* eslint-disable-next-line no-extra-boolean-cast */}
                  {data[1] === true ? (
                    <i className="flaticon2-check-mark text-success mx-2"></i>
                  ) : (
                    <i className="flaticon2-delete text-danger mx-2"></i>
                  )}
                  <FormattedMessage id={data[0]} />
                </div>
              ))}
          </section>
        </Modal.Body>
      </Modal>
    </>
  );
};
ServiceProviderDataModal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sp: PropTypes.object,
  selected: PropTypes.object,
  setSelected: PropTypes.func,
};
export default ServiceProviderDataModal;
