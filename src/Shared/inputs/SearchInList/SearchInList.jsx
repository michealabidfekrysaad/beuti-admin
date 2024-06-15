/* eslint-disable  */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './SearchInList.scss';
import { FormattedMessage } from 'react-intl';
import { convertMinsToHours } from 'utils/Helpers/TimeHelper';
import { useIntl } from 'react-intl';
import { useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
const SearchInList = ({ list, loading, value, handleSelect, valueId }) => {
  const { messages } = useIntl();
  const [filterdList, setFilterdList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isListActive, setIsListActive] = useState(false);
  const inputRef = useRef();
  useEffect(() => {
    if (!searchValue) {
      return setFilterdList(list);
    }
    return setFilterdList(
      list.flatMap((cate) => {
        const filterdServices = cate.categoryServices.filter(
          (service) =>
            service?.nameAr?.toLowerCase().includes(searchValue.toLowerCase()) ||
            service?.nameEn?.toLowerCase().includes(searchValue.toLowerCase()) ||
            service?.priceWithVat?.toString().includes(searchValue),
        );
        return filterdServices.length
          ? { ...cate, categoryServices: filterdServices }
          : [];
      }),
    );
  }, [searchValue, list]);
  useEffect(() => {
    document.addEventListener('click', (event) => {
      if (!inputRef?.current?.contains(event.target)) {
        setIsListActive(false);
        setSearchValue('');
      }
    });
    return () => document.removeEventListener('click', document);
  }, []);

  return (
    <section className="searchinlist" ref={inputRef}>
      <label className="searchinlist_label" htmlFor="input">
        {messages['booking.flow.service.name']}
      </label>
      <div className="searchinlist_input">
        {isListActive ? (
          <input
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={messages['booking.flow.select.service']}
            value={searchValue}
          />
        ) : (
          <input
            type="text"
            onFocus={() => setIsListActive(true)}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={messages['booking.flow.select.service']}
            value={value}
          />
        )}

        <div>
          {loading ? (
            <CircularProgress size={24} className="mx-auto" color="secondary" />
          ) : (
            <SVG
              src={toAbsoluteUrl('/dropdown.svg')}
              className={isListActive ? 'open dropdownicon' : 'dropdownicon'}
            />
          )}
        </div>
      </div>
      <div className={isListActive ? 'open searchinlist_list' : 'searchinlist_list'}>
        {filterdList?.map((cate, key) => {
          return (
            <>
              <div
                value={cate.categoryDisplayName}
                key={key}
                disabled
                className="searchinlist_list-parent"
              >
                {cate.categoryDisplayName} ({cate?.categoryServices?.length})
              </div>
              {cate.categoryServices.map((serv, i) => (
                <div
                  value={serv.selectId}
                  key={i}
                  id={serv.selectId}
                  selected
                  className={
                    serv.selectId === valueId
                      ? 'selected searchinlist_list-item'
                      : 'searchinlist_list-item'
                  }
                  onClick={(e) => {
                    handleSelect(e.currentTarget.id);
                    setIsListActive(false);
                    setSearchValue('');
                  }}
                >
                  <div className="searchinlist_list-info">
                    <div className="searchinlist_list-info--title">
                      {serv.displayName}
                    </div>
                    <div className="searchinlist_list-info--time">
                      {!!serv?.serviceCount && (
                        <FormattedMessage
                          id="booking.service.count"
                          values={{
                            service: serv?.serviceCount,
                          }}
                        />
                      )}
                      {convertMinsToHours(serv.durationInMinutes, messages)}
                    </div>
                  </div>
                  <div className="searchinlist_list-price">
                    {!!serv?.priceWithOfferAndVat || !!serv?.priceWithVat ? (
                      <FormattedMessage
                        id={
                          serv?.isPriceFrom
                            ? 'booking.service.from'
                            : 'booking.service.current'
                        }
                        values={{
                          price: serv?.priceWithOfferAndVat || serv?.priceWithVat,
                        }}
                      />
                    ) : (
                      messages['booking.service.free']
                    )}
                  </div>
                </div>
              ))}
            </>
          );
        })}
        {!filterdList?.length && (
          <div disabled className="searchinlist_list-item">
            <div className="searchinlist_list-info">
              <div className="searchinlist_list-info--title">No Result Found</div>{' '}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchInList;
SearchInList.propTypes = {
  list: PropTypes.array,
};
