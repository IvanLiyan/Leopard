import UploadDiscountState from "@merchant/model/mfp/UploadDiscountState";
import UploadFlashSaleState from "@merchant/model/mfp/UploadFlashSaleState";

type UploadCampaignState = UploadDiscountState | UploadFlashSaleState;

export type UploadCampaignStep =
  | "ENTER_DETAILS"
  | "UPLOAD_FILE"
  | "REVIEW_CAMPAIGN";

export default UploadCampaignState;
