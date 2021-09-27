/* eslint-disable filenames/match-regex */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import FBSTopVariationsGrid from "@merchant/component/logistics/recommendations/wishs-picks/FBSTopVariationsGrid";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { FBSTopVariation } from "@merchant/api/fbs";

export type FBSTopVariationsProps = BaseProps & {
  readonly data: ReadonlyArray<FBSTopVariation>;
  readonly combinedVariationsQuantityMap: Map<string, number>;
};

const FBSTopVariations = (props: FBSTopVariationsProps) => {
  const { data, combinedVariationsQuantityMap } = props;
  const styles = useStylesheet();

  return (
    <Card>
      <div className={css(styles.recommendationSection)}>
        <Illustration
          name="fbsRecommendationSection"
          className={css(styles.headerImage)}
          alt="fbs recommendation section"
        />
      </div>
      <div className={css(styles.header)}>
        <Markdown
          className={css(styles.headerText)}
          text={
            i`Wish's Picks recommends to you a list of high-potential products for FBS. ` +
            i`You can stock these recommended products by shipping them to FBW warehouses. ` +
            i`Some or all of them will automatically become available for customers' ` +
            i`**same-day pickup purchases** in the Wish app.`
          }
        />
      </div>
      <FBSTopVariationsGrid
        data={data}
        combinedVariationsQuantityMap={combinedVariationsQuantityMap}
      />
    </Card>
  );
};

export default observer(FBSTopVariations);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        insidePager: {
          padding: 24,
        },
        recommendationSection: {
          display: "flex",
          flexDirection: "column",
          background: palettes.coreColors.DarkerWishBlue,
          alignItems: "center",
          borderBottomLeftRadius: "16px",
          borderBottomRightRadius: "16px",
        },
        headerImage: {
          maxWidth: "424px",
        },
        header: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          fontSize: 16,
          textAlign: "center",
          fontColor: "#152934",
          justifyContent: "center",
        },
        headerText: {
          padding: "40px 0 0 0",
          maxWidth: "640px",
        },
      }),
    []
  );
};
