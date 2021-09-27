import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import FinalSaleTable from "@merchant/component/policy/restricted-product/FinalSaleTable";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { Scalars } from "@schema/types";

type FinalSaleTabProps = {
  readonly merchantId: Scalars["ObjectIdType"];
};

const FinalSaleTab = ({ merchantId }: FinalSaleTabProps) => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.root)}>
      <FinalSaleTable style={css(styles.content)} merchantId={merchantId} />
    </div>
  );
};
export default observer(FinalSaleTab);

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
          backgroundColor: pageBackground,
          paddingBottom: 45,
        },
        content: {
          marginTop: 24,
          alignSelf: "center",
          width: "70%",
        },
      }),
    [pageBackground]
  );
};
