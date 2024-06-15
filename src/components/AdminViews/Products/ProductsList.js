import React, { useContext, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { Routes } from 'constants/Routes';
import { BranchesContext } from 'providers/BranchesSelections';
import BeutiButton from 'Shared/inputs/BeutiButton';
import { useHistory, useParams } from 'react-router-dom';
import BeutiPagination from 'components/shared/BeutiPagination';
import { ConfirmationModal } from 'components/shared/ConfirmationModal';
import { CallAPI } from '../../../utils/API/APIConfig';
import SearchInput from '../../shared/searchInput';
import ProductsTable from './ProdcutsList/ProductsTable';
import {
  PRODUCT_ODATA_COUNT_EP,
  PRODUCT_ODATA_GET_EP,
  PRODUCT_DELETE_EP,
} from '../../../utils/API/EndPoints/ProductEP';
import NoProductYet from './ProdcutsList/NoProductYet';

const ProductsList = () => {
  const { messages } = useIntl();
  const { page } = useParams();
  const history = useHistory();
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
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState('');
  const [firstCallTriggered, setFirstCallTriggered] = useState(false);
  const { refetch: getAllProducts, isFetching } = CallAPI({
    name: 'getAllProducts',
    url: PRODUCT_ODATA_GET_EP,
    baseURL: process.env.REACT_APP_ODOMAIN,
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
  });
  const { refetch: getCount, data: countData } = CallAPI({
    name: 'getCountProducts',
    url: PRODUCT_ODATA_COUNT_EP,
    baseURL: process.env.REACT_APP_ODOMAIN,
    select: (data) => data.data.data.list,
    query: {
      name: searchValue,
    },
  });
  /* -------------------------------------------------------------------------- */
  /*                             Search In Products                            */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    history.push(`/productList/${paginationController.pageNumber}`);
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
  /* -------------------------------------------------------------------------- */
  /*                           Handle Sorting In table                          */
  /* -------------------------------------------------------------------------- */

  const handleSort = (type) => {
    if (type === sorting.by && sorting.order === 'asc') {
      return setSorting({ ...sorting, order: 'desc' });
    }
    if (type === sorting.by && sorting.order === 'desc') {
      return setSorting({ ...sorting, order: 'asc' });
    }
    return setSorting({ by: type, order: 'asc' });
  };
  useEffect(() => {
    getAllProducts(true);
  }, [sorting]);
  /* -------------------------------------------------------------------------- */
  /*                                   Delete                                   */
  /* -------------------------------------------------------------------------- */
  const { refetch } = CallAPI({
    name: 'deleteProduct',
    url: PRODUCT_DELETE_EP,
    query: {
      productId: deleteProductId,
    },
    method: 'delete',
    onSuccess: (data) => data?.data?.data && getAllProducts(true),
  });
  const handleDeleteEmployee = (id) => {
    setDeleteProductId(id);
    setOpenDeleteModal(true);
  };
  return (
    <Row className="settings">
      <Col xs="12">
        <Row className="justify-content-between align-items-center py-3">
          <Col xs="auto">
            <h3 className="settings__section-title">{messages['products.title']}</h3>
            <p className="settings__section-description">
              {messages['products.description']}
            </p>
          </Col>

          <Col xs="auto" className="d-flex">
            <BeutiButton
              text={messages['products.add']}
              type="button"
              className="settings-employee_header-add"
              onClick={() => history.push(Routes.productadd)}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xs="4">
            <SearchInput
              handleChange={setSearchValue}
              searchValue={searchValue}
              placeholder={messages['products.search']}
            />
          </Col>
        </Row>
      </Col>

      {(!!filterdProducts?.length || isFetching) && (
        <Col xs="12">
          <ProductsTable
            Products={filterdProducts}
            handleDelete={handleDeleteEmployee}
            handleSort={handleSort}
            productLoading={isFetching}
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
        </Col>
      )}
      {!filterdProducts.length && !isFetching && (
        <Col xs="12">
          <NoProductYet />
        </Col>
      )}
      <ConfirmationModal
        setPayload={refetch}
        openModal={deleteProductId && openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        title="products.delete.title"
        message="products.delete.description"
        confirmtext="common.delete"
      />
    </Row>
  );
};

export default ProductsList;
