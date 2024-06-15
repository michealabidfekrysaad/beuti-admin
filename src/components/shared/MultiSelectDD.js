/* eslint-disable  */

import React from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { Dropdown } from 'react-bootstrap';
import { useIntl } from 'react-intl';

export default function MultiSelectDD({
  selectedStatus,
  setSelectedStatus,
  list,
  placeholder = 'calendar.choose.status',
  selectedAllEnabled,
  className = '',
}) {
  const { messages } = useIntl();
  const renderCorrectChooseStatusorEmp = (which) => {
    if (which === 'status') {
      if (selectedStatus?.length === 0) {
        return messages[placeholder];
      }
      if (selectedStatus?.length === list?.length && selectedAllEnabled) {
        return messages['calendar.all.status'];
      }

      return list
        ?.filter((el) => selectedStatus?.some((select) => el?.id === select))
        ?.map((el) => el?.label)
        .join(', ');
    }
    return null;
  };

  return (
    <Dropdown
      id="dropdown-menu-align-end"
      className={`booking-headers_first--part_status ${className}`}
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
                list?.forEach((state) => {
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
                  selectedStatus?.length < list?.length && selectedStatus?.length
                }
                checked={selectedStatus?.length === list?.length}
              />
            }
            label={messages['calendar.all.status']}
            value={null}
          />
        </div>
        {list?.map((status) => (
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
