/*
 * RefundAssuranceSplashModal.tsx
 *
 * Created by Jonah Dlin on Mon Jul 12 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  Button,
  Layout,
  PrimaryButton,
  Markdown,
  H4,
} from "@ContextLogic/lego";
import { useTheme } from "@stores/ThemeStore";
import { Illustration } from "@merchant/component/core";
import { useNavigationStore } from "@stores/NavigationStore";
import { zendeskURL } from "@toolkit/url";

export type RefundAssuranceSplashProps = BaseProps & {
  readonly onClose: () => unknown;
};

const RefundAssuranceSplash = ({ onClose }: RefundAssuranceSplashProps) => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();

  return (
    <Layout.FlexColumn alignItems="stretch">
      <Layout.FlexColumn
        className={css(styles.content)}
        alignItems="center"
        justifyContent="center"
      >
        <Illustration
          name="refundAssurance"
          alt={i`New ProductBoost credits`}
          className={css(styles.contentBlock, styles.illustration)}
        />
        <H4 className={css(styles.contentBlock, styles.title)}>
          You just received ProductBoost Credit from ProductBoost Refund
          Assurance program!
        </H4>
        <Markdown
          className={css(styles.contentBlock, styles.description)}
          text={
            i`You have been awarded ProductBoost Credit through ProductBoost ` +
            i`Refund Assurance based on recent order refunds caused by the ` +
            i`Advanced Logistics Program. See details [here](${"/product-boost/refund-assurance"}).`
          }
        />
        <Markdown
          className={css(styles.contentBlock, styles.description)}
          text={
            i`Invest in ProductBoost with confidence and assurance while being protected ` +
            i`against Advanced Logistics Program refunds. Create ProductBoost campaigns for ` +
            i`products included in the Advanced Logistics Program now. [Learn more](${zendeskURL(
              "1260804150329",
            )})`
          }
        />
      </Layout.FlexColumn>
      <Layout.FlexRow
        className={css(styles.footer)}
        justifyContent="space-between"
      >
        <Button className={css(styles.footerButton)} onClick={onClose}>
          Cancel
        </Button>
        <PrimaryButton
          className={css(styles.footerButton)}
          onClick={() => navigationStore.navigate("/product-boost/create")}
        >
          Create ProductBoost campaign
        </PrimaryButton>
      </Layout.FlexRow>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: 24,
        },
        contentBlock: {
          ":not(:last-child)": {
            marginBottom: 24,
          },
        },
        illustration: {
          maxWidth: 350,
        },
        title: {
          maxWidth: 700,
          textAlign: "center",
        },
        description: {
          fontSize: 16,
          lineHeight: "24px",
          maxWidth: 700,
        },
        footer: {
          flex: 1,
          padding: 24,
          borderTop: `1px solid ${borderPrimary}`,
        },
        footerButton: {
          boxSizing: "border-box",
          height: 40,
        },
      }),
    [borderPrimary],
  );
};

export default class RefundAssuranceSplashModal extends Modal {
  constructor() {
    super(() => null);
    this.setWidthPercentage(0.55);
  }

  renderContent() {
    return <RefundAssuranceSplash onClose={() => this.close()} />;
  }
}
