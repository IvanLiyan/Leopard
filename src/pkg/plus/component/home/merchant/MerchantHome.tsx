import React, { useMemo, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

/* Merchant Components */
import HomeBanner from "@merchant/component/widget/home-banner/HomeBanner";
import AnnouncementModal from "@merchant/component/widget/announcement-dashboard/AnnouncementModal";
import MerchantStandingCard from "@merchant/component/widget/merchant-standing/MerchantStandingCard";
import UsefulLinksCard from "@merchant/component/widget/UsefulLinksCard";
import TodoList from "@merchant/component/widget/todo-list/TodoList";

/* Lego Components */
import { LoadingIndicator, Layout } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Plus Components */
import PageGuide from "@plus/component/nav/PageGuide";

/* Relative Imports */
import MerchantHomeBanner from "./banners/MerchantHomeBanner";
import ThingsToDoSection from "./sections/ThingsToDoSection";
import TopReadsSection from "./sections/TopReadsSection";
import MerchantInsightsSection from "./sections/MerchantInsightsSection";
import QuestionsSection from "./sections/QuestionsSection";
import AboutStoreSection from "./sections/AboutStoreSection";
import AnnouncementsSection from "./sections/AnnouncementsSection";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { HomeInitialData } from "@toolkit/home";
import { CurrencyValue, MerchantAnnouncementSchema } from "@schema/types";

/* Merchant Store */
import { useProductBoostStore } from "@merchant/stores/product-boost/ProductBoostStore";

const GET_ORDERS_AND_ANNOUNCEMENTS_QUERY = gql`
  query MerchantHome_GetOrdersAndAnnouncements {
    currentMerchant {
      storeStats {
        totalGmv {
          amount
        }
      }
    }
    announcements {
      forUsers(announcementType: BD_ANNOUNCEMENT) {
        message
        ctaText
        ctaLink
        title
      }
    }
  }
`;

type GetOrdersAndAnnouncements = {
  readonly currentMerchant?: {
    readonly storeStats?: {
      readonly totalGmv: Pick<CurrencyValue, "amount">;
    };
  };
  readonly announcements?: {
    readonly forUsers?: ReadonlyArray<
      Pick<
        MerchantAnnouncementSchema,
        "message" | "ctaLink" | "ctaText" | "title"
      >
    >;
  };
};

type Props = BaseProps & {
  readonly initialData: HomeInitialData;
};

const MerchantHome: React.FC<Props> = ({
  className,
  style,
  initialData,
}: Props) => {
  const {
    currentUser: { onboarding },
    currentMerchant: { sellerVerification, standing },
  } = initialData;
  const styles = useStylesheet();
  const { renderModalsIfNeeded, productBoostState } = useProductBoostStore();

  const { data, loading } = useQuery<GetOrdersAndAnnouncements, void>(
    GET_ORDERS_AND_ANNOUNCEMENTS_QUERY,
  );

  const onboardingSteps = onboarding?.steps || [];
  const { primaryCurrency, isMerchantPlus } = initialData.currentMerchant;
  const isNewStore =
    data?.currentMerchant?.storeStats?.totalGmv != null
      ? data.currentMerchant.storeStats.totalGmv.amount <= 0
      : true;

  useEffect(() => {
    const renderModals = async () => {
      await renderModalsIfNeeded(productBoostState);
    };
    renderModals();
  }, [renderModalsIfNeeded, productBoostState]);

  useEffect(() => {
    if (!isMerchantPlus && data?.announcements != null) {
      const {
        announcements: { forUsers },
      } = data;

      if (forUsers != null && forUsers.length > 0) {
        const { title, message, ctaText, ctaLink } = forUsers[0];

        if (message != null) {
          new AnnouncementModal({
            title,
            message,
            ctaText,
            ctaLink,
          }).render();
        }
      }
    }
  }, [isMerchantPlus, data]);

  const renderNewMerchantHome = () => (
    <Layout.FlexColumn className={css(className, style)}>
      {isMerchantPlus ? <MerchantHomeBanner /> : <HomeBanner />}
      <Layout.FlexColumn alignItems="stretch">
        <PageGuide className={css(styles.content)} relaxed={!isMerchantPlus}>
          <Layout.GridRow
            templateColumns={isMerchantPlus ? "1fr" : "4fr 1fr"}
            smallScreenTemplateColumns={"1fr"}
            gap={32}
          >
            <Layout.FlexColumn>
              {isMerchantPlus && (
                <ThingsToDoSection
                  onboardingSteps={onboardingSteps}
                  sellerVerification={sellerVerification}
                  className={css(styles.section)}
                />
              )}
              {!isMerchantPlus && (
                <TodoList className={css(styles.section)} useNewHomePage />
              )}
              {!isNewStore && (
                <AboutStoreSection
                  className={css(styles.section)}
                  primaryCurrency={primaryCurrency}
                  isMerchantPlus={isMerchantPlus}
                />
              )}
              {isNewStore && !isMerchantPlus && (
                <TopReadsSection className={css(styles.section)} />
              )}
              {isMerchantPlus && (
                <MerchantInsightsSection
                  className={css(styles.section)}
                  sellerVerification={sellerVerification}
                />
              )}
              <QuestionsSection
                initialData={initialData}
                className={css(styles.section)}
              />
            </Layout.FlexColumn>
            {!isMerchantPlus && (
              <Layout.FlexColumn
                className={css(styles.sideBar, styles.section)}
              >
                <AnnouncementsSection />
                {standing && <MerchantStandingCard standing={standing} />}
                <UsefulLinksCard />
              </Layout.FlexColumn>
            )}
          </Layout.GridRow>
        </PageGuide>
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );

  return (
    <LoadingIndicator loadingComplete={!loading}>
      {renderNewMerchantHome()}
    </LoadingIndicator>
  );
};

export default observer(MerchantHome);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        section: {
          marginTop: 64,
        },
        content: {
          display: "flex",
          flexDirection: "column",
        },
        sideBar: {
          flex: 1,
          ":nth-child(1n) > *": {
            ":not(:first-child)": {
              marginTop: 16,
            },
          },
        },
      }),
    [],
  );
};
