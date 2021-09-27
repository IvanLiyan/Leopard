import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { CopyButton } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { Illustration } from "@merchant/component/core";
import Modal from "@merchant/component/core/modal/Modal";

/* Merchant Components */
import CampaignDiscountIndicator from "@merchant/component/product-boost/CampaignDiscountIndicator";

/* Merchant API */
import { BulkResumeCampaign } from "@merchant/api/product-boost";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type FreeFBWCampaignModalContentProps = BaseProps & {
  readonly freeFBWCampaigns: ReadonlyArray<BulkResumeCampaign>;
  readonly onClose: () => unknown;
};

const FreeFBWCampaignModalContent = (
  props: FreeFBWCampaignModalContentProps
) => {
  const { freeFBWCampaigns, onClose } = props;
  const styles = useStylesheet();

  const actionButtonProps = {
    text: i`View FBW campaigns`,
    href: "/product-boost/history/list?automated=0&offset=0",
  };

  const cancelButtonProps = {
    text: i`Remind me later`,
    onClick: () => {
      onClose();
    },
  };

  const renderCampaignName = (campaign: BulkResumeCampaign) => {
    // If campaign name is empty, showing default text.
    let campaignName = i`(Campaign Name Not Set)`;
    const url = `/product-boost/detail/${campaign.campaign_id}`;

    if (campaign.campaign_name) {
      campaignName = campaign.campaign_name;
    }

    return (
      <div className={css(styles.campaignNameDiscountColumn)}>
        <CopyButton
          text={campaign.campaign_id}
          prompt={i`Copy Campaign ID`}
          copyOnBodyClick={false}
        >
          <Link className={css(styles.campaignName)} openInNewTab href={url}>
            {campaignName}
          </Link>
        </CopyButton>
        <CampaignDiscountIndicator
          style={{ borderRadius: 10, marginTop: 3 }}
          discount={1.0}
          automatedType={3}
        />
      </div>
    );
  };

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.upper)}>
        <Illustration
          className={css(styles.illustration)}
          name={"productBoostFBWFree"}
          alt={""}
        />
        <div className={css(styles.title)}>
          Enjoy your free ProductBoost campaign for your FBW products
        </div>
        <div className={css(styles.subtitle)}>
          Your products that recently arrived at the FBW-LAX warehouse have been
          rewarded a free ProductBoost campaign!
        </div>
        <Table
          className={css(styles.campaignsTable)}
          data={freeFBWCampaigns}
          overflowY="visible"
          highlightRowOnHover
          rowHeight={68}
        >
          <Table.Column
            title={i`Campaign`}
            columnKey="campaign_name"
            align="left"
            minWidth={150}
          >
            {({ row }) => renderCampaignName(row)}
          </Table.Column>
          <Table.Column
            title={i`Start Date`}
            columnKey="start_date"
            align="left"
            minWidth={150}
          />
          <Table.Column
            title={i`End Date`}
            columnKey="end_date"
            align="left"
            minWidth={150}
          />
          <Table.Column
            title={i`Budget`}
            columnKey="max_budget"
            align="left"
            width={150}
          />
        </Table>
      </div>
      <div className={css(styles.fade)} />
      <div className={css(styles.footerContainer)}>
        <ModalFooter
          layout="horizontal-centered"
          action={actionButtonProps}
          cancel={cancelButtonProps}
        />
      </div>
    </div>
  );
};

export default observer(FreeFBWCampaignModalContent);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "linear-gradient(0deg, #8CACF6 -29.97%, #032453 122.3%)",
        },
        campaignNameDiscountColumn: {
          display: "contents",
        },
        upper: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxHeight: "400px",
          overflowY: "scroll",
          padding: "16px 0",
        },
        fade: {
          width: "100%",
          height: "16px",
          bottom: "16px",
          position: "relative",
          backgroundImage: "linear-gradient(to bottom, #0000, #032453)",
        },
        illustration: {
          // eslint-disable-next-line local-rules/no-frozen-width
          width: "300px",
          height: "220px",
          // eslint-disable-next-line local-rules/no-complex-styling
          marginBottom: "-30px",
          // eslint-disable-next-line local-rules/no-complex-styling
          marginTop: "-50px",
        },
        title: {
          fontSize: "28px",
          fontWeight: fonts.weightBold,
          marginBottom: "12px",
          lineHeight: 1.4,
          color: palettes.textColors.White,
          textAlign: "center",
        },
        subtitle: {
          fontSize: "16px",
          fontWeight: fonts.weightBold,
          marginBottom: "12px",
          lineHeight: 1.4,
          color: palettes.textColors.White,
          textAlign: "center",
        },
        balance: {
          display: "flex",
          flexDirection: "row",
          marginBottom: "24px",
          justifyContent: "center",
          alignItems: "center",
        },
        balanceHeader: {
          fontSize: 16,
          fontWeight: fonts.weightBold,
          lineHeight: 1.5,
          color: palettes.textColors.White,
          marginLeft: "24px",
        },
        balanceValue: {
          fontSize: 16,
          fontWeight: fonts.weightNormal,
          lineHeight: 1.5,
          color: palettes.textColors.White,
          margin: "0 24px",
        },
        campaignsTable: {
          margin: "20px 80px 0px 80px",
        },
        footerContainer: {
          width: "100%",
        },
        campaignName: {
          fontSize: 14,
          textAlign: "left",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
        },
      }),
    []
  );

export class FreeFBWCampaignModal extends Modal {
  contentProps: FreeFBWCampaignModalContentProps;

  constructor(props: FreeFBWCampaignModalContentProps) {
    super(() => null);

    this.contentProps = props;

    this.setTopPercentage(0.2);
    this.setWidthPercentage(0.63);
  }

  renderContent() {
    const { contentProps } = this;
    return (
      <FreeFBWCampaignModalContent
        {...contentProps}
        onClose={() => this.close()}
      />
    );
  }
}
