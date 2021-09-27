import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { PolicyNavSections } from "@merchant/component/policy/policies/PolicyNav";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

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
import WarehouseFulfillmentPolicy from "@merchant/component/policy/policies/latest/WarehouseFulfillmentPolicy";
import ProductCompliancePolicy from "@merchant/component/policy/policies/latest/ProductCompliancePolicy";

import { PickedPolicyAnnouncementItemSchema } from "@merchant/container/policy/policies/MerchantPoliciesContainer";

export const merchantPolicies: PolicyNavSections = [
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
  { key: "warehouse_fulfillment", title: i`Warehouse Fulfillment Policy` },
  { key: "product_compliance", title: i`Other Regulatory Compliance` },
];

type MerchantPoliciesProps = BaseProps & {
  readonly announcementsMap?: Map<string, PickedPolicyAnnouncementItemSchema>;
  readonly currentSection: string;
};

const MerchantPolicies = ({
  announcementsMap,
  currentSection,
}: MerchantPoliciesProps) => {
  const styles = useStylesheet();
  return (
    <>
      <Overview className={css(styles.policy)} />
      <RegistrationPolicy
        className={css(styles.policy)}
        sectionNumber="1"
        currentSection={currentSection}
      />
      <ListingPolicy
        className={css(styles.policy)}
        sectionNumber="2"
        currentSection={currentSection}
        announcementsMap={announcementsMap}
      />
      <PromotionPolicy
        className={css(styles.policy)}
        sectionNumber="3"
        currentSection={currentSection}
        announcementsMap={announcementsMap}
      />
      <IPPolicy
        className={css(styles.policy)}
        sectionNumber="4"
        currentSection={currentSection}
      />
      <FulfillmentPolicy
        className={css(styles.policy)}
        sectionNumber="5"
        currentSection={currentSection}
      />
      <CustomerSupportPolicy
        className={css(styles.policy)}
        sectionNumber="6"
        currentSection={currentSection}
      />
      <RefundPolicy
        className={css(styles.policy)}
        sectionNumber="7"
        announcementsMap={announcementsMap}
        currentSection={currentSection}
      />
      <AccountSuspensionPolicy
        className={css(styles.policy)}
        sectionNumber="8"
        currentSection={currentSection}
      />
      <FeesAndPaymentsPolicy
        className={css(styles.policy)}
        sectionNumber="9"
        currentSection={currentSection}
      />
      <WishExpressPolicy
        className={css(styles.policy)}
        sectionNumber="10"
        announcementsMap={announcementsMap}
        currentSection={currentSection}
      />
      <CurrencyPolicy
        className={css(styles.policy)}
        sectionNumber="11"
        currentSection={currentSection}
      />
      <WarehouseFulfillmentPolicy
        className={css(styles.policy)}
        sectionNumber="12"
        currentSection={currentSection}
      />
      <ProductCompliancePolicy
        className={css(styles.policy)}
        sectionNumber="13"
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

export default observer(MerchantPolicies);
