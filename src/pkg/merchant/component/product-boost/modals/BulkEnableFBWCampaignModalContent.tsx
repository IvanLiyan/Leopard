import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { CopyButton } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { Illustration } from "@merchant/component/core";
import Modal from "@merchant/component/core/modal/Modal";
import { RowSelectionArgs } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { CurrencyCode } from "@toolkit/currency";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";
import { BulkResumeCampaign } from "@merchant/api/product-boost";

/* Merchant Stores */
import { useToastStore } from "@stores/ToastStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type BulkEnableFBWCampaignModalContentProps = BaseProps & {
  readonly fbwCampaignsToEnable: ReadonlyArray<BulkResumeCampaign>;
  readonly maxAllowedSpending: number;
  readonly onClose: () => unknown;
  readonly currencyCode: CurrencyCode;
};

const BulkEnableFBWCampaignModalContent = (
  props: BulkEnableFBWCampaignModalContentProps,
) => {
  const { fbwCampaignsToEnable, maxAllowedSpending, onClose, currencyCode } =
    props;
  const styles = useStylesheet();

  const toastStore = useToastStore();

  const initCampaignIds = fbwCampaignsToEnable.map(
    (campaign) => campaign.campaign_id,
  );

  const [selectedCampaignIds, setSelectedCampaignIds] =
    useState(initCampaignIds);

  const selectedRows = fbwCampaignsToEnable.reduce(
    //disabled to satisfy the callback requirement on .reduce
    //eslint-disable-next-line local-rules/no-large-method-params
    (accumulator: number[], row: BulkResumeCampaign, index: number) => {
      if (selectedCampaignIds.includes(row.campaign_id)) {
        accumulator = [...accumulator, index];
      }
      return accumulator;
    },
    [],
  );

  const onResumeCampaignRowSelectionToggled = ({
    row,
    selected,
  }: RowSelectionArgs<BulkResumeCampaign>) => {
    if (selected) {
      addCampaign(row);
    } else {
      removeCampaign(row);
    }
  };

  const addCampaign = (row: BulkResumeCampaign) => {
    if (!selectedCampaignIds.includes(row.campaign_id)) {
      setSelectedCampaignIds((prevCampaignIds) => [
        ...prevCampaignIds,
        row.campaign_id,
      ]);
    }
  };

  const removeCampaign = (row: BulkResumeCampaign) => {
    setSelectedCampaignIds((prevCampaignIds) => {
      const idIndex = prevCampaignIds.indexOf(row.campaign_id);
      return prevCampaignIds.filter((_, index) => {
        return index !== idIndex;
      });
    });
  };

  const actionButtonProps = {
    text: i`Resume selected campaigns`,
    isDisabled: selectedCampaignIds.length === 0,
    onClick: async () => {
      const params = {
        campaign_ids: [...selectedCampaignIds],
        caller_source: "EnableFBWCampaignModalBulkEnable",
      };
      let response;
      try {
        response = await productBoostApi
          .bulkEnableAutomatedCampaign(params)
          .call();
      } catch (e) {
        response = e;
      }
      if (response.code === 0 && response.data) {
        toastStore.positive(i`Your campaigns have been enabled!`, {
          timeoutMs: 5000,
          link: {
            title: i`View campaigns`,
            url: `/product-boost/history/list`,
          },
        });
        onClose();
      } else {
        if (response.msg) {
          toastStore.error(response.msg);
        }
      }
    },
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
      <CopyButton
        text={campaign.campaign_id}
        prompt={i`Copy Campaign ID`}
        copyOnBodyClick={false}
      >
        <Link className={css(styles.campaignName)} openInNewTab href={url}>
          {campaignName}
        </Link>
      </CopyButton>
    );
  };

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.upper)}>
        <Illustration
          className={css(styles.illustration)}
          name={"productBoostFBWDiscount"}
          alt={""}
        />
        <div className={css(styles.title)}>
          Boost your sales by enabling 50% off ProductBoost campaigns
        </div>
        <div className={css(styles.subtitle)}>
          Your products have arrived at the FBW warehouse, and earned 50%
          ProductBoost discounts
        </div>
        <div className={css(styles.balance)}>
          <div className={css(styles.balanceHeader)}>Available balance:</div>
          <div className={css(styles.balanceValue)}>
            {formatCurrency(maxAllowedSpending, currencyCode)}
          </div>
        </div>
        <Table
          className={css(styles.campaignsTable)}
          data={fbwCampaignsToEnable}
          overflowY="visible"
          highlightRowOnHover
          selectedRows={selectedRows}
          canSelectRow={() => true}
          onRowSelectionToggled={onResumeCampaignRowSelectionToggled}
          rowHeight={68}
        >
          <Table.Column
            title={i`Campaign`}
            columnKey="campaign_name"
            align="left"
            width={150}
          >
            {({ row }) => renderCampaignName(row)}
          </Table.Column>
          <Table.Column
            title={i`Start Date`}
            columnKey="start_date"
            align="left"
            width={150}
          />
          <Table.Column
            title={i`End Date`}
            columnKey="end_date"
            align="left"
            width={150}
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

export default observer(BulkEnableFBWCampaignModalContent);

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
          fontSize: 28,
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
          margin: "0px 80px",
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
    [],
  );

export class BulkEnableFBWCampaignModal extends Modal {
  contentProps: BulkEnableFBWCampaignModalContentProps;

  constructor(props: BulkEnableFBWCampaignModalContentProps) {
    super(() => null);

    this.contentProps = props;

    this.setTopPercentage(0.2);
    this.setWidthPercentage(0.63);
  }

  renderContent() {
    const { contentProps } = this;
    return (
      <BulkEnableFBWCampaignModalContent
        {...contentProps}
        onClose={() => this.close()}
      />
    );
  }
}
