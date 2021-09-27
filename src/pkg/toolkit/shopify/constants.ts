import { CommerceMerchantState } from "@schema/types";

export const AccountStateName: { [state in CommerceMerchantState]: string } = {
  PENDING: i`Pending`,
  APPROVED: i`Approved`,
  DISABLED: i`Disabled`,
  REQUEST_INFO: i`Request Info`,
  PENDING_PHONE: i`Pending Phone`,
  VACATION: i`Vacation`,
  PENDING_EMAIL: i`Pending Email`,
  WISH_EXPRESS_ONLY: i`Wish Express Only`,
};
