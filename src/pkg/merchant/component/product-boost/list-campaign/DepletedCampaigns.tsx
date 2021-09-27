import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import CampaignsTable from "@merchant/component/product-boost/list-campaign/CampaignsTable";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Campaign } from "@merchant/api/product-boost";

type DepletedCampaignsProps = BaseProps & {
  readonly campaigns: ReadonlyArray<Campaign>;
  readonly fromNoti?: number | null | undefined;
};

@observer
class DepletedCampaigns extends Component<DepletedCampaignsProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      topControls: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "space-between",
        marginTop: 25,
        ":nth-child(1n) > *": {
          height: 30,
          margin: "0px 0px 25px 0px",
        },
      },
      title: {
        fontSize: 22,
        lineHeight: 1.33,
        color: palettes.textColors.Ink,
        marginRight: 25,
        userSelect: "none",
        alignSelf: "center",
      },
    });
  }

  @computed
  get renderCampaignsTable() {
    const { campaigns, fromNoti } = this.props;
    return <CampaignsTable campaigns={campaigns} fromNoti={fromNoti} />;
  }

  render() {
    const { className } = this.props;
    return (
      <div className={css(this.styles.root, className)}>
        <div className={css(this.styles.topControls)}>
          <Text weight="bold" className={css(this.styles.title)}>
            Campaigns with Low Budget
          </Text>
        </div>
        {this.renderCampaignsTable}
      </div>
    );
  }
}
export default DepletedCampaigns;
