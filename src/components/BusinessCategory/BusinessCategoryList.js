/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@material-ui/core';
import { toast } from 'react-toastify';
import DeleteModal from 'components/shared/DeleteModal';
import { CallAPI } from 'utils/API/APIConfig';
import { useHistory } from 'react-router-dom';
import Fade from '@material-ui/core/Fade';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import TableLoader from '../shared/TableLoader';

function useUpdate() {
  const [value, setValue] = useState(0);
  // eslint-disable-next-line no-shadow
  return () => setValue((value) => value + 1);
}

export function BusinessCategoryList({
  allData,
  direction,
  setDirection,
  isLoading,
  setSortBy,
  setDirectionEN,
  directionEN,
  setChangeColumn,
  getCategories,
}) {
  const history = useHistory();
  const updating = useUpdate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [canDelete, setCanDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const categories = 'sadmin.business';
  const { messages } = useIntl();

  /* -------------------------------------------------------------------------- */
  /*                      check can delete category or not                      */
  /* -------------------------------------------------------------------------- */
  const { isFetching, refetch } = CallAPI({
    name: 'CanDeleteBusinessCategory',
    url: 'BusinessCategory/CanDeleteBusinessCategory',
    refetchOnWindowFocus: false,
    query: { id: selectedId },
    onSuccess: (res) => {
      if (res) {
        if (res?.data?.data?.success) {
          setOpenDeleteModal(true);
          setCanDelete(false);
        } else {
          toast.error(messages[`sadmin.business.check.delete`]);
          setCanDelete(false);
          setSelectedId(null);
        }
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  /* -------------------------------------------------------------------------- */
  /*                        delete the  business category                       */
  /* -------------------------------------------------------------------------- */
  const { isFetching: fetchDeletingLoad, refetch: callDelete } = CallAPI({
    name: 'deleteBusinessCategory',
    url: 'GeneralCenterType/Delete',
    refetchOnWindowFocus: false,
    method: 'delete',
    query: { id: selectedId },
    onSuccess: (res2) => {
      if (res2?.data?.data?.success) {
        setConfirmDelete(false);
        getCategories(true);
        setSelectedId(null);
        toast.success(messages[`sadmin.business.delete.message.success`]);
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  const handleDirectionClickAR = () => {
    setChangeColumn('nameAR');
    setDirectionEN('asc-EN');
    setSortBy('nameAR');
    if (direction === 'asc') {
      setDirection('des');
    } else {
      setDirection('asc');
    }
  };
  const handleDirectionClickEN = () => {
    setChangeColumn('nameEN');
    setDirection('asc');
    setSortBy('nameEN');
    if (directionEN === 'asc-EN') {
      setDirectionEN('des-EN');
    } else {
      setDirectionEN('asc-EN');
    }
  };

  const tableGuide = [
    {
      data: 'nameAr',
      message: (
        <button type="button" className="sorting-btn" onClick={handleDirectionClickAR}>
          {messages[`${categories}.name.ar`]}
          <i
            className={`la-arrow-up la mx-1 ${direction === 'asc' && 'la-rotate-180'}`}
          ></i>
        </button>
      ),
    },
    {
      data: 'nameEN',
      message: (
        <button type="button" className="sorting-btn" onClick={handleDirectionClickEN}>
          {messages[`${categories}.name.en`]}
          <i
            className={`la-arrow-up la mx-1 ${directionEN === 'asc-EN' &&
              'la-rotate-180'}`}
          ></i>
        </button>
      ),
    },
    { data: 'actions', message: messages['common.actions'] },
  ];

  useEffect(() => {
    if (canDelete) {
      refetch();
    }
  }, [canDelete]);

  useEffect(() => {
    if (confirmDelete) {
      callDelete();
    }
  }, [confirmDelete]);

  useEffect(() => {
    updating();
  }, [direction]);
  useEffect(() => {
    updating();
  }, [directionEN]);

  return (
    <>
      <Card className="mb-5">
        <Card.Body>
          <Table>
            <TableHead>
              <TableRow>
                {tableGuide.map((el) => (
                  <TableCell key={el.data} align="center">
                    {el.message}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading &&
                allData?.length > 0 &&
                allData.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell align="center">{supplier.nameAR}</TableCell>
                    <TableCell align="center">{supplier.nameEN}</TableCell>
                    <TableCell align="center">
                      <Tooltip
                        key={supplier.id}
                        arrow
                        TransitionComponent={Fade}
                        title={messages['common.edit']}
                      >
                        <button
                          type="button"
                          className="icon-wrapper-btn btn-icon-primary mx-2"
                          onClick={() =>
                            history.push(`/businessCategory/edit/${supplier.id}`)
                          }
                        >
                          <i className="flaticon2-pen text-primary"></i>
                        </button>
                      </Tooltip>
                      <Tooltip
                        arrow
                        TransitionComponent={Fade}
                        title={messages['common.delete']}
                      >
                        <button
                          type="button"
                          className="icon-wrapper-btn btn-icon-danger"
                          onClick={() => {
                            setSelectedId(supplier.id);
                            setCanDelete(true);
                          }}
                          disabled={
                            (isFetching && selectedId === supplier.id) ||
                            (fetchDeletingLoad && selectedId === supplier.id)
                          }
                        >
                          {fetchDeletingLoad && selectedId === supplier.id ? (
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
                <TableLoader colSpan="6" noData={!isLoading} />
              )}
            </TableBody>
          </Table>
        </Card.Body>{' '}
      </Card>
      <DeleteModal
        setOpen={setOpenDeleteModal}
        open={openDeleteModal}
        header="sadmin.business.delete.message"
        setConfirmDelete={setConfirmDelete}
      />
    </>
  );
}

BusinessCategoryList.propTypes = {
  allData: PropTypes.array,
  direction: PropTypes.string,
  setDirection: PropTypes.func,
  isLoading: PropTypes.bool,
  setSortBy: PropTypes.func,
  setDirectionEN: PropTypes.func,
  directionEN: PropTypes.string,
  setChangeColumn: PropTypes.func,
  getCategories: PropTypes.func,
};
