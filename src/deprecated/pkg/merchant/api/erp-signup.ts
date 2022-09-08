/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type ErpSignupParams = {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  company_name: string;
  website: string;
  street_address1: string | null | undefined;
  street_address2?: string | null | undefined;
  city: string | null | undefined;
  state: string | null | undefined;
  zipcode: string | null | undefined;
  country: string | null | undefined;
  partner_role: number;
  tech_contact_name: string | null | undefined;
  tech_contact_email: string | null | undefined;
  tech_contact_phone: string | null | undefined;
  tech_contact_job_title?: string | null | undefined;
  tech_contact_wechat?: string | null | undefined;
  business_id_doc?: string | null | undefined;
  license_id?: string | null | undefined;
};

export const signupErpPartner = (
  args: ErpSignupParams
): MerchantAPIRequest<ErpSignupParams, {}> =>
  new MerchantAPIRequest("erp-partner/signup", args);
