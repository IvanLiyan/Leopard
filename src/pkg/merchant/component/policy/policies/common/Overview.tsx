/* eslint-disable local-rules/unnecessary-list-usage */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import PolicySection from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const Overview = ({ className }: BaseProps) => {
  const styles = useStylesheet();
  return (
    <PolicySection
      className={className}
      name="home"
      title={i`Policy Overview`}
      dateUpdated={i`July 16, 2020`}
    >
      <PolicySubSection>
        Our policies help build and maintain customer trust in Wish’s
        international marketplace, so we can continually connect your products
        with customers worldwide. If you follow these policies, your store can
        participate in various programs offered on Wish.
      </PolicySubSection>
      <PolicySubSection
        title={i`Merchants provide Wish truthful and accurate information at all times`}
        subSectionNumber="1"
      >
        Merchants provide Wish truthful and accurate information at all times
        Merchants are expected to be truthful and accurate when entering
        information into the Wish platform. Product listings should be truthful
        and accurate, this includes but not limited to images, inventory,
        pricing. Product images should depict the product being sold accurately.
        The product description should not include conditions that are different
        from the product image.
      </PolicySubSection>
      <PolicySubSection
        title={i`Merchants should ensure orders are delivered to the customer as fast as possible`}
        subSectionNumber="2"
      >
        <p>
          Customers expect to get what they ordered promptly. Merchants should
          ensure the customers receive what they ordered as quickly as possible.
        </p>
        <span>Accomplish this by:</span>
        <ol className={css(styles.subsectionEnd)}>
          <li>Fulfilling orders quickly.</li>
          <li>Using reliable and efficient shipping methods.</li>
        </ol>
      </PolicySubSection>
    </PolicySection>
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

export default observer(Overview);
