// *https://www.registers.service.gov.uk/registers/country/use-the-api*
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import useAPI, { get } from 'hooks/useAPI';
import { CallAPI } from 'utils/API/APIConfig';
import { useIntl } from 'react-intl';

import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { SERVICE_PROVIDER_PACKAGES_AUTO_COMPLETE } from 'utils/API/EndPoints/ServiceProviderEP';
import { toast } from 'react-toastify';

export default function PackagesAutoComplete({
  handleEnNameInput,
  handleArNameInput,
  nameAr,
  useFormRef,
  error,
  searchValue,
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const { messages, locale } = useIntl();

  const { refetch, isFetching: fetchServices } = CallAPI({
    name: 'autoCompletePackagesSearch',
    url: SERVICE_PROVIDER_PACKAGES_AUTO_COMPLETE,
    refetchOnWindowFocus: false,
    query: {
      name: nameAr,
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
    if (searchValue?.length >= 3) {
      refetch();
      setOpen(true);
    }
    if (searchValue?.length < 3) setOpen(false);
  }, [searchValue]);

  return (
    <Autocomplete
      id="serviceAutoComplete"
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      fullWidth
      className={`serviceAutoCompleteParent ${
        error ? 'serviceAutoCompleteParent__error-happen' : ''
      }`}
      getOptionSelected={(option, value) => value.nameAR === option.nameAR}
      getOptionLabel={(option) => `${option.nameAR}`}
      renderOption={(option) => <span>{`${option.nameAR} - ${option.nameEN}`}</span>}
      options={options}
      loading={fetchServices}
      freeSolo
      disableClearable
      value={{ nameAR: nameAr }}
      onChange={(e, value) => {
        handleArNameInput(value?.nameAR);
        handleEnNameInput(value?.nameEN);
      }}
      renderInput={(params) => (
        <>
          <TextField
            {...params}
            {...useFormRef}
            label={messages['package.ar.name']}
            InputLabelProps={{
              shrink: false,
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {fetchServices ? (
                    <CircularProgress
                      color="inherit"
                      size={20}
                      className={`${locale === 'ar' ? 'leftPosition' : 'rightPosition'}`}
                    />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
          {error && <p id="serviceAutoComplete__errormsg">{error}</p>}
        </>
      )}
    />
  );
}
PackagesAutoComplete.propTypes = {
  handleEnNameInput: PropTypes.func,
  handleArNameInput: PropTypes.func,
  nameAr: PropTypes.string,
  useFormRef: PropTypes.object,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  searchValue: PropTypes.string,
};
