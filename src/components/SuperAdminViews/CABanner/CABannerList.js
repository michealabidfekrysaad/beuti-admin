import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { Routes } from 'constants/Routes';
import BeutiButton from 'Shared/inputs/BeutiButton';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ConfirmationModal } from 'components/shared/ConfirmationModal';
import { CallAPI } from '../../../utils/API/APIConfig';
import CABannerTable from './CABannerList/CABannerTable';

const CABannerList = () => {
  const { messages } = useIntl();
  const history = useHistory();

  const [filterdBanners, setFilterdBanners] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState('');
  const { refetch: getAllCABanners } = CallAPI({
    name: 'getCustomerBannerAll',
    url: 'CustomerBanner/Get',
    enabled: true,
    select: (data) => data.data.data.list,
    onSuccess: (list) => {
      setFilterdBanners(list);
    },
    refetchOnWindowFocus: false,
  });

  /* -------------------------------------------------------------------------- */
  /*                                   Delete                                   */
  /* -------------------------------------------------------------------------- */
  const { refetch } = CallAPI({
    name: 'deleteBanner',
    url: 'CustomerBanner/Delete',
    query: {
      id: deleteProductId,
    },
    method: 'delete',
    onSuccess: (data) => {
      if (data?.data?.data) {
        toast.success(messages['delete.success']);
        getAllCABanners(true);
      }
    },
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
            <h3 className="settings__section-title">{messages['canbanner.title']}</h3>
            <p className="settings__section-description">
              {messages['canbanner.description']}
            </p>
          </Col>

          <Col xs="auto" className="d-flex">
            <BeutiButton
              text={messages['common.add']}
              type="button"
              className="settings-employee_header-add"
              onClick={() => history.push(Routes.cabannersAdd)}
            />
          </Col>
        </Row>
      </Col>

      {filterdBanners.length > 0 && (
        <Col xs="12">
          <CABannerTable banners={filterdBanners} handleDelete={handleDeleteEmployee} />
        </Col>
      )}

      <ConfirmationModal
        setPayload={refetch}
        openModal={deleteProductId && openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        title="canbanner.delete.title"
        message="canbanner.delete.description"
        confirmtext="common.delete"
      />
    </Row>
  );
};

export default CABannerList;
