import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import TrackingNumberModal from "@merchant/component/logistics/shipping-plan/TrackingNumberModal";

import { Tracking } from "@merchant/api/fbw";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ShippingPlanState } from "@merchant/api/fbw";

export type FBWTrackingInfoProps = BaseProps & {
  readonly shippingPlanId: string;
  readonly shippingPlanState: ShippingPlanState;
  readonly trackings: ReadonlyArray<Tracking>;
  readonly providers: {
    [key: string]: string;
  };
};

@observer
class FBWTrackingInfo extends Component<FBWTrackingInfoProps> {
  @observable
  trackings: ReadonlyArray<Tracking> = [];

  constructor(props: FBWTrackingInfoProps) {
    super(props);
    const { trackings } = this.props;
    this.trackings = trackings;
  }

  updateTrackings = (trackings: ReadonlyArray<Tracking>) => {
    this.trackings = trackings;
  };

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
        fontWeight: fonts.weightBold,
        color: palettes.textColors.DarkInk,
      },
      topSection: {
        display: "flex",
        flexDirection: "column",
        padding: "20px 0px",
        fontSize: 16,
        fontWeight: fonts.weightNormal,
      },
      button: {
        width: 100,
        padding: "5px 40px",
        "@media (min-width: 900px)": { padding: "5px 38px" },
        "@media (max-width: 900px)": { padding: "7px 35px" },
      },
      explanation: {
        fontFamily: fonts.proxima,
        fontSize: "16px",
        fontWeight: fonts.weightMedium,
        lineHeight: 1.5,
        letterSpacing: "normal",
        color: palettes.textColors.Ink,
      },
    });
  }

  render() {
    return (
      <Card className={css(this.styles.card)}>
        <div className={css(this.styles.content)}>
          <div className={css(this.styles.textStatsTitle)}>
            Add tracking information
          </div>
          <div className={css(this.styles.topSection)}>
            <div className={css(this.styles.explanation)}>
              Add tracking information to your shipping plan when you deliver
              products to FBW warehouses.
            </div>
          </div>
          <PrimaryButton
            onClick={async () => this.openModal()}
            className={css(this.styles.button)}
          >
            Add tracking information
          </PrimaryButton>
        </div>
      </Card>
    );
  }

  openModal() {
    const { providers, shippingPlanId } = this.props;
    const modal = new TrackingNumberModal({
      shippingPlanId,
      trackings: this.trackings,
      providers,
      updateTrackings: this.updateTrackings,
      refreshParent: () => null,
    });
    modal.render();
  }
}

export default FBWTrackingInfo;
