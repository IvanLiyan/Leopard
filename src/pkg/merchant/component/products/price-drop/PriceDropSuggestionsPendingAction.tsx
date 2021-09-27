import React, { useMemo, useState } from "react";
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
import PriceDropPopover from "@merchant/component/products/price-drop/PriceDropPopover";
import PriceDropSuggestions from "@merchant/component/products/price-drop/PriceDropSuggestions";

/* Merchant API */
import * as priceDropApi from "@merchant/api/price-drop";

/* Toolkit */
import * as logger from "@toolkit/logger";
import { PriceDropLoggingActions } from "@toolkit/price-drop/logging-actions";
import { PriceDropTooltip } from "@toolkit/price-drop/tooltip";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ImprBoosterItem } from "@merchant/api/price-drop";
import { PriceDropRangeParams } from "@merchant/component/products/price-drop/PriceDropPerformanceGraph";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useUserStore } from "@merchant/stores/UserStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

const PriceDropLogTable = "PRICE_DROP_UI";

type PriceDropSuggestionsPendingActionProps = BaseProps & {
  readonly priceDropItem: ImprBoosterItem;
  readonly renderPriceRange: (params: PriceDropRangeParams) => string;
};

const PriceDropSuggestionsPendingAction = (
  props: PriceDropSuggestionsPendingActionProps,
) => {
  const { className, style, priceDropItem, renderPriceRange } = props;
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();
  const { loggedInMerchantUser } = useUserStore();
  const {
    drop_percentage: dropPercentage,
    trial_drop_percentage: trialDropPercentage,
  } = priceDropItem;

  const [newDropPercentage, setNewDropPercentage] = useState(() => {
    if (dropPercentage) {
      return dropPercentage;
    }
    return trialDropPercentage ? trialDropPercentage : 0;
  });

  const actionButton = (
    <SecondaryButton
      className={css(styles.button)}
      text={i`Drop ${numeral(newDropPercentage).format("0,0")}%`}
      onClick={async () => {
        // log
        logger.log(PriceDropLogTable, {
          merchant_id: loggedInMerchantUser.merchant_id,
          action:
            PriceDropLoggingActions.CLICK_DROP_PRICE_FROM_PERFORMANCE_PAGE,
          price_drop_record_id: priceDropItem.id,
        });

        let hasError = false;
        try {
          await priceDropApi
            .dropPriceForImpression({
              drop_percentages: JSON.stringify({
                [priceDropItem.id]: newDropPercentage,
              }),
            })
            .call();
        } catch (e) {
          hasError = true;
        }
        if (!hasError) {
          toastStore.positive(i`You successfully dropped the price.`, {
            deferred: true,
          });
        }
        navigationStore.reload();
      }}
      padding="10px 14px"
    />
  );

  const renderAction = () => {
    return (
      <div className={css(styles.root)}>
        <PriceDropPopover
          dropPercentage={newDropPercentage}
          rangeSliderHandler={({ value }) => {
            setNewDropPercentage(value);
          }}
          priceDropItem={priceDropItem}
          renderPriceRange={renderPriceRange}
        />
        <Popover
          popoverContent={PriceDropTooltip.DROP_PRICE}
          position="bottom center"
          contentWidth={300}
        >
          {actionButton}
        </Popover>
      </div>
    );
  };

  return (
    <PriceDropSuggestions
      className={css(className, style)}
      illustration={"coins"}
      content={i`Continue to drop the product price to keep the sales momentum going!`}
      renderAction={renderAction}
    />
  );
};

export default observer(PriceDropSuggestionsPendingAction);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        button: {
          marginRight: 40,
          marginLeft: 10,
        },
      }),
    [],
  );
};
