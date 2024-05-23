import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Layout, H5Markdown, Pager } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import { useRequest } from "@core/toolkit/restApi";
import { GET_TODOS_ENDPOINT, GetTodoItemsResponse } from "@home/toolkit/todos";
import { css } from "@core/toolkit/styling";
import LoadingIndicatorCard from "../cards/LoadingIndicatorCard";
import Illustration from "@core/components/Illustration";
import { ci18n } from "@core/toolkit/i18n";
import Qoo10IntegrationCard from "@home/components/cards/Qoo10IntegrationCard";
import Qoo10SalesStatusCard from "@home/components/cards/Qoo10SalesStatusCard";
import WishSalesStatusCard from "@home/components/cards/WishSalesStatusCard";
import { useQuery } from "@apollo/client";
import {
  GET_MERCHANT_SALES_STATS_DATA,
  MerchantSalesStatsData,
} from "@home/toolkit/home";

type Props = BaseProps & {
  readonly isQoo10Registered: boolean | null | undefined;
  readonly isQoo10Candidate: boolean | null | undefined;
};

const GlobalSalesStatusSection: React.FC<Props> = ({
  className,
  style,
  isQoo10Registered,
  isQoo10Candidate,
}: Props) => {
  const styles = useStylesheet();
  const { data } = useQuery<MerchantSalesStatsData>(
    GET_MERCHANT_SALES_STATS_DATA,
  );

  const { isLoading, isValidating } = useRequest<GetTodoItemsResponse>({
    url: GET_TODOS_ENDPOINT,
  });

  if (isLoading || isValidating) {
    return <LoadingIndicatorCard style={[className, style]} minHeight={240} />;
  }

  const tabButtonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 109,
    height: 42,
  };

  const tabKeyTextStyle = {
    marginLeft: 12,
  };

  const renderTabBtnContent = (theme: "white" | "green", text: string) => {
    const TabButtonContent = () => (
      <div style={tabButtonStyle}>
        <Illustration
          name={theme === "white" ? "wishLogoSlimWhite" : "wishLogoSlimGreen"}
          alt={ci18n("alt label for image", "Wish Logo")}
          styleImg={{ width: 24, height: 24 }}
        />
        <span style={tabKeyTextStyle}>{text}</span>
      </div>
    );

    return TabButtonContent;
  };

  const tabContainerStyle = {
    backgroundColor: undefined,
    marginTop: 18,
  };

  return (
    <Layout.FlexColumn style={[className, style]} alignItems="stretch">
      <H5Markdown
        className={css(styles.headingV2)}
        text={`**${ci18n(
          "module title in home page",
          "Global Sales Status",
        )}**`}
      />
      <Pager tabsRowStyle={tabContainerStyle}>
        {isQoo10Candidate && (
          <Pager.Content
            className={css(styles.pagerContent)}
            key={1}
            tabKey={"wishPlus"}
            titleValue={renderTabBtnContent("white", "Wish+")}
          >
            {isQoo10Registered ? (
              <Qoo10SalesStatusCard
                data={data?.currentMerchant?.qoo10SalesStats}
              />
            ) : (
              <Qoo10IntegrationCard />
            )}
          </Pager.Content>
        )}
        <Pager.Content
          className={css(styles.pagerContent)}
          key={2}
          tabKey={"wish"}
          titleValue={renderTabBtnContent("green", "Wish")}
        >
          <WishSalesStatusCard data={data?.currentMerchant?.wishSalesStats} />
        </Pager.Content>
      </Pager>
    </Layout.FlexColumn>
  );
};

export default observer(GlobalSalesStatusSection);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        pagerContent: {
          marginTop: 24,
        },
        heading: {
          color: textBlack,
          fontSize: 24,
          lineHeight: "32px",
          marginBottom: 16,
        },
        headingV2: {
          margin: "5px 0px",
        },
        item: {
          boxShadow: "0 2px 4px 0 rgba(175, 199, 209, 0.2)",
          marginBottom: 8,
        },
        loading: {
          marginLeft: 25,
          marginBottom: 25,
          maxWidth: 200,
        },
      }),
    [textBlack],
  );
};
