import { MerchantSchema } from "@schema/types";

type PickedMerchantSchema = Pick<MerchantSchema, "isMerchantPlus">;

export type AccountBalanceInitialData = {
  readonly currentMerchant: PickedMerchantSchema;
};
