import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Switch } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightBold } from "@toolkit/fonts";

/* Merchant Components */
import PriceDropSuggestions from "@merchant/component/products/price-drop/PriceDropSuggestions";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";

/* Merchant Model */
import Campaign from "@merchant/model/product-boost/Campaign";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

type CampaignSuggestionsToggleEvergreenProps = BaseProps & {
  readonly campaign: Campaign;
};

const CampaignSuggestionsToggleEvergreen = (
  props: CampaignSuggestionsToggleEvergreenProps,
) => {
  const { className, style, campaign } = props;
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();

  const renderAction = () => {
    return (
      <Switch
        className={css(styles.switch)}
        isOn={campaign.isEvergreen != null ? campaign.isEvergreen : false}
        onToggle={async (isOn: boolean) => {
          // should only allow user to turn on auto renew through suggestion
          if (!isOn) {
            return;
          }

          new ConfirmationModal(
            i`When Auto Renew is on, this campaign will be ` +
              i`automatically renewed and changed after completion.`,
          )
            .setHeader({
              title: i`Auto renew your campaign`,
            })
            .setCancel(i`Cancel`)
            .setIllustration(
              isOn ? "productBoostRocketHeartbreak" : "productBoostRocket",
            )
            .setAction(i`Turn on`, async () => {
              await productBoostApi
                .changeEvergreenStatus({
                  campaign_id: campaign.id,
                  set_evergreen: isOn,
                })
                .call();
              navigationStore.reload();
            })
            .render();
        }}
      >
        <div className={css(styles.switchText)}>Auto Renew?</div>
      </Switch>
    );
  };

  return (
    <PriceDropSuggestions
      className={css(className, style)}
      illustration={"coins"}
      content={i`Turn on auto renew to renew your campaign automatically upon completion.`}
      renderAction={renderAction}
    />
  );
};

export default observer(CampaignSuggestionsToggleEvergreen);

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
    [],
  );
};
