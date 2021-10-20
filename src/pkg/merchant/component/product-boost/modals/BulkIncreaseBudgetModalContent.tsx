import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import numeral from "numeral";

/* Lego Components */
import { CopyButton } from "@ContextLogic/lego";
import { CurrencyInput } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { Link } from "@ContextLogic/lego";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { Table } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";
import Modal from "@merchant/component/core/modal/Modal";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CurrencyCode } from "@toolkit/currency";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { RowSelectionArgs } from "@ContextLogic/lego";
import { BulkIncreaseBudgetCampaign } from "@merchant/api/product-boost";
import { useToastStore } from "@stores/ToastStore";

export type BulkIncreaseBudgetModalContentProps = BaseProps & {
  readonly campaignsToIncreaseBudget: ReadonlyArray<BulkIncreaseBudgetCampaign>;
  readonly maxAllowedSpending: number;
  readonly onClose: () => unknown;
  readonly currencyCode: CurrencyCode;
};

const BulkIncreaseBudgetModalContent = (
  props: BulkIncreaseBudgetModalContentProps,
) => {
  const {
    campaignsToIncreaseBudget,
    maxAllowedSpending,
    onClose,
    currencyCode,
  } = props;
  const styles = useStylesheet();

  const toastStore = useToastStore();

  const initalCampaignIds = campaignsToIncreaseBudget.map(
    (campaign) => campaign.campaign_id,
  );
  const initalCampaignToBudgetMap = new Map();
  campaignsToIncreaseBudget.forEach((campaign) => {
    initalCampaignToBudgetMap.set(
      campaign.campaign_id,
      campaign.suggested_budget,
    );
  });

  const [selectedCampaignIds, setSelectedCampaignIds] =
    useState(initalCampaignIds);
  const [validCampaignIds, setValidCampaignIds] = useState(initalCampaignIds);
  const [campaignToBudgetMap, setCampaignToBudgetMap] = useState(
    initalCampaignToBudgetMap,
  );
  const [displayingConfirmationTable, setDisplayingConfirmationTable] =
    useState(false);

  const totalBudgetToAdd = campaignsToIncreaseBudget.reduce(
    (accumulator, row) => {
      if (selectedCampaignIds.includes(row.campaign_id)) {
        accumulator += campaignToBudgetMap.get(row.campaign_id);
      }
      return accumulator;
    },
    0,
  );

  const selectedRows = campaignsToIncreaseBudget.reduce(
    //disabled to satisfy the callback requirement on .reduce
    //eslint-disable-next-line local-rules/no-large-method-params
    (accumulator: number[], row: BulkIncreaseBudgetCampaign, index: number) => {
      if (selectedCampaignIds.includes(row.campaign_id)) {
        accumulator = [...accumulator, index];
      }
      return accumulator;
    },
    [],
  );

  const onIncreaseBudgetRowSelectionToggled = ({
    row,
    selected,
  }: RowSelectionArgs<BulkIncreaseBudgetCampaign>) => {
    if (selected) {
      addCampaign(row);
    } else {
      removeCampaign(row);
    }
  };

  const addCampaign = (row: BulkIncreaseBudgetCampaign) => {
    if (!selectedCampaignIds.includes(row.campaign_id)) {
      setSelectedCampaignIds((prevCampaignIds) => [
        ...prevCampaignIds,
        row.campaign_id,
      ]);
    }
  };

  const removeCampaign = (row: BulkIncreaseBudgetCampaign) => {
    setSelectedCampaignIds((prevCampaignIds) => {
      const idIndex = prevCampaignIds.indexOf(row.campaign_id);
      return prevCampaignIds.filter((_, index) => {
        return index !== idIndex;
      });
    });
  };

  const setCampaignValid = (row: BulkIncreaseBudgetCampaign) => {
    if (!validCampaignIds.includes(row.campaign_id)) {
      setValidCampaignIds([...validCampaignIds, row.campaign_id]);
    }
  };

  const setCampaignInvalid = (row: BulkIncreaseBudgetCampaign) => {
    const idIndex = validCampaignIds.indexOf(row.campaign_id);
    if (idIndex > -1) {
      setValidCampaignIds(
        validCampaignIds.filter((_, index) => {
          return index !== idIndex;
        }),
      );
    }
  };

  const validateBudget = () => {
    if (maxAllowedSpending < totalBudgetToAdd || totalBudgetToAdd <= 0) {
      toastStore.error(i`Total budget to add cannot exceed Available balance`);
      return false;
    }
    return !campaignsToIncreaseBudget.some(
      (row) =>
        selectedCampaignIds.includes(row.campaign_id) &&
        !validCampaignIds.includes(row.campaign_id),
    );
  };

  const actionButtonProps = {
    text: i`Add budget`,
    isDisabled:
      selectedCampaignIds.length === 0 ||
      totalBudgetToAdd <= 0 ||
      isNaN(totalBudgetToAdd),
    onClick: async () => {
      if (!validateBudget()) {
        return;
      }
      setDisplayingConfirmationTable(true);
    },
  };

  const cancelButtonProps = {
    text: i`Cancel`,
    onClick: () => {
      onClose();
    },
  };

  const confirmationSecondaryButtonProps = {
    text: i`Confirm`,
    onClick: async () => {
      const params = {
        add_budget_data: JSON.stringify(increaseCampaigns),
        max_spending_displayed: maxAllowedSpending,
      };
      let response;
      try {
        response = await productBoostApi
          .bulkIncreaseCampaignBudget(params)
          .call();
      } catch (e) {
        response = e;
      }
      if (response.code === 0 && response.data) {
        toastStore.positive(i`Your campaign budgets have been updated!`, {
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

  const confirmationCancelButtonProps = {
    text: i`Cancel`,
    onClick: () => {
      setDisplayingConfirmationTable(false);
    },
  };

  const renderAddBudgetField = (row: BulkIncreaseBudgetCampaign) => {
    const budgetAdded = campaignToBudgetMap.get(row.campaign_id);
    const suggestedBudget = row.suggested_budget;
    const budgetAddedString =
      budgetAdded != null ? budgetAdded.toString() : suggestedBudget.toString();
    return (
      <CurrencyInput
        padding={2}
        currencyCode={currencyCode}
        value={budgetAddedString}
        onChange={({ textAsNumber }: OnTextChangeEvent) => {
          const newCampaignToBudgetMap = new Map(campaignToBudgetMap);
          newCampaignToBudgetMap.set(row.campaign_id, textAsNumber);
          setCampaignToBudgetMap(newCampaignToBudgetMap);
        }}
        onValidityChanged={(
          isValid: boolean,
          errorMessage: string | null | undefined,
        ) => {
          if (isValid) {
            setCampaignValid(row);
          } else {
            setCampaignInvalid(row);
          }
        }}
        placeholder={row.min_budget_to_add.toFixed(2)}
      />
    );
  };

  const renderConfirmationTotalBudgetField = (
    row: BulkIncreaseBudgetCampaign,
  ) => {
    const addedBudget = campaignToBudgetMap.get(row.campaign_id);
    if (addedBudget == null) {
      return null;
    }
    return formatCurrency(addedBudget + row.budget, currencyCode);
  };

  const renderConfirmationAddedBudgetField = (
    row: BulkIncreaseBudgetCampaign,
  ) => {
    const addedBudget = campaignToBudgetMap.get(row.campaign_id);
    if (addedBudget == null) {
      return null;
    }
    return formatCurrency(addedBudget, currencyCode);
  };

  const renderCampaignName = (campaign: BulkIncreaseBudgetCampaign) => {
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

  const selectedCampaignsToIncreaseBudget = campaignsToIncreaseBudget.filter(
    (row) => {
      return selectedCampaignIds.includes(row.campaign_id);
    },
  );

  const increaseCampaigns = selectedCampaignsToIncreaseBudget.reduce(
    (accumulator, row) => {
      (accumulator as any)[row.campaign_id] = {
        budget_to_add: campaignToBudgetMap.get(row.campaign_id),
        suggested_budget: row.suggested_budget,
      };
      return accumulator;
    },
    {},
  );

  const renderSpendOverGmvField = (campaign: BulkIncreaseBudgetCampaign) => {
    let spendOverGmv;
    if (campaign.gmv > 0 && campaign.spend != null) {
      spendOverGmv = numeral(campaign.spend / campaign.gmv).format("0.00%");
    } else {
      spendOverGmv = i`No data`;
    }
    return <div>{spendOverGmv}</div>;
  };

  if (displayingConfirmationTable) {
    return (
      <div className={css(styles.root)}>
        <div className={css(styles.upper)}>
          {campaignsToIncreaseBudget.length > 2 || (
            <Illustration
              className={css(styles.illustration)}
              name={"productBoostHomepageBudget"}
              alt={""}
            />
          )}
          <Text weight="bold" className={css(styles.title)}>
            Confirm budget update
          </Text>
          <Table
            key="confirmation"
            className={css(styles.campaignsTable)}
            data={selectedCampaignsToIncreaseBudget}
            fixLayout
            overflowY="visible"
            highlightRowOnHover
            rowHeight={68}
          >
            <Table.Column title={i`Campaign`} columnKey="campaign_name">
              {({ row }) => renderCampaignName(row)}
            </Table.Column>
            <Table.CurrencyColumn
              title={i`Original Budget`}
              columnKey="budget"
              currencyCode={currencyCode}
            />
            <Table.Column title={i`New Budget`} columnKey="min_budget_to_add">
              {({ row }) => renderConfirmationTotalBudgetField(row)}
            </Table.Column>
            <Table.Column
              title={i`Budget to Add`}
              columnKey="min_budget_to_add"
            >
              {({ row }) => renderConfirmationAddedBudgetField(row)}
            </Table.Column>
          </Table>
        </div>
        <div className={css(styles.fade)} />
        <div className={css(styles.balance)}>
          <Text weight="bold" className={css(styles.balanceHeader)}>
            Remaining available balance:
          </Text>
          <Text weight="regular" className={css(styles.balanceValue)}>
            {formatCurrency(
              maxAllowedSpending - totalBudgetToAdd,
              currencyCode,
            )}
          </Text>
          <Text weight="bold" className={css(styles.balanceHeader)}>
            Total budget added:
          </Text>
          <div className={css(styles.balanceValue)}>
            {formatCurrency(totalBudgetToAdd, currencyCode)}
          </div>
        </div>
        <div className={css(styles.footerContainer)}>
          <ModalFooter
            layout="horizontal-centered"
            action={confirmationSecondaryButtonProps}
            cancel={confirmationCancelButtonProps}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.upper)}>
        {campaignsToIncreaseBudget.length > 2 || (
          <Illustration
            className={css(styles.illustration)}
            name={"productBoostHomepageBudget"}
            alt={""}
          />
        )}
        <Text weight="bold" className={css(styles.title)}>
          Increase budget for depleted ProductBoost campaigns
        </Text>
        <Table
          key="addBudget"
          className={css(styles.campaignsTable)}
          data={campaignsToIncreaseBudget}
          overflowY="visible"
          highlightRowOnHover
          selectedRows={selectedRows}
          canSelectRow={() => true}
          onRowSelectionToggled={onIncreaseBudgetRowSelectionToggled}
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
            title={i`Original Budget`}
            columnKey="budget"
            width={150}
            currencyCode={currencyCode}
          />
          <Table.CurrencyColumn
            title={i`Current Spend`}
            columnKey="spend"
            width={150}
            currencyCode={currencyCode}
          />
          <Table.Column title={i`Spend / GMV`} columnKey="spend" width={150}>
            {({ row }) => renderSpendOverGmvField(row)}
          </Table.Column>
          <Table.Column
            title={i`Budget to Add`}
            columnKey="min_budget_to_add"
            width={150}
          >
            {({ row }) => renderAddBudgetField(row)}
          </Table.Column>
        </Table>
      </div>
      <div className={css(styles.fade)} />
      <div className={css(styles.balance)}>
        <Text weight="bold" className={css(styles.balanceHeader)}>
          Available balance:
        </Text>
        <Text weight="regular" className={css(styles.balanceValue)}>
          {formatCurrency(maxAllowedSpending, currencyCode)}
        </Text>
        <Text weight="bold" className={css(styles.balanceHeader)}>
          Total budget to add:
        </Text>
        <Text weight="regular" className={css(styles.balanceValue)}>
          {formatCurrency(totalBudgetToAdd, currencyCode)}
        </Text>
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

export default observer(BulkIncreaseBudgetModalContent);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#318562",
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
          backgroundImage: "linear-gradient(to bottom, #0000, #318562)",
        },
        illustration: {
          width: "150px",
          height: "110px",
          marginBottom: "12px",
        },
        title: {
          fontSize: 28,
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
          lineHeight: 1.5,
          color: palettes.textColors.White,
          marginLeft: "24px",
        },
        balanceValue: {
          fontSize: 16,
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
    [],
  );
};

export class BulkIncreaseBudgetModal extends Modal {
  contentProps: BulkIncreaseBudgetModalContentProps;

  constructor(props: BulkIncreaseBudgetModalContentProps) {
    super(() => null);

    this.contentProps = props;

    this.setTopPercentage(0.2);
    this.setWidthPercentage(0.63);
  }

  renderContent() {
    const { contentProps } = this;
    return (
      <BulkIncreaseBudgetModalContent
        {...contentProps}
        onClose={() => this.close()}
      />
    );
  }
}
