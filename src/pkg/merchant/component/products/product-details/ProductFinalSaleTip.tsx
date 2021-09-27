/* eslint-disable local-rules/use-markdown */

import React, { ReactNode } from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Tip } from "@ContextLogic/lego";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";

export type ProductFinalSaleTipProps = BaseProps;
const ProductFinalSaleTip: React.FC<ProductFinalSaleTipProps> = (
  props: ProductFinalSaleTipProps
) => {
  const link = "/product-authorization#final-sale";

  const renderTip = (): ReactNode => {
    return (
      <Tip
        color={palettes.coreColors.WishBlue}
        icon="tip"
        style={{ width: "90%" }}
      >
        <div
          style={{
            alignItems: "flex-start",
            color: palettes.textColors.Ink,
            display: "flex",
            flexDirection: "column",
            fontSize: 14,
          }}
        >
          <div style={{ fontWeight: fonts.weightMedium }}>
            To enable Final Sale Policy for the product, please enable the Final
            Sale{" "}
            <Link href={link} openInNewTab>
              here.
            </Link>
          </div>
        </div>
      </Tip>
    );
  };

  return <>{renderTip()}</>;
};

export default observer(ProductFinalSaleTip);
