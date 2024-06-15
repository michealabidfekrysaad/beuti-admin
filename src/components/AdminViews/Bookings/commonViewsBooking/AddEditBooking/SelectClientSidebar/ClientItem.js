import React from 'react';
import PropTypes from 'prop-types';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';

const ClientItem = ({ client, onClick, selected, readOnly, salesPage = false }) => (
  <button
    className={`emp--holder ${(selected || readOnly) && 'nocursor'}`}
    type="button"
    onClick={(e) => (selected || readOnly ? null : onClick(client))}
  >
    <section className="clientitem">
      <div className="round">
        <img
          className="round-img"
          src={client?.image || '/clientholder.png'}
          alt="circle"
        />
      </div>
      <div className="clientitem__emp-data">
        <div className="clientitem__emp-data_title">{client?.name} </div>
        <div className="clientitem__emp-data_sub--title">
          {client?.phoneNumber || client?.phone}{' '}
        </div>
      </div>
    </section>
    {selected && !salesPage?.prevSale && (
      <button
        className="emp--holder-close"
        type="button"
        onClick={(e) => onClick(client)}
      >
        <SVG src={toAbsoluteUrl('/Close.svg')} />
      </button>
    )}
  </button>
);

ClientItem.propTypes = {
  onClick: PropTypes.array,
  client: PropTypes.object,
  selected: PropTypes.bool,
  readOnly: PropTypes.bool,
  salesPage: PropTypes.bool,
};

export default ClientItem;
