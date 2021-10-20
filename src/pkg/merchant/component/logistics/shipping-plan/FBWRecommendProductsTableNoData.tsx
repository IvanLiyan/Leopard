import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Illustration } from "@merchant/component/core";
import { Card } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { useTheme } from "@stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type FBWRecommendProductsTableNoDataProps = BaseProps & {
  readonly onClick?: () => Promise<unknown>;
  readonly allowAddingProduct: boolean;
};

const FBWRecommendProductsTableNoData = (
  props: FBWRecommendProductsTableNoDataProps,
) => {
  const styles = useStylesheet();
  const { onClick, allowAddingProduct } = props;

  const renderFBWNoData = () => (
    <>
      <div className={css(styles.text)}>
        You will see recommended products here from us soon.
      </div>
      <div className={css(styles.text)}>
        <Markdown text={i`At this time, you can add products manually.`} />
        <div className={css(styles.actBtn)}>
          <PrimaryButton className={css(styles.btn)} onClick={onClick}>
            Add products manually
          </PrimaryButton>
        </div>
      </div>
    </>
  );

  const renderFBSNoData = () => (
    <>
      <Illustration
        name={"createHeader"}
        animate={false}
        alt={i`FBS No data`}
        className={css(styles.logo)}
      />
      <div className={css(styles.text)}>
        Check back soon! You will see high-potential FBS products here
        specifically picked for you by Wish when they become available
      </div>
    </>
  );

  return (
    <Card className={css(styles.card)}>
      {allowAddingProduct ? renderFBWNoData() : renderFBSNoData()}
    </Card>
  );
};

export default FBWRecommendProductsTableNoData;

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 56,
          paddingBottom: 56,
        },
        text: {
          fontSize: 16,
          lineHeight: 1.5,
          color: textBlack,
          fontWeight: fonts.weightNormal,
          fontFamily: fonts.proxima,
        },
        btn: {
          fontSize: 14,
        },
        actBtn: {
          marginTop: 8,
          padding: "0 20%",
        },
        logo: {},
      }),
    [textBlack],
  );
};
