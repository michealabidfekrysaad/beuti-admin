import { salesItemIds } from 'components/AdminViews/sales/Helper/ViewsEnum';

export const rePositionOfElement = ({ currentIndex, displayNumbers, width, height }) => {
  const positionHorizntal = (currentIndex + 1) % displayNumbers || displayNumbers;
  return {
    height,
    width,
    position: 'absolute',
    transform: `translate3d(${(positionHorizntal - 1) * width}px, ${Math.floor(
      currentIndex / displayNumbers,
    ) * height}px, 0px)`,
  };
};

export const typeOfItems = {
  1: { identify: salesItemIds.packages, translate: 'sales.quicksale.package' },
  2: { identify: salesItemIds.products, translate: 'sales.quicksale.product' },
  3: { identify: salesItemIds.services, translate: 'sales.quicksale.serviceOption' },
  4: { identify: salesItemIds.customItem, translate: 'sales.quicksale.customItem' },
  5: { identify: salesItemIds.fees, translate: 'sales.quicksale.transportationFees' },
};

export const dropDownTypesItems = {
  packages: 1,
  products: 2,
  services: 3,
  customItem: 4,
  fees: 5,
};
export const handleAddServiceOrQuantity = ({ selectedData = [], newItem }) => {
  const checkifItemExistInSelected = selectedData?.itemsSelected.find(
    (selectedBefore) => selectedBefore?.id === newItem?.id,
  );
  if (
    checkifItemExistInSelected &&
    typeOfItems[newItem.type]?.identify !== salesItemIds?.services
  ) {
    return {
      ...selectedData,
      itemsSelected: selectedData?.itemsSelected.map((selectedBefore) =>
        selectedBefore.id === newItem.id
          ? { ...selectedBefore, quantity: selectedBefore.quantity + 1 }
          : { ...selectedBefore },
      ),
    };
  }
  return {
    ...selectedData,
    itemsSelected: [
      ...selectedData?.itemsSelected,
      {
        ...newItem,
        id: newItem.id,
        name: newItem.name,
        price: newItem.priceAfterOffer || newItem.price,
        quantity: 1,
        identify: typeOfItems[newItem.type].identify,
        uniqueKey: Math.floor(Math.random() * 10000),
      },
    ],
  };
};
