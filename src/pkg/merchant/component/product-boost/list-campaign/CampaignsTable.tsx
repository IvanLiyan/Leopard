import React, { useMemo, useCallback } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import numeral from "numeral";

/* Legacy */
import ProductBoostBuyCreditsModal from "@legacy/view/modal/ProductBoostBuyCredits";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { Switch } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";
import { CopyButton } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { Info } from "@ContextLogic/lego";
import { TableAction } from "@ContextLogic/lego";
import { SortOrder } from "@ContextLogic/lego";

/* Lego Toolkit */
import { weightMedium, proxima } from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Components */
import BonusBudgetForm from "@merchant/component/product-boost/BonusBudgetForm";
import BudgetTextInput from "@merchant/component/product-boost/BudgetTextInput";
import CampaignActionModal from "@merchant/component/product-boost/modals/CampaignActionModal";
import CampaignDateInput from "@merchant/component/product-boost/CampaignDateInput";
import CampaignDetailRow from "@merchant/component/product-boost/CampaignDetailRow";
import CampaignDiscountIndicator from "@merchant/component/product-boost/CampaignDiscountIndicator";
import CampaignStatusLabel from "@merchant/component/product-boost/CampaignStatusLabel";
import { CampaignActions } from "@merchant/component/product-boost/modals/CampaignActionModal";
import FlexibleBudgetForm from "@merchant/component/product-boost/FlexibleBudgetForm";
import WishSubsidyBudgetForm from "@merchant/component/product-boost/WishSubsidyBudgetForm";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";

/* Merchant Model */
import CampaignModel from "@merchant/model/product-boost/Campaign";

/* Toolkit */
import { log } from "@toolkit/logger";
import { zendeskURL } from "@toolkit/url";
import {
  CampaignActionsHelper,
  CampaignAction,
} from "@toolkit/product-boost/utils/campaign-actions";
import { ProductBoostCampaignExplanations } from "@toolkit/product-boost/resources/tooltip";

/* Merchant Store */
import { useProductBoostStore } from "@merchant/stores/product-boost/ProductBoostStore";
import {
  useProductBoostMerchantInfo,
  useProductBoostProperty,
} from "@merchant/stores/product-boost/ProductBoostContextStore";
import DimenStore from "@merchant/stores/DimenStore";
import ToastStore from "@merchant/stores/ToastStore";

/* Types Imports */
import { Campaign } from "@merchant/api/product-boost";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CurrencyCode } from "@toolkit/currency";
import NavigationStore from "@merchant/stores/NavigationStore";

const BaseUrl = "/product-boost/history/list";
const ButtonClicksLogTableName = "PRODUCT_BOOST_NEW_PAGES_BUTTON_CLICK";
const OneClickAutomatedCampaignTableName =
  "PRODUCT_BOOST_ONE_CLICK_DUPLICATE_AUTOMATED";

const SortByType = {
  campaignID: "campaign_id",
  startDate: "start_time",
  endDate: "end_time",
};

export type CampaignsTableProps = BaseProps & {
  readonly campaigns: ReadonlyArray<Campaign>;
  readonly onCampaignUpdated?: () => unknown;
  readonly onUpdateAllowedSpending?: () => unknown;
  readonly enableEvergreenCampaign?: (campaignId: string) => unknown;
  readonly maxAllowedSpending?: number;
  // Track the source of add-budget action
  readonly fromNoti?: number | null | undefined;
};

const CampaignsTable = (props: CampaignsTableProps) => {
  const {
    className,
    campaigns,
    enableEvergreenCampaign,
    maxAllowedSpending = 0.0,
    onCampaignUpdated,
    onUpdateAllowedSpending,
    fromNoti,
  } = props;
  const {
    filterSetting,
    listElements: { expandedRows },
    merchant,
  } = useProductBoostStore();
  const productBoostMerchantInfoResult = useProductBoostMerchantInfo();
  const productBoostCampaignInfoResult = useProductBoostProperty();
  const minStartDateUnix =
    productBoostCampaignInfoResult?.campaignProperty.minStartDate.unix || 0;
  const maxStartDateUnix =
    productBoostCampaignInfoResult?.campaignProperty.maxStartDate.unix || 0;
  const minStartDate = useMemo(() => new Date(minStartDateUnix * 1000), [
    minStartDateUnix,
  ]);
  const maxStartDate = useMemo(() => new Date(maxStartDateUnix * 1000), [
    maxStartDateUnix,
  ]);
  const maxNumWeeks =
    productBoostCampaignInfoResult?.campaignProperty.maxNumWeeks || 0;
  const styles = useStyleSheet();
  const allowLocalizedCurrency =
    productBoostMerchantInfoResult?.marketing.currentMerchant
      .allowLocalizedCurrency || false;
  const merchantSourceCurrency =
    productBoostMerchantInfoResult?.currentMerchant.primaryCurrency || "USD";
  const allowMaxboost =
    productBoostMerchantInfoResult?.marketing.currentMerchant.allowMaxboost ||
    false;
  const currencyCode = useMemo(() => {
    const currencyCode = merchantSourceCurrency || "USD";
    return allowLocalizedCurrency ? currencyCode : "USD";
  }, [allowLocalizedCurrency, merchantSourceCurrency]);

  const renderAutomatedCampaignActionModal = useCallback(
    async (campaign: Campaign, action: CampaignActions) => {
      if (productBoostCampaignInfoResult == null) {
        return;
      }
      const toastStore = ToastStore.instance();
      const campaignId = campaign.campaign_id;
      const resp = await productBoostApi
        .getCampaignBudgetBreakdown({
          campaign_id: campaignId,
        })
        .call();

      if (resp.code !== 0 || !resp.data) {
        if (resp.msg) {
          toastStore.error(resp.msg);
        }
        return;
      }

      const modalCurrencyCode =
        action == "EnabledAutomated"
          ? campaign.localized_currency
          : currencyCode;

      const modal = new CampaignActionModal({
        action,
        campaignId,
        campaignName: campaign.campaign_name,
        startDate: campaign.start_time,
        endDate: campaign.end_time,
        onCampaignUpdated,
        onUpdateAllowedSpending,
        maxBudget: resp.data.merchant_budget,
        maxSpendingBreakdown: resp.data.max_spending_breakdown,
        maxAllowedSpending: resp.data.max_allowed_spending,
        isPayable: resp.data.is_payable,
        hasMaxboostProduct: campaign.has_maxboost_product,
        discount: resp.data.discount_factor,
        currencyCode: modalCurrencyCode,
        productCount: campaign.products ? campaign.products.length : 0,
        showSuggestedBudget: resp.data.show_suggested_budget,
        suggestedBudget: resp.data.suggested_budget,
        flexibleBudgetEnabled: resp.data.flexible_budget_enabled,
        flexibleBudgetType: campaign.flexible_budget_type,
        minStartDate,
        maxStartDate,
        allowMaxboost,
        maxNumWeeks,
      });
      modal.render();
    },
    [
      currencyCode,
      onCampaignUpdated,
      onUpdateAllowedSpending,
      minStartDate,
      maxStartDate,
      productBoostCampaignInfoResult,
      allowMaxboost,
      maxNumWeeks,
    ]
  );
  const renderAddBudgetModal = useCallback(
    async (campaign: Campaign) => {
      const toastStore = ToastStore.instance();
      const campaignId = campaign.campaign_id;
      const resp = await productBoostApi
        .getCampaignBudgetBreakdown({
          campaign_id: campaignId,
        })
        .call();
      if (resp.code !== 0 || !resp.data) {
        if (resp.msg) {
          toastStore.error(resp.msg);
        }
        return;
      }

      const modal = new CampaignActionModal({
        action: "AddBudget",
        maxSpendingBreakdown: resp.data.max_spending_breakdown,
        maxAllowedSpending: resp.data.max_allowed_spending,
        maxBudget: resp.data.merchant_budget,
        campaignId,
        campaignName: campaign.campaign_name,
        startDate: campaign.start_time,
        endDate: campaign.end_time,
        isPayable: resp.data.is_payable,
        onCampaignUpdated,
        onUpdateAllowedSpending,
        showSuggestedBudget: resp.data.show_suggested_budget,
        suggestedBudget: resp.data.suggested_budget,
        discount: resp.data.discount_factor,
        fromNoti,
        flexibleBudgetEnabled: resp.data.flexible_budget_enabled,
        flexibleBudgetType: campaign.flexible_budget_type,
        minStartDate,
        maxStartDate,
        allowMaxboost,
        maxNumWeeks,
      });
      modal.render();
    },
    [
      fromNoti,
      onCampaignUpdated,
      onUpdateAllowedSpending,
      minStartDate,
      maxStartDate,
      allowMaxboost,
      maxNumWeeks,
    ]
  );

  const duplicateAutomatedCampaign = useCallback(
    async (campaign: Campaign) => {
      const toastStore = ToastStore.instance();
      const navigationStore = NavigationStore.instance();

      const campaignId = campaign.campaign_id;
      const hasMaxboostProduct = campaign.has_maxboost_product;
      let resp;
      try {
        resp = await productBoostApi
          .duplicateAutomatedCampaign({
            campaign_id: campaignId,
            is_maxboost: hasMaxboostProduct,
            dup_source: 4,
          })
          .call();
      } catch (e) {
        resp = e;
      }
      log(OneClickAutomatedCampaignTableName, {
        merchant_id: campaign.merchant_id,
        campaign_id: campaign.campaign_id,
        action: "duplicate",
        resp_code: resp.code,
      });

      if (resp.code === 0 && resp.data) {
        const newCampaignId = resp.data.new_campaign_id;
        toastStore.positive(i`Your campaign is duplicated successfully`, {
          timeoutMs: 5000,
          link: {
            title: i`View details`,
            url: `/product-boost/detail/${newCampaignId}`,
          },
        });
        if (onUpdateAllowedSpending == null || onCampaignUpdated == null) {
          navigationStore.reload();
        } else {
          onUpdateAllowedSpending();
          if (onCampaignUpdated) {
            onCampaignUpdated();
          }
        }
        return;
      }
      await renderAutomatedCampaignActionModal(campaign, "DuplicateAutomated");
    },
    [
      onCampaignUpdated,
      onUpdateAllowedSpending,
      renderAutomatedCampaignActionModal,
    ]
  );

  const enableAutomatedCampaign = useCallback(
    async (campaign: Campaign) => {
      const toastStore = ToastStore.instance();
      const navigationStore = NavigationStore.instance();

      const campaignId = campaign.campaign_id;
      const hasMaxboostProduct = campaign.has_maxboost_product;
      let resp;
      try {
        resp = await productBoostApi
          .enableCampaign({
            campaign_id: campaignId,
            is_maxboost: hasMaxboostProduct,
            caller_source: "CampaignTableEnable",
          })
          .call();
      } catch (e) {
        resp = e;
      }
      log(OneClickAutomatedCampaignTableName, {
        merchant_id: campaign.merchant_id,
        campaign_id: campaignId,
        action: "enable",
        resp_code: resp.code,
      });
      if (resp.code === 0) {
        toastStore.positive(i`Your campaign is enabled successfully`, {
          timeoutMs: 5000,
          link: {
            title: i`View details`,
            url: `/product-boost/detail/${campaignId}`,
          },
        });
        if (onUpdateAllowedSpending == null || onCampaignUpdated == null) {
          navigationStore.reload();
        } else {
          onUpdateAllowedSpending();
          if (onCampaignUpdated) {
            onCampaignUpdated();
          }
        }
        return;
      }
      await renderAutomatedCampaignActionModal(campaign, "EnabledAutomated");
    },
    [
      onCampaignUpdated,
      onUpdateAllowedSpending,
      renderAutomatedCampaignActionModal,
    ]
  );

  const tableActions = useMemo((): ReadonlyArray<TableAction> => {
    const navigationStore = NavigationStore.instance();
    if (productBoostCampaignInfoResult == null) {
      return [];
    }
    const actionsHelper = new CampaignActionsHelper({
      minStartDateUnix,
      maxStartDateUnix,
    });
    const actionButtonProps: TableAction[] = [
      {
        key: "ENABLE_AUTOMATED",
        name: i`Enable`,
        canBatch: false,
        canApplyToRow: (campaign: Campaign) => false,
        apply: async ([campaign]: ReadonlyArray<Campaign>) => {
          await enableAutomatedCampaign(campaign);
          log(ButtonClicksLogTableName, {
            merchant_id: campaign.merchant_id,
            campaign_id: campaign.campaign_id,
            bucket: "show",
            button: "enable_automated",
          });
        },
      },
      {
        key: "DUPLICATE_AUTOMATED_CAMPAIGN",
        name: i`Duplicate`,
        canBatch: false,
        canApplyToRow: (campaign: Campaign) => false,
        apply: async ([campaign]: ReadonlyArray<Campaign>) => {
          await duplicateAutomatedCampaign(campaign);

          log(ButtonClicksLogTableName, {
            merchant_id: campaign.merchant_id,
            campaign_id: campaign.campaign_id,
            bucket: "show",
            button: "duplicate_automated",
          });
        },
      },
      {
        key: "ADD_BUDGET",
        name: i`Add Budget`,
        canBatch: false,
        canApplyToRow: (campaign: Campaign) => false,
        apply: async ([campaign]: ReadonlyArray<Campaign>) => {
          await renderAddBudgetModal(campaign);
        },
      },
      {
        key: "ENABLE_EVERGREEN",
        name: i`Enable`,
        canBatch: false,
        canApplyToRow: (campaign: Campaign) => false,
        apply: async ([campaign]: ReadonlyArray<Campaign>) => {
          if (enableEvergreenCampaign) {
            await enableEvergreenCampaign(campaign.campaign_id);
          }
        },
      },
      {
        key: "RECHARGE_EVERGREEN",
        name: i`Recharge`,
        canBatch: false,
        canApplyToRow: (campaign: Campaign) => false,
        apply: ([campaign]: ReadonlyArray<Campaign>) => {
          let chargeAmount = campaign.max_budget - maxAllowedSpending;
          // The min number we charge user is $1
          if (chargeAmount < campaign.min_budget_to_add) {
            chargeAmount = campaign.min_budget_to_add;
          }
          chargeAmount = Math.ceil(chargeAmount * 100) / 100;
          const redirectPath = `${BaseUrl}?enable_campaign_id=${campaign.campaign_id}`;

          const chargeParams = {
            item_type: "0",
            amount: chargeAmount,
            reason_type: 1,
            redirect_path: redirectPath,
            reference_page: "/product-boost/history/list",
            flow_type: 1,
            currency: currencyCode,
            pb_v2: campaign.is_v2,
          };
          const modal = new ProductBoostBuyCreditsModal(
            chargeAmount,
            chargeParams
          );
          modal.render();
        },
      },
      {
        key: "EDIT",
        name: i`Edit`,
        canBatch: false,
        canApplyToRow: (campaign: Campaign) => false,
        apply: ([campaign]: ReadonlyArray<Campaign>) => {
          window.open(`/product-boost/edit/${campaign.campaign_id}`);
        },
      },
      {
        key: "CANCEL",
        name: i`Cancel`,
        canBatch: false,
        canApplyToRow: (campaign: Campaign) => false,
        apply: ([campaign]: ReadonlyArray<Campaign>) => {
          new ConfirmationModal(
            i`Are you sure you want to cancel this campaign?`
          )
            .setHeader({
              title: i`Confirmation`,
            })
            .setCancel(i`No`)
            .setAction(i`Yes`, async () => {
              await productBoostApi
                .cancelCampaign({
                  campaign_id: campaign.campaign_id,
                })
                .call();
              if (
                onUpdateAllowedSpending == null ||
                onCampaignUpdated == null
              ) {
                navigationStore.reload();
              } else {
                onUpdateAllowedSpending();
                if (onCampaignUpdated) {
                  onCampaignUpdated();
                }
              }
            })
            .render();
        },
      },
      {
        key: "STOP",
        name: i`Stop`,
        canBatch: false,
        canApplyToRow: (campaign: Campaign) => false,
        apply: ([campaign]: ReadonlyArray<Campaign>) => {
          new ConfirmationModal(i`Are you sure you want to stop this campaign?`)
            .setHeader({
              title: i`Confirmation`,
            })
            .setCancel(i`No`)
            .setAction(i`Yes`, async () => {
              await productBoostApi
                .stopCampaign({
                  campaign_id: campaign.campaign_id,
                })
                .call();
              if (
                onUpdateAllowedSpending == null ||
                onCampaignUpdated == null
              ) {
                navigationStore.reload();
              } else {
                onUpdateAllowedSpending();
                if (onCampaignUpdated) {
                  onCampaignUpdated();
                }
              }
            })
            .render();
        },
      },
      {
        key: "DUPLICATE_CAMPAIGN",
        name: i`Duplicate`,
        canBatch: false,
        canApplyToRow: (campaign: Campaign) => false,
        apply: ([campaign]: ReadonlyArray<Campaign>) => {
          const title =
            i`In order to duplicate a running auto ` +
            i`renew campaign, please turn off auto renew or stop campaign.`;
          if (campaign.state === "STARTED" && campaign.is_evergreen) {
            new ConfirmationModal(title)
              .setHeader({
                title: i`Duplicate Campaign`,
              })
              .setAction(i`OK`, () => {})
              .render();
          } else {
            window.open(
              `/product-boost/v2/create?dup_campaign_id=${campaign.campaign_id}`
            );
          }
        },
      },
      {
        key: "VIEW",
        name: i`View`,
        canBatch: false,
        canApplyToRow: (campaign: Campaign) => true,
        apply: ([campaign]: ReadonlyArray<Campaign>) => {
          window.open(`/product-boost/detail/${campaign.campaign_id}`);
        },
      },
    ];

    return actionButtonProps.map((buttonProp) => {
      return {
        ...buttonProp,
        canApplyToRow(campaign: Campaign) {
          return actionsHelper.canApply({
            campaign: CampaignModel.fromMongoCampaign(campaign),
            action: buttonProp.key as CampaignAction,
            maxAllowedSpending: maxAllowedSpending || 0,
          });
        },
      };
    });
  }, [
    currencyCode,
    duplicateAutomatedCampaign,
    enableAutomatedCampaign,
    enableEvergreenCampaign,
    maxAllowedSpending,
    onCampaignUpdated,
    onUpdateAllowedSpending,
    renderAddBudgetModal,
    productBoostCampaignInfoResult,
    maxStartDateUnix,
    minStartDateUnix,
  ]);

  const sortBy: string = filterSetting.sortBy || SortByType.campaignID;

  const orderBy: SortOrder = filterSetting.orderBy || "not-applied";

  const startDateSortOrder: SortOrder =
    sortBy === SortByType.startDate ? orderBy : "not-applied";

  const endDateSortOrder: SortOrder =
    sortBy === SortByType.endDate ? orderBy : "not-applied";

  const expandedRowsIndices: ReadonlyArray<number> = Array.from(
    expandedRows.keys()
  )
    .filter((row) => expandedRows.get(row))
    .map((row) => Math.round(row));

  const onStartDateSortToggled = (sortOrder: SortOrder) => {
    filterSetting.offset = 0;
    if (sortOrder === "not-applied") {
      filterSetting.orderBy = null;
      filterSetting.sortBy = null;
    } else {
      filterSetting.orderBy = sortOrder;
      filterSetting.sortBy = SortByType.startDate;
    }
    expandedRows.clear();
  };

  const onEndDateSortToggled = (sortOrder: SortOrder) => {
    filterSetting.offset = 0;
    if (sortOrder === "not-applied") {
      filterSetting.orderBy = null;
      filterSetting.sortBy = null;
    } else {
      filterSetting.orderBy = sortOrder;
      filterSetting.sortBy = SortByType.endDate;
    }
    expandedRows.clear();
  };

  const onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    expandedRows.set(index, shouldExpand);
  };

  const renderExpandedCampaign = (campaign: Campaign) => {
    return (
      <CampaignDetailRow
        campaign={campaign}
        className={css(styles.rowDetails)}
      />
    );
  };

  const renderCampaignNameField = (campaign: Campaign) => {
    if (campaign && campaign.discount_factor) {
      const discountFactor = campaign.discount_factor || 0;
      return (
        <div className={css(styles.campaignNameDiscountColumn)}>
          {renderCampaignName(campaign)}
          <CampaignDiscountIndicator
            style={{ borderRadius: 10, marginTop: 3 }}
            discount={discountFactor}
            automatedType={campaign.automated_type}
          />
        </div>
      );
    }
    return renderCampaignName(campaign);
  };

  const renderCampaignName = (campaign: Campaign) => {
    // If campaign name is empty, showing default text.
    let campaignName = i`(Campaign Name Not Set)`;
    let url = `/product-boost/edit/${campaign.campaign_id}`;

    if (campaign.campaign_name) {
      campaignName = campaign.campaign_name;
      url = `/product-boost/detail/${campaign.campaign_id}`;
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

  const renderBudgetField = (campaign: Campaign) => {
    const isRunningState =
      campaign.state === "STARTED" || campaign.state === "SAVED";
    const disabledDueToState = !(
      campaign.state === "NEW" ||
      campaign.state === "PENDING" ||
      isRunningState
    );
    const disabledDueToSource = campaign.source === 5;
    const fieldDisabled = disabledDueToState || disabledDueToSource;
    const showWishSubsidyInfo =
      merchant.wish_subsidy_discount_factor > 0.0 &&
      campaign.source !== 5 &&
      campaign.source !== 6 &&
      campaign.discount_factor &&
      !campaign.flexible_budget_enabled;
    const showBonusBudget = campaign.is_bonus_budget_campaign;

    return (
      <div className={css(styles.budgetField)}>
        <BudgetTextInput
          campaignId={campaign.campaign_id}
          currentBudget={campaign.merchant_budget}
          onCampaignUpdated={onCampaignUpdated}
          onUpdateAllowedSpending={onUpdateAllowedSpending}
          fieldDisabled={fieldDisabled}
          addBudgetOnly={isRunningState}
          currency={campaign.localized_currency || "USD"}
          onFocus={
            isRunningState
              ? async () => {
                  await renderAddBudgetModal(campaign);
                }
              : null
          }
        />
        {campaign.flexible_budget_enabled && (
          <Info
            text={() => {
              return (
                <FlexibleBudgetForm
                  merchantBudget={campaign.merchant_budget.toString()}
                  localizedCurrency={campaign.localized_currency}
                  edit={false}
                  flexibleBudgetType={campaign.flexible_budget_type}
                />
              );
            }}
            popoverMaxWidth={200}
            sentiment="success"
            className={css(styles.budgetInfo)}
          />
        )}
        {showWishSubsidyInfo && (
          <Info
            text={() => {
              return (
                <WishSubsidyBudgetForm
                  merchantBudget={
                    campaign.merchant_budget
                      ? campaign.merchant_budget.toString()
                      : "0.0"
                  }
                  localizedCurrency={campaign.localized_currency}
                  wishSubsidyDiscountFactor={
                    merchant.wish_subsidy_discount_factor
                  }
                />
              );
            }}
            popoverMaxWidth={200}
            sentiment="success"
            className={css(styles.budgetInfo)}
          />
        )}
        {showBonusBudget && (
          <Info
            text={() => {
              return (
                <BonusBudgetForm
                  merchantBudget={
                    campaign.merchant_budget
                      ? campaign.merchant_budget.toString()
                      : "0.0"
                  }
                  localizedCurrency={campaign.localized_currency}
                  bonusBudgetRate={campaign.bonus_budget_rate}
                  bonusBudgetType={campaign.bonus_budget_type}
                  showPromoMessage
                />
              );
            }}
            contentWidth={700}
            sentiment="success"
            className={css(styles.budgetInfo)}
          />
        )}
      </div>
    );
  };

  const renderBudgetColumn = () => {
    return (
      <Table.Column
        title={i`Budget`}
        columnKey="merchant_budget"
        align="center"
        description={ProductBoostCampaignExplanations.BUDGET}
        minWidth={143}
      >
        {({ row }) => renderBudgetField(row)}
      </Table.Column>
    );
  };

  const renderSpendOverGmvField = (campaign: Campaign) => {
    const currency: CurrencyCode = campaign.localized_currency || "USD";
    const spend = formatCurrency(campaign.capped_spend, currency);
    const gmv = formatCurrency(campaign.gmv, currency);
    const minSpend = campaign.min_spend || 0;
    const minSpendInfoText = i`This campaign has a minimum spending of ${formatCurrency(
      minSpend,
      currency
    )}`;

    let spendOverGmv;
    if (campaign.gmv > 0 && campaign.capped_spend != null) {
      spendOverGmv = numeral(campaign.capped_spend / campaign.gmv).format(
        "0.00%"
      );
    } else {
      spendOverGmv = i`No data`;
    }
    return (
      <div className={css(styles.spendOverGMVField)}>
        <div>
          {spend} / {gmv} ({spendOverGmv})
        </div>
        {minSpend > 0 && (
          <Info
            text={minSpendInfoText}
            popoverMaxWidth={200}
            sentiment="warning"
            className={css(styles.minSpendInfo)}
          />
        )}
      </div>
    );
  };

  const renderIsEvergreenSwitch = (
    campaign: Campaign,
    buttonDisabled: boolean
  ) => {
    return (
      <Switch
        onToggle={(isOn: boolean) => {
          let modalHeader = "";
          let modalMessage = "";
          let actionButtonText = "";
          if (isOn) {
            modalHeader = i`Auto renew your campaign`;
            modalMessage =
              i`When Auto Renew is on, this campaign will be ` +
              i`automatically renewed and changed after completion.`;
            actionButtonText = i`Turn on`;
          } else {
            modalHeader = i`Turn off Auto Renew`;
            modalMessage =
              i`When Auto Renew is off, this campaign will not be ` +
              i`automatically renewed and changed after completion.`;
            actionButtonText = i`Turn off`;
          }

          new ConfirmationModal(modalMessage)
            .setHeader({
              title: modalHeader,
            })
            .setCancel(i`Cancel`)
            .setIllustration(
              isOn ? "productBoostRocketHeartbreak" : "productBoostRocket"
            )
            .setAction(actionButtonText, async () => {
              await productBoostApi
                .changeEvergreenStatus({
                  campaign_id: campaign.campaign_id,
                  set_evergreen: isOn,
                })
                .call();
              if (onCampaignUpdated) {
                onCampaignUpdated();
              }
            })
            .render();
        }}
        isOn={campaign.is_evergreen}
        disabled={buttonDisabled}
      >
        {/*Avoid showing the text*/}
        <div />
      </Switch>
    );
  };

  const renderIsEvergreenField = (campaign: Campaign) => {
    const buttonDisabled =
      !(
        campaign.state === "NEW" ||
        campaign.state === "SAVED" ||
        campaign.state === "STARTED"
      ) ||
      campaign.source === 5 ||
      campaign.source === 6 ||
      enableEvergreenCampaign == null;

    if (!buttonDisabled) {
      return renderIsEvergreenSwitch(campaign, buttonDisabled);
    }

    const tooltipMsg =
      i`Auto-renew setting is disabled because this ` +
      i`campaign passed the scheduled end date or this campaign is an ` +
      i`automated campaign.`;

    return (
      <Popover
        position={`top center`}
        popoverMaxWidth={192}
        popoverFontSize={12}
        popoverContent={tooltipMsg}
      >
        {renderIsEvergreenSwitch(campaign, buttonDisabled)}
      </Popover>
    );
  };

  const renderStartDateField = (campaign: Campaign) => {
    if (productBoostCampaignInfoResult == null) {
      return null;
    }

    const fieldDisabled =
      !(campaign.state === "NEW" || campaign.state === "PENDING") ||
      (campaign.source === 5 && campaign.state !== "NEW");

    const startDate = campaign.start_time;
    const endDate = campaign.end_time;
    const timeDiff =
      new Date(endDate).getTime() - new Date(startDate).getTime();

    return (
      <CampaignDateInput
        campaignId={campaign.campaign_id}
        currentDate={startDate}
        onCampaignUpdated={onCampaignUpdated}
        fieldDisabled={fieldDisabled}
        isStartDate
        timeDiff={timeDiff}
        minStartDate={minStartDate}
        maxStartDate={maxStartDate}
        maxNumWeeks={maxNumWeeks}
      />
    );
  };

  const renderEndDateField = (campaign: Campaign) => {
    if (productBoostCampaignInfoResult == null) {
      return null;
    }

    const isRunningState =
      campaign.state === "SAVED" || campaign.state === "STARTED";
    const disabledDueToSource = campaign.source === 5;
    const disabledDueToState = !(
      isRunningState ||
      campaign.state === "NEW" ||
      campaign.state === "PENDING"
    );
    const disabledDueToRunningEvergreen =
      isRunningState && campaign.is_evergreen;

    const fieldDisabled =
      disabledDueToSource ||
      disabledDueToState ||
      disabledDueToRunningEvergreen;

    return (
      <CampaignDateInput
        campaignId={campaign.campaign_id}
        currentDate={campaign.end_time}
        onCampaignUpdated={onCampaignUpdated}
        fieldDisabled={fieldDisabled}
        isStartDate={false}
        isRunningState={isRunningState}
        minStartDate={minStartDate}
        maxStartDate={maxStartDate}
        maxNumWeeks={maxNumWeeks}
      />
    );
  };

  const renderStateLabel = (campaign: Campaign) => {
    const discountFactor = campaign.discount_factor || 0;
    return (
      <CampaignStatusLabel
        status={campaign.state}
        maxAllowedSpending={maxAllowedSpending}
        maxBudget={campaign.max_budget}
        automatedType={campaign.automated_type}
        discount={discountFactor}
        trainingProgress={campaign.training_progress}
        learningStatusThreshold={
          productBoostCampaignInfoResult?.campaignProperty
            .learningStatusThreshold
        }
      />
    );
  };

  return (
    <Table
      className={css(styles.root, className)}
      data={campaigns}
      actions={tableActions}
      noDataMessage={() => (
        <p>
          <span>Need to boost your products?</span>&nbsp;
          <Link href="/product-boost/create">Create a Campaign</Link>
        </p>
      )}
      maxVisibleColumns={20}
      rowExpands={() => true} // all rows expand
      expandedRows={expandedRowsIndices}
      renderExpanded={renderExpandedCampaign}
      onRowExpandToggled={onRowExpandToggled}
      highlightRowOnHover
      rowHeight={60}
    >
      <Table.Column
        title={i`Campaign Name`}
        columnKey="campaign_name"
        align="left"
        width={150}
      >
        {({ row }) => renderCampaignNameField(row)}
      </Table.Column>
      <Table.Column
        title={i`Status`}
        columnKey="display_state_text"
        align="center"
        description={() => (
          <p className={css(styles.tooltipText)}>
            <span>{ProductBoostCampaignExplanations.STATE}</span>&nbsp;
            <Link href={zendeskURL("360018979833")}>Learn more</Link>
          </p>
        )}
        descriptionPopoverMinWidth={250}
      >
        {({ row }) => renderStateLabel(row)}
      </Table.Column>
      {renderBudgetColumn()}
      <Table.Column
        title={i`Spend / GMV`}
        columnKey="capped_spend"
        align="center"
      >
        {({ row }) => renderSpendOverGmvField(row)}
      </Table.Column>
      <Table.NumeralColumn
        title={i`Orders`}
        columnKey="sales"
        align="center"
        description={ProductBoostCampaignExplanations.SALES}
      />
      <Table.Column
        title={i`Start Date`}
        columnKey="start_time"
        align="center"
        description={ProductBoostCampaignExplanations.START_DATE}
        sortOrder={startDateSortOrder}
        onSortToggled={onStartDateSortToggled}
        multiline
      >
        {({ row }) => renderStartDateField(row)}
      </Table.Column>
      <Table.Column
        title={i`End Date`}
        columnKey="end_time"
        align="center"
        description={ProductBoostCampaignExplanations.END_DATE}
        sortOrder={endDateSortOrder}
        onSortToggled={onEndDateSortToggled}
        multiline
      >
        {({ row }) => renderEndDateField(row)}
      </Table.Column>
      <Table.Column
        title={i`Auto Renew`}
        columnKey="is_evergreen"
        align="center"
        description={() => (
          <p className={css(styles.tooltipText)}>
            <span>{ProductBoostCampaignExplanations.IS_EVERGREEN}</span>&nbsp;
            <Link href={zendeskURL("360020530033")}>Learn more</Link>
          </p>
        )}
      >
        {({ row }) => renderIsEvergreenField(row)}
      </Table.Column>
    </Table>
  );
};

const useStyleSheet = () => {
  const { pageGuideX } = DimenStore.instance();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        rowDetails: {
          padding: "15px 20px",
        },
        campaignName: {
          fontSize: 14,
          textAlign: "left",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",

          overflow: "hidden",
        },
        modalContent: {
          display: "flex",
          flexDirection: "column",
          padding: `50px ${pageGuideX}`,
        },
        modalTextContent: {
          padding: "40px 0 0 0",
          fontSize: 16,
          lineHeight: 1.5,
          textAlign: "center",
          color: palettes.textColors.Ink,
          fontWeight: weightMedium,
          fontFamily: proxima,
        },
        tooltip: {
          fontSize: 13,
          maxWidth: "200px",
          lineHeight: 1.33,
          textAlign: "left",
          overflowWrap: "break-word",
          wordWrap: "break-word",
          wordBreak: "break-word",
          whiteSpace: "normal",
          padding: "13px 13px 0px 13px",
        },
        tooltipButton: {
          fontSize: 13,
          padding: "0px 13px 13px 13px",
        },
        campaignNameDiscountColumn: {
          display: "contents",
        },
        budgetField: {
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          maxWidth: 164,
        },
        budgetInfo: {
          marginLeft: 5,
        },
        spendOverGMVField: {
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
        },
        minSpendInfo: {
          marginLeft: 5,
        },
        tooltipText: {
          padding: 13,
          fontSize: 13,
          lineHeight: 1.5,
          fontWeight: weightMedium,
          color: palettes.textColors.Ink,
          maxWidth: 260,
          margin: 0,
        },
      }),
    [pageGuideX]
  );
};

export default observer(CampaignsTable);
