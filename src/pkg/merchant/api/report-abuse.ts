import gql from "graphql-tag";

/* Lego Toolkit */
import { wishURL, zendeskURL } from "@toolkit/url";

/* Type Imports */
import {
  Country,
  ReportAbuseMutationsUpsertRegulatorArgs,
  UpsertRegulator,
  ReportAbuseMutationsUpsertRegulatorReportArgs,
  UpsertRegulatorReport,
  ReportAbuseHubRegulatorArgs,
  RegulatorSchema,
  RegulatorReportReason,
} from "@schema/types";

export type PickedCountry = Pick<Country, "code" | "name">;

export type ReportAbuseUpsertRegulatorRequestType =
  ReportAbuseMutationsUpsertRegulatorArgs;

export type ReportAbuseUpsertRegulatorResponseType = {
  readonly policyPublic: {
    readonly reportAbuse: {
      readonly upsertRegulator: Pick<UpsertRegulator, "ok" | "message">;
    };
  };
};

export const UPSERT_REGULATOR = gql`
  mutation ReportAbuse_UpsertRegulator($input: UpsertRegulatorInput!) {
    policyPublic {
      reportAbuse {
        upsertRegulator(input: $input) {
          ok
          message
        }
      }
    }
  }
`;

export type ReportAbuseUpsertRegulatorReportRequestType =
  ReportAbuseMutationsUpsertRegulatorReportArgs;

export type ReportAbuseUpsertRegulatorReportResponseType = {
  readonly policyPublic: {
    readonly reportAbuse: {
      readonly upsertRegulatorReport: Pick<
        UpsertRegulatorReport,
        "ok" | "message"
      >;
    };
  };
};

export const UPSERT_REGULATOR_REPORT = gql`
  mutation ReportAbuse_UpsertRegulatorReport(
    $input: UpsertRegulatorReportInput!
  ) {
    policyPublic {
      reportAbuse {
        upsertRegulatorReport(input: $input) {
          ok
          message
        }
      }
    }
  }
`;

export type ReportAbuseGetRegulatorRequestType = ReportAbuseHubRegulatorArgs;

export type ReportAbuseGetRegulatorResponseType = {
  readonly policyPublic: {
    readonly reportAbuse: {
      readonly regulator: Pick<
        RegulatorSchema,
        | "id"
        | "organization"
        | "website"
        | "name"
        | "emailAddress"
        | "phoneNumber"
        | "title"
      > & {
        readonly country: PickedCountry;
      };
    };
  };
};

export const GET_REGULATOR = gql`
  query ReportAbuse_GetRegulator($emailAddress: String!) {
    policyPublic {
      reportAbuse {
        regulator(emailAddress: $emailAddress) {
          id
          emailAddress
          name
          phoneNumber
          website
          title
          organization
          country {
            code
            name
          }
        }
      }
    }
  }
`;

export const STEPS = [
  {
    title: i`Trust & Safety Regulator Portal`,
    path: `/trust-and-safety/regulator-portal/`,
  },
  {
    title: i`Enter your regulator email address to report product listings.`,
    path: `/trust-and-safety/regulator-portal/email`,
  },
  {
    title: i`Regulator Information`,
    path: `/trust-and-safety/regulator-portal/regulator-information`,
  },
  {
    title: i`Report Listings`,
    path: `/trust-and-safety/regulator-portal/report-listings`,
  },
  {
    title: i`Report successfully submitted!`,
    path: `/trust-and-safety/regulator-portal/confirmation`,
  },
];

export const REPORT_REASONS: { [reason in RegulatorReportReason]: string } = {
  DANGEROUS_OR_UNSAFE: i`Dangerous or Unsafe`,
  HAZARDOUS: i`Hazardous`,
  POLICY_VIOLATION: i`Wish Policy Violation`,
  OTHER_NON_COMPLIANCE: i`Other Non-compliance`,
};

export type Section =
  | "OVERVIEW"
  | "REPORT"
  | "AFTER"
  | "TIMEFRAMES"
  | "REQUESTS";

export type SectionInfo = {
  value: Section;
  title: string;
  altTitle?: string;
  link?: string;
  linkTitle?: string;
};

export const sections: ReadonlyArray<SectionInfo> = [
  {
    value: "OVERVIEW",
    title: i`Overview`,
  },
  {
    value: "REPORT",
    title: i`Report a Dangerous or Unsafe Product`,
    link: "/trust-and-safety/regulator-portal/email",
    linkTitle: i`Report Product Listings`,
  },
  {
    value: "AFTER",
    title: i`After You Send In Your Report`,
  },
  {
    value: "TIMEFRAMES",
    title: i`Timeframes for Substantiated Reports of Dangerous or Unsafe Items`,
    altTitle: i`Timeframes`,
  },
  {
    value: "REQUESTS",
    title: i`Special Requests`,
  },
];

export const policyLink = "/policy";
export const communityGuidelinesLink = wishURL(`/community-guidelines`);
export const termsOfUseLink = wishURL("/terms");
export const prohibitedLink = zendeskURL("205211777");
export const restrictedProductsLink = "/policy/inappropriate-reasons/42";
export const europeConsumerRightsLink = zendeskURL("1260800324169");
// export const regulatorLink = "" //TBD;

export const externalLinks = [
  {
    value: `MERCHANT_POLICIES`,
    title: i`Merchant Policies`,
    href: policyLink,
  },
  {
    value: `COMMUNITY_GUIDELINES`,
    title: i`Community Guideliness`,
    href: communityGuidelinesLink,
  },
  {
    value: `TERMS_OF_USE`,
    title: i`Terms of Use`,
    href: termsOfUseLink,
  },
  {
    value: `PROHIBITED_PRODUCT_LISTINGS`,
    title: i`Prohibited Product Listings`,
    href: prohibitedLink,
  },
  {
    value: `REGIONAL_RESTRICTED_PRODUCTS`,
    title: i`Regional Restricted Products`,
    href: restrictedProductsLink,
  },
  {
    value: `CONSUMER_RIGHTS_IN_EUROPE`,
    title: i`Consumer Rights in Europe`,
    href: europeConsumerRightsLink,
  },
  // TBD
  // {
  //   value: `REGULATOR_INFORMATIONAL_UPDATES`,
  //   title: i`Regulator Informational Updates`,
  //   href: regulatorLink,
  // },
];
