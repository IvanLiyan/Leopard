/* eslint-disable local-rules/unnecessary-list-usage */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";

import { PolicyProps } from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const Section2P3 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();

  return (
    <PolicySubSection
      title={i`Account Payment Eligibility`}
      subSectionNumber={`${sectionNumber}.2.3`}
      currentSection={currentSection}
    >
      <p>
        An account is eligible to receive payments if the following required
        feature(s) are enabled:
      </p>
      <ol>
        <li>
          Two Factor Authentication (Required for all merchant accounts,
          effective April 15, 2018 01:00 UTC)
        </li>
        <li>
          WeChat Binding (Required for Mainland China-based merchant accounts
          only, effective July 15, 2018 01:00 UTC)
        </li>
      </ol>

      <p>
        If an account does not have the required feature(s) enabled, payments
        will be withheld for the account. Once these required feature(s) are
        enabled, the account will receive payment on their next scheduled
        payment date.
      </p>

      <p>
        <Link href={zendeskURL("221686987")} openInNewTab>
          Learn more about Two Factor Authentication
        </Link>
      </p>
      <p className={css(styles.subsectionEnd)}>
        <Link href={zendeskURL("360006946894")} openInNewTab>
          Learn more about WeChat Binding
        </Link>
      </p>
    </PolicySubSection>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        subsectionEnd: {
          marginBottom: 0,
        },
      }),
    []
  );

export default observer(Section2P3);
