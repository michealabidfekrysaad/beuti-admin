import React from 'react';
import SVG from 'react-inlinesvg';
import PropTypes from 'prop-types';
import { toAbsoluteUrl } from '../../functions/toAbsoluteUrl';

const SearchInput = ({
  handleChange,
  handleSubmit,
  placeholder,
  searchValue,
  setSearchValue = () => null,
  className,
  svg,
  clear,
  onFocus = () => null,
}) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      return handleSubmit(e);
    }}
    className="beuti-search"
  >
    <input
      value={searchValue}
      placeholder={placeholder}
      className={className ? ` beuti-search__input ${className}` : 'beuti-search__input'}
      // id="search"
      onFocus={() => onFocus(true)}
      onChange={(e) => handleChange(e.target.value)}
    ></input>

    <button className="beuti-search__submit" type="submit" disabled>
      {svg ? (
        <SVG src={toAbsoluteUrl('/search.svg')} />
      ) : (
        <i className="flaticon-search"></i>
      )}
    </button>
    {clear && setSearchValue && searchValue && (
      <button
        className="beuti-search__clear"
        type="button"
        onClick={() => setSearchValue('')}
      >
        <SVG src={toAbsoluteUrl('/clear.svg')} />
      </button>
    )}
  </form>
);

SearchInput.propTypes = {
  handleChange: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  searchValue: PropTypes.string,
  handleSubmit: PropTypes.func,
  className: PropTypes.string,
  svg: PropTypes.bool,
  clear: PropTypes.bool,
  setSearchValue: PropTypes.func,
};

export default SearchInput;
