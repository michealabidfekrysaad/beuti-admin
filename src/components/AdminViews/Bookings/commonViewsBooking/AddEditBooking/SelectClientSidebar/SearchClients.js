import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import SearchInput from '../../../../../shared/searchInput';

const SearchClient = ({ setSearchValue, searchValue, handleFoucs }) => {
  const { messages } = useIntl();

  return (
    <SearchInput
      onFocus={handleFoucs}
      handleChange={setSearchValue}
      setSearchValue={setSearchValue}
      searchValue={searchValue}
      placeholder={messages['booking.sidebar.search']}
      svg
      clear
    />
  );
};
SearchClient.propTypes = {
  searchValue: PropTypes.string,
  setSearchValue: PropTypes.func,
  handleFoucs: PropTypes.func,
};
export default SearchClient;
