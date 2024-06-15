/* eslint-disable  */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useIntl } from 'react-intl';
import { useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
const QuickSaleSearch = ({ list, loading, value, handleSelect, valueId, disabled }) => {
  const { messages } = useIntl();
  const [filterdList, setFilterdList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isListActive, setIsListActive] = useState(false);
  const inputRef = useRef();
  useEffect(() => {
    if (!searchValue && list) {
      return setFilterdList(list);
    }
    console.log(filterdList);
    return setFilterdList(
      list?.flatMap((cate) => {
        const filterdServices = cate.items.filter(
          (service) =>
            // service?.keyWords
            //   ?.map((key) => key.toLowerCase())
            //   .includes(searchValue.toLowerCase()) ||
            service?.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
            service?.priceWithVat?.toString().includes(searchValue),
        );
        return filterdServices.length ? { ...cate, items: filterdServices } : [];
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
    <section className="searchinlist beuti-search" ref={inputRef}>
      <div className="searchinlist_input">
        {isListActive ? (
          <input
            disabled={disabled}
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={messages['booking.flow.select.service']}
            value={searchValue}
          />
        ) : (
          <input
            type="text"
            disabled={disabled}
            onFocus={() => setIsListActive(true)}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={messages['booking.flow.select.service']}
            value={value}
          />
        )}

        <div>
          {loading && (
            <CircularProgress size={24} className="mx-auto" color="secondary" />
          )}
        </div>
        <button className="beuti-search__submit" type="submit" disabled>
          <SVG src={toAbsoluteUrl('/search.svg')} />
        </button>
        {!loading && searchValue && (
          <button
            className="beuti-search__clear"
            type="button"
            onClick={() => setSearchValue('')}
          >
            <SVG src={toAbsoluteUrl('/clear.svg')} />
          </button>
        )}
      </div>
      <div className={isListActive ? 'open searchinlist_list' : 'searchinlist_list'}>
        {filterdList?.map((cate, key) => {
          return (
            <>
              <div
                value={cate.name}
                key={key}
                disabled
                className="searchinlist_list-parent"
              >
                {cate.name} ({cate?.items?.length})
              </div>
              {cate?.items?.map((serv, i) => (
                <div
                  value={serv.id}
                  key={i}
                  id={serv.id}
                  selected
                  className={
                    serv.id === valueId
                      ? 'selected searchinlist_list-item'
                      : 'searchinlist_list-item'
                  }
                  onClick={(e) => {
                    handleSelect({
                      id: serv.id,
                      isFrom: serv.isFrom,
                      isOffer: serv.isOffer,
                      name: serv.name,
                      price: serv.price,
                      priceAfterOffer: null,
                      type: cate.identify,
                    });
                    setIsListActive(false);
                    setSearchValue('');
                  }}
                >
                  <div className="searchinlist_list-info">
                    <div className="searchinlist_list-info--title">
                      {serv.name} {serv?.availableStock && `- ${serv.availableStock} pcs`}
                    </div>
                  </div>
                  <div className="searchinlist_list-price">
                    {!!serv?.priceAfterDiscount || !!serv?.price ? (
                      <FormattedMessage
                        id={
                          serv?.isFrom
                            ? 'booking.service.from'
                            : 'booking.service.current'
                        }
                        values={{
                          price: serv?.priceAfterDiscount || serv?.price,
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

export default QuickSaleSearch;
QuickSaleSearch.propTypes = {
  list: PropTypes.array,
};
