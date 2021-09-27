/* eslint-disable local-rules/unnecessary-list-usage */

import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import PolicySection, {
  PolicyProps,
} from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

import Section1Latest from "@merchant/component/policy/policies/latest/registration/Section1";
import Section1Archive from "@merchant/component/policy/policies/archive/registration/Section1";

const RegistrationPolicy = ({
  className,
  sectionNumber,
  version,
  currentSection,
}: PolicyProps) => {
  return (
    <PolicySection
      className={className}
      name="registration"
      title={i`Registration`}
      sectionNumber={sectionNumber}
      dateUpdated={i`July 29, 2021`}
      linkToVersion={version == "archive" ? "" : "archive"}
    >
      {version == "archive" ? (
        <Section1Archive
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      ) : (
        <Section1Latest
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      )}

      <PolicySubSection
        title={i`Each entity may have one account only`}
        subSectionNumber={`${sectionNumber}.2`}
        currentSection={currentSection}
      >
        If any company or person has multiple accounts all accounts risk
        suspension.
      </PolicySubSection>

      {version == "archive" && (
        <PolicySubSection
          title={i`Newly onboarded stores are subject to a ${formatCurrency(
            2000,
            "USD"
          )}* Store Registration Fee`}
          subSectionNumber={`${sectionNumber}.3`}
          currentSection={currentSection}
        >
          Starting October 1st, 2018 00:00 UTC, newly onboarded stores may be
          subject to a {formatCurrency(2000, "USD")}* Store Registration Fee.
          Wish may apply this policy to accounts that complete the onboarding
          process after October 1st, 2018 00:00 UTC. Accounts that have not
          actively been used for an extended period of time may also be subject
          to this {formatCurrency(2000, "USD")}* Store Registration Fee,
          starting October 1st, 2018 00:00 UTC.
        </PolicySubSection>
      )}

      <PolicySubSection
        title={i`ERP Partners and Private API are subject to Partner Terms of Service`}
        subSectionNumber={`${sectionNumber}.${version == "archive" ? 4 : 3}`}
        currentSection={currentSection}
      >
        <Markdown
          text={
            i`ERP Partners and Private API merchants that are used on Wish ` +
            i`are subject to the [Wish API Terms of Service](${"/api-partner-terms-of-service"}).`
          }
          openLinksInNewTab
        />
      </PolicySubSection>

      <PolicySubSection
        title={i`Merchants must properly safeguard customer data`}
        subSectionNumber={`${sectionNumber}.${version == "archive" ? 5 : 4}`}
        currentSection={currentSection}
      >
        <p>
          Failing to properly safeguard personal customer information and data
          may result in higher penalties, suspension, and/or termination.
        </p>
        <span>
          Examples of improper safeguarding of customer information and data
          include, but are not limited to:
        </span>
        <ul style={{ marginBottom: 0 }}>
          <li>
            Improperly exposing names and addresses of customers to outside
            parties
          </li>
          <li>Posting API tokens publicly</li>
          <li>Sharing passwords to accounts</li>
        </ul>
      </PolicySubSection>
    </PolicySection>
  );
};

export default observer(RegistrationPolicy);
