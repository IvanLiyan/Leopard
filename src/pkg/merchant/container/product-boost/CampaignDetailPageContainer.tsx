import React, { useState, useMemo, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Pager, LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { usePathParams } from "@toolkit/url";
import { useStringQueryParam } from "@toolkit/url";
import { InitialData } from "@toolkit/marketing/campaign-detail";
import * as productBoostApi from "@merchant/api/product-boost";
import CampaignModel from "@merchant/model/product-boost/Campaign";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";

import ProductBoostBuyCreditsModal from "@legacy/view/modal/ProductBoostBuyCredits";

import InvoiceSection from "@merchant/component/product-boost/campaign-detail/InvoiceSection";
import ProductsSection from "@merchant/component/product-boost/campaign-detail/ProductsSection";
import PerformanceSection from "@merchant/component/product-boost/campaign-detail/PerformanceSection";
import CampaignActionModal from "@merchant/component/product-boost/modals/CampaignActionModal";
import CampaignDetailPageHeader from "@merchant/component/product-boost/campaign-detail/CampaignDetailPageHeader";
import CampaignSuggestionsActionButton from "@merchant/component/product-boost/campaign-detail/CampaignSuggestionsActionButton";
import PerformanceSectionAdminStatsTable from "@merchant/component/product-boost/campaign-detail/PerformanceSectionAdminStatsTable";
import CampaignSuggestionsToggleEvergreen from "@merchant/component/product-boost/campaign-detail/CampaignSuggestionsToggleEvergreen";
import { CampaignSuggestion } from "@toolkit/product-boost/utils/campaign-suggestions";
import { CampaignSuggestionsHelper } from "@toolkit/product-boost/utils/campaign-suggestions";

import Campaign, { formatDate } from "@merchant/model/product-boost/Campaign";

/* Toolkit */
import { useRequest } from "@toolkit/api";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useDimenStore } from "@merchant/stores/DimenStore";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { useProductBoostStore } from "@merchant/stores/product-boost/ProductBoostStore";
import {
  useProductBoostProperty,
  useProductBoostMerchantInfo,
} from "@merchant/stores/product-boost/ProductBoostContextStore";

type Props = {
  readonly initialData: InitialData;
};

const CampaignDetailPageContainer: React.FC<Props> = ({
  initialData,
}: Props) => {
  const styles = useStyleSheet();
  const toastStore = useToastStore();
  const dimenStore = useDimenStore();
  const navigationStore = useNavigationStore();
  const { campaignId } = usePathParams("/product-boost/detail/:campaignId");
  const [currentTab, setCurrentTab] = useStringQueryParam("tab", "performance");
  const campaignInfo = useProductBoostProperty();

  const merchantInfo = useProductBoostMerchantInfo();

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
  const { currentUser } = initialData;

  const [campaignDetailResponse] = useRequest(
    productBoostApi.getProductBoostCampaignDetail({
      campaign_id: campaignId || "",
    })
  );
  const [campaignRegistered, setCampaignRegistered] = useState(false);
  const productBoostStore = useProductBoostStore();
  useEffect(() => {
    const campaignDict = campaignDetailResponse?.data?.campaign_dict;
    if (campaignDict) {
      productBoostStore.registerCampaign(
        CampaignModel.fromMongoCampaign(campaignDict)
      );
      setCampaignRegistered(true);
    }
  }, [campaignDetailResponse, productBoostStore]);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await productBoostApi
        .getProductBoostCampaignDetailPerformance({
          campaign_id: campaignId || "",
        })
        .call();
      const campaignStats = resp?.data?.campaign_product_stats;
      const campaignByDateStats = resp?.data?.campaign_detail_stats;
      if (campaignStats) {
        productBoostStore.registerPerformanceStats(campaignId, campaignStats);
        if (campaignByDateStats) {
          productBoostStore.registerCampaignByDateStats(
            campaignId,
            campaignByDateStats
          );
        }
      }
    };
    fetchData();
  }, [campaignId, productBoostStore]);

  const maxAllowedSpending =
    campaignDetailResponse?.data?.max_allowed_spending || 0;

  if (campaignDetailResponse?.data && campaignDetailResponse?.code !== 0) {
    toastStore.error(i`Campaign with ID ${campaignId} cannot be found!`, {
      timeoutMs: 15 * 1000,
    });
    return null;
  }

  const { currentCampaign: campaign } = productBoostStore;

  if (!campaignRegistered || campaignId == null || campaign == null) {
    return <LoadingIndicator />;
  }

  const showInvoiceSection = campaign?.canShowInvoice == true;
  const isAdmin = currentUser.isAdmin == true;

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

  const renderAutomatedCampaignActionModal = async (
    campaign: Campaign,
    action: string
  ) => {
    const startDate = formatDate(campaign.startDate);
    const endDate = formatDate(campaign.endDate);
    const resp = await productBoostApi
      .getCampaignBudgetBreakdown({
        campaign_id: campaign.id,
      })
      .call();
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
    try {
      resp = await productBoostApi
        .duplicateAutomatedCampaign({
          campaign_id: campaign.id || "",
          is_maxboost: campaign.hasMaxboostProduct || false,
          dup_source: 8,
        })
        .call();
    } catch (e) {
      resp = e;
    }

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
    try {
      resp = await productBoostApi
        .enableCampaign({
          campaign_id: campaign.id || "",
          is_maxboost: hasMaxboostProduct || false,
          caller_source: "CampaignDetailEnable",
        })
        .call();
    } catch (e) {
      resp = e;
    }
    if (resp.code === 0) {
      toastStore.positive(i`Your campaign is enabled successfully`);
      navigationStore.reload();
      return;
    }
    await renderAutomatedCampaignActionModal(campaign, "enable");
  };

  const handleEnableEvergreen = async (campaign: Campaign) => {
    let resp;
    try {
      resp = await productBoostApi
        .enableCampaign({
          campaign_id: campaign.id,
          caller_source: "CampaignDetailPage",
        })
        .call();
    } catch (e) {
      resp = e;
    }

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

  const renderSuggestions = () => {
    if (campaignInfo == null) {
      return null;
    }
    const suggestionsHelper = new CampaignSuggestionsHelper({
      minStartDateUnix: campaignInfo.campaignProperty.minStartDate.unix,
      maxStartDateUnix: campaignInfo.campaignProperty.maxStartDate.unix,
    });
    const campaignSuggestions: ReadonlyArray<CampaignSuggestion> = [
      "TURN_ON_EVERGREEN",
      "ADD_BUDGET",
      "DUPLICATE_AUTOMATED_CAMPAIGN",
      "DUPLICATE_CAMPAIGN",
      "RECHARGE",
      "ENABLE_AUTOMATED",
      "ENABLE_EVERGREEN",
    ];

    return (
      <>
        {campaignSuggestions.map((suggestion) => {
          const display = suggestionsHelper.displaySuggestion({
            campaign,
            suggestion,
            maxAllowedSpending,
          });
          if (display) {
            return (
              <div className={css(styles.suggestion)}>
                {renderSuggestion(suggestion)}
              </div>
            );
          }
          return null;
        })}
      </>
    );
  };

  const renderSuggestion = (suggestion: CampaignSuggestion) => {
    switch (suggestion) {
      case "TURN_ON_EVERGREEN":
        return <CampaignSuggestionsToggleEvergreen campaign={campaign} />;
      case "ADD_BUDGET":
        return (
          <CampaignSuggestionsActionButton
            campaign={campaign}
            onClick={handleAddBudget}
            buttonText={i`Add Budget`}
            suggestionContent={
              i`This campaign is running out of budget. ` +
              i`Please add budget before it pauses.`
            }
          />
        );
      case "DUPLICATE_AUTOMATED_CAMPAIGN":
        return (
          <CampaignSuggestionsActionButton
            campaign={campaign}
            onClick={handleDuplicateAutomatedCampaign}
            buttonText={i`Duplicate`}
            suggestionContent={i`This campaign has completed. Duplicate it to continue the good performance!`}
          />
        );
      case "DUPLICATE_CAMPAIGN":
        return (
          <CampaignSuggestionsActionButton
            campaign={campaign}
            onClick={handleDuplicateCampaign}
            buttonText={i`Duplicate`}
            suggestionContent={i`This campaign has completed. Duplicate it to continue the good performance!`}
          />
        );
      case "RECHARGE":
        return (
          <CampaignSuggestionsActionButton
            campaign={campaign}
            onClick={handleRecharge}
            buttonText={i`Recharge`}
            suggestionContent={
              i`You don't have enough balance to enable your campaign. ` +
              i`Please click Recharge to recharge your balance.`
            }
          />
        );
      case "ENABLE_AUTOMATED":
        return (
          <CampaignSuggestionsActionButton
            campaign={campaign}
            onClick={handleEnableAutomated}
            buttonText={i`Enable`}
            suggestionContent={i`This campaign has been paused. Please click Enable to enable it.`}
          />
        );
      case "ENABLE_EVERGREEN":
        return (
          <CampaignSuggestionsActionButton
            campaign={campaign}
            onClick={handleEnableEvergreen}
            buttonText={i`Enable`}
            suggestionContent={i`This campaign has been paused. Please click Enable to enable it.`}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={css(styles.root)}>
      <CampaignDetailPageHeader maxAllowedSpending={maxAllowedSpending} />
      <Pager
        onTabChange={(tab: string) => {
          setCurrentTab(tab);
        }}
        selectedTabKey={currentTab}
        tabsRowStyle={{
          padding: `0px ${dimenStore.pageGuideX}`,
        }}
        hideHeaderBorder
      >
        <Pager.Content titleValue={i`Performance`} tabKey="performance">
          <div className={css(styles.pagerContent)}>
            {renderSuggestions()}
            <PerformanceSection />
          </div>
        </Pager.Content>
        <Pager.Content titleValue={i`Products`} tabKey="products">
          <div className={css(styles.pagerContent)}>
            <ProductsSection />
          </div>
        </Pager.Content>
        {showInvoiceSection && (
          <Pager.Content titleValue={i`Invoice`} tabKey="invoice">
            <div className={css(styles.pagerContent)}>
              <InvoiceSection />
            </div>
          </Pager.Content>
        )}
        {isAdmin && (
          <Pager.Content titleValue={i`Admin`} tabKey="admin">
            <div className={css(styles.pagerContent)}>
              <PerformanceSectionAdminStatsTable campaign={campaign} />
            </div>
          </Pager.Content>
        )}
      </Pager>
    </div>
  );
};

const useStyleSheet = () => {
  const { pageBackground } = useTheme();
  const dimenStore = useDimenStore();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: pageBackground,
        },
        pagerContent: {
          display: "flex",
          flexDirection: "column",
          padding: `32px ${dimenStore.pageGuideX} 65px ${dimenStore.pageGuideX}`,
        },
        suggestion: {
          margin: "20px 0px",
        },
      }),
    [pageBackground, dimenStore.pageGuideX]
  );
};

export default observer(CampaignDetailPageContainer);
