import React from "react";
import { observer } from "mobx-react";
import numeral from "numeral";
import { useQuery } from "@apollo/client";
import PerformanceScaleSection from "@performance/migrated/wss-order-metrics-components/PerformanceScaleSection";
import PerformanceScale from "@performance/migrated/wss-order-metrics-components/PerformanceScale";
import {
  UNDERPERFORMING_PRODUCT_RATE,
  metricsDataMap,
} from "@performance/migrated/toolkit/stats";
import {
  compare,
  formatter,
} from "@performance/toolkit/underperforming-products";
import Skeleton from "@core/components/Skeleton";
import {
  UnderperformingProductsPerformanceScaleQueryResponse,
  UNDERPERFORMING_PRODUCTS_PERFORMANCE_SCALE_QUERY,
} from "@performance/api/underperformingProductsPerformanceScaleQuery";

const UnderperformingProductsPerformanceScale: React.FC = () => {
  const { data, loading } =
    useQuery<UnderperformingProductsPerformanceScaleQueryResponse>(
      UNDERPERFORMING_PRODUCTS_PERFORMANCE_SCALE_QUERY,
      {
        fetchPolicy: "no-cache",
      },
    );

  if (loading) {
    return (
      <PerformanceScaleSection>
        <Skeleton height={160} />
      </PerformanceScaleSection>
    );
  }

  const badProductRate =
    data?.currentMerchant?.wishSellerStandard.stats?.badProductRate;

  if (!badProductRate) {
    return null;
  }

  const scoreData = metricsDataMap.underperformingProducts({ badProductRate });

  return (
    <PerformanceScaleSection>
      <PerformanceScale
        compare={compare}
        formatter={formatter}
        higherIsBetter={false}
        getScoreData={(score) =>
          metricsDataMap.underperformingProducts({
            badProductRate: score,
          })
        }
        ticks={[0.105, ...UNDERPERFORMING_PRODUCT_RATE] as const}
        currentValue={numeral(scoreData.currentScoreDisplay).value()}
      />
    </PerformanceScaleSection>
  );
};

export default observer(UnderperformingProductsPerformanceScale);
