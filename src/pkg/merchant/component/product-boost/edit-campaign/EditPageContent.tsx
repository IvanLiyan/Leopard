import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, action, observable, reaction } from "mobx";

/* Lego Components */
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";

/* Merchant Components */
import EditPageSinglePage from "@merchant/component/product-boost/edit-campaign/EditPageSinglePage";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";

/* Merchant Store */
import {
  ProductBoostCampaignSchema,
  ProductBoostPropertyContext,
  RefundAssurancePromo,
} from "@merchant/stores/product-boost/ProductBoostContextStore";
import ProductBoostStore from "@merchant/stores/product-boost/ProductBoostStore";
import NavigationStore from "@merchant/stores/NavigationStore";
import ToastStore from "@merchant/stores/ToastStore";

/* Merchant Model */
import ProductModel from "@merchant/model/product-boost/Product";
import CampaignModel from "@merchant/model/product-boost/Campaign";
import { formatDate } from "@merchant/model/product-boost/Campaign";
import CampaignRestrictions from "@merchant/model/product-boost/CampaignRestrictions";

/* Toolkit */
import { log } from "@toolkit/logger";
import CampaignValidator from "@toolkit/product-boost/validators/CampaignValidator";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { APIResponse } from "@toolkit/api";
import { MaxSpendingBreakdown } from "@merchant/model/product-boost/Campaign";

const EditCampaignPageLogTableName = "PB_CREATE_CAMPAIGN_ACTIVITY_TRACKER";

const CreateCampaignBudgetTracker = "PB_CREATE_CAMPAIGN_BUDGET_TRACKER";

type EditPageContentProps = BaseProps & {
  readonly campaign_id?: string;
  readonly is_new_state?: boolean;
  readonly max_allowed_spending?: number;
  readonly max_spending_breakdown?: MaxSpendingBreakdown;
  readonly is_payable?: boolean;
  readonly product_ids?: string | null | undefined;
  readonly campaignDict: ProductBoostCampaignSchema;
  readonly refundAssurancePromo: RefundAssurancePromo;
};

@observer
export default class EditPageContent extends Component<EditPageContentProps> {
  static contextType = ProductBoostPropertyContext;
  context!: React.ContextType<typeof ProductBoostPropertyContext>;
  disposables: Array<() => void> = [];

  @observable
  uniqId: number;

  @observable
  minBudget: number | undefined;

  @observable
  suggestedBudget: number | undefined;

  @observable
  minSpend: number | undefined;

  constructor(
    props: EditPageContentProps,
    context: typeof ProductBoostPropertyContext
  ) {
    super(props, context);
    this.uniqId = 0;
    this.registerCampaign();
    this.setCampaignRestrictions();

    // Set initial value
    this.setBudgetInfo();
  }

  componentDidMount() {
    const navigationStore = NavigationStore.instance();
    navigationStore.placeNavigationLock(
      i`You have not saved some of your changes`
    );

    this.disposables.push(
      reaction(
        () => [
          this.campaignEndDate,
          this.campaignProductsStr,
          this.campaignIntenseBoost,
        ],
        () => {
          this.setBudgetInfo();
        }, // Add a delay to debounce.
        { delay: 10 }
      )
    );
  }

  componentWillUnmount() {
    this.disposables.forEach((dispose) => dispose());
  }

  @computed
  get isNewState(): boolean {
    const { campaignDict } = this.props;
    const { state } = campaignDict;
    return state === "NEW" || state === "PENDING";
  }

  @computed
  get products(): ReadonlyArray<ProductModel> {
    const {
      campaignProperty: { minBid },
    } = this.context;
    const { campaignDict, product_ids: productIds } = this.props;
    let products = campaignDict.products.map<ProductModel>((product) => {
      this.uniqId++;
      return new ProductModel({
        id: product.productId,
        keywords: product.keywords.join(","),
        isMaxboost: false,
        uniqId: this.uniqId,
        brandId: product.brandId,
      });
    });
    // prefill products based on product_ids prop
    const existingProductSet = new Set(products.map((p) => p.id));
    if (!productIds) {
      return products;
    }
    const filteredProductIds = productIds
      .split(",")
      .filter((pid) => !existingProductSet.has(pid));
    if (!filteredProductIds) {
      return products;
    }
    let newProducts = filteredProductIds.map((pid) => {
      return new ProductModel({
        id: pid,
        keywords: "",
        bid: minBid.amount.toFixed(2),
        isMaxboost: true,
        uniqId: this.uniqId,
      });
    });
    if (products == null) {
      products = [];
    }
    if (newProducts == null) {
      newProducts = [];
    }
    return [...products, ...newProducts];
  }

  registerCampaign() {
    const productBoostStore = ProductBoostStore.instance();
    const {
      campaignDict,
      max_spending_breakdown: maxSpendingBreakdown,
    } = this.props;
    const { isNewState } = this;
    let merchantBudget = campaignDict.merchantBudget.amount.toFixed(2);
    if (merchantBudget === "0.00") {
      // to let the user see empty string in the TextInput instead of '0.00'
      // when they first create the campaign
      merchantBudget = "";
    }
    let budget = campaignDict.maxBudget.amount.toFixed(2);
    if (budget === "0.00") {
      // to let the user see empty string in the TextInput instead of '0.00'
      // when they first create the campaign
      budget = "";
    }
    const scheduledAddBudgetAmount = campaignDict.scheduledAddBudget.amount.amount.toFixed(
      2
    );
    productBoostStore.registerCampaign(
      new CampaignModel({
        id: campaignDict.id,
        name: campaignDict.name,
        budget,
        merchantBudget,
        oldBudget: campaignDict.merchantBudget.amount,
        startDate: new Date(campaignDict.startDate.formatted),
        endDate: new Date(campaignDict.endDate.formatted),
        products: this.products,
        isEvergreen: campaignDict.isEvergreen,
        isV2: true,
        state: campaignDict.state,
        merchantId: campaignDict.merchantId,
        isNewState,
        scheduledAddBudgetEnabled: campaignDict.scheduledAddBudget.enabled,
        scheduledAddBudgetAmount,
        scheduledAddBudgetDays: campaignDict.scheduledAddBudget.days,
        maxSpendingBreakdown,
        localizedCurrency: campaignDict.localizedCurrency,
        flexibleBudgetEnabled: campaignDict.flexibleBudget.enabled,
        flexibleBudgetType: campaignDict.flexibleBudget.type,
        intenseBoost: campaignDict.intenseBoost,
        isBonusBudgetCampaign: campaignDict.bonusBudget.isBonusBudgetCampaign,
        bonusBudgetRate: campaignDict.bonusBudget.bonusBudgetRate,
        bonusBudget: campaignDict.bonusBudget.bonusBudget.amount,
        usedBonusBudget: campaignDict.bonusBudget.usedBonusBudget.amount,
        bonusBudgetType: campaignDict.bonusBudget.bonusBudgetType,
        eligibleBonusBudgetType:
          campaignDict.bonusBudget.eligibleBonusBudgetType,
      })
    );
  }

  setCampaignRestrictions() {
    const {
      is_payable: isPayable,
      max_allowed_spending: maxAllowedSpending,
    } = this.props;
    const productBoostStore = ProductBoostStore.instance();
    productBoostStore.campaignRestrictions = new CampaignRestrictions({
      maxAllowedSpending: maxAllowedSpending || 0,
      isPayable,
    });
  }

  launchErrorToast(message: string) {
    const toastStore = ToastStore.instance();
    toastStore.error(message);
  }

  async validateCampaign() {
    const { max_allowed_spending: maxAllowedSpending } = this.props;
    const {
      campaignProperty: { maxCampaignNameLength },
    } = this.context;
    if (this.campaign != null) {
      const validator = new CampaignValidator({
        campaign: this.campaign,
        minBudget: this.minBudget || 0,
        maxAllowedSpending: maxAllowedSpending || 0,
        maxNameLength: maxCampaignNameLength,
      });
      return await validator.validate();
    }
  }

  discardChanges() {
    const navigationStore = NavigationStore.instance();

    return new ConfirmationModal(
      i`Are you sure you want to discard your changes?`
    )
      .setHeader({ title: i`Confirmation` })
      .setCancel(i`No`)
      .setAction(i`Yes, I want to discard my changes`, () => {
        navigationStore.releaseNavigationLock();
        navigationStore.navigate("/product-boost/history/list");
      })
      .render();
  }

  async saveNewCampaign() {
    const navigationStore = NavigationStore.instance();
    const { campaign } = this;
    if (!campaign) {
      return;
    }
    const error = await this.validateCampaign();
    if (error) {
      this.launchErrorToast(error);
      return;
    }
    try {
      const productBoostStore = ProductBoostStore.instance();
      await productBoostStore.commitCampaign(campaign.id);
    } catch (e) {
      return;
    }

    navigationStore.releaseNavigationLock();
    navigationStore.navigate(
      `/product-boost/history/list?action=created&cid=${campaign.id}`
    );
  }

  async saveRunningCampaign() {
    const navigationStore = NavigationStore.instance();
    const { campaign } = this;
    if (!campaign) {
      return;
    }
    const error = await this.validateCampaign();
    if (error) {
      this.launchErrorToast(error);
      return;
    }
    try {
      const productBoostStore = ProductBoostStore.instance();
      await productBoostStore.commitRunningCampaign(campaign.id);
    } catch (e) {
      return;
    }
    navigationStore.releaseNavigationLock();
    navigationStore.navigate(
      `/product-boost/history/list?action=updated&cid=${campaign.id}`
    );
  }

  async onClickSave() {
    const { product_ids: productIds } = this.props;
    const { campaign } = this;
    if (!campaign || !campaign.products) {
      return;
    }
    const { campaignRestrictions } = ProductBoostStore.instance();
    log(EditCampaignPageLogTableName, {
      campaign_id: campaign.id,
      merchant_id: campaign.merchantId,
      action: "ClickSaveButton",
      max_allowed_spending: campaignRestrictions.maxAllowedSpending,
      from_product: productIds,
      num_products: campaign.products.length,
      is_new_page: true,
      campaign_state: campaign.state,
    });
    if (campaign.isNewState) {
      log(CreateCampaignBudgetTracker, {
        merchant_id: campaign.merchantId,
        has_trending_product: campaign.showIncreaseCampaignBudget(),
        campaign_id: campaign.id,
      });
      await this.saveNewCampaign();
    } else {
      await this.saveRunningCampaign();
    }
  }

  @computed
  get campaign(): CampaignModel | null | undefined {
    const { currentCampaign } = ProductBoostStore.instance();
    return currentCampaign;
  }

  @computed
  get campaignStartDate(): Date | null | undefined {
    const { campaign } = this;
    if (!campaign) {
      return null;
    }
    return campaign.startDate;
  }

  @computed
  get campaignEndDate(): Date | null | undefined {
    const { campaign } = this;
    if (!campaign) {
      return;
    }
    return campaign.endDate;
  }

  @computed
  get campaignIntenseBoost(): boolean | null | undefined {
    const { campaign } = this;
    if (!campaign) {
      return;
    }
    return campaign.intenseBoost;
  }

  @computed
  get campaignProductsStr(): string {
    const { campaign } = this;
    if (!campaign) {
      return "[]";
    }
    return JSON.stringify(
      (campaign.products || []).map((product) => product.toJson())
    );
  }

  @computed
  get styles() {
    return StyleSheet.create({});
  }

  @action
  async setBudgetInfo() {
    const {
      campaign,
      campaignStartDate,
      campaignEndDate,
      campaignProductsStr,
    } = this;
    if (!campaign || !campaignStartDate || !campaignEndDate) {
      return;
    }

    const startDateStr = formatDate(campaignStartDate) || "";
    const endDateStr = formatDate(campaignEndDate) || "";
    const intenseBoost = campaign.intenseBoost || false;

    let resp: APIResponse<
      productBoostApi.GetProductBoostCampaignBudgetInfoResult
    > | null = null;

    try {
      resp = await productBoostApi
        .getProductBoostCampaignBudgetInfo({
          campaign_id: campaign.id,
          start_date: startDateStr,
          end_date: endDateStr,
          products: campaignProductsStr,
          intense_boost: intenseBoost,
        })
        .call();
    } catch (e) {
      this.minBudget = 0.43;
      this.minSpend = 0.0;
      return;
    }
    if (resp.code === 0 && resp.data) {
      this.minBudget = resp.data.min_budget;
      this.suggestedBudget = resp.data.suggested_budget;
      this.minSpend = resp.data.min_spend || 0.0;
    }
  }

  @computed
  get childProps() {
    const { product_ids: productIds, refundAssurancePromo } = this.props;
    const { minBudget, suggestedBudget, minSpend } = this;

    return {
      productIds,
      minBudget: minBudget || 0.0,
      suggestedBudget: suggestedBudget || 0.0,
      onClickCancel: () => this.discardChanges(),
      onClickSave: () => this.onClickSave(),
      minSpend: minSpend || 0.0,
      refundAssurancePromo,
    };
  }

  render() {
    const { productIds, ...editPageProps } = this.childProps;
    return <EditPageSinglePage {...editPageProps} />;
  }
}
