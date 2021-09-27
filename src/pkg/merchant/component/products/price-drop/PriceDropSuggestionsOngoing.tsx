import React, { useMemo, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import moment from "moment-timezone";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import { Switch } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";

/* Lego Toolkit */
import { relativeTimeFormat } from "@toolkit/datetime";
import { css } from "@toolkit/styling";
import { weightBold } from "@toolkit/fonts";

/* Merchant Components */
import PriceDropSuggestions from "@merchant/component/products/price-drop/PriceDropSuggestions";

/* Merchant API */
import * as priceDropApi from "@merchant/api/price-drop";

/* Toolkit */
import * as logger from "@toolkit/logger";
import { PriceDropLoggingActions } from "@toolkit/price-drop/logging-actions";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ImprBoosterItem } from "@merchant/api/price-drop";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { useUserStore } from "@merchant/stores/UserStore";

const PriceDropLogTable = "PRICE_DROP_UI";

type PriceDropSuggestionsOngoingProps = BaseProps & {
  readonly priceDropItem: ImprBoosterItem;
};

const PriceDropSuggestionsOngoing = (
  props: PriceDropSuggestionsOngoingProps
) => {
  const { className, style, priceDropItem } = props;
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();
  const { loggedInMerchantUser } = useUserStore();

  if (priceDropItem.end_date_str == null) {
    return null;
  }
  const endDatePST = moment.tz(
    priceDropItem.end_date_str,
    "MM/DD/YYYY",
    "America/Los_Angeles"
  );
  const endDateLocal = endDatePST.clone().local();
  const value = relativeTimeFormat(endDateLocal);
  const autoRenewValue = relativeTimeFormat(
    endDateLocal.clone().subtract(1, "days")
  );

  let content: ReactNode = null;
  const canToggleAutoRenew =
    moment().isBefore(endDateLocal.clone().subtract(2, "days")) &&
    moment().isSameOrAfter(endDateLocal.clone().subtract(8, "days"));
  if (priceDropItem.blacklisted) {
    content = ci18n(
      "placeholder is a time period. e.g 'in 3 days', 'tomorrow', etc",
      "This campaign will be canceled %1$s due to low performance standards.",
      value
    );
  } else if (priceDropItem.auto_renew) {
    content = ci18n(
      "placeholder is a time period. e.g 'in 3 days', 'tomorrow', etc",
      "This campaign will auto renew %1$s.",
      autoRenewValue
    );
  } else {
    content = canToggleAutoRenew
      ? ci18n(
          "placeholder is a time period. e.g 'in 3 days', 'tomorrow', etc",
          "This campaign will be canceled %1$s. You still have time to renew the campaign.",
          value
        )
      : ci18n(
          "placeholder is a time period. e.g 'in 3 days', 'tomorrow', etc",
          "This campaign will be canceled %1$s.",
          value
        );
  }

  const autoRenew = (
    <Switch
      className={css(styles.switch)}
      isOn={priceDropItem.auto_renew}
      onToggle={async (isOn: boolean) => {
        // log
        logger.log(PriceDropLogTable, {
          merchant_id: loggedInMerchantUser.merchant_id,
          action: isOn
            ? PriceDropLoggingActions.TOGGLE_ON_AUTO_RENEW_FROM_PERFORMANCE_PAGE
            : PriceDropLoggingActions.TOGGLE_OFF_AUTO_RENEW_FROM_PERFORMANCE_PAGE,
          price_drop_record_id: priceDropItem.id,
        });

        let hasError = false;
        try {
          await priceDropApi
            .updateAutoRenew({
              record_id: priceDropItem.id,
              auto_renew: isOn,
            })
            .call();
        } catch (e) {
          hasError = true;
        }
        if (!hasError) {
          const successMsg = isOn
            ? i`You successfully turned on auto renew`
            : i`You successfully turned off auto renew`;
          toastStore.positive(successMsg, {
            deferred: true,
          });
        }
        navigationStore.reload();
      }}
    >
      <div className={css(styles.switchText)}>Auto-renew?</div>
    </Switch>
  );

  const renderAction = () => {
    if (!priceDropItem.auto_renew) {
      return (
        <Popover
          popoverContent={ci18n(
            "placeholder is a time period. e.g 'in 3 days', 'tomorrow', etc",
            "This campaign will be canceled %1$s. Your product may lose its promoted status thereafter.",
            value
          )}
          position="bottom center"
          contentWidth={300}
        >
          {autoRenew}
        </Popover>
      );
    }

    return autoRenew;
  };

  // hide auto renew toggle when campaign is blacklisted or it passes the auto renew period.
  if (priceDropItem.blacklisted || !canToggleAutoRenew) {
    return (
      <PriceDropSuggestions
        className={css(className, style)}
        illustration={"coins"}
        content={content}
      />
    );
  }

  return (
    <PriceDropSuggestions
      className={css(className, style)}
      illustration={"coins"}
      content={content}
      renderAction={renderAction}
    />
  );
};

export default observer(PriceDropSuggestionsOngoing);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        switch: {
          marginRight: 40,
          marginLeft: 10,
        },
        switchText: {
          color: "#455c70",
          fontSize: 20,
          fontWeight: weightBold,
        },
      }),
    []
  );
};
