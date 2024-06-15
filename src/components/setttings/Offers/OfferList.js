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
import {
  PRODUCT_ODATA_COUNT_EP,
  PRODUCT_ODATA_GET_EP,
  PRODUCT_DELETE_EP,
} from '../../../utils/API/EndPoints/ProductEP';
// import NoProductYet from './ProdcutsList/NoProductYet';
import OffersTable from './OfferList/OffersTable';
import NoOffersYet from './OfferList/NoOffersYet';
import SelectInputMUI from '../../../Shared/inputs/SelectInputMUI';

const OffersList = () => {
  const { messages } = useIntl();
  const { page } = useParams();
  const history = useHistory();
  const { branches } = useContext(BranchesContext);
  const [sorting, setSorting] = useState({
    by: 'offerName',
    order: 'asc',
  });
  const [paginationController, setPaginationController] = useState({
    pagesMax: 10,
    pageNumber: +page || 0,
  });
  const [statusFilterationValue, setStatusFilterationValue] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteOfferId, setDeleteOfferId] = useState('');
  const [allOffers, setAllOffers] = useState([]);
  const handleCheckByStatus = () =>
    statusFilterationValue ? `and status eq ${statusFilterationValue}` : '';
  const { data: Offers, refetch: getAllOffers, isFetching } = CallAPI({
    name: [
      'getAllOffers',
      sorting,
      searchValue,
      paginationController,
      statusFilterationValue,
    ],
    url: '/SPOffersOData',
    baseURL: process.env.REACT_APP_ODOMAIN,
    enabled: true,
    select: (data) => data.data.data.list,
    onSuccess: (list) => {
      setAllOffers(list);
      getCount(true);
    },
    refetchOnWindowFocus: false,
    query: {
      $skip: paginationController.pageNumber * paginationController.pagesMax,
      $top: paginationController.pagesMax,
      $filter: `contains(offerName,'${searchValue}') ${handleCheckByStatus()}`,
      $orderby: `${sorting.by} ${sorting.order}`,
    },
  });
  const { refetch: getCount, data: countData } = CallAPI({
    name: 'getCountProducts',
    url: '/SPOffersOData/$count?',
    baseURL: process.env.REACT_APP_ODOMAIN,
    select: (data) => data.data.data.list,
    query: {
      $filter: `contains(offerName,'${searchValue}') ${handleCheckByStatus()}`,
    },
  });
  /* -------------------------------------------------------------------------- */
  /*                             Search In Products                            */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    history.push(`/allOffers/${paginationController.pageNumber}`);
  }, [paginationController]);
  useEffect(() => {
    if (searchValue !== null || branches) {
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

  /* -------------------------------------------------------------------------- */
  /*                                   Delete                                   */
  /* -------------------------------------------------------------------------- */
  const { refetch } = CallAPI({
    name: 'deleteOffer',
    url: PRODUCT_DELETE_EP,
    query: {
      offerId: deleteOfferId,
    },
    method: 'delete',
    onSuccess: (data) => data?.data?.data && getAllOffers(true),
  });
  const handleDeleteOffer = (id) => {
    setDeleteOfferId(id);
    setOpenDeleteModal(true);
  };
  const statusFilteration = [
    { id: 0, text: messages['common.selectAll'] },
    { id: 1, text: messages['offers.table.status.upcoming'] },
    { id: 2, text: messages['offers.table.status.active'] },
    { id: 3, text: messages['offers.table.status.expired'] },
  ];
  return (
    <Row className="settings">
      <Col xs="12">
        <Row className="justify-content-between align-items-center py-3">
          <Col xs="auto">
            <h3 className="settings__section-title">{messages['offers.title']}</h3>
            <p className="settings__section-description">
              {messages['offers.description']}
            </p>
          </Col>

          <Col xs="auto" className="d-flex">
            <BeutiButton
              text={messages['offers.add']}
              type="button"
              className="settings-employee_header-add"
              onClick={() => history.push(Routes.addOffer)}
            />
          </Col>
        </Row>
        <Row className="mb-3 justify-content-between align-items-center">
          <Col xs="4">
            <SearchInput
              handleChange={setSearchValue}
              searchValue={searchValue}
              placeholder={messages['offers.search']}
            />
          </Col>
          <Col xs="2">
            <SelectInputMUI
              list={statusFilteration}
              value={statusFilterationValue}
              onChange={(e) => setStatusFilterationValue(e.target.value)}
            />
          </Col>
        </Row>
      </Col>

      {(!!allOffers?.length || isFetching) && (
        <Col xs="12">
          <OffersTable
            Offers={allOffers}
            handleDelete={handleDeleteOffer}
            handleSort={handleSort}
            offersLoading={isFetching}
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
      {!Offers?.length && !isFetching && (
        <Col xs="12">
          <NoOffersYet />
        </Col>
      )}
      <ConfirmationModal
        setPayload={refetch}
        openModal={deleteOfferId && openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        title="offers.delete.title"
        message="offers.delete.description"
        confirmtext="common.delete"
      />
    </Row>
  );
};

export default OffersList;
