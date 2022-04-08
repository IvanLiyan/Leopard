import React from "react";
import { observer } from "mobx-react";

/* Merchant Components */
import WishForMerchants, {
  WishForMerchantsMode,
} from "@merchant/component/nav/WishForMerchants";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type WishForDevelopersProps = BaseProps & {
  readonly text?: string;
  readonly mode?: WishForMerchantsMode;
};

const forDevelopersText = ci18n(
  "placed beside a 'Wish' logo to display 'Wish Developers'. Developers here means 'Software Developers'",
  "Developers"
);

const WishForDevelopers = (props: WishForDevelopersProps) => {
  const { className, style, text, mode } = props;
  return (
    <WishForMerchants
      className={css(className, style)}
      text={text || forDevelopersText}
      mode={mode}
    />
  );
};

export default observer(WishForDevelopers);
