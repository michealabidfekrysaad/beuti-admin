/* eslint-disable  */

import React from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { Row, Col, Dropdown, Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';

export default function CustomerBookingDD({ selectedStatus, setSelectedStatus }) {
  const { messages, locale } = useIntl();
  const renderCorrectChooseStatusorEmp = (which) => {
    if (which === 'status') {
      if (selectedStatus?.length === 0) {
        return messages['calendar.choose.status'];
      }
      if (selectedStatus?.length === bookingStatusChoose?.length) {
        return messages['calendar.all.status'];
      }

      return bookingStatusChoose
        ?.filter((el) => selectedStatus?.some((select) => el?.id === select))
        ?.map((el) => el?.label)
        .join(', ');
    }
    return null;
  };

  const bookingStatusChoose = [
    {
      key: 2,
      id: 1,
      valu: 1,
      label: messages['customer.booking.confirmed'],
    },
    {
      key: 0,
      id: 3,
      value: 3,
      label: messages['customer.booking.completed'],
    },
    {
      key: 1,
      id: 4,
      valu: 4,
      label: messages['customer.booking.pending'],
    },
    {
      key: 4,
      id: 2,
      valu: 2,
      label: messages['customer.booking.cancelled'],
    },
    {
      key: 4,
      id: 6,
      valu: 6,
      label: messages['customer.booking.noShow'],
    },
  ];
  return (
    <Dropdown
      id="dropdown-menu-align-end"
      className="booking-headers_first--part_status"
      drop="start"
    >
      <Dropdown.Toggle
        className="booking-headers_first--part_status-btn"
        id="dropdown-autoclose-true"
      >
        <div>{renderCorrectChooseStatusorEmp('status')}</div>
      </Dropdown.Toggle>
      <Dropdown.Menu className="booking-headers_first--part_status-drop">
        <div className="booking-headers_first--part_status-drop_holder">
          <FormControlLabel
            onClick={(event) => {
              event.stopPropagation();
              if (event?.target?.checked?.toString() === 'true') {
                setSelectedStatus([]);
                bookingStatusChoose?.forEach((state) => {
                  setSelectedStatus((current) => [...current, +state?.id]);
                });
              }
              if (event?.target?.checked?.toString() === 'false') {
                setSelectedStatus([]);
              }
            }}
            onFocus={(event) => event.stopPropagation()}
            control={
              <Checkbox
                color="primary"
                indeterminate={
                  selectedStatus?.length < bookingStatusChoose?.length &&
                  selectedStatus?.length
                }
                checked={selectedStatus?.length === bookingStatusChoose?.length}
              />
            }
            label={messages['calendar.all.status']}
            value={null}
          />
        </div>
        {bookingStatusChoose?.map((status) => (
          <div className="booking-headers_first--part_status-drop_holder">
            <FormControlLabel
              onClick={(event) => {
                event.stopPropagation();
                if (event?.target?.checked?.toString() === 'true') {
                  setSelectedStatus((current) => [...current, +event?.target?.value]);
                }
                if (event?.target?.checked?.toString() === 'false') {
                  setSelectedStatus(
                    selectedStatus?.filter((el) => el !== +event?.target?.value),
                  );
                }
              }}
              onFocus={(event) => event.stopPropagation()}
              control={
                <Checkbox
                  color="primary"
                  checked={selectedStatus?.some((el) => el === status?.id)}
                />
              }
              label={status?.label}
              value={status?.id}
            />
          </div>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}