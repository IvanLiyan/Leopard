import { Layout, LoadingIndicator, Markdown, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";
import InfractionsCard from "./InfractionsCard";
import WssSection from "@performance/migrated/wss-components/WssSection";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { useTheme } from "@core/stores/ThemeStore";
import {
  WSSInfractionWindowQuery,
  WSSInfractionWindowQueryResponse,
} from "@performance/migrated/toolkit/infractions";
import { PickedMerchantWssDetails } from "@performance/migrated/toolkit/stats";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { merchFeUrl } from "@core/toolkit/router";

type Infraction = {
  readonly title: string;
  readonly count: number | undefined;
};

type InfractionsProps = BaseProps & {
  readonly wssDetails?: PickedMerchantWssDetails;
};

const InfractionsSection: React.FC<InfractionsProps> = (props) => {
  const { className, style, wssDetails } = props;
  const stats = wssDetails?.complianceUpdateStats;

  const { locale } = useLocalizationStore();
  const styles = useStylesheet();

  const { data, loading } = useQuery<WSSInfractionWindowQueryResponse, never>(
    WSSInfractionWindowQuery,
    { fetchPolicy: "no-cache" },
  );

  const infractionWindow = data?.currentMerchant?.wishSellerStandard;

  const policyInfractions: ReadonlyArray<Infraction> = [
    {
      title: ci18n(
        "Name of a WSS product-related infraction",
        "Misleading listings",
      ),
      count: stats?.misleadingListingCount,
    },
    {
      title: ci18n(
        "Name of a WSS product-related infraction",
        "Prohibited products",
      ),
      count: stats?.prohibitedProductCount,
    },
  ];

  const fulfillmentInfractions: ReadonlyArray<Infraction> = [
    {
      title: ci18n(
        "Name of a WSS fulfillment infraction",
        "Order cancellation",
      ),
      count: stats?.orderCancellationCount,
    },
    {
      title: ci18n("Name of a WSS fulfillment infraction", "Unfulfilled order"),
      count: stats?.unfulfilledOrderCount,
    },
    {
      title: ci18n(
        "Name of a WSS fulfillment infraction",
        "Late confirmed fulfillment",
      ),
      count: stats?.lateConfirmedFulfillmentCount,
    },
    {
      title: ci18n(
        "Name of a WSS fulfillment infraction",
        "Misleading tracking",
      ),
      count: stats?.misleadingTrackingCount,
    },
  ];

  const formatDate = (unix: number | null | undefined): string => {
    if (unix == null) {
      return "";
    }
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(unix * 1000));
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <WssSection
      style={[className, style]}
      title={ci18n(
        "Infractions section in WSS performance dashboard",
        "Infractions",
      )}
      subtitle={() => (
        <>
          <Layout.FlexRow style={{ gap: 4 }}>
            <Text style={styles.subtitleText}>
              Wish calculates your Product related infractions and Fulfillment
              infractions daily on a 90-day rolling basis.
            </Text>
            <Markdown
              style={styles.subtitleText}
              text={i`[View your infractions](${merchFeUrl("/warnings/v2")})`}
              openLinksInNewTab
            />
          </Layout.FlexRow>
        </>
      )}
    >
      <Layout.GridRow
        templateColumns="360px 360px"
        smallScreenTemplateColumns="minmax(auto, 360px)"
        alignItems="flex-start"
        style={styles.body}
      >
        <InfractionsCard
          title={ci18n(
            "WSS infractions from product-related reasons",
            "Product Related Infractions",
          )}
          info={`${formatDate(
            infractionWindow?.policyInfractionWindowStartDate?.unix,
          )} - ${formatDate(
            infractionWindow?.policyInfractionWindowEndDate?.unix,
          )}`}
          infractions={policyInfractions}
        />
        <InfractionsCard
          title={ci18n(
            "WSS infractions from fulfillment-related reasons",
            "Fulfillment Infractions",
          )}
          info={`${formatDate(
            infractionWindow?.fulfillmentInfractionWindowStartDate?.unix,
          )} - ${formatDate(
            infractionWindow?.fulfillmentInfractionWindowEndDate?.unix,
          )}`}
          infractions={fulfillmentInfractions}
        />
      </Layout.GridRow>
    </WssSection>
  );
};

export default observer(InfractionsSection);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        subtitleText: {
          fontSize: 14,
          color: textBlack,
        },
        body: {
          gap: 16,
        },
      }),
    [textBlack],
  );
};
