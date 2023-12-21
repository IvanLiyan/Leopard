import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import numeral from "numeral";

/* Lego Components */
import {
  CopyButton,
  CurrencyInput,
  Link,
  Table,
  Text,
  OnTextChangeEvent,
  RowSelectionArgs,
  Layout,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { css } from "@core/toolkit/styling";
import { formatCurrency } from "@core/toolkit/currency";
import ModalFooter from "@core/components/modal/ModalFooter";
import Illustration from "@core/components/Illustration";
import {
  BulkIncreaseBudgetCampaign,
  BulkIncreaseCampaignBudgetParams,
  PB_ADD_CAMPAIGN_BUDGET_BULK_ENDPOINT,
} from "@home/toolkit/product-boost";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import { PaymentCurrencyCode } from "@schema";
import { useToastStore } from "@core/stores/ToastStore";
import { useMutation } from "@core/toolkit/restApi";
import ModalTitle from "@core/components/modal/ModalTitle";
import { merchFeUrl } from "@core/toolkit/router";

export type BulkIncreaseBudgetModalProps = BaseProps &
  Pick<ModalProps, "open"> & {
    readonly campaignsToIncreaseBudget?: ReadonlyArray<BulkIncreaseBudgetCampaign>;
    readonly maxAllowedSpending?: number;
    readonly onClose: () => unknown;
    readonly currencyCode: PaymentCurrencyCode;
  };

const BulkIncreaseBudgetModal: React.FC<BulkIncreaseBudgetModalProps> = ({
  campaignsToIncreaseBudget = [],
  maxAllowedSpending,
  onClose,
  open,
  currencyCode,
}) => {
  const styles = useStylesheet();

  const toastStore = useToastStore();

  const initalCampaignIds = campaignsToIncreaseBudget.map(
    (campaign) => campaign.campaign_id,
  );
  const initialCampaignToBudgetMap: Map<string, number> = new Map();
  campaignsToIncreaseBudget.forEach((campaign) => {
    initialCampaignToBudgetMap.set(
      campaign.campaign_id,
      campaign.suggested_budget,
    );
  });

  const [selectedCampaignIds, setSelectedCampaignIds] =
    useState(initalCampaignIds);
  const [validCampaignIds, setValidCampaignIds] = useState(initalCampaignIds);
  const [campaignToBudgetMap, setCampaignToBudgetMap] = useState<
    Map<string, number | null | undefined>
  >(initialCampaignToBudgetMap);
  const [displayingConfirmationTable, setDisplayingConfirmationTable] =
    useState(false);

  const totalBudgetToAdd = campaignsToIncreaseBudget.reduce(
    (accumulator, row) => {
      if (selectedCampaignIds.includes(row.campaign_id)) {
        accumulator += campaignToBudgetMap.get(row.campaign_id) ?? 0;
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
    if ((maxAllowedSpending ?? 0) < totalBudgetToAdd || totalBudgetToAdd <= 0) {
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
    onClick: () => {
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

  const { trigger: bulkIncreaseCampaignBudget } = useMutation<
    {
      code: number;
      data: unknown;
    },
    BulkIncreaseCampaignBudgetParams
  >({
    url: PB_ADD_CAMPAIGN_BUDGET_BULK_ENDPOINT,
  });

  const confirmationSecondaryButtonProps = {
    text: i`Confirm`,
    onClick: async () => {
      if (maxAllowedSpending == null) {
        return;
      }
      const params = {
        add_budget_data: JSON.stringify(increaseCampaigns),
        max_spending_displayed: maxAllowedSpending,
      };
      let response;
      try {
        response = await bulkIncreaseCampaignBudget(params);
      } catch (e) {
        if (typeof e == "object" && e != null) {
          toastStore.error(
            (e as { msg?: string }).msg ?? i`Something went wrong`,
          );
        } else {
          toastStore.error(i`Something went wrong`);
        }
      }
      if (response != null && response.code === 0 && response.data) {
        toastStore.positive(i`Your campaign budgets have been updated!`, {
          timeoutMs: 5000,
          link: {
            title: i`View campaigns`,
            url: merchFeUrl(`/product-boost/history/list`),
          },
        });
        onClose();
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
        style={{ width: 150 }}
        currencyCode={currencyCode}
        value={budgetAddedString}
        onChange={({ textAsNumber }: OnTextChangeEvent) => {
          const newCampaignToBudgetMap = new Map(campaignToBudgetMap);
          newCampaignToBudgetMap.set(row.campaign_id, textAsNumber);
          setCampaignToBudgetMap(newCampaignToBudgetMap);
        }}
        onValidityChanged={(isValid: boolean) => {
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
    const url = merchFeUrl(`/product-boost/detail/${campaign.campaign_id}`);

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

  const increaseCampaigns = selectedCampaignsToIncreaseBudget.reduce<
    Record<
      string,
      {
        budget_to_add: number | null | undefined;
        suggested_budget: number;
      }
    >
  >((accumulator, row) => {
    accumulator[row.campaign_id] = {
      budget_to_add: campaignToBudgetMap.get(row.campaign_id),
      suggested_budget: row.suggested_budget,
    };
    return accumulator;
  }, {});

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
      <Modal open={open} onClose={() => onClose()} maxWidth="md">
        <ModalTitle
          onClose={() => onClose()}
          title={i`Increase ProductBoost Budget`}
        />
        <Layout.FlexColumn alignItems="stretch">
          <Layout.FlexColumn
            className={css(styles.content)}
            alignItems="center"
            justifyContent="center"
          >
            <Illustration
              className={css(styles.illustration)}
              name={"homePbModalBudget"}
              alt={""}
            />
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
              <Table.Column
                _key={undefined}
                title={i`Campaign`}
                columnKey="campaign_name"
              >
                {({ row }: { row: BulkIncreaseBudgetCampaign }) =>
                  renderCampaignName(row)
                }
              </Table.Column>
              <Table.CurrencyColumn
                _key={undefined}
                title={i`Original Budget`}
                columnKey="budget"
                currencyCode={currencyCode}
              />
              <Table.Column
                _key={undefined}
                title={i`New Budget`}
                columnKey="min_budget_to_add"
              >
                {({ row }: { row: BulkIncreaseBudgetCampaign }) =>
                  renderConfirmationTotalBudgetField(row)
                }
              </Table.Column>
              <Table.Column
                _key={undefined}
                title={i`Budget to Add`}
                columnKey="min_budget_to_add"
              >
                {({ row }: { row: BulkIncreaseBudgetCampaign }) =>
                  renderConfirmationAddedBudgetField(row)
                }
              </Table.Column>
            </Table>
            <div className={css(styles.balance)}>
              {maxAllowedSpending && (
                <>
                  <Text weight="bold" className={css(styles.balanceHeader)}>
                    Remaining available balance:
                  </Text>
                  <Text weight="regular" className={css(styles.balanceValue)}>
                    {formatCurrency(
                      maxAllowedSpending - totalBudgetToAdd,
                      currencyCode,
                    )}
                  </Text>
                </>
              )}
              <Text weight="bold" className={css(styles.balanceHeader)}>
                Total budget added:
              </Text>
              <div className={css(styles.balanceValue)}>
                {formatCurrency(totalBudgetToAdd, currencyCode)}
              </div>
            </div>
          </Layout.FlexColumn>
          <ModalFooter
            layout="horizontal-centered"
            action={confirmationSecondaryButtonProps}
            cancel={confirmationCancelButtonProps}
          />
        </Layout.FlexColumn>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={() => onClose()} maxWidth="md">
      <ModalTitle
        onClose={() => onClose()}
        title={i`Increase ProductBoost Budget`}
      />
      <Layout.FlexColumn alignItems="stretch">
        <Layout.FlexColumn
          className={css(styles.content)}
          alignItems="center"
          justifyContent="center"
        >
          <Illustration
            className={css(styles.illustration)}
            name={"homePbModalBudget"}
            alt={""}
          />
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
              _key={undefined}
              title={i`Campaign`}
              columnKey="campaign_name"
            >
              {({ row }: { row: BulkIncreaseBudgetCampaign }) =>
                renderCampaignName(row)
              }
            </Table.Column>
            <Table.CurrencyColumn
              _key={undefined}
              title={i`Original Budget`}
              columnKey="budget"
              currencyCode={currencyCode}
            />
            <Table.CurrencyColumn
              _key={undefined}
              title={i`Current Spend`}
              columnKey="spend"
              currencyCode={currencyCode}
            />
            <Table.Column
              _key={undefined}
              title={i`Spend / GMV`}
              columnKey="spend"
            >
              {({ row }: { row: BulkIncreaseBudgetCampaign }) =>
                renderSpendOverGmvField(row)
              }
            </Table.Column>
            <Table.Column
              _key={undefined}
              title={i`Budget to Add`}
              columnKey="min_budget_to_add"
            >
              {({ row }: { row: BulkIncreaseBudgetCampaign }) =>
                renderAddBudgetField(row)
              }
            </Table.Column>
          </Table>
          {maxAllowedSpending != null && (
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
          )}
        </Layout.FlexColumn>
        <ModalFooter
          layout="horizontal-centered"
          action={actionButtonProps}
          cancel={cancelButtonProps}
        />
      </Layout.FlexColumn>
    </Modal>
  );
};

export default observer(BulkIncreaseBudgetModal);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: 24,
          overflow: "hidden",
          maxWidth: "calc(100% - 48px)",
        },
        illustration: {
          width: "150px",
          height: "110px",
          marginBottom: 16,
        },
        title: {
          fontSize: 28,
          marginBottom: 16,
          lineHeight: 1.4,
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
          marginLeft: "24px",
        },
        balanceValue: {
          fontSize: 16,
          lineHeight: 1.5,
          margin: "0 24px",
        },
        campaignsTable: {
          marginBottom: 16,
          alignSelf: "flex-start",
          maxWidth: "calc(100% - 2px)",
          overflowX: "scroll",
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
