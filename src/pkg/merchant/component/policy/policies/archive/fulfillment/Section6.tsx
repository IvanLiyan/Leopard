import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { zendeskURL } from "@toolkit/url";

import { PolicyProps } from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const Section6 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();

  return (
    <PolicySubSection
      title={i`Orders that are fulfilled with fake tracking numbers will be penalized`}
      subSectionNumber={`${sectionNumber}.6`}
      currentSection={currentSection}
    >
      <p>
        {i`If an order is fulfilled using a fake tracking number, the merchant may ` +
          i`be subject to penalties. Violating orders that are marked shipped or ` +
          i`have modified tracking prior to January 15, 2019 00:00 GMT, the penalty ` +
          i`amount issued will reflect order value plus ${formatCurrency(
            100,
            "USD",
          )}*. ` +
          i`Violating marked shipped or have modified tracking after January 15, ` +
          i`2019 00:00 GMT, the penalty amount issued will reflect order value plus ` +
          i`${formatCurrency(500, "USD")}*.`}
      </p>
      <p>
        Order value is defined as 'quantity * (merchant price + merchant
        shipping)'.
      </p>
      <p>
        Effective November 12, 2018, the penalty can only be disputed and
        approved within {90} calendar days from when the penalty was created. If
        the penalty dispute is not approved within the {90} calendar day period
        from when the penalty was created, the penalty will not be reversed.
      </p>
      <p className={css(styles.subsectionEnd)}>
        <Link href={zendeskURL("360006093273")} openInNewTab>
          See examples and learn more
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
    [],
  );

export default observer(Section6);
