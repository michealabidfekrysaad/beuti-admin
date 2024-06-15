/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import BeutiInput from 'Shared/inputs/BeutiInput';
import PackagesAutoComplete from '../PackagesAutoComplete';

export default function PackageDetails({
  handleEnNameInput,
  setnameAR,
  nameAR,
  register,
  setSearchValue,
  searchValue,
  errors,
  getBC,
  BCloading,
  watch,
  BClist,
  EditView,
}) {
  const { messages } = useIntl();
  const categoryComponentRef = useRef(null);
  const getNameOfPackage = (idOfPackage) =>
    BClist?.find((cat) => +cat?.id === +idOfPackage)?.name;

  useEffect(() => {
    if (errors?.categoryID && !errors?.packageAr && !errors?.packageEn) {
      window.scrollTo(0, categoryComponentRef?.current?.offsetTop);
    }
  }, [errors]);
  return (
    <>
      <Row>
        <Col xs={12} className="addPackage-title">
          {messages['package.title']}
        </Col>
        <Col xs={12} className="addPackage-subTitle">
          {messages['package.sub.title']}
        </Col>
      </Row>
      <Row className="pt-4">
        <Col lg="6" xs="12" className=" mb-2">
          <PackagesAutoComplete
            handleEnNameInput={handleEnNameInput}
            handleArNameInput={(value) => setnameAR(value)}
            nameAr={nameAR}
            useFormRef={register(
              'packageAr',
              {
                onChange: (e) => {
                  setnameAR(e.target.value);
                  setSearchValue(e.target.value);
                },
              },
              { shouldValidate: true },
            )}
            error={errors.packageAr?.message}
            searchValue={searchValue}
          />
        </Col>
        <Col lg="6" xs="12" className=" mb-2">
          <BeutiInput
            label={messages['package.en.name']}
            error={errors.packageEn?.message && errors.packageEn?.message}
            useFormRef={register('packageEn')}
          />
        </Col>
        <Col xs={12} className="mb-2" ref={categoryComponentRef}>
          <p
            className={`branchEdit__business ${
              errors?.categoryID ? 'labelCatError' : ''
            }`}
          >
            {messages[`category.DD.label`]}
          </p>
          <button
            type="button"
            className={`beuti-dropdown-modal mt-3 ${
              errors?.categoryID ? 'categoryError' : ''
            }`}
            onClick={getBC}
            disabled={BCloading}
          >
            <span>
              {BCloading ? (
                <div className="spinner-border spinner-border-sm mb-1" />
              ) : (
                watch(`categoryID`) && getNameOfPackage(watch(`categoryID`))
              )}
            </span>
            <span className="primary-color  font-weight-bold">
              {messages[`${EditView ? 'common.edit' : 'common.select'}`]}
            </span>
          </button>
          {!watch(`categoryID`) && (
            <span
              className={`package-cat-place-holder ${errors?.categoryID?.message &&
                'error-found-place-holders'}`}
              onClick={getBC}
            >
              {messages['package.category.place.holder']}
            </span>
          )}

          {errors?.categoryID && (
            <>
              <p className="branches-err-message" style={{ top: '83px' }}>
                {errors?.categoryID?.message}
              </p>
            </>
          )}
        </Col>
      </Row>
    </>
  );
}
