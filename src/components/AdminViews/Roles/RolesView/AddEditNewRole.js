/* eslint-disable react/prop-types */
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { Col, Modal, Row, Dropdown } from 'react-bootstrap';
import BeutiInput from 'Shared/inputs/BeutiInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddNewRoleSchema } from './AddNewRoleSchema';

export default function AddEditNewRole({
  openModal,
  setOpenModal,
  selectedEmps = [],
  allEmp = [],
  setSelectedEmps = () => {},
  setEditedItem,
  editedItem,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(AddNewRoleSchema),
  });

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
  const closeModal = () => {
    setOpenModal(false);
    clearErrors();
    setEditedItem(false);
  };
  const FormSubmit = (data) => {
    console.log(data);
  };

  return (
    <Modal
      onHide={() => closeModal()}
      show={openModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      className="bootstrap-modal-customizing add-custom-item edit"
    >
      <form onSubmit={handleSubmit(FormSubmit)}>
        <Modal.Header>
          <Modal.Title className="title">
            <FormattedMessage id="roles.add.new.role" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs="6" className="mb-2">
              <BeutiInput
                error={errors?.nameAr?.message}
                useFormRef={register('nameAr')}
                label={<FormattedMessage id="roles.add.new.role.arabic.name" />}
              />
            </Col>
            <Col xs="6" className="mb-2">
              <BeutiInput
                error={errors?.nameEn?.message}
                useFormRef={register('nameEn')}
                label={<FormattedMessage id="roles.add.new.role.english.name" />}
              />
            </Col>
            <Col xs="12" className="mb-2">
              <Dropdown
                id="dropdown-menu-align-end"
                className="booking-headers_first--part_status w-100"
                drop="start"
              >
                <Dropdown.Toggle
                  id="dropdown-autoclose-true"
                  //   disabled={allEmp?.length === 0}
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
                          checked={allEmp?.every((elem) =>
                            selectedEmps?.includes(elem?.id),
                          )}
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
                            setSelectedEmps((current) => [
                              ...current,
                              +event?.target?.value,
                            ]);
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
          </Row>
        </Modal.Body>{' '}
        <Modal.Footer className="justify-content-end">
          <div></div>
          <div className="btns">
            <button type="button" className="btn cancel" onClick={() => closeModal()}>
              <FormattedMessage id="common.cancel" />
            </button>
            <button type="submit" className="btn confirm">
              <FormattedMessage id="common.save" />
            </button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
