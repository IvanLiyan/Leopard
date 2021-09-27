import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import FBWTopVariationsTable from "@merchant/component/logistics/recommendations/wishs-picks/FBWTopVariationsTable";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { FBWTopVariation } from "@merchant/api/fbw";

export type FBWTopVariationsProps = BaseProps & {
  readonly data: ReadonlyArray<FBWTopVariation>;
};

@observer
class FBWTopVariations extends Component<FBWTopVariationsProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {},
      insidePager: {
        padding: 24,
      },
      recommendationSection: {
        display: "flex",
        flexDirection: "column",
        background: "#f8fafb",
        height: "130px",
      },
      headerText: {
        fontSize: 16,
        textAlign: "center",
        padding: "40px",
        fontColor: "#152934",
      },
    });
  }

  render() {
    const { className, style, data } = this.props;
    return (
      <div className={css(this.styles.root, className, style)}>
        <Card>
          <Illustration
            name="fbwRecommendationSection"
            className={css(this.styles.recommendationSection)}
            alt="fbw recommendation section"
          />
          <div className={css(this.styles.headerText)}>
            <Markdown
              text={i`Restock your top-selling FBW products that customers love!`}
            />
            <Markdown
              text={i`Here are your top sellers **in the last 30 days**.`}
            />
          </div>
          <FBWTopVariationsTable data={data} />
        </Card>
      </div>
    );
  }
}

export default FBWTopVariations;
