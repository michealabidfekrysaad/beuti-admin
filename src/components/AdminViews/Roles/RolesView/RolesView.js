/* eslint-disable react/jsx-boolean-value */
import BeutiPagination from 'components/shared/BeutiPagination';
import { ConfirmationModal } from 'components/shared/ConfirmationModal';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { CallAPI } from 'utils/API/APIConfig';
import { EMP_GET_ODATA } from 'utils/API/EndPoints/EmployeeEP';
import AddEditNewRole from './AddEditNewRole';
import GrantAccessModal from './GrantAccessModal';
import RolesTable from './RolesTable';

export default function RolesView() {
  const { messages } = useIntl();
  const [openModal, setOpenModal] = useState(false);
  const [openModalGrantAccess, setOpenModalGrantAccess] = useState(false);
  const [editedItem, setEditedItem] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(0);
  const [selectedRole, setSelectedrole] = useState(0);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteProductobj, setDeleteProductobj] = useState(false);

  const { data: allEmp } = CallAPI({
    name: 'allEmpSystem',
    url: EMP_GET_ODATA,
    baseURL: process.env.REACT_APP_ODOMAIN,
    refetchOnWindowFocus: false,
    enabled: true,
    onSuccess: (res) => setSelectedEmp(res[0]?.id),
    select: (data) =>
      data.data.data.list?.map((d) => ({ ...d, text: d?.name, key: d?.id })),
  });
  /* -------------------------------------------------------------------------- */
  /*                                   Delete                                   */
  /* -------------------------------------------------------------------------- */
  //   const { refetch } = CallAPI({
  //     name: 'deleteProduct',
  //     url: PRODUCT_DELETE_EP,
  //     query: {
  //       productId: deleteProductobj?.id,
  //     },
  //     method: 'delete',
  //     onSuccess: (data) => data?.data?.data && getAllProducts(true),
  //   });

  const handleDeleteRow = (obj) => {
    setDeleteProductobj(obj);
    setOpenDeleteModal(true);
  };
  return (
    <div className="roles-views">
      <header className="roles-views__header">
        <div className="roles-views__header-title">{messages['roles.route.roles']}</div>
        <div className="roles-views__header-desc">
          <div className="roles-views__header-desc__subtitle">
            {messages['roles.subtitle']}
          </div>
          <div className="roles-views__info-btns">
            <button
              type="button"
              className="beutibuttonempty mx-2 action"
              onClick={() => setOpenModalGrantAccess(true)}
            >
              {messages['roles.grant.access']}
            </button>
            <button
              type="button"
              className="beutibutton settings-employee_header-add w-auto"
              onClick={() => setOpenModal(true)}
            >
              {messages['roles.add.new.role']}
            </button>
          </div>
        </div>
      </header>
      <div className="roles-views__data">
        <RolesTable
          data={[]}
          setOpenModal={setOpenModal}
          setEditedItem={setEditedItem}
          handleDeleteRow={handleDeleteRow}
        />
        {/* <section className="beuti-table__footer">
          <BeutiPagination
            count={100}
            setPaginationController={() => {}}
            paginationController={{
              pagesMax: 10,
              pageNumber: +0 || 0,
            }}
          />
        </section> */}
      </div>
      <AddEditNewRole
        openModal={openModal}
        setOpenModal={setOpenModal}
        setEditedItem={setEditedItem}
        editedItem={editedItem}
      />

      <GrantAccessModal
        openModal={openModalGrantAccess}
        setOpenModal={setOpenModalGrantAccess}
        allEmp={allEmp}
        selectedEmp={selectedEmp}
        setSelectedEmp={setSelectedEmp}
        setSelectedrole={setSelectedrole}
        selectedRole={selectedRole}
      />

      <ConfirmationModal
        // setPayload={refetch}
        openModal={deleteProductobj && openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        title="roles.delete.confirm.modal"
        message="roles.delete.role.message"
        messageVariables={{
          role: deleteProductobj?.name,
        }}
        confirmtext="common.delete"
      />
    </div>
  );
}
