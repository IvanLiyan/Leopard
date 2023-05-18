import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { observer } from "mobx-react";
import RefundAssuranceSplashModal from "./product-boost/RefundAssuranceSplashModal";
import { useRequest } from "@core/toolkit/restApi";
import {
  GetHomePageModalParams,
  GetHomePageModalResult,
  PB_GET_HOME_PAGE_PARAMS_ENDPOINT,
} from "@home/toolkit/product-boost";
import { useQuery } from "@apollo/client";
import {
  AnnouncementTypeConstants,
  GET_OPT_IN_STATUS,
  GET_USER_ANNOUNCEMENTS_V2_MODAL,
  GetUserAnnouncementsV2ModalResponseType,
  OptInStatusResponseType,
} from "@home/toolkit/announcements";
import { AnnouncementsForUsersV2SchemaListArgs } from "@schema";
import { useApolloStore } from "@core/stores/ApolloStore";
import BulkEnableFBWCampaignModal from "./product-boost/BulkEnableFBWCampaignModal";
import BulkDuplicateAutomatedModal from "./product-boost/BulkDuplicateAutomatedModal";
import BulkIncreaseBudgetModal from "./product-boost/BulkIncreaseBudgetModal";
import BulkResumeCampaignModal from "./product-boost/BulkResumeCampaignModal";
import FreePromotionModal from "./product-boost/FreePromotionModal";
import PromoMessageModal from "./product-boost/PromoMessageModal";
import FreeCreditModal from "./product-boost/FreeCreditModal";
import AnnouncementModal from "./AnnouncementModal";
import FrsOptInModal from "./FrsOptInModal";

type ModalState = "OPEN" | "DISMISSED" | "QUEUED";

const AnnouncementModals: React.FC = () => {
  const { nonBatchingClient } = useApolloStore();

  const [hasEnqueued, setHasEnqueued] = useState(false);

  // One state per announement modal type. State options are:
  // - undefined: data has not loaded, or data has loaded and modal does not need to be shown
  // - "QUEUED": data has loaded and this modal has yet to be shown
  // - "OPEN": data has loaded and this modal is currently being shown (max one can be open at a time)
  // - "DISMISSED": data has loaded and this modal has already been shown
  const [frsOptInAnnouncementModalState, setFrsOptInAnnouncementModalState] =
    useState<ModalState | undefined>();
  const [announcementModalState, setAnnouncementModalState] = useState<
    ModalState | undefined
  >();
  const [refundAssuranceSplashModalState, setRefundAssuranceSplashModalState] =
    useState<ModalState | undefined>();
  const [bulkEnableFbwCampaignModalState, setBulkEnableFBWCampaignModalState] =
    useState<ModalState | undefined>();
  const [
    bulkDuplicateAutomatedModalState,
    setBulkDuplicateAutomatedModalState,
  ] = useState<ModalState | undefined>();
  const [bulkIncreaseBudgetModalState, setBulkIncreaseBudgetModalState] =
    useState<ModalState | undefined>();
  const [bulkResumeCampaignModalState, setBulkResumeCampaignModalState] =
    useState<ModalState | undefined>();
  const [
    productBoostFreePromotionCampaignModalState,
    setProductBoostFreePromotionCampaignModalState,
  ] = useState<ModalState | undefined>();
  const [productBoostPromotionModalState, setProductBoostPromotionModalState] =
    useState<ModalState | undefined>();
  const [
    productBoostFreeCreditModalState,
    setProductBoostFreeCreditModalState,
  ] = useState<ModalState | undefined>();

  const {
    data: dataAnnouncements,
    loading: isLoadingAnnouncements,
    error: errorAnnouncements,
  } = useQuery<
    GetUserAnnouncementsV2ModalResponseType,
    AnnouncementsForUsersV2SchemaListArgs
  >(GET_USER_ANNOUNCEMENTS_V2_MODAL, {
    variables: {
      announcementType:
        AnnouncementTypeConstants.ANNOUNCEMENT_TYPE_BD_ANNOUNCEMENT,
      offset: 0,
      limit: 1,
    },
    client: nonBatchingClient,
  });

  const {
    data: dataPb,
    isLoading: isLoadingPbData,
    error: errorPbData,
  } = useRequest<GetHomePageModalResult, GetHomePageModalParams>({
    url: PB_GET_HOME_PAGE_PARAMS_ENDPOINT,
    body: {
      params_type: "modal",
    },
  });

  const { data: dataFrsOptInStatus, loading: isLoadingFrsOptInStatus } =
    useQuery<OptInStatusResponseType, Record<string, never>>(GET_OPT_IN_STATUS);

  // Once per lifecycle, once data has loaded, set modal states to "QUEUED" for
  // all modals that need to be shown. Set the first modal that would be "QUEUED"
  // to "OPEN"
  useEffect(() => {
    if (
      hasEnqueued ||
      dataPb == null ||
      isLoadingPbData ||
      errorPbData != null ||
      dataAnnouncements == null ||
      isLoadingAnnouncements ||
      errorAnnouncements != null ||
      isLoadingFrsOptInStatus
    ) {
      return;
    }

    const announcements = dataAnnouncements.announcements.forUsersV2.list;
    const announcement =
      announcements != null && announcements.length > 0
        ? announcements[0]
        : undefined;

    const {
      campaigns_near_budget_depletion: campaignsToIncreaseBudget,
      campaigns_to_duplicate: campaignsToDuplicate,
      free_promo_products: freePromoProducts,
      promo_message: promoMessage,
      campaigns_to_enable: campaignsToResume,
      free_pb_credit_modal_info: freePbCreditModalInfo,
      fbw_campaigns_to_enable: fbwCampaignsToEnable,
      can_view_refund_assurance_credit_modal: canViewRefundAssuranceCreditModal,
    } = dataPb;

    const optedIntoFrs =
      dataFrsOptInStatus?.currentMerchant?.isFlatRateShippingOptedIn ?? false;
    const canSeeFrsOptIn =
      dataFrsOptInStatus?.currentMerchant
        ?.canAccessFlatRateShippingOptInOptOut ?? false;
    const showFrsOptInAnnouncementModal =
      // temporarily disabling FRS modal until i18n is ready
      false && canSeeFrsOptIn && !optedIntoFrs;

    let firstModalSet = false;
    const enqueue = (
      setStateAction: (value: SetStateAction<ModalState | undefined>) => void,
    ) => {
      if (!firstModalSet) {
        setStateAction("OPEN");
        firstModalSet = true;
        return;
      }

      setStateAction("QUEUED");
    };

    if (showFrsOptInAnnouncementModal) {
      enqueue(setFrsOptInAnnouncementModalState);
    }

    if (announcement !== undefined) {
      enqueue(setAnnouncementModalState);
    }

    if (canViewRefundAssuranceCreditModal) {
      enqueue(setRefundAssuranceSplashModalState);
    }

    if (fbwCampaignsToEnable && fbwCampaignsToEnable.length > 0) {
      enqueue(setBulkEnableFBWCampaignModalState);
    }
    if (campaignsToDuplicate && campaignsToDuplicate.length > 0) {
      enqueue(setBulkDuplicateAutomatedModalState);
    }
    if (campaignsToIncreaseBudget && campaignsToIncreaseBudget.length > 0) {
      enqueue(setBulkIncreaseBudgetModalState);
    }
    if (campaignsToResume && campaignsToResume.length > 0) {
      enqueue(setBulkResumeCampaignModalState);
    }
    if (freePromoProducts && freePromoProducts.length > 0) {
      enqueue(setProductBoostFreePromotionCampaignModalState);
    }
    if (promoMessage != null && Object.keys(promoMessage).length > 0) {
      enqueue(setProductBoostPromotionModalState);
    }
    if (
      freePbCreditModalInfo != null &&
      Object.keys(freePbCreditModalInfo).length > 0
    ) {
      enqueue(setProductBoostFreeCreditModalState);
    }

    setHasEnqueued(true);
  }, [
    hasEnqueued,
    dataPb,
    isLoadingPbData,
    errorPbData,
    dataAnnouncements,
    isLoadingAnnouncements,
    errorAnnouncements,
    dataFrsOptInStatus,
    isLoadingFrsOptInStatus,
  ]);

  // When called, set the currently modal whose state is "OPEN" to "DISMISSED"
  // and set the next modal whose state is "QUEUED" to "OPEN", if it exists
  const advanceModal = () => {
    const stateActionPairs: ReadonlyArray<
      [ModalState | undefined, Dispatch<SetStateAction<ModalState | undefined>>]
    > = [
      [frsOptInAnnouncementModalState, setFrsOptInAnnouncementModalState],
      [announcementModalState, setAnnouncementModalState],
      [refundAssuranceSplashModalState, setRefundAssuranceSplashModalState],
      [bulkEnableFbwCampaignModalState, setBulkEnableFBWCampaignModalState],
      [bulkDuplicateAutomatedModalState, setBulkDuplicateAutomatedModalState],
      [bulkIncreaseBudgetModalState, setBulkIncreaseBudgetModalState],
      [bulkResumeCampaignModalState, setBulkResumeCampaignModalState],
      [
        productBoostFreePromotionCampaignModalState,
        setProductBoostFreePromotionCampaignModalState,
      ],
      [productBoostPromotionModalState, setProductBoostPromotionModalState],
      [productBoostFreeCreditModalState, setProductBoostFreeCreditModalState],
    ];

    const currentlyOpenActionPairIndex = stateActionPairs.findIndex(
      ([state]) => state === "OPEN",
    );

    if (currentlyOpenActionPairIndex === -1) {
      return;
    }

    stateActionPairs[currentlyOpenActionPairIndex][1]("DISMISSED");

    const nextModalActionPair = stateActionPairs.find((pair, index) => {
      const [stateValue] = pair;
      if (index > currentlyOpenActionPairIndex && stateValue === "QUEUED") {
        return true;
      }
      return false;
    });

    if (nextModalActionPair !== undefined) {
      nextModalActionPair[1]("OPEN");
    }
  };

  if (
    isLoadingPbData ||
    errorPbData != null ||
    dataPb == null ||
    isLoadingAnnouncements ||
    errorAnnouncements != null ||
    dataAnnouncements == null
  ) {
    return null;
  }

  const announcements = dataAnnouncements.announcements.forUsersV2.list;
  const announcement =
    announcements != null && announcements.length > 0
      ? announcements[0]
      : undefined;

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
  } = dataPb;

  return (
    <>
      <FrsOptInModal
        open={frsOptInAnnouncementModalState === "OPEN"}
        onClose={() => advanceModal()}
      />
      <AnnouncementModal
        open={announcementModalState === "OPEN"}
        onClose={() => advanceModal()}
        title={announcement?.title}
        message={announcement?.message ?? ""}
      />
      <RefundAssuranceSplashModal
        open={refundAssuranceSplashModalState === "OPEN"}
        onClose={() => advanceModal()}
      />
      <BulkEnableFBWCampaignModal
        open={bulkEnableFbwCampaignModalState === "OPEN"}
        onClose={() => advanceModal()}
        fbwCampaignsToEnable={fbwCampaignsToEnable}
        maxAllowedSpending={maxAllowedSpending}
        currencyCode={currencyCode}
      />
      <BulkDuplicateAutomatedModal
        open={bulkDuplicateAutomatedModalState === "OPEN"}
        onClose={() => advanceModal()}
        campaignsToDuplicate={campaignsToDuplicate}
        maxAllowedSpending={maxAllowedSpending}
        currencyCode={currencyCode}
      />
      <BulkIncreaseBudgetModal
        open={bulkIncreaseBudgetModalState === "OPEN"}
        onClose={() => advanceModal()}
        campaignsToIncreaseBudget={campaignsToIncreaseBudget}
        maxAllowedSpending={maxAllowedSpending}
        currencyCode={currencyCode}
      />
      <BulkResumeCampaignModal
        open={bulkResumeCampaignModalState === "OPEN"}
        onClose={() => advanceModal()}
        campaignsToResume={campaignsToResume}
        maxAllowedSpending={maxAllowedSpending}
        currencyCode={currencyCode}
      />
      <FreePromotionModal
        open={productBoostFreePromotionCampaignModalState === "OPEN"}
        onClose={() => advanceModal()}
        productNames={freePromoProducts}
      />
      <PromoMessageModal
        open={productBoostPromotionModalState === "OPEN"}
        onClose={() => advanceModal()}
        promoMessage={promoMessage}
      />
      <FreeCreditModal
        open={productBoostFreeCreditModalState === "OPEN"}
        onClose={() => advanceModal()}
        freePbCreditModalInfo={freePbCreditModalInfo}
      />
    </>
  );
};

export default observer(AnnouncementModals);
