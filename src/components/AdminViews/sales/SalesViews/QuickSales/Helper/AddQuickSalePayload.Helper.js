import { salesItemIds } from 'components/AdminViews/sales/Helper/ViewsEnum';

export class PayloadCreator {
  #hashMap = {};

  constructor(selectedItem) {
    this.selectedItem = selectedItem;
    selectedItem.map((item) => {
      if (this.#hashMap[item?.identify]) {
        return this.#hashMap[item?.identify].push(item);
      }
      this.#hashMap[item?.identify] = [item];
      return null;
    });
  }

  getServices() {
    if (this.#hashMap[salesItemIds.services]) {
      return this.#hashMap[salesItemIds.services].map((service) => ({
        serviceOptionId: service.serviceOptionId,
        employeeId: service.employeeId,
        priceWithoutVAT: service?.priceBeforeDiscount || service.price,
        itemDiscountAmount: service?.itemDiscountAmount || 0,
      }));
    }
    return null;
  }

  getPackages() {
    if (this.#hashMap[salesItemIds.packages]) {
      return this.#hashMap[salesItemIds.packages].map((pack) => ({
        packageId: pack.id,
        quantity: pack.quantity,
        priceWithoutVAT: pack?.priceBeforeDiscount || pack.price,
        itemDiscountAmount: pack?.itemDiscountAmount || 0,
      }));
    }
    return null;
  }

  getProducts() {
    if (this.#hashMap[salesItemIds.products]) {
      return this.#hashMap[salesItemIds.products].map((product) => ({
        productId: product.id,
        priceWithoutVAT: product?.priceBeforeDiscount || product.price,
        itemDiscountAmount: product?.itemDiscountAmount || 0,
        totalQuantity: product.quantity,
        freeQuantity: product.freequantity || 0,
      }));
    }
    return null;
  }

  getTransportionFees() {
    if (this.#hashMap[salesItemIds.fees]) {
      return this.#hashMap[salesItemIds.fees].map((fees) => ({
        priceWithoutVAT: fees?.priceBeforeDiscount || fees.price,
        itemDiscountAmount: fees?.itemDiscountAmount || 0,
        quantity: fees.quantity,
      }));
    }
    return null;
  }

  getCustomItem() {
    if (this.#hashMap[salesItemIds.customItem]) {
      return this.#hashMap[salesItemIds.customItem].map((customItem) => ({
        name: customItem.name,
        priceWithoutVAT: customItem?.priceBeforeDiscount || customItem.price,
        itemDiscountAmount: customItem?.itemDiscountAmount || 0,
        quantity: customItem.quantity,
      }));
    }
    return null;
  }

  getConfirmedBooking() {
    if (this.#hashMap[salesItemIds.confirmedBooking]) {
      const singleBooking = this.#hashMap[salesItemIds.confirmedBooking][0];
      return {
        bookingId: singleBooking?.id,
        transportationFees: singleBooking?.cityFees,
        packages: singleBooking?.packages?.map((data) => ({
          packageHistoryId: data.packageHistoryId,
          priceWithoutVAT: data?.priceBeforeDiscount || data?.price,
          itemDiscountAmount: data?.itemDiscountAmount || 0,
          quantity: data?.count,
        })),
        services: singleBooking?.services?.map((data) => ({
          employeeId: data.employeeId,
          priceWithoutVAT: data?.priceBeforeDiscount || data?.price,
          itemDiscountAmount: data?.itemDiscountAmount || 0,
          bookingServiceId: data?.id,
        })),
      };
    }

    return null;
  }

  getPayload() {
    return {
      services: this.getServices(),
      packages: this.getPackages(),
      booking: this.getConfirmedBooking(),
      products: this.getProducts(),
      customTransportationFees: this.getTransportionFees(),
      customItems: this.getCustomItem(),
    };
  }
}
