import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { BranchesContext } from 'providers/BranchesSelections';
import { useParams } from 'react-router-dom';
import BeutiPagination from 'components/shared/BeutiPagination';
import {
  PRODUCT_ODATA_COUNT_EP,
  PRODUCT_ODATA_GET_EP,
} from 'utils/API/EndPoints/ProductEP';

import { CallAPI } from 'utils/API/APIConfig';
import SearchInput from 'components/shared/searchInput';
import ProductsTable from './ProdcutsList/ProductsTable';

import NoProductYet from './ProdcutsList/NoProductYet';
import './ProductList.scss';
import {
  dropDownTypesItems,
  handleAddServiceOrQuantity,
  typeOfItems,
} from '../QuickSales/Helper/QuickSale.Helper';
const ProductsList = ({ setSalesData, salesData, isPOS }) => {
  const { messages } = useIntl();
  const { page } = useParams();
  const { branches } = useContext(BranchesContext);
  const [sorting, setSorting] = useState({
    by: 'name',
    order: 'asc',
  });
  const [paginationController, setPaginationController] = useState({
    pagesMax: 10,
    pageNumber: +page || 0,
  });
  const [searchValue, setSearchValue] = useState(null);
  const [filterdProducts, setFilterdProducts] = useState([]);
  const [firstCallTriggered, setFirstCallTriggered] = useState(false);
  const { refetch: getAllProducts, isFetching } = CallAPI({
    name: 'getAllProducts',
    url: PRODUCT_ODATA_GET_EP,
    method: !isPOS ? 'GET' : 'POST',
    baseURL: !isPOS
      ? `${process.env.REACT_APP_ODOMAIN}`
      : `${process.env.REACT_APP_POS_URL}/odata`,
    enabled: false,
    select: (data) => data.data.data.list,
    onSuccess: (list) => {
      setFilterdProducts(list);
      getCount(true);
      setTimeout(() => {
        setFirstCallTriggered(true);
      }, [500]);
    },
    refetchOnWindowFocus: false,
    query: {
      $skip: paginationController.pageNumber * paginationController.pagesMax,
      $top: paginationController.pagesMax,
      name: searchValue,
      $orderby: `${sorting.by} ${sorting.order}`,
    },
    body: {
      $skip: paginationController.pageNumber * paginationController.pagesMax,
      $top: paginationController.pagesMax,
      name: searchValue,
      $orderby: `${sorting.by} ${sorting.order}`,
    },
  });
  const { refetch: getCount, data: countData } = CallAPI({
    name: 'getCountProducts',
    url: PRODUCT_ODATA_COUNT_EP,
    baseURL: !isPOS
      ? `${process.env.REACT_APP_ODOMAIN}`
      : `${process.env.REACT_APP_POS_URL}/odata`,
    select: (data) => data.data.data.list,
    query: {
      name: searchValue,
    },
  });
  /* -------------------------------------------------------------------------- */
  /*                             Search In Products                            */
  /* -------------------------------------------------------------------------- */
  const selectProduct = (prod) => {
    setSalesData({
      ...handleAddServiceOrQuantity({
        selectedData: salesData,
        newItem: {
          id: prod.id,
          name: prod.name,
          price: prod.price,
          type: dropDownTypesItems.products,
        },
      }),
    });
  };

  useEffect(() => {
    getAllProducts(true);
  }, [paginationController]);

  useEffect(() => {
    if ((searchValue !== null || branches) && firstCallTriggered) {
      setPaginationController({
        ...paginationController,
        pageNumber: 0,
      });
    }
  }, [searchValue, branches]);

  return (
    <Row>
      <Col xs="12">
        <section className="booking--header w-100 mb-3">
          <Col xs="8">
            {/* <Col xs="4"> */}
            <SearchInput
              handleChange={setSearchValue}
              searchValue={searchValue}
              placeholder={messages['products.search']}
            />
            {/* </Col> */}
          </Col>
        </section>

        {(!!filterdProducts?.length || isFetching) && (
          <>
            <ProductsTable
              Products={filterdProducts}
              productLoading={isFetching}
              selectProduct={selectProduct}
            />

            {countData > 10 && !isFetching && (
              <section className="beuti-table__footer">
                <BeutiPagination
                  count={countData}
                  setPaginationController={setPaginationController}
                  paginationController={paginationController}
                />
              </section>
            )}
          </>
        )}
        {!filterdProducts.length && !isFetching && <NoProductYet />}
      </Col>
    </Row>
  );
};

export default ProductsList;
ProductsList.propTypes = {
  setSalesData: PropTypes.func,
  salesData: PropTypes.object,
  isPOS: PropTypes.bool,
};
