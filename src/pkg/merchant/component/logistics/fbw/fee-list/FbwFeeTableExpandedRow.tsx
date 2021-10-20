import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { CopyButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@stores/ThemeStore";

/* Relative Imports */
import TextGroup from "@merchant/component/logistics/common/TextGroup";

export type FBWFeeTableAdditionalDetails = {
  readonly orderId?: string;
  readonly skus?: ReadonlyArray<string>;
  readonly weight?: string;
  readonly shippingPlanId?: string;
  readonly fbwShippingPlanId?: string;
};

const FbwFeeTableExpanedRow = (props: FBWFeeTableAdditionalDetails) => {
  //priority order: orderId > shippingPlanId > skus > weight
  const { orderId, shippingPlanId, fbwShippingPlanId, skus, weight } = props;
  const styles = useStyleSheet();
  const numFields = useMemo(() => {
    let numFields = 0;
    for (const field of [orderId, shippingPlanId, skus, weight]) {
      numFields += field ? 1 : 0;
    }
    return numFields;
  }, [orderId, shippingPlanId, skus, weight]);

  if (numFields > 0) {
    return (
      <div className={css(styles.expandRow)}>
        {orderId && (
          <TextGroup
            title={i`Order ID`}
            values={[
              <CopyButton text={orderId}>
                <Link href={`/order/${orderId}`} openInNewTab>
                  {orderId}
                </Link>
              </CopyButton>,
            ]}
          />
        )}
        {shippingPlanId && (
          <TextGroup
            title={i`Shipping Plan ID`}
            values={[
              <CopyButton text={shippingPlanId}>
                <Link
                  href={`/fbw/shipping-plan-by-id/${shippingPlanId}`}
                  openInNewTab
                >
                  {shippingPlanId}
                </Link>
              </CopyButton>,
              fbwShippingPlanId && `(${fbwShippingPlanId})`,
            ]}
          />
        )}
        {skus && <TextGroup title={i`Variation SKU`} values={skus} />}
        {weight && <TextGroup title={i`Weight`} values={[weight]} />}
      </div>
    );
  }
  return (
    <div className={css(styles.expandRow)}>
      <div className={css(styles.noDetails)}>No additional data available.</div>
    </div>
  );
};

export default observer(FbwFeeTableExpanedRow);

const useStyleSheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        expandRow: {
          display: "block",
          minHeight: "40px",
          background: pageBackground,
          margin: 0,
          padding: "5px 5px 5px 65px",
        },
        noDetails: {
          margin: "10px 14px",
        },
      }),
    [pageBackground],
  );
};
