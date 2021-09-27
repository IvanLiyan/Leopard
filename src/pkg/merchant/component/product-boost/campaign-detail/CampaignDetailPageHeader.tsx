import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import moment from "moment/moment";

/* Legacy */
import ProductBoostBuyCreditsModal from "@legacy/view/modal/ProductBoostBuyCredits";

/* Lego Components */
import { Info, Text, MultiSecondaryButton } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";

import { Popover } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Components */
import BonusBudgetForm from "@merchant/component/product-boost/BonusBudgetForm";
import ProductBoostHeader from "@merchant/component/product-boost/ProductBoostHeader";
import FlexibleBudgetForm from "@merchant/component/product-boost/FlexibleBudgetForm";
import CampaignStatusLabel from "@merchant/component/product-boost/CampaignStatusLabel";
import CampaignActionModal from "@merchant/component/product-boost/modals/CampaignActionModal";
import WishSubsidyBudgetForm from "@merchant/component/product-boost/WishSubsidyBudgetForm";
import CampaignTrainingProcess from "@merchant/component/product-boost/CampaignTrainingProcess";

/* Merchant API */
import {
  stopCampaign,
  cancelCampaign,
  enableCampaign,
  getCampaignBudgetBreakdown,
  duplicateAutomatedCampaign,
} from "@merchant/api/product-boost";

/* Merchant Model */
import Campaign from "@merchant/model/product-boost/Campaign";
import { formatDate } from "@merchant/model/product-boost/Campaign";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";
import { useRouteStore } from "@merchant/stores/RouteStore";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import {
  useProductBoostProperty,
  useProductBoostMerchantInfo,
} from "@merchant/stores/product-boost/ProductBoostContextStore";
import { useProductBoostStore } from "@merchant/stores/product-boost/ProductBoostStore";

/* Toolkit */
import { CampaignAction } from "@toolkit/product-boost/utils/campaign-actions";
import { CampaignActionsHelper } from "@toolkit/product-boost/utils/campaign-actions";
import { formatDatetimeLocalized } from "@toolkit/datetime";
import { ProductBoostCampaignExplanations } from "@toolkit/product-boost/resources/tooltip";
import { BonusBudgetPromotionExplanations } from "@toolkit/product-boost/resources/bonus-budget-tooltip";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type CampaignActionItem = {
  readonly action: CampaignAction;
  readonly name: string;
  readonly apply: (campaign: Campaign) => unknown;
};

type Props = BaseProps & {
  readonly maxAllowedSpending: number;
};

const CampaignDetailPageHeader: React.FC<Props> = ({
  style,
  className,
  maxAllowedSpending,
}: Props) => {
  const styles = useStyleSheet();
  const toastStore = useToastStore();
  const productBoostStore = useProductBoostStore();
  const campaignInfo = useProductBoostProperty();
  const merchantInfo = useProductBoostMerchantInfo();
  const navigationStore = useNavigationStore();
  const routeStore = useRouteStore();
  const { currentCampaign } = productBoostStore;

  const dailyBudgetEnabled =
    merchantInfo?.marketing.currentMerchant?.dailyBudgetEnabled || false;
  const wishSubsidyDiscountFactor =
    merchantInfo?.marketing.currentMerchant?.wishSubsidyDiscountFactor || 0.0;
  const minStartDateUnix =
    campaignInfo?.campaignProperty.minStartDate.unix || 0;
  const maxStartDateUnix =
    campaignInfo?.campaignProperty.maxStartDate.unix || 0;
  const minStartDate = useMemo(() => new Date(minStartDateUnix * 1000), [
    minStartDateUnix,
  ]);
  const maxStartDate = useMemo(() => new Date(maxStartDateUnix * 1000), [
    maxStartDateUnix,
  ]);
  const maxNumWeeks = campaignInfo?.campaignProperty.maxNumWeeks || 0;
  const allowMaxboost =
    merchantInfo?.marketing.currentMerchant?.allowMaxboost || false;

  const [actionButtonDisabled, setSecondaryButtonDisabled] = useState(false);

  if (!currentCampaign) {
    return null;
  }
  const {
    oldBudget,
    localizedCurrency,
    trainingProgress,
    flexibleBudgetEnabled,
    flexibleBudgetType,
    merchantBudget,
    automatedType,
    campaignSource,
    isBonusBudgetCampaign,
    bonusBudgetRate,
    bonusBudgetType,
  } = currentCampaign;
  const campaignName = currentCampaign.name;
  const campaignStateName = currentCampaign.state;
  const productsCount = currentCampaign.products?.length;
  const maxBudget =
    oldBudget != null
      ? formatCurrency(oldBudget, localizedCurrency)
      : i`No Data`;
  const startTime = currentCampaign.startDate;
  const endTime = currentCampaign.endDate;
  const discountFactor = currentCampaign.discountFactor || 0;
  const canRenderTrainingProgressColumn =
    campaignStateName === "STARTED" &&
    trainingProgress != null &&
    trainingProgress != -1;

  const renderAutomatedCampaignActionModal = async (
    campaign: Campaign,
    action: string
  ) => {
    const startDate = formatDate(campaign.startDate);
    const endDate = formatDate(campaign.endDate);
    setSecondaryButtonDisabled(true);
    const resp = await getCampaignBudgetBreakdown({
      campaign_id: campaign.id,
    }).call();
    setSecondaryButtonDisabled(false);
    if (resp.code !== 0 || !resp.data) {
      if (resp.msg) {
        toastStore.error(resp.msg);
      }
      return;
    }
    const campaignAction =
      action === "enable" ? "EnabledAutomated" : "DuplicateAutomated";

    const modalProps: any = {
      action: campaignAction,
      campaignId: campaign.id,
      campaignName: campaign.name || "",
      startDate: startDate || "",
      endDate: endDate || "",
      maxBudget: resp.data.merchant_budget,
      maxSpendingBreakdown: resp.data.max_spending_breakdown,
      maxAllowedSpending: resp.data.max_allowed_spending,
      isPayable: resp.data.is_payable || false,
      hasMaxboostProduct: campaign.hasMaxboostProduct || false,
      discount: resp.data.discount_factor,
      currencyCode: campaign.localizedCurrency,
      productCount: campaign.products ? campaign.products.length : 0,
      minStartDate,
      maxStartDate,
      maxNumWeeks,
      allowMaxboost,
    };

    const modal = new CampaignActionModal(modalProps);
    modal.render();
  };

  const handleAddBudget = async (campaign: Campaign) => {
    const campaignId = campaign.id;
    const startDate = formatDate(campaign.startDate);
    const endDate = formatDate(campaign.endDate);

    setSecondaryButtonDisabled(true);
    const resp = await getCampaignBudgetBreakdown({
      campaign_id: campaignId,
    }).call();
    setSecondaryButtonDisabled(false);
    if (resp.code !== 0 || !resp.data) {
      if (resp.msg) {
        toastStore.error(resp.msg);
      }
      return;
    }

    let actionModalProp: any = {
      action: "AddBudget",
      maxSpendingBreakdown: resp.data.max_spending_breakdown,
      maxAllowedSpending: resp.data.max_allowed_spending,
      maxBudget: resp.data.merchant_budget,
      campaignId,
      campaignName: campaign.name || "",
      startDate: startDate || "",
      endDate: endDate || "",
      isPayable: resp.data.is_payable || false,
      showSuggestedBudget: resp.data.show_suggested_budget,
      suggestedBudget: resp.data.suggested_budget,
      fromNoti: 100,
      flexibleBudgetEnabled: resp.data.flexible_budget_enabled,
      minStartDate,
      maxStartDate,
      maxNumWeeks,
      allowMaxboost,
    };

    if (campaign.flexibleBudgetType) {
      actionModalProp = {
        ...actionModalProp,
        flexibleBudgetType: campaign.flexibleBudgetType,
      };
    }

    const modal = new CampaignActionModal(actionModalProp);
    modal.render();
  };

  const handleDuplicateAutomatedCampaign = async (campaign: Campaign) => {
    let resp;
    setSecondaryButtonDisabled(true);
    try {
      resp = await duplicateAutomatedCampaign({
        campaign_id: campaign.id || "",
        is_maxboost: campaign.hasMaxboostProduct || false,
        dup_source: 8,
      }).call();
    } catch (e) {
      resp = e;
    }
    setSecondaryButtonDisabled(false);
    if (resp.code === 0 && resp.data) {
      const newCampaignId = resp.data.new_campaign_id;
      toastStore.positive(i`Your campaign is duplicated successfully`, {
        timeoutMs: 5000,
        link: {
          title: i`View details`,
          url: `/product-boost/detail/${newCampaignId}`,
        },
      });
      navigationStore.reload();
      return;
    }
    await renderAutomatedCampaignActionModal(campaign, "duplicate");
  };

  const handleDuplicateCampaign = (campaign: Campaign) => {
    const title =
      i`In order to duplicate a running auto ` +
      i`renew campaign, please turn off auto renew or stop campaign.`;
    if (campaign.state === "STARTED" && campaign.isEvergreen) {
      new ConfirmationModal(title)
        .setHeader({
          title: i`Duplicate Campaign`,
        })
        .setAction(i`OK`, () => {})
        .render();
    } else {
      window.open(`/product-boost/v2/create?dup_campaign_id=${campaign.id}`);
    }
  };

  const handleRecharge = (campaign: Campaign) => {
    const campaignBudget = campaign.oldBudget || 0.0;
    let chargeAmount = campaignBudget - maxAllowedSpending;
    // The min number we charge user is $1
    if (chargeAmount < campaign.minBudgetToAdd) {
      chargeAmount = campaign.minBudgetToAdd;
    }
    chargeAmount = Math.ceil(chargeAmount * 100) / 100;
    const redirectPath = `/product-boost/detail/${campaign.id}?enable_campaign_id=${campaign.id}`;

    const chargeParams = {
      item_type: "0",
      amount: chargeAmount,
      reason_type: 1,
      redirect_path: redirectPath,
      reference_page: `/product-boost/detail/${campaign.id}`,
      flow_type: 1,
      currency: campaign.localizedCurrency,
    };
    const modal = new ProductBoostBuyCreditsModal(chargeAmount, chargeParams);
    modal.render();
  };

  const handleEnableAutomated = async (campaign: Campaign) => {
    const hasMaxboostProduct = campaign.hasMaxboostProduct;
    let resp;
    setSecondaryButtonDisabled(true);
    try {
      resp = await enableCampaign({
        campaign_id: campaign.id || "",
        is_maxboost: hasMaxboostProduct || false,
        caller_source: "CampaignDetailEnable",
      }).call();
    } catch (e) {
      resp = e;
    }
    setSecondaryButtonDisabled(false);
    if (resp.code === 0) {
      toastStore.positive(i`Your campaign is enabled successfully`);
      navigationStore.reload();
      return;
    }
    await renderAutomatedCampaignActionModal(campaign, "enable");
  };

  const handleEnableEvergreen = async (campaign: Campaign) => {
    let resp;
    setSecondaryButtonDisabled(true);
    try {
      resp = await enableCampaign({
        campaign_id: campaign.id,
        caller_source: "CampaignDetailPage",
      }).call();
    } catch (e) {
      resp = e;
    }
    setSecondaryButtonDisabled(false);

    if (resp.code !== 0) {
      if (resp.msg) {
        toastStore.error(resp.msg);
      }
      navigationStore.navigate(`/product-boost/edit/${campaign.id}`);
    } else {
      toastStore.positive(i`Your campaign is enabled successfully`);
      navigationStore.reload();
    }
  };

  const campaignActions: ReadonlyArray<CampaignActionItem> = [
    {
      action: "ENABLE_AUTOMATED",
      name: i`Enable`,
      apply: handleEnableAutomated,
    },
    {
      action: "DUPLICATE_AUTOMATED_CAMPAIGN",
      name: i`Duplicate`,
      apply: handleDuplicateAutomatedCampaign,
    },
    {
      action: "ADD_BUDGET",
      name: i`Add Budget`,
      apply: handleAddBudget,
    },
    {
      action: "ENABLE_EVERGREEN",
      name: i`Enable`,
      apply: handleEnableEvergreen,
    },
    {
      action: "RECHARGE_EVERGREEN",
      name: i`Recharge`,
      apply: handleRecharge,
    },
    {
      action: "EDIT",
      name: i`Edit`,
      apply: (campaign: Campaign) => {
        navigationStore.navigate(`/product-boost/edit/${campaign.id}`);
      },
    },
    {
      action: "CANCEL",
      name: i`Cancel`,
      apply: (campaign: Campaign) => {
        new ConfirmationModal(i`Are you sure you want to cancel this campaign?`)
          .setHeader({
            title: i`Confirmation`,
          })
          .setCancel(i`No`)
          .setAction(i`Yes`, async () => {
            await cancelCampaign({
              campaign_id: campaign.id,
            }).call();
            navigationStore.navigate("/product-boost/history/list");
          })
          .render();
      },
    },
    {
      action: "STOP",
      name: i`Stop`,
      apply: (campaign: Campaign) => {
        new ConfirmationModal(i`Are you sure you want to stop this campaign?`)
          .setHeader({
            title: i`Confirmation`,
          })
          .setCancel(i`No`)
          .setAction(i`Yes`, async () => {
            await stopCampaign({
              campaign_id: campaign.id,
            }).call();
            navigationStore.reload();
          })
          .render();
      },
    },
    {
      action: "DUPLICATE_CAMPAIGN",
      name: i`Duplicate`,
      apply: handleDuplicateCampaign,
    },
  ];

  const campaignId =
    currentCampaign?.id ||
    routeStore.pathParams("/product-boost/detail/:id").id;

  const renderCampaignSecondaryButton = () => {
    if (campaignInfo == null) {
      return null;
    }
    const actionsHelper = new CampaignActionsHelper({
      minStartDateUnix: campaignInfo.campaignProperty.minStartDate.unix,
      maxStartDateUnix: campaignInfo.campaignProperty.maxStartDate.unix,
    });
    const actions = campaignActions.filter((a) => {
      const action: CampaignAction = a.action;
      return actionsHelper.canApply({
        campaign: currentCampaign,
        action,
        maxAllowedSpending,
      });
    });

    if (actions.length === 0) {
      return null;
    }

    const buttonActions = actions.map((action) => ({
      text: action.name,
      onClick: async () => {
        await action.apply(currentCampaign);
      },
    }));

    return (
      <MultiSecondaryButton
        className={css(styles.titleButton)}
        padding="7px 25px"
        actions={buttonActions}
        disabled={actionButtonDisabled}
      />
    );
  };

  const campaignTitle = (
    <div className={css(styles.titleContainer)}>
      <Text weight="bold" className={css(styles.titleBold)}>
        {campaignName}
      </Text>
      {!dailyBudgetEnabled && renderCampaignSecondaryButton()}
    </div>
  );

  const statusColumn = (
    <div className={css(styles.statsColumn)}>
      <Text weight="bold" className={css(styles.statsTitle)}>
        Status
      </Text>
      <CampaignStatusLabel
        status={campaignStateName}
        maxAllowedSpending={maxAllowedSpending}
        maxBudget={oldBudget}
        automatedType={automatedType}
        discount={discountFactor}
      />
    </div>
  );

  const activeDatesString = () => {
    if (startTime == null || endTime == null) {
      return i`N/A`;
    }
    const startDate = moment(startTime);
    const endDate = moment(endTime);
    if (startDate.year() == endDate.year()) {
      return `${formatDatetimeLocalized(
        startDate,
        "M/D"
      )}-${formatDatetimeLocalized(endDate, "M/D/Y")}`;
    }
    return `${formatDatetimeLocalized(
      startDate,
      "M/D/Y"
    )}-${formatDatetimeLocalized(endDate, "M/D/Y")}`;
  };

  const durationColumn = (
    <div className={css(styles.statsColumn)}>
      <Text weight="bold" className={css(styles.statsTitle)}>
        Duration
      </Text>
      <Text weight="medium" className={css(styles.statsBody)}>
        {activeDatesString()}
      </Text>
    </div>
  );

  const renderBudgetColumn = () => {
    const showWishSubsidyInfo =
      wishSubsidyDiscountFactor > 0.0 &&
      campaignSource !== 5 &&
      campaignSource !== 6 &&
      discountFactor &&
      !flexibleBudgetEnabled;
    return (
      <div className={css(styles.statsColumn)}>
        <div className={css(styles.statsTitle)}>
          <Popover
            popoverMaxWidth={200}
            popoverContent={
              isBonusBudgetCampaign
                ? BonusBudgetPromotionExplanations.BONUS_BUDGET_COLUMN
                : ProductBoostCampaignExplanations.BUDGET
            }
          >
            <Text weight="bold">Budget</Text>
          </Popover>
        </div>
        <div className={css(styles.statsBody, styles.flexAlign)}>
          <Text weight="medium">{maxBudget}</Text>
          {flexibleBudgetEnabled && (
            <Info
              text={() => {
                if (flexibleBudgetType) {
                  return (
                    <FlexibleBudgetForm
                      merchantBudget={merchantBudget}
                      localizedCurrency={localizedCurrency}
                      edit={false}
                      flexibleBudgetType={flexibleBudgetType}
                    />
                  );
                }
                return (
                  <FlexibleBudgetForm
                    merchantBudget={merchantBudget}
                    localizedCurrency={localizedCurrency}
                    edit={false}
                  />
                );
              }}
              popoverMaxWidth={200}
              sentiment="success"
              position={"bottom center"}
              className={css(styles.budgetInfo)}
            />
          )}
          {showWishSubsidyInfo && (
            <Info
              text={() => {
                return (
                  <WishSubsidyBudgetForm
                    merchantBudget={
                      merchantBudget ? merchantBudget.toString() : "0.0"
                    }
                    localizedCurrency={localizedCurrency}
                    wishSubsidyDiscountFactor={wishSubsidyDiscountFactor}
                  />
                );
              }}
              popoverMaxWidth={200}
              sentiment="success"
              className={css(styles.budgetInfo)}
            />
          )}
          {isBonusBudgetCampaign && (
            <Info
              text={() => {
                return (
                  <BonusBudgetForm
                    merchantBudget={
                      merchantBudget ? merchantBudget.toString() : "0.00"
                    }
                    localizedCurrency={localizedCurrency}
                    bonusBudgetRate={bonusBudgetRate}
                    bonusBudgetType={bonusBudgetType}
                    showPromoMessage
                    style={{ maxWidth: 700 }}
                  />
                );
              }}
              sentiment="success"
              className={css(styles.budgetInfo)}
            />
          )}
        </div>
      </div>
    );
  };

  const productsColumn = (
    <div className={css(styles.statsColumn)}>
      <Text weight="bold" className={css(styles.statsTitle)}>
        Products
      </Text>
      <Text weight="medium" className={css(styles.statsBody)}>
        {productsCount}
      </Text>
    </div>
  );

  const IDColumn = (
    <div className={css(styles.statsColumn)}>
      <Text weight="bold" className={css(styles.statsTitle)}>
        ID
      </Text>
      <Text weight="medium" className={css(styles.statsBody)}>
        {campaignId}
      </Text>
    </div>
  );

  const renderTrainingProgressColumn = () => {
    if (canRenderTrainingProgressColumn && trainingProgress != null) {
      return (
        <div className={css(styles.statsColumn)}>
          <div className={css(styles.statsBody)}>
            <Text weight="bold" className={css(styles.statsTitle)}>
              Training Progress
            </Text>
            <CampaignTrainingProcess trainingProgress={trainingProgress} />
          </div>
        </div>
      );
    }
  };

  const statsNode = (
    <div className={css(styles.statsContainer)}>
      <div className={css(styles.statsRow)}>
        {statusColumn}
        {durationColumn}
        {renderBudgetColumn()}
      </div>
      <div className={css(styles.statsRow)}>
        {productsColumn}
        {IDColumn}
        {renderTrainingProgressColumn()}
      </div>
    </div>
  );

  return (
    <ProductBoostHeader
      className={css(style, className)}
      title={() => campaignTitle}
      body=""
      illustration="productBoostDetailHeader"
      statsNode={statsNode}
      hideBorder
    />
  );
};

const useStyleSheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        titleBold: {
          fontSize: 32,
        },
        titleButton: {
          display: "flex",
          marginLeft: 30,
        },
        titleContainer: {
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
        },
        statsContainer: {
          display: "flex",
          flexDirection: "column",
          maxWidth: 900,
          transform: "translateZ(0)",
        },
        statsRow: {
          display: "flex",
          maxWidth: 900,
          transform: "translateZ(0)",
          marginTop: 16,
        },
        statsColumn: {
          lineHeight: 1.4,
          flex: 1 / 3,
        },
        statsTitle: {
          fontSize: 14,
          color: textBlack,
          display: "inline-block",
        },
        statsBody: {
          fontSize: 14,
          fontWeight: fonts.weightMedium,
          color: textBlack,
          wordWrap: "break-word",
          userSelect: "text",
        },
        statsProgressBar: {
          maxWidth: 138,
        },
        trainingProgress: {
          verticalAlign: "middle",
          position: "relative",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        suggestion: {
          marginTop: 5,
        },
        flexAlign: {
          display: "flex",
          alignItems: "center",
        },
        budgetInfo: {
          marginLeft: 5,
        },
        alert: {
          margin: "30px 50px 0px 50px",
        },
      }),
    [textBlack]
  );
};

export default observer(CampaignDetailPageHeader);
