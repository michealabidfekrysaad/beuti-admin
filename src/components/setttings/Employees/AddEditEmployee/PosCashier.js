import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import BeutiInput from 'Shared/inputs/BeutiInput';
import PropTypes from 'prop-types';

import Toggle from 'react-toggle';
const PosCashier = ({ register, errors, setValue, watch }) => {
  const { messages } = useIntl();

  return (
    <Row>
      <Col lg={8} md={6} xs={12} className="mb-5">
        <h3 className="settings__section-title">
          {messages['setting.employee.pos.title']}
        </h3>
        <p className="settings__section-description">
          {messages['setting.employee.pos.description']}
        </p>
      </Col>
      <Col lg={8} md={8} xs={12}>
        <Row className=" align-items-center">
          <Col lg="auto" md={6} xs={12}>
            <div className="settings__section-toggle">
              <Toggle
                id="poscasher"
                icons={{
                  unchecked: null,
                }}
                checked={watch('employee.isCasher')}
                onChange={(e) =>
                  setValue('employee.isCasher', !watch('employee.isCasher'))
                }
              />
              <label htmlFor="poscasher">
                {messages['setting.employee.input.casher']}
              </label>
            </div>
          </Col>
          <Col xs="6" className="mb-4">
            <BeutiInput
              type="text"
              label={messages['setting.employee.input.pincode']}
              useFormRef={register('employee.casherPin')}
              error={watch('employee.isCasher') && errors?.employee?.casherPin?.message}
              note={messages['setting.employee.input.pincode.note']}
              disabled={!watch('employee.isCasher')}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
PosCashier.propTypes = {
  register: PropTypes.func,
  watch: PropTypes.func,
  setValue: PropTypes.func,

  errors: PropTypes.object,
};

export default PosCashier;
