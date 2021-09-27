import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { ExpanderButton } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { useStringQueryParam } from "@toolkit/url";

/* Merchant Components */
import FBSRecommendedVariation from "@merchant/component/logistics/recommendations/wishs-picks/FBSRecommendedVariation";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { FBSTopVariation } from "@merchant/api/fbs";

export type FBSTopVariationsGridProps = BaseProps & {
  readonly data: ReadonlyArray<FBSTopVariation>;
  readonly combinedVariationsQuantityMap: Map<string, number>;
};

const FBSTopVariationsGrid = (props: FBSTopVariationsGridProps) => {
  const { data, combinedVariationsQuantityMap } = props;
  const [selectedItemVariationIds, setSelectedItemVariationIds] = useState<
    Set<string>
  >(new Set());
  const [gridExpanded, setGridExpanded] = useState(false);
  const styles = useStylesheet();
  // To achieve a nice looking grid with 3's multiplier of items, we need to calculate how many empty slots to fill.
  const emptySlotNum = gridExpanded
    ? (3 - (data.length % 3)) % 3
    : Math.max(3 - data.length, 0);

  const displayableVariations = gridExpanded ? data : data.slice(0, 3);
  const [fromEmailQueryParam] = useStringQueryParam("from_email");
  const recommendationSourceParam = `&rec_source=${
    fromEmailQueryParam ? "email" : "web"
  }`;

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.expanderButtonLine)}>
        {data.length > 3 && (
          <ExpanderButton
            expanded={gridExpanded}
            onClick={(expanded) => setGridExpanded(!expanded)}
          />
        )}
      </div>
      <div className={css(styles.grid)}>
        {displayableVariations.map((variation, index) => {
          return (
            <FBSRecommendedVariation
              key={variation.variation_id}
              variation={variation}
              selectedItemVariationIds={selectedItemVariationIds}
              onSelect={setSelectedItemVariationIds}
              isShown={index >= 3 ? gridExpanded : true}
              combinedQuantity={combinedVariationsQuantityMap}
            />
          );
        })}
        {Array(emptySlotNum)
          .fill(<div />)
          .map((emptySlot) => {
            return emptySlot;
          })}
      </div>
      <div className={css(styles.line)} />
      <div className={css(styles.grid)}>
        <div />
        <div className={css(styles.buttonContainer)}>
          <PrimaryButton
            openInNewTab
            isDisabled={selectedItemVariationIds.size === 0}
            style={{ padding: "8px 28px" }}
            href={`/create-shipping-plan?shipmentType=FBS${recommendationSourceParam}&variationIds=${Array.from(
              selectedItemVariationIds
            ).join(",")}`}
          >
            {i`Stock Products` + ` (${selectedItemVariationIds.size})`}
          </PrimaryButton>
        </div>
        <div />
      </div>
    </div>
  );
};

export default FBSTopVariationsGrid;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        expanderButtonLine: {
          display: "flex",
          flexDirection: "row-reverse",
          padding: "0 16px 0 0",
        },
        grid: {
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gridGap: "16px",
          padding: "16px",
        },
        line: {
          height: "2px",
          borderBottom: `1px solid ${palettes.greyScaleColors.DarkGrey}`,
          width: "100%",
        },
        buttonContainer: {
          padding: "8px 28px",
          lineHeight: "24px",
        },
      }),
    []
  );
};
