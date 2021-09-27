import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { StaggeredFadeIn } from "@ContextLogic/lego";
import { StaggeredScaleIn } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as icons from "@assets/icons";
import * as illustrations from "@assets/illustrations";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

export type TaxBannerProps = BaseProps;

const PersistenceKey = "TaxBanner:order_history_tax_banner";

const FirstPoint = (props: { readonly detailsVisible: boolean }) => {
  const { detailsVisible } = props;
  const styles = useStylesheet();
  return (
    <div className={css(styles.point)}>
      <div className={css(styles.text)}>
        <img
          className={css(styles.icon)}
          src={icons.greenCheckmark}
          alt="green checkmark"
          draggable={false}
        />
        <Text weight="regular">
          For all orders placed on Wish within jurisdictions where Wish is
          registered as a Marketplace, Wish will collect and remit the
          appropriate sales tax on behalf
        </Text>
      </div>

      {detailsVisible && (
        <div className={css(styles.text)}>
          For orders placed on Wish within the United States jurisdictions,
          Canada, and select European Countries where Wish is not registered as
          a Marketplace, you may configure your Tax Settings for these
          jurisdictions so that Wish is able to collect the estimated indirect
          tax remittance amounts from customers (as a separate sales tax line
          item at checkout). You will receive the tax remittance amounts in your
          next scheduled payment (subject to Payment Eligibility terms).
        </div>
      )}
    </div>
  );
};

const TaxBanner = (props: TaxBannerProps) => {
  const { className, style } = props;
  const { persistenceStore } = useStore();
  const [detailsVisible, setDetailsVisible] = useState(true);
  const styles = useStylesheet();
  const hasDismissedBanner = persistenceStore.get(PersistenceKey) == true;

  const dismissBanner = () => {
    persistenceStore.set(PersistenceKey, true);
  };

  if (hasDismissedBanner) {
    return null;
  }

  return (
    <Card className={css(className, style)}>
      <div className={css(styles.root)}>
        <StaggeredScaleIn animationDurationMs={300}>
          <img
            className={css(styles.image)}
            src={illustrations.lightBulb}
            alt="light bulb"
            draggable={false}
          />
        </StaggeredScaleIn>
        <StaggeredFadeIn
          className={css(styles.content)}
          deltaY={10}
          animationDelayMs={400}
          animationDurationMs={800}
        >
          <Text weight="bold" className={css(styles.title)}>
            Indirect Tax Collection and Remittance
          </Text>
          <div className={css(styles.text)}>
            <span>
              Wish will collect the estimated indirect tax remittance amounts
              for you on some of your orders:
            </span>
            <div
              className={css(styles.link)}
              onClick={() => setDetailsVisible(!detailsVisible)}
            >
              {detailsVisible ? i`Hide` : i`Show details`}
            </div>
          </div>

          <FirstPoint detailsVisible={detailsVisible} />

          <PrimaryButton
            className={css(styles.dismiss)}
            onClick={dismissBanner}
            style={{
              padding: "10px 70px",
            }}
          >
            <Text weight="regular">Got it!</Text>
          </PrimaryButton>
        </StaggeredFadeIn>
      </div>
    </Card>
  );
};

export default observer(TaxBanner);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          padding: "24px 24px",
        },
        image: {
          width: 45,
          height: 45,
          marginRight: 15,
        },
        content: {
          display: "flex",
          flexDirection: "column",
          maxWidth: 1200,
          alignItems: "flex-start",
        },
        title: {
          color: palettes.textColors.Ink,
          fontSize: 20,
          lineHeight: 1.4,
          marginBottom: 10,
          cursor: "default",
        },
        text: {
          fontSize: 15,
          lineHeight: 1.25,
          color: palettes.textColors.Ink,
          cursor: "default",
          marginBottom: 8,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        point: {
          marginTop: 15,
          display: "flex",
          flexDirection: "column",
        },
        dismiss: {
          marginTop: 18,
          alignSelf: "flex-start",
        },
        icon: {
          height: 24,
          marginRight: 10,
        },
        link: {
          opacity: 1,
          color: palettes.coreColors.WishBlue,
          transition: "opacity 0.3s linear",
          ":hover": {
            opacity: 0.8,
          },
          cursor: "pointer",
          userSelect: "none",
          marginLeft: 5,
        },
      }),
    []
  );
