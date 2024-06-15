/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl, FormattedMessage } from 'react-intl';
import { convertMinsToHours, convertTimeToMinuts } from 'utils/Helpers/TimeHelper';
import { EMP_GET_ODATA } from 'utils/API/EndPoints/EmployeeEP';
import { CallAPI } from 'utils/API/APIConfig';
import { ModalCheckoutUnpaid } from 'components/AdminViews/Bookings/views/CheckoutFlow/ModalCheckoutUnpaid/ModalCheckoutUnpaid';
import ViewCartActions from './ViewCartActions';
import PaymentDetails from './PaymentDetails';
import ConfirmRemoveItem from '../Helper/ConfirmRemoveItem';
import EditServiceAndPackage from '../SalesViews/Services/EditSeriveAndPackage';
import SingleConfirmedBooking from './AddedItemsType/SingleConfirmedBooking';
import SingleItemSelected from './AddedItemsType/SingleItemSelected';
import { RemoveChecker, salesItemIds } from '../Helper/ViewsEnum';
import CustomeItem from '../SalesViews/CustomItem/CustomItem';
import { CancelCheckoutModal } from '../CollectPhase/CancelCheckoutModal';

export default function SelectedItemCart({
  setSalesData,
  setCollectPhase,
  salesData,
  couponValueForBooking,
  collectPhase,
  toPayAmount,
  setOpenCheckoutUnpaidClicked,
  refetchAddBoookingCheckout,
  fetchingNewCheckout,
  setOpenCancelSaleModal,
  openCancelSaleModal,
  openCheckoutUnpaidClicked,
  setBookingSelectedInTheCart,
  isPOS,
}) {
  const { messages } = useIntl();
  const [openConfirmRemove, setOpenConfirmRemove] = useState(false);
  const [openEditItemModal, setOpenEditItemModal] = useState(false);
  const [removeItemOrNot, setRemoveItemOrNot] = useState(RemoveChecker.cancel);
  const [EditedItemClicked, setEditedItemClicked] = useState({
    item: null,
    serviceorNot: true,
    insideBooking: false,
  });
  const [identifier, setIdentfier] = useState(salesItemIds?.quickSale);

  const { data: allEmp } = CallAPI({
    name: 'getAllEmpForEditItemSale',
    url: EMP_GET_ODATA,
    baseURL: !isPOS
      ? `${process.env.REACT_APP_ODOMAIN}`
      : `${process.env.REACT_APP_POS_URL}/odata`,
    refetchOnWindowFocus: false,
    enabled: true,
    select: (data) =>
      data.data.data.list?.map((d) => ({ ...d, text: d?.name, key: d?.id })),
  });
  return (
    <Row className="cart">
      <div xs="12" className="cart--info">
        <div className="cart--add">
          {salesData?.prevSale && <div className="cart--overlay"></div>}
          <Col xs="12" className="cart--info-title">
            {messages['checkout.booking.items']}
          </Col>
          {salesData?.itemsSelected?.map((item) => (
            <>
              {/* booking example */}
              {item?.identify === salesItemIds?.confirmedBooking && (
                <SingleConfirmedBooking
                  singleItem={item}
                  setOpenEditItemModal={setOpenEditItemModal}
                  setEditedItemClicked={setEditedItemClicked}
                  setIdentfier={setIdentfier}
                  couponValueForBooking={couponValueForBooking}
                />
              )}
              {item?.identify !== salesItemIds?.confirmedBooking && (
                <SingleItemSelected
                  item={item}
                  setOpenEditItemModal={setOpenEditItemModal}
                  setEditedItemClicked={setEditedItemClicked}
                  setIdentfier={setIdentfier}
                  couponValueForBooking={couponValueForBooking}
                />
              )}
            </>
          ))}
        </div>
        {/* the payment section details */}
        <PaymentDetails salesData={salesData} setSalesData={setSalesData} />
      </div>
      {/* the cart  actions buttons */}
      <ViewCartActions
        setCollectPhase={setCollectPhase}
        salesData={salesData}
        collectPhase={collectPhase}
        toPayAmount={toPayAmount}
        setOpenCheckoutUnpaidClicked={setOpenCheckoutUnpaidClicked}
        refetchAddBoookingCheckout={refetchAddBoookingCheckout}
        fetchingNewCheckout={fetchingNewCheckout}
        setOpenCancelSaleModal={setOpenCancelSaleModal}
      />

      <ConfirmRemoveItem
        setOpenModal={setOpenConfirmRemove}
        openModal={openConfirmRemove}
        message="sales.confirm.remove.item.header"
        handleClose={() => {
          setRemoveItemOrNot(RemoveChecker.cancel);
          setOpenConfirmRemove(false);
          setOpenEditItemModal(true);
        }}
        handleSubmit={() => {
          setRemoveItemOrNot(RemoveChecker.removed);
          setOpenConfirmRemove(false);
          setOpenEditItemModal(false);
        }}
      />
      <EditServiceAndPackage
        open={
          (salesItemIds?.services === identifier ||
            salesItemIds?.packages === identifier) &&
          openEditItemModal
        }
        setOpen={setOpenEditItemModal}
        EditedItemClicked={EditedItemClicked}
        allEmp={allEmp}
        setOpenConfirmRemove={setOpenConfirmRemove}
        removeItemOrNot={removeItemOrNot}
        setRemoveItemOrNot={setRemoveItemOrNot}
        salesData={salesData}
        setSalesData={setSalesData}
        identifier={identifier}
        setBookingSelectedInTheCart={setBookingSelectedInTheCart}
      />

      <CustomeItem
        open={
          (salesItemIds?.customItem === identifier ||
            salesItemIds?.products === identifier ||
            salesItemIds.fees === identifier) &&
          openEditItemModal
        }
        setOpen={setOpenEditItemModal}
        EditedItemClicked={EditedItemClicked}
        setOpenConfirmRemove={setOpenConfirmRemove}
        setSalesData={setSalesData}
        salesData={salesData}
        removeItemOrNot={removeItemOrNot}
        setRemoveItemOrNot={setRemoveItemOrNot}
        identifier={identifier}
      />

      <ModalCheckoutUnpaid
        openModal={openCheckoutUnpaidClicked}
        setOpenModal={setOpenCheckoutUnpaidClicked}
        toPayAmount={toPayAmount}
        refetchAddBoookingCheckout={refetchAddBoookingCheckout}
      />
      <CancelCheckoutModal
        openCancelSaleModal={openCancelSaleModal}
        setOpenCancelSaleModal={setOpenCancelSaleModal}
        setSalesData={setSalesData}
        salesData={salesData}
        setCollectPhase={setCollectPhase}
      />
    </Row>
  );
}
