import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import numeral from "numeral";

/* Lego Components */
import { CopyButton } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { Illustration } from "@merchant/component/core";
import Modal from "@merchant/component/core/modal/Modal";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { RowSelectionArgs } from "@ContextLogic/lego";
import { CurrencyCode } from "@toolkit/currency";
import { BulkDuplicateCampaign } from "@merchant/api/product-boost";
import { useToastStore } from "@merchant/stores/ToastStore";

export type BulkDuplicateAutomatedModalContentProps = BaseProps & {
  readonly campaignsToDuplicate: ReadonlyArray<BulkDuplicateCampaign>;
  readonly maxAllowedSpending: number;
  readonly onClose: () => unknown;
  readonly currencyCode: CurrencyCode;
};

const BulkDuplicateAutomatedModalContent = (
  props: BulkDuplicateAutomatedModalContentProps
) => {
  const {
    campaignsToDuplicate,
    maxAllowedSpending,
    onClose,
    currencyCode,
  } = props;
  const styles = useStylesheet();

  const toastStore = useToastStore();

  const initalCampaignIds = campaignsToDuplicate.map(
    (campaign) => campaign.campaign_id
  );

  const [selectedCampaignIds, setSelectedCampaignIds] = useState(
    initalCampaignIds
  );

  const selectedRows = campaignsToDuplicate.reduce(
    //disabled to satisfy the callback requirement on .reduce
    //eslint-disable-next-line local-rules/no-large-method-params
    (accumulator: number[], row: BulkDuplicateCampaign, index: number) => {
      if (selectedCampaignIds.includes(row.campaign_id)) {
        accumulator = [...accumulator, index];
      }
      return accumulator;
    },
    []
  );

  const onDuplicateRowSelectionToggled = ({
    row,
    selected,
  }: RowSelectionArgs<BulkDuplicateCampaign>) => {
    if (selected) {
      addCampaign(row);
    } else {
      removeCampaign(row);
    }
  };

  const addCampaign = (row: BulkDuplicateCampaign) => {
    if (!selectedCampaignIds.includes(row.campaign_id)) {
      setSelectedCampaignIds((prevCampaignIds) => [
        ...prevCampaignIds,
        row.campaign_id,
      ]);
    }
  };

  const removeCampaign = (row: BulkDuplicateCampaign) => {
    setSelectedCampaignIds((prevCampaignIds) => {
      const idIndex = prevCampaignIds.indexOf(row.campaign_id);
      return prevCampaignIds.filter((_, index) => {
        return index !== idIndex;
      });
    });
  };

  const actionButtonProps = {
    text: i`Duplicate selected campaigns`,
    isDisabled: selectedCampaignIds.length === 0,
    onClick: async () => {
      const params = {
        campaign_ids: [...selectedCampaignIds],
      };
      let response;
      try {
        response = await productBoostApi
          .bulkDuplicateAutomatedCampaign(params)
          .call();
      } catch (e) {
        response = e;
      }
      if (response.code === 0 && response.data) {
        toastStore.positive(i`Your campaigns have been duplicated!`, {
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

  const renderCampaignName = (campaign: BulkDuplicateCampaign) => {
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

  const renderSpendOverGmvField = (campaign: BulkDuplicateCampaign) => {
    let spendOverGmv;
    if (campaign.gmv > 0 && campaign.spend != null) {
      spendOverGmv = numeral(campaign.spend / campaign.gmv).format("0.00%");
    } else {
      spendOverGmv = i`No data`;
    }
    return <div>{spendOverGmv}</div>;
  };

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.upper)}>
        {campaignsToDuplicate.length > 2 || (
          <Illustration
            className={css(styles.illustration)}
            name={"productBoostHomepageModalLogo"}
            alt={""}
          />
        )}
        <div className={css(styles.title)}>
          Duplicate the following campaigns to gain more sales!
        </div>
        <Table
          className={css(styles.campaignsTable)}
          data={campaignsToDuplicate}
          overflowY="visible"
          highlightRowOnHover
          selectedRows={selectedRows}
          canSelectRow={() => true}
          onRowSelectionToggled={onDuplicateRowSelectionToggled}
          rowHeight={68}
        >
          <Table.Column
            title={i`Campaign`}
            columnKey="campaign_name"
            width={150}
          >
            {({ row }) => renderCampaignName(row)}
          </Table.Column>
          <Table.CurrencyColumn
            title={i`Budget`}
            columnKey="budget"
            width={150}
            currencyCode={currencyCode}
          />
          <Table.CurrencyColumn
            title={i`Spend`}
            columnKey="spend"
            width={150}
            currencyCode={currencyCode}
          />
          <Table.CurrencyColumn
            title={i`GMV`}
            columnKey="gmv"
            width={150}
            currencyCode={currencyCode}
          />
          <Table.Column title={i`Spend / GMV`} columnKey="spend" width={150}>
            {({ row }) => renderSpendOverGmvField(row)}
          </Table.Column>
        </Table>
      </div>
      <div className={css(styles.fade)} />
      <div className={css(styles.balance)}>
        <div className={css(styles.balanceHeader)}>Available balance:</div>
        <div className={css(styles.balanceValue)}>
          {formatCurrency(maxAllowedSpending, currencyCode)}
        </div>
      </div>
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

export default observer(BulkDuplicateAutomatedModalContent);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#0e3aa1",
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
          backgroundImage: "linear-gradient(to bottom, #0000, #0e3aa1)",
        },
        illustration: {
          width: "150px",
          height: "110px",
          marginBottom: "12px",
        },
        title: {
          fontSize: 28,
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
          margin: "0 80px",
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

export class BulkDuplicateAutomatedModal extends Modal {
  contentProps: BulkDuplicateAutomatedModalContentProps;

  constructor(props: BulkDuplicateAutomatedModalContentProps) {
    super(() => null);

    this.contentProps = props;

    this.setTopPercentage(0.2);
    this.setWidthPercentage(0.63);
  }

  renderContent() {
    const { contentProps } = this;
    return (
      <BulkDuplicateAutomatedModalContent
        {...contentProps}
        onClose={() => this.close()}
      />
    );
  }
}
