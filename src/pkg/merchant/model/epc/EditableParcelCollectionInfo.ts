/* External Libraries */
import { observable } from "mobx";

/* Merchant API */
import { EPCRegionName, ParcelCollectionInfo } from "@merchant/api/epc";

export default class EditableParcelCollectionInfo {
  @observable
  carriers: ReadonlyArray<number> = [];

  @observable
  address = "";

  @observable
  city: string | null = "";

  @observable
  province = "";

  @observable
  selfDeliveryWarehouse: ReadonlyArray<EPCRegionName> = [];

  @observable
  warehouse: EPCRegionName;

  constructor({
    carriers,
    address,
    city,
    province,
    self_delivery_warehouse: selfDeliveryWarehouse,
    warehouse,
  }: ParcelCollectionInfo) {
    this.carriers = carriers;
    this.address = address;
    this.city = city;
    this.province = province;
    this.selfDeliveryWarehouse = selfDeliveryWarehouse;
    this.warehouse = warehouse;
  }

  toJson(): ParcelCollectionInfo {
    return {
      carriers: this.carriers || [],
      address: this.address,
      city: this.city || "",
      province: this.province,
      self_delivery_warehouse: this.selfDeliveryWarehouse || [],
      warehouse: this.warehouse,
    };
  }
}
