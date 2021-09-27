import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import numeral from "numeral";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Relative Imports */
import BaseStoreHealthCard from "./BaseStoreHealthCard";
import StoreHealthcardLabel from "./StoreHealthCardLabel";

/* Model */
import { PickedMerchantStats } from "@toolkit/performance/stats";
import {
  CS_LATE_RESPONSE_THRESHOLD,
  CS_SATISFACTION_THRESHOLD,
} from "@toolkit/performance/constants";

type Props = BaseProps & {
  readonly storeStats: PickedMerchantStats;
};

const CustomerServiceStoreHealthCard = (props: Props) => {
  const { className, style, storeStats } = props;
  const styles = useStylesheet();

  const lateResponseRate30d = storeStats.cs?.lateResponseRate30d;
  const customerSatisfactionScore = storeStats.cs?.customerSatisfactionScore;
  const averageTicketResponseTime = storeStats.cs?.averageTicketResponseTime;
  const startDate = storeStats.cs?.startDate;
  const endDate = storeStats.cs?.endDate;

  const weekOf =
    (lateResponseRate30d != null ||
      customerSatisfactionScore != null ||
      averageTicketResponseTime != null) &&
    startDate != null &&
    endDate != null
      ? i`Week of ${startDate.formatted} to ${endDate.formatted}`
      : null;

  const lateReponseThresh =
    lateResponseRate30d != null
      ? lateResponseRate30d > CS_LATE_RESPONSE_THRESHOLD
      : false;
  const csScoreThresh =
    customerSatisfactionScore != null
      ? customerSatisfactionScore < CS_SATISFACTION_THRESHOLD
      : false;

  const renderContent = () => (
    <>
      <div className={css(styles.body)}>
        <Markdown
          text={
            i`Faster responses will help increase customer satisfaction and will encourage ` +
            i`return customers.`
          }
        />
      </div>
      <div className={css(styles.statsGroup)}>
        <StoreHealthcardLabel
          label={i`Late response rate`}
          value={
            lateResponseRate30d != null
              ? numeral(lateResponseRate30d).format("0.00%")
              : lateResponseRate30d
          }
          aboveThreshold={lateReponseThresh}
        />
        <StoreHealthcardLabel
          label={i`Customer satisfaction score`}
          value={
            customerSatisfactionScore != null
              ? numeral(customerSatisfactionScore).format("0.00%")
              : customerSatisfactionScore
          }
          aboveThreshold={csScoreThresh}
        />
        <StoreHealthcardLabel
          label={i`Average ticket response time`}
          value={
            averageTicketResponseTime != null
              ? i`${Math.round(averageTicketResponseTime.hours)} hours`
              : "--"
          }
        />
      </div>
    </>
  );

  const renderLearnMore = () => (
    <Markdown
      text={
        i`Please be sure to respond to customer tickets within 48 hours. Responses that ` +
        i`take longer than 48 hours will be considered late and may result in a lower ` +
        i`customer satisfaction score.`
      }
    />
  );

  return (
    <BaseStoreHealthCard
      title={i`Customer service`}
      titleIconName="darkBlueUsers"
      linkTitle={i`View CS Performance`}
      linkUrl="/cs-performance-table"
      content={renderContent()}
      learnMore={renderLearnMore()}
      dateSnapshot={weekOf}
      className={css(className, style)}
      aboveThreshold={lateReponseThresh || csScoreThresh}
    />
  );
};

export default CustomerServiceStoreHealthCard;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          display: "flex",
          flexFlow: "row",
          alignItems: "center",
        },
        body: {
          padding: "16px 0px 0px 30px",
        },
        statsGroup: {
          paddingTop: 32,
        },
      }),
    []
  );
};
