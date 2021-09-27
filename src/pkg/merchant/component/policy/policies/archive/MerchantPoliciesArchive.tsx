import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { PolicyNavSections } from "@merchant/component/policy/policies/PolicyNav";

/* Sections */
import Overview from "@merchant/component/policy/policies/common/Overview";
import RegistrationPolicy from "@merchant/component/policy/policies/common/RegistrationPolicy";
import ListingPolicy from "@merchant/component/policy/policies/common/ListingPolicy";
import PromotionPolicy from "@merchant/component/policy/policies/common/PromotionPolicy";
import IPPolicy from "@merchant/component/policy/policies/common/IPPolicy";
import FulfillmentPolicy from "@merchant/component/policy/policies/common/FulfillmentPolicy";
import CustomerSupportPolicy from "@merchant/component/policy/policies/common/CustomerSupportPolicy";
import RefundPolicy from "@merchant/component/policy/policies/common/RefundPolicy";
import AccountSuspensionPolicy from "@merchant/component/policy/policies/common/AccountSuspensionPolicy";
import FeesAndPaymentsPolicy from "@merchant/component/policy/policies/common/FeesAndPaymentsPolicy";
import WishExpressPolicy from "@merchant/component/policy/policies/common/WishExpressPolicy";
import CurrencyPolicy from "@merchant/component/policy/policies/common/CurrencyPolicy";
import EPCPolicy from "@merchant/component/policy/policies/common/EPCPolicy";

export const merchantPoliciesArchive: PolicyNavSections = [
  { key: "home", title: i`Policy Overview` },
  { key: "registration", title: i`Registration` },
  { key: "listing", title: i`Listing Products` },
  { key: "promotion", title: i`Product Promotion` },
  { key: "ip", title: i`Intellectual Property` },
  { key: "fulfillment", title: i`Fulfillment` },
  { key: "customer", title: i`Customer Support` },
  { key: "refunds", title: i`Refund Policy` },
  { key: "account_suspension", title: i`Account Suspension` },
  { key: "fees_and_payments", title: i`Fees and Payments` },
  { key: "wish_express", title: i`Wish Express` },
  { key: "currency", title: i`Currency` },
  { key: "epc", title: i`EPC` },
];

const MerchantPoliciesArchive = ({
  currentSection,
}: {
  currentSection: string;
}) => {
  const styles = useStylesheet();
  return (
    <>
      <Overview className={css(styles.policy)} />
      <RegistrationPolicy
        className={css(styles.policy)}
        sectionNumber="1"
        version="archive"
        currentSection={currentSection}
      />
      <ListingPolicy
        className={css(styles.policy)}
        sectionNumber="2"
        version="archive"
        currentSection={currentSection}
      />
      <PromotionPolicy
        className={css(styles.policy)}
        sectionNumber="3"
        version="archive"
        currentSection={currentSection}
      />
      <IPPolicy
        className={css(styles.policy)}
        sectionNumber="4"
        version="archive"
        currentSection={currentSection}
      />
      <FulfillmentPolicy
        className={css(styles.policy)}
        sectionNumber="5"
        version="archive"
        currentSection={currentSection}
      />
      <CustomerSupportPolicy
        className={css(styles.policy)}
        sectionNumber="6"
        version="archive"
        currentSection={currentSection}
      />
      <RefundPolicy
        className={css(styles.policy)}
        sectionNumber="7"
        version="archive"
        currentSection={currentSection}
      />
      <AccountSuspensionPolicy
        className={css(styles.policy)}
        sectionNumber="8"
        version="archive"
        currentSection={currentSection}
      />
      <FeesAndPaymentsPolicy
        className={css(styles.policy)}
        sectionNumber="9"
        version="archive"
        currentSection={currentSection}
      />
      <WishExpressPolicy
        className={css(styles.policy)}
        sectionNumber="10"
        version="archive"
        currentSection={currentSection}
      />
      <CurrencyPolicy
        className={css(styles.policy)}
        sectionNumber="11"
        version="archive"
        currentSection={currentSection}
      />
      <EPCPolicy
        className={css(styles.policy)}
        sectionNumber="12"
        version="archive"
        currentSection={currentSection}
      />
    </>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        policy: {
          marginTop: 20,
        },
      }),
    []
  );

export default observer(MerchantPoliciesArchive);
