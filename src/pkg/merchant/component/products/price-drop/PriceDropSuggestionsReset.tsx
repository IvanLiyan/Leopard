import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import numeral from "numeral";

/* Lego Components */
import { SecondaryButton } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import PriceDropSuggestions from "@merchant/component/products/price-drop/PriceDropSuggestions";

/* Merchant API */
import * as priceDropApi from "@merchant/api/price-drop";

/* Toolkit */
import * as logger from "@toolkit/logger";
import { PriceDropLoggingActions } from "@toolkit/price-drop/logging-actions";
import { PriceDropTooltip } from "@toolkit/price-drop/tooltip";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ImprBoosterItem } from "@merchant/api/price-drop";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

const PriceDropLogTable = "PRICE_DROP_UI";

type PriceDropSuggestionsResetProps = BaseProps & {
  readonly priceDropItem: ImprBoosterItem;
};

const PriceDropSuggestionsReset = (props: PriceDropSuggestionsResetProps) => {
  const { className, style, priceDropItem } = props;
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();

  const renderAction = () => {
    return (
      <Popover
        popoverContent={PriceDropTooltip.RESET}
        position="bottom center"
        contentWidth={300}
      >
        <SecondaryButton
          className={css(styles.button)}
          text={i`Reset Price`}
          onClick={async () => {
            const { toastStore, userStore } = AppStore.instance();
            // log
            logger.log(PriceDropLogTable, {
              merchant_id: userStore.loggedInMerchantUser.merchant_id,
              action: PriceDropLoggingActions.CLICK_RESET_FROM_PERFORMANCE_PAGE,
              price_drop_record_id: priceDropItem.id,
            });

            let hasError = false;
            try {
              await priceDropApi
                .cancelDropPrice({ record_ids: priceDropItem.id })
                .call();
            } catch (e) {
              hasError = true;
            }
            if (!hasError) {
              toastStore.positive(i`You successfully reset the price.`, {
                deferred: true,
              });
            }
            navigationStore.reload();
          }}
          padding="10px 14px"
        />
      </Popover>
    );
  };

  return (
    <PriceDropSuggestions
      className={css(className, style)}
      illustration={"coins"}
      content={i`Congratulations! You have dropped the price by ${numeral(
        priceDropItem.drop_percentage / 100.0
      ).format("0%")}`}
      renderAction={renderAction}
    />
  );
};

export default observer(PriceDropSuggestionsReset);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        button: {
          marginRight: 40,
          marginLeft: 10,
        },
      }),
    []
  );
};
