import { Option } from "@ContextLogic/lego";
import { SellerProfileVerificationDocType } from "@schema/types";

export const getDocName = (
  docType: SellerProfileVerificationDocType,
  isCN: boolean
) => {
  const nameMap: { [t in SellerProfileVerificationDocType]: string } = {
    national_id: i`National ID`,
    driver_license: i`Driver License`,
    passport: i`Passport`,
    state_id: i`State ID`,
    social_security_card: i`Social Security Card`,
    citizenship_card: i`Citizenship Card`,
    permanent_resident_card: i`Permanent Resident Card`,
    business_license: i`Government-issued Business License`,
    articles_of_incorporation: i`Articles of Incorporation`,
    certificate_of_incorporation: i`Certificate of Incorporation`,
    partnership_agreement: i`Partnership agreement`,
    recent_business_returns: i`Recent business returns`,
    vat_registration_certificate: i`VAT Registration Certificate`,
  };

  if (isCN) {
    nameMap.national_id = "居民身份证";
    nameMap.business_license = "营业执照";
  }

  return nameMap[docType];
};

const generateSelectOptions = (
  docTypes: ReadonlyArray<SellerProfileVerificationDocType>,
  isCN: boolean
) => {
  let options: ReadonlyArray<Option<SellerProfileVerificationDocType>> = [];

  for (const doc of docTypes) {
    const name = getDocName(doc, isCN);
    options = [...options, { value: doc, text: name }];
  }

  return options;
};

export const getDocOptions = (individual: boolean, isCN: boolean) => {
  let docTypes: ReadonlyArray<SellerProfileVerificationDocType> = [];

  if (isCN) {
    if (individual) {
      docTypes = ["national_id"];
    } else {
      docTypes = ["business_license"];
    }
  } else {
    if (individual) {
      docTypes = [
        "national_id",
        "driver_license",
        "passport",
        "state_id",
        "social_security_card",
        "citizenship_card",
        "permanent_resident_card",
      ];
    } else {
      docTypes = [
        "business_license",
        "articles_of_incorporation",
        "certificate_of_incorporation",
        "partnership_agreement",
        "recent_business_returns",
        "vat_registration_certificate",
      ];
    }
  }

  return generateSelectOptions(docTypes, isCN);
};
