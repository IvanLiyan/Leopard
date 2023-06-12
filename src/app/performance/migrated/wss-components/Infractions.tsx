import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo } from "react";

/* Legacy */
import { ci18n } from "@core/toolkit/i18n";

/* Lego Components */
import { Info, Layout, Markdown, Text } from "@ContextLogic/lego";

/* Merchant Components */
import Icon from "@core/components/Icon";
import Illustration, { IllustrationName } from "@core/components/Illustration";

/* Store */
import { useTheme } from "@core/stores/ThemeStore";

/* Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PickedMerchantWssDetails } from "@performance/migrated/toolkit/stats";

/* Relative Imports */
import WssSection from "./WssSection";

type Infraction = {
  readonly title: string;
  readonly count: number | undefined;
};

type InfractionsProps = BaseProps & {
  readonly wssDetails?: PickedMerchantWssDetails | null;
};

const Infractions: React.FC<InfractionsProps> = (props) => {
  const { className, style, wssDetails } = props;

  const { negativeDarker } = useTheme();
  const styles = useStylesheet();

  const stats = wssDetails?.complianceUpdateStats;

  const policyInfractions: ReadonlyArray<Infraction> = [
    {
      title: i`Misleading listings`,
      count: stats?.misleadingListingCount,
    },
    {
      title: i`Misleading tracking`,
      count: stats?.misleadingTrackingCount,
    },
    {
      title: i`Prohibited products`,
      count: stats?.prohibitedProductCount,
    },
  ];

  const fulfillmentInfractions: ReadonlyArray<Infraction> = [
    {
      title: i`Order cancellation`,
      count: stats?.orderCancellationCount,
    },
    {
      title: i`Unfulfilled order`,
      count: stats?.unfulfilledOrderCount,
    },
    {
      title: i`Late confirmed fulfillment`,
      count: stats?.lateConfirmedFulfillmentCount,
    },
  ];

  const getInfractionsCount = (infractions: ReadonlyArray<Infraction>) =>
    infractions.reduce((acc, cur) => acc + (cur.count || 0), 0);

  const renderInfractionsCard = ({
    illustration,
    title,
    info,
    infractions,
  }: {
    readonly illustration: IllustrationName;
    readonly title: string;
    readonly info: string;
    readonly infractions: ReadonlyArray<Infraction>;
  }) => {
    const infractionsCount = getInfractionsCount(infractions);
    return (
      <Layout.FlexColumn style={styles.infractionsCard}>
        <Layout.FlexRow justifyContent="space-between">
          <Illustration
            name={illustration}
            alt={illustration}
            style={styles.infractionsCardIconLeft}
          />
          {infractionsCount > 0 ? (
            <Illustration
              name="warningFilled"
              alt="warningFilled"
              style={styles.infractionsCardIconRight}
            />
          ) : (
            <Illustration
              name="darkGreenCheckmarkFilled"
              alt="darkGreenCheckmarkFilled"
              style={styles.infractionsCardIconRight}
            />
          )}
        </Layout.FlexRow>
        <Layout.FlexRow alignItems="center">
          <Text weight="bold" style={styles.infractionsCardTitle}>
            {title}
          </Text>
          <Info
            text={info}
            size={20}
            sentiment="info"
            openContentLinksInNewTab
          />
        </Layout.FlexRow>
        <Text
          weight="semibold"
          style={[
            styles.infractionsCount,
            infractionsCount > 0 && styles.colorRed,
          ]}
        >
          {infractionsCount}
        </Text>
        {infractionsCount > 0 && (
          <Layout.FlexColumn style={styles.infractionsList}>
            {infractions.map(({ title, count }) => {
              const hasInfractions = count != null && count > 0;
              return (
                <Layout.FlexRow key={title}>
                  <Text
                    style={[
                      styles.infractionsDetailTitle,
                      hasInfractions && styles.colorRed,
                    ]}
                  >
                    {title}
                  </Text>
                  {hasInfractions && (
                    <Icon
                      style={styles.warningIconRed}
                      name="warning"
                      size={16}
                      color={negativeDarker}
                    />
                  )}
                  <Text
                    weight="semibold"
                    style={[
                      styles.infractionsDetailCount,
                      hasInfractions && styles.colorRed,
                    ]}
                  >
                    {count || "-"}
                  </Text>
                </Layout.FlexRow>
              );
            })}
          </Layout.FlexColumn>
        )}
      </Layout.FlexColumn>
    );
  };

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
              Wish calculates your infractions daily on a {90}-day rolling
              basis.
            </Text>
            <Markdown
              style={styles.subtitleText}
              text={i`[View your infractions](${"/warnings/v2"})`}
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
        {renderInfractionsCard({
          illustration: "twoExclamation",
          title: i`Policy infractions`,
          info: i`Policy infractions occur when a merchant does not follow a Wish merchant policy.`,
          infractions: policyInfractions,
        })}
        {renderInfractionsCard({
          illustration: "oneExclamation",
          title: i`Fulfillment infractions`,
          info:
            i`Fulfillment infractions are a type of policy infraction that occur ` +
            i`when an order or product doesn’t adhere to Wish merchant policies ` +
            i`regarding fulfillment. [Learn more](${"/policy#5"})`,
          infractions: fulfillmentInfractions,
        })}
      </Layout.GridRow>
    </WssSection>
  );
};

export default observer(Infractions);

const useStylesheet = () => {
  const {
    textBlack,
    textDark,
    borderPrimary,
    negativeDarker,
    surfaceLightest,
  } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        subtitleText: {
          fontSize: 14,
          color: textBlack,
        },
        calendarIcon: {
          margin: "0px 4px 0px 4px",
        },
        subtitleLink: {
          fontSize: 14,
          width: "fit-content",
        },
        body: {
          gap: 16,
        },
        infractionsCard: {
          padding: 16,
          gap: "16px 0",
          border: `1px solid ${borderPrimary}`,
          borderRadius: 4,
          background: surfaceLightest,
        },
        infractionsCardIconLeft: {
          height: 32,
        },
        infractionsCardIconRight: {
          height: 24,
        },
        infractionsCardTitle: {
          fontSize: 16,
          color: textBlack,
          marginRight: 8,
        },
        infractionsCount: {
          fontSize: 28,
          color: textDark,
        },
        colorRed: {
          color: negativeDarker,
        },
        infractionsList: {
          gap: "8px 0",
        },
        infractionsDetailTitle: {
          fontSize: 16,
          color: textDark,
          flexGrow: 1,
        },
        warningIconRed: {
          marginRight: 8,
        },
        infractionsDetailCount: {
          fontSize: 16,
          color: textDark,
        },
      }),
    [textBlack, borderPrimary, textDark, negativeDarker, surfaceLightest],
  );
};
