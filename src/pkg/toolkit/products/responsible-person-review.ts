import {
  UserSchema,
  ProductComplianceSchemaResponsiblePersonsArgs,
  ProductComplianceSchema,
  ResponsiblePersonStatus,
} from "@schema/types";
import { PickedResponsiblePerson } from "./responsible-person";
import { Theme } from "@ContextLogic/lego";

export type ResponsiblePersonsRequestData = Pick<
  ProductComplianceSchemaResponsiblePersonsArgs,
  "limit" | "offset" | "states" | "sort"
>;

export type ResponsiblePersonsResponseData = {
  readonly policy?: {
    readonly productCompliance?: {
      readonly responsiblePersons?: ReadonlyArray<
        PickedResponsiblePerson
      > | null;
      readonly responsiblePersonCount?:
        | ProductComplianceSchema["responsiblePersonCount"]
        | null;
    } | null;
  } | null;
};

export type ResponsiblePersonReviewInitialData = {
  readonly currentUser: Pick<UserSchema, "isAdmin">;
};

// Should be used for admins only
/* eslint-disable local-rules/unwrapped-i18n */
export const AdminThemeColor: { [type in ResponsiblePersonStatus]: Theme } = {
  COMPLETE: "LightGrey",
  INREVIEW: "LightGrey",
  REJECTED: "Red",
  DELETED: "Red",
  ADMIN_APPROVED: "CashGreen",
};

export const ReviewStatusLabel: {
  [type in ResponsiblePersonStatus]: string;
} = {
  COMPLETE: "Approved",
  INREVIEW: "Pending review",
  REJECTED: "Rejected",
  DELETED: "Deleted",
  ADMIN_APPROVED: "Approved",
};

export const AdminReviewStatusLabel: {
  [type in ResponsiblePersonStatus]: string;
} = {
  COMPLETE: "Auto-completed",
  INREVIEW: "Pending review",
  REJECTED: "Rejected",
  DELETED: "Deleted",
  ADMIN_APPROVED: "Admin approved",
};
/* eslint-enable local-rules/unwrapped-i18n */
