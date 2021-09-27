import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Relative Imports */
import BaseStoreHealthCard from "./BaseStoreHealthCard";
import StoreHealthCardLabel from "./StoreHealthCardLabel";
import { PerformanceHealthInitialData } from "@toolkit/performance/stats";
import { PRODUCT_COMPLIANCE_THRESHOLD } from "@toolkit/performance/constants";

/* Toolkit */
import { Page } from "@toolkit/performance/constants";
import logger from "@toolkit/performance/logger";

type Props = BaseProps & {
  readonly policy: PerformanceHealthInitialData["policy"];
};

const ProductComplianceStoreHealthCard = (props: Props) => {
  const { policy, className, style } = props;
  const styles = useStylesheet();

  const ipInfringementProducts = policy?.ipInfringementProducts;
  const prohibitedProducts = policy?.prohibitedProducts;
  const misleadingProducts = policy?.misleadingProducts;

  const prohibitedProductsFinal =
    prohibitedProducts != null && misleadingProducts != null
      ? prohibitedProducts - misleadingProducts
      : null;
  const ipAboveThresh = ipInfringementProducts
    ? ipInfringementProducts > PRODUCT_COMPLIANCE_THRESHOLD
    : false;
  const prohibitedAboveThresh = prohibitedProductsFinal
    ? prohibitedProductsFinal > PRODUCT_COMPLIANCE_THRESHOLD
    : false;
  const misleadingAboveThresh = misleadingProducts
    ? misleadingProducts > PRODUCT_COMPLIANCE_THRESHOLD
    : false;

  const renderContent = () => (
    <>
      <div className={css(styles.body)}>
        <Markdown
          text={i`Any products violating Wish policies may be removed from your store.`}
        />
      </div>
      <div className={css(styles.statsGroup)}>
        <StoreHealthCardLabel
          label={i`Intellectual property violations`}
          value={ipInfringementProducts}
          aboveThreshold={ipAboveThresh}
        />
        <StoreHealthCardLabel
          label={i`Prohibited products`}
          value={prohibitedProductsFinal}
          aboveThreshold={prohibitedAboveThresh}
        />
        <StoreHealthCardLabel
          label={i`Misleading products`}
          value={misleadingProducts}
          aboveThreshold={misleadingAboveThresh}
        />
      </div>
    </>
  );

  const renderLearnMore = () => (
    <>
      <Markdown
        text={i`What is [intellectual property infringement](${"/policy#ip"})?`}
        onLinkClicked={async () =>
          await logger({
            action: "CLICK",
            event_name: "INTELLECTUAL_PROPERTY_POLICY",
            page: Page.storeHealth,
            to_page_url: "/policy#ip",
          })
        }
        openLinksInNewTab
      />
      <Markdown
        text={i`Which products are [prohibited](${"/policy/listing#2.7"}) due to safety and regulatory reasons?`}
        onLinkClicked={async () =>
          await logger({
            action: "CLICK",
            event_name: "PROHIBITED_PRODUCTS_POLICY",
            page: Page.storeHealth,
            to_page_url: "/policy/listing#2.7",
          })
        }
        openLinksInNewTab
      />
      <Markdown
        text={i`What is a [misleading product](${"/policy/listing#2.10"})?`}
        onLinkClicked={async () =>
          await logger({
            action: "CLICK",
            event_name: "MISLEADING_PRODUCTS_POLICY",
            page: Page.storeHealth,
            to_page_url: "/policy/listing#2.10",
          })
        }
        openLinksInNewTab
      />
    </>
  );

  return (
    <BaseStoreHealthCard
      title={i`Product compliance`}
      titleIconName="darkBlueCheckmark"
      linkTitle={i`Resolve Infractions`}
      linkUrl="/warning/awaiting_merchant"
      content={renderContent()}
      learnMore={renderLearnMore()}
      dateSnapshot={i`Current`}
      className={css(className, style)}
      aboveThreshold={
        ipAboveThresh || prohibitedAboveThresh || misleadingAboveThresh
      }
    />
  );
};

export default ProductComplianceStoreHealthCard;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          display: "flex",
          flexFlow: "row",
          alignItems: "center",
        },
        body: {
          padding: "16px 0px 0px 30px",
        },
        statsGroup: {
          paddingTop: 32,
        },
      }),
    []
  );
};
