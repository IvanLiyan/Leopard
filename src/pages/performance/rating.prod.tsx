import { NextPage } from "next";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { Alert } from "@ContextLogic/lego";
import { Tabs, Tab, TabPanel } from "src/app/performance-cn/components";
import AggregateRating from "src/app/performance-cn/components/rating/AggregateRating";
import ProductRating from "src/app/performance-cn/components/rating/ProductRating";
import StoreRating from "src/app/performance-cn/components/rating/StoreRating";
import WeeklyStoreRating from "src/app/performance-cn/components/rating/WeeklyStoreRating";
import WeeklyProductRating from "src/app/performance-cn/components/rating/WeeklyProductRating";
import StoreRatingsBreakdown from "src/app/performance-cn/components/rating/StoreRatingsBreakdown";
import ProductRatingsBreakdown from "src/app/performance-cn/components/rating/ProductRatingsBreakdown";
import PageRoot from "@core/components/PageRoot";
import { merchFeUrl } from "@core/toolkit/router";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import { RATING_TAB_TYPE } from "src/app/performance-cn/toolkit/enums";

const RatingPerformance: NextPage<Record<string, never>> = () => {
  const [ratingTabType, setRatingTabType] = useState(
    RATING_TAB_TYPE.AGGREGATE_RATING,
  );
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setRatingTabType(newValue);
  };

  return (
    <PageRoot>
      <PageHeader
        relaxed
        breadcrumbs={[
          { name: i`Home`, href: merchFeUrl("/home") },
          { name: i`Performance`, href: merchFeUrl("/performance-overview") },
          { name: i`Rating Performance`, href: window.location.href },
        ]}
        title={i`Rating Performance`}
      />
      <PageGuide relaxed style={{ paddingTop: 20 }}>
        <Alert
          sentiment="info"
          text={
            i`Please refer to the metrics on the Wish Standards page as the ` +
            i`definitive source for your performance.`
          }
        />
        <div style={{ marginTop: "20px" }}>
          <div style={{ borderBottom: 1, borderColor: "divider", padding: 0 }}>
            <Tabs
              value={ratingTabType}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label={i`Weekly Aggregate Rating`} />
              <Tab label={i`Weekly Store Rating`} />
              <Tab label={i`Store Rating Breakdown`} />
              <Tab label={i`Weekly Product Rating`} />
              <Tab label={i`Product Rating Breakdown`} />
              <Tab label={i`Store Rating`} />
              <Tab label={i`Product Rating`} />
            </Tabs>
          </div>
          <TabPanel
            value={ratingTabType}
            index={RATING_TAB_TYPE.AGGREGATE_RATING}
          >
            <AggregateRating />
          </TabPanel>
          <TabPanel
            value={ratingTabType}
            index={RATING_TAB_TYPE.WEEKLY_STORE_RATING}
          >
            <WeeklyStoreRating />
          </TabPanel>
          <TabPanel
            value={ratingTabType}
            index={RATING_TAB_TYPE.STORE_RATINGS_BREAKDOWN}
          >
            <StoreRatingsBreakdown />
          </TabPanel>
          <TabPanel
            value={ratingTabType}
            index={RATING_TAB_TYPE.WEEKLY_PRODUCT_RATING}
          >
            <WeeklyProductRating />
          </TabPanel>
          <TabPanel
            value={ratingTabType}
            index={RATING_TAB_TYPE.PRODUCT_RATINGS_BREAKDOWN}
          >
            <ProductRatingsBreakdown />
          </TabPanel>
          <TabPanel value={ratingTabType} index={RATING_TAB_TYPE.STORE_RATING}>
            <StoreRating />
          </TabPanel>
          <TabPanel
            value={ratingTabType}
            index={RATING_TAB_TYPE.PRODUCT_RATING}
          >
            <ProductRating />
          </TabPanel>
        </div>
      </PageGuide>
    </PageRoot>
  );
};

export default observer(RatingPerformance);
