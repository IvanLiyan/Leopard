import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { SecondaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import PriceDropSuggestions from "@merchant/component/products/price-drop/PriceDropSuggestions";

/* Merchant Model */
import Campaign from "@merchant/model/product-boost/Campaign";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type CampaignSuggestionsActionButtonProps = BaseProps & {
  readonly campaign: Campaign;
  readonly onClick: (campaign: Campaign) => any;
  readonly buttonText: string;
  readonly suggestionContent: string;
};

const CampaignSuggestionsActionButton = (
  props: CampaignSuggestionsActionButtonProps
) => {
  const {
    className,
    style,
    campaign,
    onClick,
    buttonText,
    suggestionContent,
  } = props;
  const styles = useStylesheet();

  return (
    <PriceDropSuggestions
      className={css(className, style)}
      illustration={"coins"}
      content={suggestionContent}
      renderAction={() => {
        return (
          <SecondaryButton
            className={css(styles.button)}
            text={buttonText}
            onClick={async () => {
              onClick(campaign);
            }}
            padding="10px 14px"
          />
        );
      }}
    />
  );
};

export default observer(CampaignSuggestionsActionButton);

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
