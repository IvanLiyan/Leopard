import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Components */
import CampaignStatusLabel from "@merchant/component/product-boost/CampaignStatusLabel";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Campaign } from "@merchant/api/product-boost";

export type UnpaidCampaignsTableProps = BaseProps & {
  readonly campaigns: ReadonlyArray<Campaign>;
};

@observer
class UnpaidCampaignsTable extends Component<UnpaidCampaignsTableProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {},
      campaignId: {
        fontSize: 14,
        textAlign: "left",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",

        overflow: "hidden",
      },
    });
  }

  renderCampaignID(campaign: Campaign) {
    const campaignId = campaign.campaign_id;
    const url = `/product-boost/detail/${campaignId}`;
    if (campaignId.trim().length > 0 && campaignId !== `None`) {
      return (
        <Link className={css(this.styles.campaignId)} openInNewTab href={url}>
          {campaignId}
        </Link>
      );
    }
  }

  renderStateLabel(campaign: Campaign) {
    return <CampaignStatusLabel status={campaign.state} />;
  }

  renderCurrentUnpaidField(campaign: Campaign) {
    return formatCurrency(campaign.current_unpaid, campaign.localized_currency);
  }

  render() {
    const { campaigns, className } = this.props;
    return (
      <Table
        className={css(this.styles.root, className)}
        data={campaigns}
        noDataMessage={i`No Unpaid Campaigns Found`}
        maxVisibleColumns={20}
      >
        <Table.Column
          title={i`Campaign Name`}
          columnKey="campaign_name"
          align="left"
          width={200}
          noDataMessage={""}
        />
        <Table.Column
          title={i`Campaign ID`}
          columnKey="campaign_id"
          align="left"
          width={200}
          noDataMessage={""}
        >
          {({ row }) => this.renderCampaignID(row)}
        </Table.Column>
        <Table.Column
          title={i`Status`}
          columnKey="display_state_text"
          align="left"
        >
          {({ row }) => this.renderStateLabel(row)}
        </Table.Column>
        <Table.Column
          title={i`Pending Amount`}
          columnKey="current_unpaid"
          align="left"
        >
          {({ row }) => this.renderCurrentUnpaidField(row)}
        </Table.Column>
      </Table>
    );
  }
}
export default UnpaidCampaignsTable;
