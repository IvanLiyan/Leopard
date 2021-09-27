// TODO: next step is deprecating all `pageParams` related @computed function here
// and use `ProductBoostContextStore`.

/* External Libraries */
import { observable, computed } from "mobx";
import moment from "moment/moment";

/* Legacy */
import ProductBoostFreePromotionCampaignModal from "@legacy/view/modal/ProductBoostFreePromotionCampaignModal";
import ProductBoostFreeCreditModal from "@legacy/view/modal/ProductBoostFreeCreditModal";
import ProductBoostPromotionModal from "@legacy/view/modal/ProductBoostPromotionModal";

/* Merchant Components */
import { BulkDuplicateAutomatedModal } from "@merchant/component/product-boost/modals/BulkDuplicateAutomatedModalContent";
import { BulkIncreaseBudgetModal } from "@merchant/component/product-boost/modals/BulkIncreaseBudgetModalContent";
import { BulkResumeCampaignModal } from "@merchant/component/product-boost/modals/BulkResumeCampaignModalContent";
import { BulkEnableFBWCampaignModal } from "@merchant/component/product-boost/modals/BulkEnableFBWCampaignModalContent";
import RefundAssuranceSplashModal from "@merchant/component/product-boost/modals/RefundAssuranceSplashModal";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";
import {
  CampaignDetailStats,
  CampaignDetailByDateStats,
} from "@merchant/api/product-boost";

/* Merchant Store */
import UserStore from "@merchant/stores/UserStore";
import RouteStore from "@merchant/stores/RouteStore";

/* Merchant Model */
import Campaign from "@merchant/model/product-boost/Campaign";
import CampaignListElements from "@merchant/model/product-boost/CampaignListElements";
import CampaignsFilterSetting from "@merchant/model/product-boost/CampaignsFilterSetting";
import CampaignPerformanceFilterSetting from "@merchant/model/product-boost/CampaignPerformanceFilterSetting";
import CampaignRestrictions from "@merchant/model/product-boost/CampaignRestrictions";

export type MerchantState = "APPROVED" | "INVITED";

export type ProductBoostMerchant = {
  state: MerchantState;
  has_automated_campaign: boolean;
  show_credits: boolean;
  allow_maxboost: boolean;
  wish_subsidy_discount_factor: number;
  daily_budget_enabled: boolean;
};

export default class ProductBoostStore {
  @observable
  campaigns: Map<string, Campaign> = new Map();

  @observable
  listElements: CampaignListElements = new CampaignListElements();

  @observable
  filterSetting: CampaignsFilterSetting = new CampaignsFilterSetting();

  @observable
  campaignRestrictions: CampaignRestrictions = new CampaignRestrictions();

  @observable
  campaignsDetailDaily: Map<string, CampaignDetailStats> = new Map();

  @observable
  campaignDetailByDateStats: Map<string, CampaignDetailByDateStats> = new Map();

  @observable
  campaignsPerformanceFilters: CampaignPerformanceFilterSetting = new CampaignPerformanceFilterSetting();

  static instance(): ProductBoostStore {
    let { productBoostStore } = window as any;
    if (productBoostStore == null) {
      productBoostStore = new ProductBoostStore();
      (window as any).productBoostStore = productBoostStore;
    }
    return productBoostStore;
  }

  @computed
  get merchant(): ProductBoostMerchant {
    return (window as any).pageParams.product_boost_merchant;
  }

  @computed
  get maxNumRowsCSV(): number {
    return (window as any).pageParams.product_boost_max_num_rows_csv;
  }

  @computed
  get productBoostState(): number {
    return (window as any).pageParams.product_boost_state;
  }

  formatDate(date: Date | null | undefined): string | null | undefined {
    if (date == null) {
      return null;
    }
    const mdate = moment(date);
    return mdate.format("YYYY-MM-DD");
  }

  registerCampaign(campaign: Campaign) {
    const { campaigns } = this;
    campaigns.set(campaign.id, campaign);
  }

  getCampaign(id: string): Campaign | null | undefined {
    const { campaigns } = this;
    return campaigns.get(id);
  }

  @computed
  get currentCampaign(): Campaign | null | undefined {
    const routeStore = RouteStore.instance();
    const campaignId =
      routeStore.pathParams("/product-boost/edit/:id").id ||
      routeStore.pathParams("/product-boost/detail/:id").id;
    if (campaignId) {
      return this.getCampaign(campaignId);
    }
  }

  registerPerformanceStats(id: string, stats: CampaignDetailStats) {
    const { campaignsDetailDaily } = this;
    campaignsDetailDaily.set(id, stats);
  }

  getPerformanceStats(id: string): CampaignDetailStats | null | undefined {
    const { campaignsDetailDaily } = this;
    return campaignsDetailDaily.get(id);
  }

  @computed
  get currentPerformanceStats(): CampaignDetailStats | null | undefined {
    const routeStore = RouteStore.instance();
    const campaignId = routeStore.pathParams("/product-boost/detail/:id").id;
    if (campaignId) {
      return this.getPerformanceStats(campaignId);
    }
  }

  registerCampaignByDateStats(id: string, stats: CampaignDetailByDateStats) {
    const { campaignDetailByDateStats } = this;
    campaignDetailByDateStats.set(id, stats);
  }

  getCampaignDetailByDateStats(
    id: string
  ): CampaignDetailByDateStats | null | undefined {
    const { campaignDetailByDateStats } = this;
    return campaignDetailByDateStats.get(id);
  }

  @computed
  get currentCampaignDetailByDateStats():
    | CampaignDetailByDateStats
    | null
    | undefined {
    const routeStore = RouteStore.instance();
    const campaignId = routeStore.pathParams("/product-boost/detail/:id").id;
    if (campaignId) {
      return this.getCampaignDetailByDateStats(campaignId);
    }
  }

  async commitCampaign(id: string) {
    const campaign = this.getCampaign(id);
    if (!campaign) {
      return;
    }

    await productBoostApi.saveCampaign(campaign.toJson()).call();
  }

  async commitRunningCampaign(id: string) {
    const campaign = this.getCampaign(id);
    if (!campaign) {
      return;
    }

    await productBoostApi.saveRunningCampaign(campaign.toJson()).call();
  }

  async renderModalsIfNeeded(productBoostState: number) {
    const {
      loggedInMerchantUser: { merchant_id: merchantId },
    } = UserStore.instance();
    const modalArgs = {
      params_type: "modal",
    };
    const response = await productBoostApi.getHomePageModal(modalArgs).call();
    const data = response?.data;
    if (data == null) {
      return;
    }
    const {
      max_allowed_spending: maxAllowedSpending,
      campaigns_near_budget_depletion: campaignsToIncreaseBudget,
      campaigns_to_duplicate: campaignsToDuplicate,
      free_promo_products: freePromoProducts,
      promo_message: promoMessage,
      campaigns_to_enable: campaignsToResume,
      currency: currencyCode,
      free_pb_credit_modal_info: freePbCreditModalInfo,
      fbw_campaigns_to_enable: fbwCampaignsToEnable,
      can_view_refund_assurance_credit_modal: canViewRefundAssuranceCreditModal,
    } = data;
    type ModalConfig = { readonly modal: any; isLegacy: boolean };
    const modals: ModalConfig[] = [];

    if (canViewRefundAssuranceCreditModal) {
      const refundAssuranceModal = new RefundAssuranceSplashModal();
      modals.push({ modal: refundAssuranceModal, isLegacy: false });
    }
    if (fbwCampaignsToEnable && fbwCampaignsToEnable.length > 0) {
      const bulkEnableFBWCampaignModal = new BulkEnableFBWCampaignModal({
        fbwCampaignsToEnable,
        maxAllowedSpending,
        currencyCode,
        onClose: () => {},
      });
      modals.push({ modal: bulkEnableFBWCampaignModal, isLegacy: false });
    }
    if (campaignsToDuplicate && campaignsToDuplicate.length > 0) {
      const duplicateModal = new BulkDuplicateAutomatedModal({
        campaignsToDuplicate,
        maxAllowedSpending,
        currencyCode,
        onClose: () => {},
      });
      modals.push({ modal: duplicateModal, isLegacy: false });
    }
    if (campaignsToIncreaseBudget && campaignsToIncreaseBudget.length > 0) {
      const increaseBudgetModal = new BulkIncreaseBudgetModal({
        campaignsToIncreaseBudget,
        maxAllowedSpending,
        currencyCode,
        onClose: () => {},
      });
      modals.push({ modal: increaseBudgetModal, isLegacy: false });
    }
    if (campaignsToResume && campaignsToResume.length > 0) {
      const resumeModal = new BulkResumeCampaignModal({
        campaignsToResume,
        maxAllowedSpending,
        currencyCode,
        onClose: () => {},
      });
      modals.push({ modal: resumeModal, isLegacy: false });
    }
    if (freePromoProducts && freePromoProducts.length > 0) {
      const freePromoModal = new ProductBoostFreePromotionCampaignModal({
        merchant_id: merchantId,
        product_names: freePromoProducts,
        product_boost_state: productBoostState,
        from_noti: 1,
      });
      modals.push({ modal: freePromoModal, isLegacy: true });
    }
    if (promoMessage != null && Object.keys(promoMessage).length > 0) {
      const promoModal = new ProductBoostPromotionModal({
        merchant_id: merchantId,
        promo_message: promoMessage,
      });
      modals.push({ modal: promoModal, isLegacy: true });
    }
    if (
      freePbCreditModalInfo != null &&
      Object.keys(freePbCreditModalInfo).length > 0
    ) {
      const freeCreditModal = new ProductBoostFreeCreditModal({
        merchant_id: merchantId,
        free_pb_credit_modal_info: freePbCreditModalInfo,
      });
      modals.push({ modal: freeCreditModal, isLegacy: true });
    }
    const renderModalsSequentially = (modals: ReadonlyArray<ModalConfig>) => {
      if (modals.length == 0) {
        return;
      }
      const [firstModal, ...remainingModals] = modals;
      firstModal.modal.render();
      if (firstModal.isLegacy) {
        firstModal.modal.on("hidden", () => {
          renderModalsSequentially(remainingModals);
        });
      } else {
        firstModal.modal.setOnDismiss(() =>
          renderModalsSequentially(remainingModals)
        );
      }
    };
    renderModalsSequentially(modals);
  }
}

export const useProductBoostStore = (): ProductBoostStore => {
  return ProductBoostStore.instance();
};
