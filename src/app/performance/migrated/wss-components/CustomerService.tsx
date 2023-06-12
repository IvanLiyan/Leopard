import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";
import numeral from "numeral";
import moment from "moment/moment";

/* Legacy */
import { ni18n, ci18n } from "@core/toolkit/i18n";

/* Lego Components */
import { Accordion, Layout, Link, Text } from "@ContextLogic/lego";

/* Merchant Components */
import Icon from "@core/components/Icon";

/* Store */
import { useTheme } from "@core/stores/ThemeStore";

/* Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PickedMerchantCsStats } from "@performance/migrated/toolkit/stats";
import {
  CS_LATE_RESPONSE_THRESHOLD,
  CS_SATISFACTION_THRESHOLD,
} from "@performance/migrated/toolkit/constants";

/* Relative Imports */
import WssSection from "./WssSection";

type CustomerServiceProps = BaseProps & {
  readonly cs: PickedMerchantCsStats | null | undefined;
};

const CustomerService: React.FC<CustomerServiceProps> = (props) => {
  const { className, style, cs } = props;
  const {
    lateResponseRate30d,
    averageTicketResponseTime,
    customerSatisfactionScore,
    startDate,
    endDate,
  } = cs || {};

  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);

  const { negativeDark, surfaceLightest } = useTheme();
  const styles = useStylesheet();

  const lateRespRate =
    lateResponseRate30d != null
      ? numeral(lateResponseRate30d).format("0.0%")
      : "-";
  const avgRespTime = averageTicketResponseTime
    ? ni18n(
        Math.round(averageTicketResponseTime.hours),
        "1 hour",
        "{%1=number of hours} hours",
      )
    : "-";
  const csSatisfactionScore =
    customerSatisfactionScore != null
      ? numeral(customerSatisfactionScore).format("0%")
      : "-";

  const lateReponseWarning =
    lateResponseRate30d != null
      ? lateResponseRate30d > CS_LATE_RESPONSE_THRESHOLD
      : false;
  const csScoreWarning =
    customerSatisfactionScore != null
      ? customerSatisfactionScore < CS_SATISFACTION_THRESHOLD
      : false;

  const showWarning = lateReponseWarning || csScoreWarning;

  const weekStart = startDate?.formatted;
  const weekEnd = endDate?.formatted;
  const monthStart = startDate?.iso8061
    ? moment(startDate.iso8061).startOf("month").format("MM/DD")
    : null;
  const monthEnd = startDate?.iso8061
    ? moment(startDate.iso8061).endOf("month").format("MM/DD")
    : null;

  const renderCsStat = ({
    title,
    stat,
    period,
    showWarning,
  }: {
    readonly title: string;
    readonly stat: string;
    readonly period: string | null | undefined;
    readonly showWarning?: boolean;
  }) => {
    return (
      <Layout.FlexColumn style={styles.statContainer}>
        <Layout.FlexRow alignItems="center">
          {showWarning && (
            <Icon
              name="warning"
              color={negativeDark}
              size={20}
              style={styles.warningIcon}
            />
          )}
          <Text style={styles.statTitle}>{title}</Text>
        </Layout.FlexRow>
        <Text style={styles.statContent} weight="semibold">
          {stat}
        </Text>
        {period && <Text style={styles.statPeriod}>{period}</Text>}
      </Layout.FlexColumn>
    );
  };

  return (
    <WssSection
      style={[className, style]}
      title={ci18n("customer service", "Customer Service")}
      subtitle={() => (
        <>
          <Text style={styles.subtitleText}>
            Customer service metrics don&apos;t impact your tier, but they give
            you insight on how to build an even better customer experience.
          </Text>
          <Link
            style={styles.subtitleLink}
            href="/cs-performance-table"
            openInNewTab
          >
            View CS Guidelines
          </Link>
        </>
      )}
    >
      <Layout.FlexColumn
        style={[styles.body, showWarning && styles.cardWarning]}
      >
        <Layout.FlexRow style={styles.statsContainer}>
          {renderCsStat({
            title: i`Late response rate`,
            stat: lateRespRate,
            period:
              monthStart && monthEnd && i`Month of ${monthStart} - ${monthEnd}`,
            showWarning: lateReponseWarning,
          })}
          {renderCsStat({
            title: i`Average ticket response time`,
            stat: avgRespTime,
            period:
              weekStart && weekEnd && i`Week of ${weekStart} - ${weekEnd}`,
          })}
          {renderCsStat({
            title: i`Customer satisfaction score`,
            stat: csSatisfactionScore,
            period:
              weekStart && weekEnd && i`Week of ${weekStart} - ${weekEnd}`,
            showWarning: csScoreWarning,
          })}
        </Layout.FlexRow>
        <Accordion
          style={styles.learMoreSection}
          header={ci18n(
            "learn more about customer service metrics score",
            "Learn more",
          )}
          isOpen={isLearnMoreOpen}
          onOpenToggled={() => setIsLearnMoreOpen((open) => !open)}
          headerPadding="0 0 8px 0"
          hideLines
          backgroundColor={surfaceLightest}
        >
          <Text style={styles.learnMoreText}>
            Please be sure to respond to customer tickets within {48} hours.
            Responses that take longer than {48} hours will be considered late
            and may result in a lower customer satisfaction score.
          </Text>
        </Accordion>
      </Layout.FlexColumn>
    </WssSection>
  );
};

export default observer(CustomerService);

const useStylesheet = () => {
  const { textBlack, textDark, borderPrimary, negative, surfaceLightest } =
    useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        subtitleText: {
          fontSize: 14,
          color: textBlack,
        },
        subtitleLink: {
          fontSize: 14,
          width: "fit-content",
        },
        body: {
          border: `1px solid ${borderPrimary}`,
          borderRadius: 4,
          background: surfaceLightest,
        },
        cardWarning: {
          borderTop: `4px solid ${negative}`,
        },
        learMoreSection: {
          padding: "16px 24px 8px 12px",
        },
        learnMoreText: {
          fontSize: 14,
          color: textDark,
          margin: "0 0 16px 30px",
        },
        statsContainer: {
          padding: 24,
          flexWrap: "wrap",
          borderBottom: `1px solid ${borderPrimary}`,
          gap: "24px 80px",
        },
        statContainer: {
          flex: "0 0 110px",
        },
        warningIcon: {
          marginRight: 8,
          flexShrink: 0,
        },
        statTitle: {
          fontSize: 14,
          color: textDark,
        },
        statContent: {
          fontSize: 28,
          color: textBlack,
          margin: "16px 0",
        },
        statPeriod: {
          fontSize: 14,
          color: textDark,
        },
      }),
    [textBlack, borderPrimary, surfaceLightest, negative, textDark],
  );
};
