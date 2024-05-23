import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";
import { Layout, StaggeredFadeIn } from "@ContextLogic/lego";
import TopReadsSection from "./sections/TopReadsSection";
import QuestionsSection from "./sections/QuestionsSection";
import AboutStoreSection from "./sections/AboutStoreSection";
import AnnouncementsSection from "./sections/AnnouncementsSection";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  GET_ORDERS_AND_ANNOUNCEMENTS_QUERY,
  GetOrdersAndAnnouncements,
  HomeInitialData,
} from "@home/toolkit/home";
import PageGuide from "@core/components/PageGuide";
import { css } from "@core/toolkit/styling";
import AnnouncementModals from "./modals/AnnouncementModals";
import HomeBannerCarousel from "./banner/HomeBannerCarousel";
import UsefulLinksCard from "./cards/UsefulLinksCard";
import LoadingIndicatorCard from "./cards/LoadingIndicatorCard";
import TodoListSection from "./sections/TodoListSection";
import GlobalSalesStatusSection from "./sections/GlobalSalesStatusSection";

type Props = BaseProps & {
  readonly initialData?: HomeInitialData;
};

const MerchantHome: React.FC<Props> = ({
  className,
  style,
  initialData,
}: Props) => {
  const styles = useStylesheet();

  const { data, loading: isLoadingData } = useQuery<
    GetOrdersAndAnnouncements,
    never
  >(GET_ORDERS_AND_ANNOUNCEMENTS_QUERY);

  const loading = initialData == null || isLoadingData;

  const isNewStore =
    data?.currentMerchant?.storeStats?.totalGmv != null
      ? data.currentMerchant.storeStats.totalGmv.amount <= 0
      : true;

  return loading || initialData == null ? (
    <Layout.FlexColumn style={[className, style]}>
      <LoadingIndicatorCard minHeight={233} />
      <Layout.FlexColumn alignItems="stretch">
        <PageGuide className={css(styles.content)} relaxed>
          <Layout.GridRow
            templateColumns="4fr 1fr"
            smallScreenTemplateColumns={"1fr"}
            gap={32}
          >
            <Layout.FlexColumn style={styles.section}>
              <LoadingIndicatorCard minHeight={100} />
              <Layout.GridRow
                gap={16}
                smallScreenTemplateColumns="100%"
                templateColumns="1fr 1fr 1fr"
                style={styles.section}
              >
                <LoadingIndicatorCard minHeight={240} />
                <LoadingIndicatorCard minHeight={240} />
                <LoadingIndicatorCard minHeight={240} />
              </Layout.GridRow>
            </Layout.FlexColumn>
            <Layout.FlexColumn style={[styles.sideBar, styles.section]}>
              <LoadingIndicatorCard minHeight={700} />
            </Layout.FlexColumn>
          </Layout.GridRow>
        </PageGuide>
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  ) : (
    <StaggeredFadeIn>
      <Layout.FlexColumn style={[className, style]}>
        {!initialData.currentMerchant?.isFactory && <HomeBannerCarousel />}
        <AnnouncementModals />
        <Layout.FlexColumn alignItems="stretch">
          <PageGuide className={css(styles.content)} relaxed>
            <Layout.GridRow
              templateColumns="4fr 1fr"
              smallScreenTemplateColumns={"1fr"}
              gap={32}
            >
              <Layout.FlexColumn>
                <TodoListSection className={css(styles.section)} />
                <GlobalSalesStatusSection
                  className={css(styles.section)}
                  isQoo10Registered={
                    initialData?.currentMerchant?.isQoo10Registered
                  }
                  isQoo10Candidate={
                    initialData?.currentMerchant?.isQoo10Candidate
                  }
                />
                {!isNewStore && (
                  <AboutStoreSection
                    className={css(styles.section)}
                    primaryCurrency={
                      initialData.currentMerchant.primaryCurrency
                    }
                    storeStats={initialData.currentMerchant.storeStats}
                  />
                )}
                {isNewStore && (
                  <TopReadsSection className={css(styles.section)} />
                )}
                <QuestionsSection
                  initialData={initialData}
                  className={css(styles.section)}
                />
              </Layout.FlexColumn>
              <Layout.FlexColumn style={[styles.sideBar, styles.section]}>
                <AnnouncementsSection />
                <UsefulLinksCard />
              </Layout.FlexColumn>
            </Layout.GridRow>
          </PageGuide>
        </Layout.FlexColumn>
      </Layout.FlexColumn>
    </StaggeredFadeIn>
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
