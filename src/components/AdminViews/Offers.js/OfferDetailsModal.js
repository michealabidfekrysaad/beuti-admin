import React from 'react';
import { Modal } from 'react-bootstrap';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const OfferDetailsModal = ({ selectedOffer, open, setOpen }) => (
  <Modal
    onHide={() => {
      setOpen(false);
    }}
    show={open}
    size="xl"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    className="bootstrap-modal-customizing"
  >
    <Modal.Header>
      <Modal.Title id="contained-modal-title-vcenter" className="title">
        {selectedOffer?.offerName}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">
              <FormattedMessage id="spAdmin.bookings.serviceName" />
            </TableCell>
            <TableCell align="center">
              <FormattedMessage id="appointment.service.booking.details.servicePrice" />
            </TableCell>
            <TableCell align="center">
              <FormattedMessage id="booking.details.serviceDuration" />
            </TableCell>
            <TableCell align="center">
              <FormattedMessage id="spAdmin.bookings.bookingType" />
            </TableCell>
            <TableCell align="center">
              <FormattedMessage id="ability.toBook" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedOffer?.serviceList?.length > 0 &&
            selectedOffer.serviceList.map((ser) => (
              <TableRow key={ser.name}>
                <TableCell align="center">{ser.name}</TableCell>
                <TableCell align="center">{ser.price}</TableCell>
                <TableCell align="center">{ser.duration}</TableCell>
                <TableCell align="center">{ser.serviceType}</TableCell>
                <TableCell align="center">{ser.serviceType}</TableCell>
              </TableRow>
            ))}
          {selectedOffer?.serviceList?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center" className="text-info pt-5 ">
                <i className="flaticon-notepad la-2x v-center  mx-2"></i>
                <FormattedMessage id="common.noData" />
              </TableCell>
            </TableRow>
          )}
          {!selectedOffer && (
            <TableRow>
              <TableCell colSpan={5} align="center" className="pt-5">
                <CircularProgress size={24} className="mx-auto" color="secondary" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Modal.Body>
  </Modal>
);

OfferDetailsModal.propTypes = {
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  selectedOffer: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};
export default OfferDetailsModal;
