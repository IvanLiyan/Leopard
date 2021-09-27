import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import numeral from "numeral";

/* Lego Components */
import { Markdown, H4, H6 } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Type Imports */
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

/* Relative Imports */
import BaseStoreHealthCard from "./BaseStoreHealthCard";
import StarRating from "./StarRating";

/* Model */
import { PickedMerchantStats } from "@toolkit/performance/stats";
import { RATING_THRESHOLD } from "@toolkit/performance/constants";

type Props = BaseProps & {
  readonly storeStats: PickedMerchantStats;
};

const RatingStoreHealthCard = (props: Props) => {
  const { className, style, storeStats } = props;
  const styles = useStylesheet();

  const averageProductRating = storeStats.rating?.averageProductRating;
  const startDate = storeStats.rating?.startDate;
  const endDate = storeStats.rating?.endDate;

  const weekOf =
    startDate != null && endDate != null && averageProductRating != null
      ? i`Week of ${startDate.formatted} to ${endDate.formatted}`
      : null;
  const aboveThresh =
    averageProductRating != null
      ? averageProductRating < RATING_THRESHOLD
      : false;

  const renderContent = () => (
    <>
      <div className={css(styles.statsGroup)}>
        <div className={css(styles.stat, aboveThresh && styles.hasIcon)}>
          <div className={css(styles.title)}>
            {aboveThresh && (
              <Icon name="errorFilledRed" className={css(styles.statIcon)} />
            )}
            <H6>Average product rating</H6>
          </div>
          <div>
            <div className={css(styles.rating)}>
              <H4 style={{ paddingRight: 8 }}>
                {averageProductRating != null
                  ? numeral(averageProductRating).format("0.0")
                  : "--"}
              </H4>
              <StarRating ratingValue={averageProductRating || 0} />
            </div>
          </div>
        </div>
        {/* TBD */}
        {false && (
          <div className={css(styles.percentile)}>
            <Icon name="starCircle" style={{ width: 16, paddingRight: 6 }} />
            <span className={css(styles.smallText)}>Top 10% of merchants</span>
          </div>
        )}
      </div>
    </>
  );

  const renderLearnMore = () => (
    <Markdown
      text={
        i`Your average product rating is based on customer reviews across all of your ` +
        i`products. Products with a low rating may be removed from your store.`
      }
    />
  );

  return (
    <BaseStoreHealthCard
      title={i`Rating`}
      titleIconName="darkBlueStar"
      linkTitle={i`View Rating Performance`}
      linkUrl="/rating-performance"
      content={renderContent()}
      learnMore={renderLearnMore()}
      dateSnapshot={weekOf}
      className={css(className, style)}
      aboveThreshold={aboveThresh}
    />
  );
};

export default RatingStoreHealthCard;

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
        stat: {
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: 32,
        },
        hasIcon: {
          paddingLeft: 8,
        },
        statIcon: {
          width: 16,
          paddingRight: 8,
        },
        rating: {
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        },
        percentile: {
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 11,
        },
        smallText: {
          fontSize: 12,
          lineHeight: "16px",
        },
      }),
    []
  );
};
