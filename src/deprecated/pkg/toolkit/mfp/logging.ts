import { v4 as uuidv4 } from "uuid";
import moment from "moment/moment";
import { useLogger } from "@toolkit/logger";

// Do not change these types without consulting data science team
export type MfpAction = "BUTTON_CLICK" | "PAGE_VISIT";
export type MfpButtonId =
  | "DASHBOARD_HEADER_CREATE_PROMOTION"
  | "SELECT_PROMOTION_TYPE_DISCOUNT"
  | "SELECT_PROMOTION_TYPE_FLASH_SALE"
  | "CREATE_DISCOUNT_CONFIGURE_DETAILS_NEXT"
  | "CREATE_FLASH_SALE_CONFIGURE_DETAILS_NEXT"
  | "CREATE_DISCOUNT_SET_DISCOUNTS_NEXT"
  | "CREATE_FLASH_SALE_SET_DISCOUNTS_NEXT"
  | "CREATE_DISCOUNT_SUBMIT_PROMOTION"
  | "CREATE_FLASH_SALE_SUBMIT_PROMOTION"
  | "SELECT_PROMOTION_UPLOAD_CSV"
  | "UPLOAD_DISCOUNT_CSV_SUBMIT"
  | "UPLOAD_FLASH_SALE_CSV_SUBMIT";
export type MfpPageId = "DASHBOARD" | "VIEW" | "CREATE" | "UPLOAD_CSV";

// Definitons for schema can be found in https://docs.google.com/document/d/1Jy8hzFvGvcqPLs_sq1kd0ZNksy7aI5lq_lkwBkIA9ho/edit#heading=h.45nhb5eg1x5j
export type MfpLoggableAction = {
  readonly action: MfpAction;
  readonly activity_id: string; // UUID for this action
  readonly activity_time: number; // unix timestamp when action happens
  readonly merchant_id: string;
  readonly button_id?: MfpButtonId;
  readonly page_id?: MfpPageId;
  readonly updated_time: number; // unix timestamp when action is logged
  readonly ip: string; // IP address of merchant
};

export const useMfpLogger = () => {
  const logger = useLogger("MFP_MERCHANT_ACTIVITY_LOG");
  return logger;
};

export const mfpPageVisitLogData = ({
  page,
  merchantId,
}: {
  readonly page: MfpPageId;
  readonly merchantId: string;
}): MfpLoggableAction => {
  const id = uuidv4();
  const now = moment();
  const nowTimestamp = now.utc().unix();

  return {
    action: "PAGE_VISIT",
    activity_id: id,
    activity_time: nowTimestamp,
    updated_time: nowTimestamp,
    // TODO: include IP address in future iterations
    ip: "",
    merchant_id: merchantId,
    page_id: page,
  };
};

export const mfpButtonPressLogData = ({
  button,
  merchantId,
}: {
  readonly button: MfpButtonId;
  readonly merchantId: string;
}): MfpLoggableAction => {
  const id = uuidv4();
  const now = moment();
  const nowTimestamp = now.utc().unix();

  return {
    action: "BUTTON_CLICK",
    activity_id: id,
    activity_time: nowTimestamp,
    updated_time: nowTimestamp,
    // TODO: include IP address in future iterations
    ip: "",
    merchant_id: merchantId,
    button_id: button,
  };
};
