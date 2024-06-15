/* eslint-disable react/prop-types */

import { Table, TableRow, TableCell, TableBody, TableHead } from '@material-ui/core';

import React from 'react';
import { Image } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import TableAction from '../../../shared/TableAction';

const CABannerTable = ({ banners, handleDelete }) => {
  const { messages } = useIntl();
  return (
    <>
      <section className="beuti-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{messages['products.table.image']}</TableCell>
              <TableCell align="center">{messages['common.type']}</TableCell>

              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {banners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>
                  <div className="producttable-image">
                    <Image
                      src={banner.image || toAbsoluteUrl('/productplaceholder.png')}
                    />
                  </div>
                </TableCell>
                <TableCell align="center">
                  {banner.bannerType === 1 && `${messages['cabanner.add.singlesp']}`}
                  {banner.bannerType === 2 && messages['cabanner.add.promocode']}
                  {banner.bannerType === 3 && messages['canbanner.add.none']}
                </TableCell>
                <TableCell align="right">
                  <TableAction
                    icon="flaticon-delete"
                    onClick={() => handleDelete(banner.id)}
                    name="common.delete"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </>
  );
};

export default CABannerTable;
