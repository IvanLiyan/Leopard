import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { DownloadButton } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ShippingPlan } from "@merchant/api/fbw";

export type FBWPrintLabelProps = BaseProps & {
  readonly shippingPlan: ShippingPlan | null | undefined;
};

@observer
class FBWPrintLabel extends Component<FBWPrintLabelProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      card: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.pageBackground,
      },
      content: {
        padding: "24px",
      },
      textStatsTitle: {
        paddingTop: "10px",
        fontSize: 20,
        color: palettes.textColors.DarkInk,
      },
      topSection: {
        display: "flex",
        flexDirection: "column",
        padding: "20px 0px",
        fontSize: 16,
      },
      button: {
        width: 100,
      },
      explanation: {
        fontSize: "16px",
        lineHeight: 1.5,
        letterSpacing: "normal",
        color: palettes.textColors.Ink,
      },
      buttonContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
      buttonsLeft: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
      },
      icon: {
        height: 15,
        marginRight: 6,
      },
      downloadButton: {
        alignSelf: "stretch",
        marginRight: 8,
      },
    });
  }

  render() {
    return (
      <Card className={css(this.styles.card)}>
        <div className={css(this.styles.content)}>
          <Text weight="bold" className={css(this.styles.textStatsTitle)}>
            Print your shipping label
          </Text>
          <div className={css(this.styles.topSection)}>
            <Text weight="medium" className={css(this.styles.explanation)}>
              Download and print your shipping labels for the products in your
              shipping plan. Your shipping labels should include SKU labels,
              manifests & case labels.
            </Text>
          </div>
          {this.renderDownloadButtons()}
        </div>
      </Card>
    );
  }

  @computed
  get label() {
    const { shippingPlan } = this.props;
    return shippingPlan?.label;
  }

  @computed
  get invoice() {
    const { shippingPlan } = this.props;
    return shippingPlan?.invoice;
  }

  @computed
  get canBatchDownloadLabels() {
    const { shippingPlan } = this.props;
    return (
      shippingPlan &&
      shippingPlan.case_labels_generated &&
      shippingPlan.sku_labels_generated
    );
  }

  renderDownloadButtons() {
    const { shippingPlan } = this.props;
    const shippingPlanId = shippingPlan?.id || "";
    return (
      <div className={css(this.styles.buttonsLeft)}>
        {this.canBatchDownloadLabels && (
          <DownloadButton
            className={css(this.styles.downloadButton)}
            href={`/fbw/shipping-plan/download/${shippingPlanId}`}
            popoverContent={
              this.label
                ? i`Download all labels in a zip file.`
                : i`Your shipping labels will be available for download ` +
                  i`shortly. Please come back to check again later.  `
            }
            disabled={!this.label}
          >
            Download all labels
          </DownloadButton>
        )}
        {this.canBatchDownloadLabels && (
          <DownloadButton
            className={css(this.styles.downloadButton)}
            href={`/fbw/shipping-plan/download/${shippingPlanId}/a4`}
            popoverContent={
              this.label
                ? i`Download all labels (A4) in a zip file.`
                : i`Your shipping labels will be available for download ` +
                  i`shortly. Please come back to check again later.  `
            }
            disabled={!this.label}
          >
            Download all labels (A4)
          </DownloadButton>
        )}
        <DownloadButton
          className={css(this.styles.downloadButton)}
          href={this.label ? this.label.url : ""}
          popoverContent={
            this.label
              ? i`Download your case label.`
              : i`Your shipping label will be available for download ` +
                i`shortly. Please come back to check again later.  `
          }
          disabled={!this.label}
        >
          Download case label
        </DownloadButton>
        <DownloadButton
          className={css(this.styles.downloadButton)}
          href={this.invoice ? this.invoice.url : ""}
          popoverContent={
            this.invoice
              ? i`Download your manifest.`
              : i`Your shipping label will be available for download ` +
                i`shortly. Please come back to check again later.  `
          }
          disabled={!this.invoice}
        >
          Download manifest
        </DownloadButton>
      </div>
    );
  }
}

export default FBWPrintLabel;
