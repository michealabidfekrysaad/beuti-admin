import React, { useState } from 'react';
import { Icon, Pagination } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const PaginationWithSemantic = ({ pageNumber, setPageNumber, totalCount }) => {
  const [lastItemInLast, setLastItemInLast] = useState(
    +pageNumber === Math.floor(totalCount / 10),
  );
  const [firstItemInLast, setFirstItemInLast] = useState(+pageNumber === 1);
  return (
    <Pagination
      className="paginationList"
      defaultActivePage={+pageNumber}
      firstItem={{
        content: <Icon name="angle double left" />,
        icon: true,
        disabled: firstItemInLast,
      }}
      lastItem={{
        content: <Icon name="angle double right" />,
        icon: true,
        disabled: lastItemInLast,
      }}
      prevItem={{
        content: <Icon name="angle left" />,
        icon: true,
        disabled: firstItemInLast,
      }}
      nextItem={{
        content: <Icon name="angle right" />,
        icon: true,
        disabled: lastItemInLast,
      }}
      ellipsisItem={false}
      totalPages={Math.ceil(totalCount / 10)}
      onPageChange={(e, data) => {
        if (data.activePage === Math.ceil(totalCount / 10)) {
          setLastItemInLast(true);
        } else {
          setLastItemInLast(false);
        }
        if (data.activePage === 1) {
          setFirstItemInLast(true);
        } else {
          setFirstItemInLast(false);
        }
        setPageNumber(data.activePage);
      }}
    />
  );
};
PaginationWithSemantic.propTypes = {
  totalCount: PropTypes.number,
  pageNumber: PropTypes.number,
  setPageNumber: PropTypes.func,
};

export default PaginationWithSemantic;
