import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Tip } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { getCountryName } from "@toolkit/countries";

/* Relative Imports */
import { WishExpressReApplyModal } from "./WishExpressReApplyModal";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";
import { CountryCode } from "@toolkit/countries";

export type BlockedCountryTipProps = BaseProps & {
  readonly countryCode: CountryCode;
};

const BlockedCountryTip = (props: BlockedCountryTipProps) => {
  const { countryCode } = props;
  const styles = useStylesheet();
  const {
    wishExpressStore: { activeBans, eligibleApplicationCountries },
  } = useStore();

  const onReapply = () => new WishExpressReApplyModal().render();

  if (activeBans == null || eligibleApplicationCountries == null) {
    return null;
  }

  if (!activeBans[countryCode]) {
    return null;
  }

  const canReapply = eligibleApplicationCountries.includes(countryCode);
  const countryName = getCountryName(countryCode);
  return (
    <Tip
      color={palettes.coreColors.WishBlue}
      icon="tip"
      style={{ marginBottom: 10 }}
    >
      <>
        You are currently blocked from shipping to {countryName} with Wish
        Express
      </>
      {canReapply && (
        <Link className={css(styles.link)} onClick={onReapply}>
          Reapply now
        </Link>
      )}
    </Tip>
  );
};

export default observer(BlockedCountryTip);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        link: {
          marginLeft: 15,
        },
      }),
    []
  );
};
