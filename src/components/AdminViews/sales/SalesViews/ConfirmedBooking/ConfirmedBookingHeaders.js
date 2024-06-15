/* eslint-disable react/prop-types */

import SearchInput from 'components/shared/searchInput';
import React from 'react';
import { Row, Col, Dropdown } from 'react-bootstrap';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { useIntl } from 'react-intl';
import SelectInputMUI from 'Shared/inputs/SelectInputMUI';

export default function ConfirmedBookingHeaders({
  searchValue,
  setSearchValue,
  allEmp,
  selectedEmps,
  setSelectedEmps,
  selectedTime,
  setSelectedTime,
  selectedtimeOptions,
}) {
  const { messages } = useIntl();
  const renderCorrectChooseStatusorEmp = () => {
    if (
      selectedEmps?.length === 0 ||
      selectedEmps?.length > allEmp?.length ||
      selectedEmps?.length === allEmp?.length
    ) {
      return messages['calendar.all.employeees'];
    }

    return allEmp
      ?.filter((el) => selectedEmps?.some((select) => el?.id === select))
      ?.map((el) => el?.text)
      .join(', ');
  };

  return (
    <section className="booking--header">
      <Row>
        <Col md="6" xs="6">
          <SearchInput
            handleChange={setSearchValue}
            searchValue={searchValue}
            placeholder={messages['sales.confirmed.booking.search.place.holder']}
          />
        </Col>
        <Col md="3" xs="6">
          <Dropdown
            id="dropdown-menu-align-end"
            className="booking-headers_first--part_status w-100"
            drop="start"
          >
            <Dropdown.Toggle
              className="booking-headers_first--part_status-btn"
              id="dropdown-autoclose-true"
              disabled={allEmp?.length === 0}
            >
              <div>{renderCorrectChooseStatusorEmp()}</div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="booking-headers_first--part_status-drop">
              {/* choose all employees */}
              <div className="booking-headers_first--part_status-drop_holder">
                <FormControlLabel
                  onClick={(event) => {
                    event.stopPropagation();
                    if (event?.target?.checked?.toString() === 'true') {
                      setSelectedEmps([]);
                      allEmp?.forEach((state) => {
                        setSelectedEmps((current) => [...current, +state?.id]);
                      });
                    }
                    if (event?.target?.checked?.toString() === 'false') {
                      setSelectedEmps([]);
                    }
                  }}
                  onFocus={(event) => event.stopPropagation()}
                  control={
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selectedEmps?.length < allEmp?.length && selectedEmps?.length
                      }
                      checked={allEmp?.every((elem) => selectedEmps?.includes(elem?.id))}
                    />
                  }
                  label={messages['calendar.all.employeees']}
                  value={null}
                />
              </div>
              {allEmp?.map((emp) => (
                <div className="booking-headers_first--part_status-drop_holder">
                  <FormControlLabel
                    onClick={(event) => {
                      event.stopPropagation();
                      if (event?.target?.checked?.toString() === 'true') {
                        setSelectedEmps((current) => [...current, +event?.target?.value]);
                      }
                      if (event?.target?.checked?.toString() === 'false') {
                        setSelectedEmps(
                          selectedEmps?.filter((el) => el !== +event?.target?.value),
                        );
                      }
                    }}
                    onFocus={(event) => event.stopPropagation()}
                    control={
                      <Checkbox
                        color="primary"
                        checked={selectedEmps?.some((el) => el === emp?.id)}
                      />
                    }
                    label={emp?.text}
                    value={emp?.id}
                  />
                </div>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md="3" xs="6">
          <SelectInputMUI
            className="booking-headers_first--part_views"
            list={selectedtimeOptions}
            value={selectedTime}
            onChange={(e) => {
              setSelectedTime(e?.target?.value);
            }}
          />
        </Col>
      </Row>
    </section>
  );
}
