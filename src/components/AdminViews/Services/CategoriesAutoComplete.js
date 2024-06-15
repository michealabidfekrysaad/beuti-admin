// *https://www.registers.service.gov.uk/registers/country/use-the-api*
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { useIntl } from 'react-intl';
import { CallAPI } from 'utils/API/APIConfig';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { SERVICE_PROVIDER_CATEGORIES_AUTO_COMPLETE } from 'utils/API/EndPoints/ServiceProviderEP';
import { toast } from 'react-toastify';

export default function CategoriesAutoComplete({
  handleEnNameInput,
  handleArNameInput,
  nameAr,
  useFormRef,
  error,
  searchValue,
  classes = '',
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const { messages, locale } = useIntl();

  const { refetch, isFetching: fetchCategories } = CallAPI({
    name: 'autoCompleteCategorySearch',
    url: SERVICE_PROVIDER_CATEGORIES_AUTO_COMPLETE,
    refetchOnWindowFocus: false,
    query: {
      searchVal: nameAr,
    },
    onSuccess: (res) => {
      if (res?.data?.data) {
        setOptions(res.data.data?.list);
      }
    },
    onError: (err) => toast.error(err?.response?.data),
  });

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    if (searchValue.length >= 3) {
      refetch();
      setOpen(true);
    }
    if (searchValue.length < 3) setOpen(false);
  }, [searchValue]);

  return (
    <>
      <Autocomplete
        id="categoryAutoComplete"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        fullWidth
        className={`categoryAutoCompleteParent ${
          error ? 'categoryAutoCompleteParent__error-happen' : ''
        } ${classes}`}
        getOptionSelected={(option, value) => value.nameAr === option.nameAr}
        getOptionLabel={(option) => `${option.nameAR}`}
        renderOption={(option) => <span>{`${option.nameAr} - ${option.nameEn}`}</span>}
        options={options}
        loading={fetchCategories}
        freeSolo
        disableClearable
        value={{ nameAR: nameAr }}
        onChange={(e, value) => {
          handleArNameInput(value?.nameAr);
          handleEnNameInput(value?.nameEn);
        }}
        renderInput={(params) => (
          <>
            <TextField
              {...params}
              {...useFormRef}
              label={`${messages['wizard.add.new.category.name.ar']} *`}
              InputLabelProps={{
                shrink: false,
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {fetchCategories ? (
                      <CircularProgress
                        color="inherit"
                        size={20}
                        className={`${
                          locale === 'ar' ? 'leftPosition' : 'rightPosition'
                        }`}
                      />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
            {error && <p id="categoryAutoComplete__errormsg">{error}</p>}
          </>
        )}
      />
    </>
  );
}
CategoriesAutoComplete.propTypes = {
  handleEnNameInput: PropTypes.func,
  handleArNameInput: PropTypes.func,
  nameAr: PropTypes.string,
  useFormRef: PropTypes.object,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  searchValue: PropTypes.string,
  classes: PropTypes.string,
};
