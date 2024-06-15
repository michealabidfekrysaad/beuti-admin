/* eslint-disable react/prop-types */

import { Table, TableRow, TableCell, TableBody, TableHead } from '@material-ui/core';

import React, { useContext } from 'react';
import { Image } from 'react-bootstrap';
import { useIntl, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import SVG from 'react-inlinesvg';
import { BranchesContext } from 'providers/BranchesSelections';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import TableLoader from 'components/shared/TableLoader';
import TableAction from '../../../shared/TableAction';

const ProductsTable = ({ Products, handleDelete, handleSort, productLoading }) => {
  const { messages } = useIntl();
  const history = useHistory();
  const { setBranches } = useContext(BranchesContext);
  return (
    <>
      <section className="beuti-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{messages['products.table.image']}</TableCell>
              <TableCell>
                <button
                  type="button"
                  className="beuti-table__sort"
                  onClick={() => handleSort('name')}
                >
                  {messages['products.table.name']}
                  <SVG className="mx-2" src={toAbsoluteUrl('/sort.svg')} />
                </button>
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  className="beuti-table__sort"
                  onClick={() => handleSort('parcode')}
                >
                  {messages['products.table.barcode']}{' '}
                  <SVG className="mx-2" src={toAbsoluteUrl('/sort.svg')} />
                </button>
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  className="beuti-table__sort"
                  onClick={() => handleSort('quantity')}
                >
                  {messages['products.table.quantity']}
                  <SVG className="mx-2" src={toAbsoluteUrl('/sort.svg')} />
                </button>
              </TableCell>

              <TableCell>
                <button
                  type="button"
                  className="beuti-table__sort"
                  onClick={() => handleSort('price')}
                >
                  {messages['products.table.price']}
                  <SVG className="mx-2" src={toAbsoluteUrl('/sort.svg')} />
                </button>
              </TableCell>
              <TableCell align="center">{messages['products.table.actions']}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!productLoading &&
              Products.map((prod) => (
                <TableRow key={prod.id}>
                  <TableCell>
                    <div className="producttable-image">
                      <Image
                        src={prod.image || toAbsoluteUrl('/productplaceholder.png')}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{prod.name || '-'}</TableCell>
                  <TableCell>{prod.parcode || '-'}</TableCell>
                  <TableCell>
                    {prod.quantity ? (
                      <>
                        <FormattedMessage
                          id="products.table.available"
                          values={{ count: prod.quantity }}
                        />

                        {prod?.quantity <= prod?.lowStockAlert && (
                          <div className="d-flex">
                            <p className="employees-grid__item-title mt-1">
                              {messages['products.table.stock']}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      messages['products.table.unavailable']
                    )}
                  </TableCell>

                  <TableCell>
                    {prod.price} {messages['common.sar']}
                  </TableCell>

                  <TableCell align="center">
                    <div className="beuti-table__actions">
                      <TableAction
                        name="common.edit"
                        onClick={() => {
                          setBranches([prod?.branchId]);
                          history.push(`/productList/productedit/${prod.id}`);
                        }}
                      >
                        <SVG src={toAbsoluteUrl('/edit.svg')} />
                      </TableAction>
                      <TableAction
                        onClick={() => handleDelete(prod.id)}
                        name="common.delete"
                      >
                        <SVG src={toAbsoluteUrl('/delete.svg')} />
                      </TableAction>{' '}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            {productLoading && <TableLoader colSpan="6" />}
          </TableBody>
        </Table>
      </section>
    </>
  );
};

export default ProductsTable;
