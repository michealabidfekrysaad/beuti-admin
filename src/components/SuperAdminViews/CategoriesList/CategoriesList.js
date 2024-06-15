import React, { useState, useEffect } from 'react';
import {
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  MenuItem,
  FormControl,
  Tooltip,
  Switch,
} from '@material-ui/core';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import DeleteModal from 'components/shared/DeleteModal';
import { Card } from 'react-bootstrap';
import Pagination from '@material-ui/lab/Pagination';
import TableLoader from 'components/shared/TableLoader';
import { CATEGORY_ENABLE_DISABLE, CATEGORY_DELETE } from 'utils/API/EndPoints/ServicesEP';
import { CallAPI } from 'utils/API/APIConfig';
import CategorySearch from './CategorySearch/index';

function CategoriesListTable({
  allData,
  countDataResponse,
  pageNumber,
  getCategories,
  setPageNumber,
  pagesMax,
  setPagesMax,
  direction,
  setDirection,
  isLoading,
  toast,
  setQuery,
  directionEn,
  setDirectionEn,
  setStatusFilterationValue,
  statusFilterationValue,
}) {
  const categories = 'table.categories';
  const { messages } = useIntl();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmEnable, setConfirmEnable] = useState(false);
  const [deletePayload, setDeletePayload] = useState(null);
  const [enabledCatID, setEnabledCatID] = useState(null);
  const [enabledCatStatus, setEnabledCatStatus] = useState(null);
  /* -------------------------------------------------------------------------- */
  /*                         API used to delete category                        */
  /* -------------------------------------------------------------------------- */
  const { isLoading: loadDelete, refetch } = CallAPI({
    name: 'deleteCategoryWithID',
    url: CATEGORY_DELETE,
    refetchOnWindowFocus: false,
    method: 'Delete',
    // retry: 1,
    query: {
      id: deletePayload,
    },
    onSuccess: (res) => {
      if (res) {
        setConfirmDelete(false);
        setDeletePayload();
        getCategories(true);
        toast.success(messages['admin.settings.workingTimeDelete.catSuccessfully']);
      }
    },
    onError: (err) => {
      setDeletePayload();
      setConfirmDelete(false);
      toast.error(err?.response?.data?.error?.message);
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                    API used to  enable\disable category                    */
  /* -------------------------------------------------------------------------- */
  const { isLoading: loadEnableDisable, refetch: refetchEnableDisable } = CallAPI({
    name: 'enableDisableCategory',
    url: CATEGORY_ENABLE_DISABLE,
    refetchOnWindowFocus: false,
    method: 'put',
    query: {
      id: enabledCatID,
      isEnabled: !enabledCatStatus,
    },
    onSuccess: (res) => {
      if (res) {
        setConfirmEnable(false);
        getCategories(true);
        toast.success(messages['spAdmin.categories.enable.success']);
      }
    },
    onError: (err) => {
      setConfirmEnable(false);
      toast.error(err?.response?.data?.error?.message);
    },
  });

  useEffect(() => {
    if (confirmDelete) {
      refetch(true);
    }
  }, [confirmDelete]);

  const handlePageMaxChange = (e, { value }) => {
    setPagesMax(e.target.value);
    setPageNumber(0);
  };

  const handleDirectionClick = () => {
    setDirectionEn(null);
    if (direction === 'desc') {
      setDirection('asc');
    } else {
      setDirection('desc');
    }
    setPageNumber(0);
  };
  const handleEnglishDirectionClick = () => {
    setDirection(null);
    if (directionEn === 'desEn') {
      setDirectionEn('ascEn');
    } else {
      setDirectionEn('desEn');
    }
    setPageNumber(0);
  };

  const handleToggleChange = (singleCategory) => {
    setOpenConfirmModal(true);
    setEnabledCatID(singleCategory?.id);
    setEnabledCatStatus(singleCategory?.isEnabled);
  };

  useEffect(() => {
    if (confirmEnable) {
      refetchEnableDisable();
    }
  }, [confirmEnable]);

  return (
    <>
      <Card className="mb-5">
        <Card.Header>
          <div className="title"> {messages['sidebar.sadmin.categories']}</div>
        </Card.Header>
        <Card.Body>
          <CategorySearch
            setQuery={setQuery}
            setStatusFilterationValue={setStatusFilterationValue}
            statusFilterationValue={statusFilterationValue}
          />
          <Table className="mt-5">
            <TableHead>
              <TableRow>
                <TableCell>
                  <button
                    type="button"
                    className="sorting-btn"
                    onClick={allData && handleDirectionClick}
                  >
                    {messages[`${categories}.name`]}
                    <i
                      className={`la-arrow-up la mx-1 ${(direction === 'asc' ||
                        !direction) &&
                        'la-rotate-180'}`}
                    ></i>
                  </button>{' '}
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    className="sorting-btn"
                    onClick={allData && handleEnglishDirectionClick}
                  >
                    {messages[`${categories}.nameEn`]}
                    <i
                      className={`la-arrow-up la mx-1 ${(directionEn === 'ascEn' ||
                        !directionEn) &&
                        'la-rotate-180'}`}
                    ></i>
                  </button>{' '}
                </TableCell>
                <TableCell>{messages['common.actions']}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading &&
                allData?.length > 0 &&
                allData.map((singleCat) => (
                  <TableRow key={singleCat.id}>
                    <TableCell>{singleCat.nameAr}</TableCell>
                    <TableCell>{singleCat.nameEn}</TableCell>
                    <TableCell>
                      <Tooltip
                        key={singleCat.id}
                        arrow
                        title={
                          singleCat.isEnabled
                            ? messages['common.deactivate']
                            : messages['common.activate']
                        }
                      >
                        <Switch
                          checked={singleCat.isEnabled}
                          onChange={() => handleToggleChange(singleCat)}
                          name="toggleisEnabled"
                          disabled={loadEnableDisable || singleCat.isEnabled}
                        />
                      </Tooltip>
                      <Tooltip arrow title={messages['common.delete']}>
                        <button
                          type="button"
                          className="icon-wrapper-btn btn-icon-danger mx-1"
                          onClick={() => {
                            setOpenDeleteModal(true);
                            setDeletePayload(singleCat.id);
                          }}
                          disabled={loadDelete}
                        >
                          {loadDelete && deletePayload === singleCat.id ? (
                            <span
                              className="spinner-border spinner-border-sm spinnerMr text-danger"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            <i className="flaticon2-rubbish-bin text-danger"></i>
                          )}
                        </button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              {(allData?.length === 0 || isLoading) && (
                <TableLoader colSpan="9" noData={!isLoading} />
              )}
              {!allData && !isLoading && (
                <TableRow>
                  <TableCell colSpan="9" align="center">
                    {messages['common.noData']}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card.Body>
        {countDataResponse >= 1 && (
          <Card.Footer>
            <FormControl variant="outlined" className="maxPage-manage-categories">
              <Select value={pagesMax} onChange={handlePageMaxChange} className="maxPage">
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>

            <Pagination
              count={countDataResponse}
              color="secondary"
              showFirstButton
              showLastButton
              className="mx-2"
              variant="outlined"
              shape="rounded"
              page={pageNumber + 1}
              onChange={(e, value) => setPageNumber(value - 1)}
            />
          </Card.Footer>
        )}
      </Card>
      <DeleteModal
        setOpen={setOpenDeleteModal}
        open={openDeleteModal}
        header="spAdmin.categories.deleteMsg"
        setConfirmDelete={setConfirmDelete}
        greyBtnMsg="common.cancel"
        purpleBtnMsg="common.yes"
      />
      <DeleteModal
        setOpen={setOpenConfirmModal}
        open={openConfirmModal}
        header="spAdmin.categories.enableMsg"
        setConfirmDelete={setConfirmEnable}
        purpleBtnMsg="common.yes"
        greyBtnMsg="common.no"
      />
    </>
  );
}

CategoriesListTable.propTypes = {
  allData: PropTypes.array,
  countDataResponse: PropTypes.number,
  pageNumber: PropTypes.number,
  getCategories: PropTypes.func,
  direction: PropTypes.string,
  setDirection: PropTypes.func,
  pagesMax: PropTypes.number,
  setPageNumber: PropTypes.func,
  setPagesMax: PropTypes.func,
  isLoading: PropTypes.bool,
  toast: PropTypes.func,
  setQuery: PropTypes.func,
  directionEn: PropTypes.string,
  setDirectionEn: PropTypes.func,

  setStatusFilterationValue: PropTypes.number,
  statusFilterationValue: PropTypes.func,
};

export default CategoriesListTable;
