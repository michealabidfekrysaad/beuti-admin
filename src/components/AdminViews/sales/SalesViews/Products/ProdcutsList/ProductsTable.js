/* eslint-disable react/prop-types */

import { Table, TableRow, TableCell, TableBody, TableHead } from '@material-ui/core';

import React from 'react';
import { Image } from 'react-bootstrap';
import { useIntl, FormattedMessage } from 'react-intl';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import TableLoader from 'components/shared/TableLoader';

const ProductsTable = ({ Products, productLoading, selectProduct }) => {
  const { messages } = useIntl();

  return (
    <>
      <section className="saleproduct-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{messages['products.table.name']}</TableCell>
              <TableCell>{messages['products.table.quantity']}</TableCell>
              <TableCell>{messages['products.table.price']}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!productLoading &&
              Products.map((prod) => (
                <TableRow
                  key={prod.id}
                  className="saleproduct-table-select"
                  onClick={() => selectProduct(prod)}
                >
                  <TableCell>
                    <section className="saleproduct-table__name">
                      <div className="producttable-image">
                        <Image
                          src={prod.image || toAbsoluteUrl('/productplaceholder.png')}
                        />
                      </div>
                      {prod.name || '-'}
                    </section>
                  </TableCell>
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
