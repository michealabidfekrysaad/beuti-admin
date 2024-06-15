import React, { useState } from 'react';
import { FormControl, MenuItem, Select } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import PropTypes from 'prop-types';

const BeutiPagination = ({ count, setPaginationController, paginationController }) => {
  const handlePageMaxChange = (e) => {
    setPaginationController({ pageNumber: 0, pagesMax: e.target.value });
  };
  return (
    <>
      {count >= 1 && (
        <>
          <Pagination
            count={Math.ceil(count / paginationController.pagesMax)}
            color="secondary"
            showFirstButton
            showLastButton
            className="mx-2"
            variant="outlined"
            shape="rounded"
            page={paginationController.pageNumber + 1}
            onChange={(e, value) =>
              setPaginationController({ ...paginationController, pageNumber: value - 1 })
            }
          />
          <FormControl variant="outlined" className="maxPage-manage-categories">
            <Select
              value={paginationController.pagesMax}
              onChange={handlePageMaxChange}
              className="maxPage"
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </>
      )}
    </>
  );
};
BeutiPagination.propTypes = {
  count: PropTypes.array,
  setPaginationController: PropTypes.func,
  paginationController: PropTypes.object,
};
export default BeutiPagination;
