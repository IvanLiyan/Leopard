/*
 * Services.tsx
 *
 * Created by Jonah Dlin on Tue Aug 23 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { CSSProperties, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Layout, H2, Text } from "@ContextLogic/lego";
import { useTheme } from "@core/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Illustration, {
  IllustrationName,
} from "@deprecated/pkg/merchant/component/core/Illustration";

import { ci18n } from "@core/toolkit/i18n";

type Props = BaseProps;

const ServicesOrder = [
  "STORE_SETUP",
  "LISTING",
  "CONTENT_CREATION",
  "LOGISTICS",
  "PRODUCT_VERIFICATION",
  "CUSTOMER_SERVICE",
  "INVENTORY_MANAGEMENT",
  "BUSINESS_INTELLIGENCE",
  "PRICING_ADVICE",
  "USER_TRAFFIC",
] as const;
type Service = typeof ServicesOrder[number];

const ServiceIllustrations: { readonly [T in Service]: IllustrationName } = {
  STORE_SETUP: "mmsWelcomeStoreSetup",
  LISTING: "mmsWelcomeListing",
  CONTENT_CREATION: "mmsWelcomeContentCreation",
  LOGISTICS: "mmsWelcomeLogistics",
  PRODUCT_VERIFICATION: "mmsWelcomeProductVerification",
  CUSTOMER_SERVICE: "mmsWelcomeCustomerService",
  INVENTORY_MANAGEMENT: "mmsWelcomeInventoryManagement",
  BUSINESS_INTELLIGENCE: "mmsWelcomeBusinessIntelligence",
  PRICING_ADVICE: "mmsWelcomePricingAdvice",
  USER_TRAFFIC: "mmsWelcomeUserTraffic",
};
// See PR description for explanation of adjustments
// https://github.com/ContextLogic/clroot/pull/63697
const ServiceIllustrationAdjustments: {
  readonly [T in Service]: Pick<
    CSSProperties,
    "top" | "bottom" | "left" | "right" | "width" | "height"
  >;
} = {
  STORE_SETUP: {
    bottom: 0,
  },
  LISTING: {},
  CONTENT_CREATION: {
    bottom: 0,
    width: 120,
    left: "calc(50% - 60px - 4px)",
  },
  LOGISTICS: {
    width: 123,
  },
  PRODUCT_VERIFICATION: {
    width: 120,
    left: "calc(50% - 60px)",
  },
  CUSTOMER_SERVICE: {
    width: 109,
  },
  INVENTORY_MANAGEMENT: {
    width: 120,
    left: "calc(50% - 60px - 4px)",
  },
  BUSINESS_INTELLIGENCE: {
    bottom: -1,
  },
  PRICING_ADVICE: {},
  USER_TRAFFIC: {
    width: 114,
    left: "calc(50% - 57px - 1px)",
  },
};
const ServiceNames: { readonly [T in Service]: string } = {
  STORE_SETUP: ci18n(
    "A service that Wish provides to merchants",
    "Store Setup",
  ),
  LISTING: ci18n("A service that Wish provides to merchants", "Listing"),
  CONTENT_CREATION: ci18n(
    "A service that Wish provides to merchants",
    "Content Creation",
  ),
  LOGISTICS: ci18n("A service that Wish provides to merchants", "Logistics"),
  PRODUCT_VERIFICATION: ci18n(
    "A service that Wish provides to merchants",
    "Product Verification",
  ),
  CUSTOMER_SERVICE: ci18n(
    "A service that Wish provides to merchants",
    "Customer Service",
  ),
  INVENTORY_MANAGEMENT: ci18n(
    "A service that Wish provides to merchants",
    "Inventory Management",
  ),
  BUSINESS_INTELLIGENCE: ci18n(
    "A service that Wish provides to merchants",
    "Business Intelligence",
  ),
  PRICING_ADVICE: ci18n(
    "A service that Wish provides to merchants",
    "Pricing Advice",
  ),
  USER_TRAFFIC: ci18n(
    "A service that Wish provides to merchants",
    "User Traffic",
  ),
};

type ServiceDisplayProps = BaseProps & {
  readonly service: Service;
};

const ServiceDisplay: React.FC<ServiceDisplayProps> = ({
  className,
  style,
  service,
}) => {
  const styles = useServiceStylesheet();
  return (
    <Layout.FlexColumn
      style={[styles.root, className, style]}
      alignItems="center"
    >
      <Layout.FlexRow style={styles.serviceIllustrationContainer}>
        <Illustration
          style={[
            styles.serviceIllustration,
            ServiceIllustrationAdjustments[service],
          ]}
          name={ServiceIllustrations[service]}
          alt={ServiceNames[service]}
        />
      </Layout.FlexRow>
      <Text style={styles.serviceDescription}>{ServiceNames[service]}</Text>
    </Layout.FlexColumn>
  );
};

const useServiceStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          // These containers are wrapped to the next line for small screens
          // eslint-disable-next-line local-rules/no-frozen-width
          width: 164,
        },
        serviceIllustrationContainer: {
          position: "relative",
          width: 112,
          height: 112,
          marginBottom: 12,
        },
        serviceIllustration: {
          position: "absolute",
        },
        serviceDescription: {
          color: textBlack,
          fontSize: 16,
          lineHeight: "24px",
          textAlign: "center",
        },
      }),
    [textBlack],
  );
};

const Services: React.FC<Props> = ({ className, style }) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn style={[className, style]} alignItems="center">
      <H2 style={styles.header}>
        {ci18n("Services that Wish provides merchants", "Services")}
      </H2>
      <Text style={styles.description}>
        For wholesale merchants or factories looking to sell on Wish, Managed
        Merchant Services can help you set up and scale cross-border e-commerce,
        reach customers, impact sales, and more. You&apos;ll have a trusted
        operational partner helping you succeed on Wish.
      </Text>
      <Layout.FlexRow style={styles.services} justifyContent="center">
        {ServicesOrder.map((service) => (
          <ServiceDisplay key={service} service={service} />
        ))}
      </Layout.FlexRow>
      <Text style={styles.footer}>More services coming soon!</Text>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textBlack, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        header: {
          marginBottom: 24,
        },
        description: {
          color: textDark,
          fontSize: 20,
          lineHeight: "24px",
          marginBottom: 48,
          textAlign: "center",
          maxWidth: 862,
        },
        services: {
          marginBottom: 64,
          maxWidth: 994,
          flexWrap: "wrap",
          gap: "48px 39px",
        },
        footer: {
          color: textBlack,
          fontSize: 20,
          lineHeight: "28px",
        },
      }),
    [textBlack, textDark],
  );
};

export default observer(Services);
