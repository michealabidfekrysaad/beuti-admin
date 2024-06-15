/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { CallAPI } from 'utils/API/APIConfig';
import noBranchImg from 'images/noBranchImg.png';
import { useIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { SP_GET_USER_BRANCHES } from 'utils/API/EndPoints/BranchManager';
import { ADD_BRANCHES_CATEGORY } from 'utils/API/EndPoints/ServiceProviderEP';
import BeutiButton from 'Shared/inputs/BeutiButton';
import BeutiInput from '../../../../Shared/inputs/BeutiInput';
import BeutiTextArea from '../../../../Shared/inputs/BeutiTextArea';
import CategoriesAutoComplete from '../CategoriesAutoComplete';
import { AddNewCategorySchema } from './AddNewCategorySchema';

export default function AddNewCategory() {
  const { messages } = useIntl();
  const history = useHistory();
  const [allBranches, setAllBranches] = useState([]);
  const [nameAR, setnameAR] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const schemaCategoriesValidations = AddNewCategorySchema();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schemaCategoriesValidations),
  });

  const handleEnNameInput = (value) => {
    setValue('categoriesEn', value, { shouldValidate: true });
  };

  useEffect(() => {
    if (localStorage.getItem('selectedBranches')) {
      setValue(
        'checkbox',
        JSON.parse(localStorage.getItem('selectedBranches')).map((single) =>
          single.toString(),
        ),
        { shouldValidate: true },
      );
    }
  }, [localStorage.getItem('selectedBranches')]);

  const { isFetching: fetchingBranches } = CallAPI({
    name: 'allBracnhesForAddCat',
    url: SP_GET_USER_BRANCHES,
    refetchOnWindowFocus: false,
    enabled: true,
    onSuccess: (res) => {
      if (res?.list?.length > 1) {
        setAllBranches(
          res?.list
            .map((branch) => ({
              value: branch.id,
              branchId: branch.id,
              name: branch.name,
              address: branch.address,
              image: branch?.bannerImage,
              selected:
                branch.id ===
                JSON.parse(localStorage.getItem('selectedBranches')).find(
                  (el) => el === branch.id,
                ),
            }))
            .sort((a, b) => {
              if (a?.selected && !b?.selected) return -1;
              if (!a?.selected && b?.selected) return 1;
              return 0;
            }),
        );
      } else {
        setAllBranches([]);
      }
    },
    select: (res) => res?.data?.data,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  const { refetch, isFetching: fetchAddNew } = CallAPI({
    name: 'addNewCategoryForSErvices',
    url: ADD_BRANCHES_CATEGORY,
    method: 'post',
    // retry: 1,
    onSuccess: (data) => {
      if (data?.data?.data.success) {
        toast.success(messages['common.success']);
        history.goBack();
      }
    },
    body: {
      nameAr: nameAR,
      nameEn: watch('categoriesEn'),
      descriptionAr: watch('categoryDescAr') || null,
      descriptionEn: watch('categoryDescEn') || null,
      branchIds: watch('checkbox'),
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  return !fetchingBranches ? (
    <form onSubmit={handleSubmit(() => refetch())} className="pb-5 mb-5">
      <Row className="informationwizard py-2">
        <Col xs={12} className="informationwizard__title catTitle">
          {messages['newCategory.title']}
        </Col>
        <Col xs={12} className="informationwizard__subtitle">
          {messages['newCategory.subtitle']}
        </Col>
      </Row>
      <Row className="pt-2">
        <Col lg="6" xs="12" className="mt-2 mb-2">
          <CategoriesAutoComplete
            handleEnNameInput={handleEnNameInput}
            handleArNameInput={(value) => setnameAR(value)}
            nameAr={nameAR}
            useFormRef={register('categoriesAr', {
              onChange: (e) => {
                setnameAR(e.target.value);
                setSearchValue(e.target.value);
              },
            })}
            error={errors.categoriesAr?.message}
            searchValue={searchValue}
            classes="catLabel"
          />
        </Col>
        <Col lg="6" xs="12" className="mt-2 mb-2">
          <BeutiInput
            label={`${messages['wizard.add.new.category.name.en']} *`}
            error={errors.categoriesEn?.message && errors.categoriesEn?.message}
            useFormRef={register('categoriesEn')}
            labelClass="catLabelInput"
          />
        </Col>
      </Row>
      <hr className="w-100" />
      {allBranches?.length > 1 && (
        <>
          <Row className="informationwizard pt-3">
            <Col xs={12} className="informationwizard__title catBranches">
              {messages['newCategory.branches.title']}
            </Col>
            <Col xs={12} className="informationwizard__subtitle catBranchesLabel">
              {messages['newCategory.branches.subTitle']}
            </Col>
            {allBranches?.map((branch) => (
              <Col key={branch?.branchId} lg={4} sm={6} className="py-4">
                <Row>
                  <Col xs={1}>
                    <input
                      value={branch?.value}
                      className="informationwizard__checkbox custom-color mt-3"
                      type="checkbox"
                      {...register('checkbox')}
                      id={branch?.branchId}
                    />
                  </Col>
                  <Col xs={10} className="branchesHolder">
                    <label
                      htmlFor={branch.branchId}
                      className="informationwizard__branchName d-flex"
                    >
                      {branch?.image ? (
                        <img
                          width="50"
                          height="50"
                          className="mx-2"
                          src={branch.image}
                          alt={branch.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = noBranchImg;
                          }}
                        />
                      ) : (
                        <img
                          width="50"
                          height="50"
                          className="mx-2"
                          src={noBranchImg}
                          alt={branch.name}
                        />
                      )}
                      <div>
                        <span className="branchName">{branch.name}</span>
                        <p className="address">
                          {branch.address ||
                            messages['branches.display.branches.address']}
                        </p>
                      </div>
                    </label>
                  </Col>
                </Row>
              </Col>
            ))}
            {errors.checkbox?.message && (
              <Col xs="12">
                <p
                  className="beuti-input__errormsg"
                  style={{ position: 'relative', bottom: '15px' }}
                >
                  {errors.checkbox?.message}
                </p>
              </Col>
            )}
          </Row>
          <hr className="w-100" />
        </>
      )}
      <Row className="informationwizard pt-4">
        <Col xs={12} className="informationwizard__title">
          {messages['newCategory.description']}
        </Col>
        <Col xs={12} className="informationwizard__subtitle">
          {messages['newCategory.description.sub.title']}
        </Col>
      </Row>
      <Row className="pt-2">
        <Col lg="6" xs="12" className="mt-2 mb-2">
          <BeutiTextArea
            type="text"
            label={`${messages['newCategory.desc.ar']}`}
            useFormRef={register('categoryDescAr')}
            error={errors.categoryDescAr?.message}
            note={messages['newCategory.desc.min.max.note']}
            labelClass="catDescLabel"
          />
        </Col>
        <Col lg="6" xs="12" className="mt-2 mb-2">
          <BeutiTextArea
            type="text"
            label={`${messages['newCategory.desc.en']}`}
            useFormRef={register('categoryDescEn')}
            error={errors.categoryDescEn?.message}
            note={messages['newCategory.desc.min.max.note']}
            labelClass="catDescLabel"
          />
        </Col>
      </Row>
      <Row>
        <Col className="text-center informationwizard__footer" xs="12">
          <button
            type="button"
            onClick={() => history.goBack()}
            className="informationwizard__footer--previous catCancel"
          >
            {messages['common.cancel']}
          </button>
          <BeutiButton
            text={messages['common.save']}
            type="submit"
            className="informationwizard__footer--submit catSave"
            loading={fetchingBranches || fetchAddNew}
            disabled={fetchingBranches || fetchAddNew}
          />
        </Col>
      </Row>
    </form>
  ) : (
    <div className="loading"></div>
  );
}
