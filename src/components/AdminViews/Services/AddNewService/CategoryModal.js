/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import SearchInput from 'components/shared/searchInput';
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { Controller } from 'react-hook-form';

const CategoryModal = ({
  show,
  setShow,
  setSelectedBC,
  list,
  selectedBC,
  register,
  indexing,
  allBranches,
  setValue,
  getValues,
  control,
}) => {
  const { messages, locale } = useIntl();
  const [allCategories, setAllCategories] = useState(list || []);
  const [categorySelected, setCategorySelected] = useState({
    id: null,
    name: '',
    description: '',
  });

  useEffect(() => {
    if (selectedBC?.id) {
      setCategorySelected(list?.find((element) => element?.id === selectedBC?.id));
    }
    if (show) {
      localStorage.setItem(
        'schemaAddService',
        JSON.stringify(getValues('branchesCheckboxes')),
      );
    }
    if (list) setAllCategories(list);
  }, [show]);

  const closeTheModalWithoutSave = () => {
    setValue('branchesCheckboxes', JSON.parse(localStorage.getItem('schemaAddService')));
    setSearchValue(null);
    localStorage.removeItem('schemaAddService');
    setShow(false);
    setCategorySelected({
      id: '',
      name: '',
      description: '',
    });
  };
  const [searchValue, setSearchValue] = useState(null);

  useEffect(() => {
    if (!searchValue) {
      setAllCategories(list);
    } else {
      const searchBy = searchValue.toLowerCase().trim();
      setAllCategories(
        list.filter(
          (cat) =>
            (cat?.description && cat?.description.toLowerCase().includes(searchBy)) ||
            (cat?.nameAr && cat?.nameAr.toLowerCase().includes(searchBy)) ||
            (cat?.nameEn && cat?.nameEn.toLowerCase().includes(searchBy)) ||
            (cat?.name && cat?.name.toLowerCase().includes(searchBy)),
        ),
      );
    }
  }, [searchValue]);

  return (
    <Modal
      onHide={() => {
        closeTheModalWithoutSave();
      }}
      show={show}
      className="registermodal-wrapper"
    >
      <Modal.Body className="categoryModal">
        <div className="categoryModal-title mt-4">{messages['category.modal.title']}</div>
        <div className="categoryModal-subtitle">
          {messages['category.modal.sub.title']}
        </div>
        <div className="categoryModal-search">
          <SearchInput
            handleChange={setSearchValue}
            searchValue={searchValue}
            placeholder={messages['category.modal.search']}
          />
        </div>
        <div className="categoryModal-scrolling">
          {allCategories?.length > 0 ? (
            allCategories.map((item) => (
              <Controller
                key={item?.id}
                control={control}
                className="beuti"
                name={`branchesCheckboxes[${allBranches.findIndex(
                  (el) => +el.branchId === +indexing,
                )}].categoryID`}
                render={({ field }) => (
                  <RadioGroup aria-label="category" {...field}>
                    <Row className="categoryModal-holder">
                      <Col xs={12} key={item.id}>
                        <FormControlLabel
                          value={`${[item?.id, item?.name]}`}
                          id={item?.id}
                          control={<Radio />}
                          checked={
                            `${[item?.id, item?.name]}` ===
                            getValues(
                              `branchesCheckboxes[${allBranches.findIndex(
                                (el) => +el.branchId === +indexing,
                              )}].categoryID`,
                            )
                          }
                          label={
                            <>
                              <div className="categoryModal-holder_catName">
                                {item.name}
                              </div>
                              <div className="categoryModal-holder_catDesc">
                                {item.description}
                              </div>{' '}
                            </>
                          }
                        />
                      </Col>
                    </Row>
                  </RadioGroup>
                )}
              />
            ))
          ) : (
            <div className="text-center my-3">{messages['category.no.found']}</div>
          )}
        </div>
        <div className="businessModal-footer">
          <Button
            type="button"
            className="btn btn-grey"
            onClick={() => {
              closeTheModalWithoutSave();
            }}
          >
            {messages[`common.cancel`]}
          </Button>
          <Button
            type="submit"
            onClick={() => {
              localStorage.removeItem('schemaAddService');
              setSelectedBC(categorySelected);
              setShow(false);
              setSearchValue(null);
            }}
          >
            {messages[`category.select.modal`]}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
CategoryModal.propTypes = {
  show: PropTypes.bool,
  list: PropTypes.array,
  selectedBC: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  setSelectedBC: PropTypes.func,
  setShow: PropTypes.func,
  register: PropTypes.func,
  indexing: PropTypes.number,
  allBranches: PropTypes.array,
  setValue: PropTypes.func,
  getValues: PropTypes.func,
  control: PropTypes.func,
};
export default CategoryModal;
