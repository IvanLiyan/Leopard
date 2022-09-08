import { MerchantSchema } from "@schema/types";

type PickedMerchantSchema = Pick<MerchantSchema, "isFactory">;

export type AccountBalanceInitialData = {
  readonly currentMerchant: PickedMerchantSchema;
};
