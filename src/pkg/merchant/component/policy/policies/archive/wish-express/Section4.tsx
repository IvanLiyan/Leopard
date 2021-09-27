import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { zendeskURL } from "@toolkit/url";

import { PolicyProps } from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const Section4 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();

  return (
    <PolicySubSection
      title={i`Wish Express orders that are confirmed delivered late will be penalized`}
      subSectionNumber={`${sectionNumber}.4`}
      currentSection={currentSection}
    >
      <p>
        The Penalties Policy measures Wish Express orders weekly, from Monday
        through Sunday. Orders confirmed delivered late will be penalized by
        {20}% of the order value or {formatCurrency(5, "USD")}*, whichever is
        greater. For confirmed fulfilled orders, Wish will apply a flat
        exemption of {1}% of the total order value of the Wish Express order.
      </p>
      <Markdown
        className={css(styles.paragraph)}
        text={
          i`Orders confirmed fulfilled by 23:59:59 UTC of the next working day` +
          i`from the order released time and fulfilled through specific qualified` +
          i`carriers, will be excluded from the penalty. ` +
          i`Please see the Wish Express Qualifications and Terms for ` +
          i`the Wish Express qualified carrier list [here](${"/policy#wish_express"}).`
        }
        openLinksInNewTab
      />
      <p>
        <span>
          In cases when the merchant requests that the customer verify his or
          her shipping address for an order through the “Verify Address”
          feature, the delivery requirement may be extended by {48} working
          hours.
        </span>{" "}
        <Link href={zendeskURL("360011856193")} openInNewTab>
          Learn more
        </Link>
      </p>
      <p>
        Wish Express orders not confirmed delivered within {5} working days are
        considered late.
      </p>
      <p>
        Merchants are allowed to dispute penalties issued for violating this
        policy within {11} calendar days after a penalty statement is generated.
      </p>
      <p className={css(styles.subsectionEnd)}>
        <Link href="/policy#wish_express" openInNewTab>
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
        paragraph: {
          marginBottom: 10,
        },
        subsectionEnd: {
          marginBottom: 0,
        },
      }),
    []
  );

export default observer(Section4);
