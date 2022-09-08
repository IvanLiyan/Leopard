/* External Libraries */
import { observable } from "mobx";
import moment from "moment/moment";

/* Lego Toolkit */
import { CountryCode } from "@toolkit/countries";

// propogate start and end date data between components
export class FBWPerformanceState {
  @observable
  startDate: Date = moment().add(-28, "days").toDate();

  @observable
  endDate: Date = moment().toDate();
}

export type TimePeriod = "weekly" | "monthly" | "yearly";

export type WarehouseType = {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly warehouse_name: string;
  readonly warehouse_code?: string;
  readonly region: number;
  readonly region_name: string;
  readonly estimated_fulfill_time: number;
  readonly country_code?: CountryCode;
  readonly allow_selling?: boolean;
};

export type LowInventorySKU = {
  readonly estimated_days_until_out_of_stock: number;
  readonly inventory_sale_rate: number;
  readonly last_90_days_sold: number;
  readonly low_stock: boolean;
  readonly merchant_id: string;
  readonly product_id: string;
  readonly shipping_plan: boolean;
  readonly update_date: number;
  readonly variation_id: string;
  readonly warehouse_code: string;
  readonly warehouse_id: string;
  readonly warehouse_inventory: number;
};

export const LogActions = {
  // table actions
  CLICK_SET_VARIATION_SHIPPING_PRICE: "CLICK_SET_VARIATION_SHIPPING_PRICE",
  CLICK_EDIT_VARIATION_SHIPPING_PRICE: "CLICK_EDIT_VARIATION_SHIPPING_PRICE",
  CLICK_REMOVE_INVENTORY: "CLICK_REMOVE_INVENTORY",
  CLICK_QUANTITY_HISTORY: "CLICK_QUANTITY_HISTORY",
  CLICK_FORCE_DISABLE: "CLICK_FORCE_DISABLE",
  CLICK_FORCE_ENABLE: "CLICK_FORCE_ENABLE",
  CLICK_SET_OR_EDIT_PRODUCT_SHIPPING_PRICE:
    "CLICK_SET_OR_EDIT_PRODUCT_SHIPPING_PRICE",

  // filter actions
  CLICK_SHIPPING_PRICE_NOT_SET_TIP: "CLICK_SHIPPING_PRICE_NOT_SET_TIP",
  CLICK_FBS_TIP: "CLICK_FBS_TIP",
  CLICK_FILTER_BUTTON: "CLICK_FILTER_BUTTON",

  // modal actions
  CLICK_UPDATE_IN_SHIPPING_PRICE_MODAL: "CLICK_UPDATE_IN_SHIPPING_PRICE_MODAL",
  CLICK_YES_IN_FORCE_DISABLE_OR_ENABLE_MODAL:
    "CLICK_YES_IN_FORCE_DISABLE_OR_ENABLE_MODAL",

  // table button groups
  CLICK_PAGE_CHANGE: "CLICK_PAGE_CHANGE",
  EDIT_ITEMS_PER_PAGE: "EDIT_ITEMS_PER_PAGE",
  EDIT_SEARCH_TOKENS: "EDIT_SEARCH_TOKENS",
  EDIT_SEARCH_CRITERIA: "EDIT_SEARCH_CRITERIA",

  // others
  CLICK_TAB_CHANGE: "CLICK_TAB_CHANGE",
  CLICK_EXPAND_OR_COLLAPSE_INVENTORY: "CLICK_EXPAND_OR_COLLAPSE_INVENTORY",
};
