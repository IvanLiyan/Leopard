import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Info } from "@ContextLogic/lego";

import Popover, { PopoverProps } from "@merchant/component/core/Popover";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as illustrations from "@assets/illustrations";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CommerceTransactionTaxRemitType } from "@schema/types";

type Props = BaseProps &
  PopoverProps & {
    readonly remitTypes: ReadonlyArray<CommerceTransactionTaxRemitType>;
    readonly showIcon?: boolean;
  };

const RemitTypeDescriptions: {
  [remitType in CommerceTransactionTaxRemitType]: string;
} = {
  NO_REMIT:
    i`For orders shipped to European countries, tax amounts will ` +
    i`be collected inclusive of the sales price. Merchants will ` +
    i`not receive payments for these suggested tax remittance ` +
    i`amounts in addition to their normal payments for sales.`,
  MERCHANT_REMIT:
    i`We have collected tax for this order based on your tax ` +
    i`settings. You will receive these tax amounts as part ` +
    i`of the normal payments process (less any refunds/deductions).`,
  WISH_REMIT:
    i`Wish will collect and remit the associated tax on ` +
    i`this order as a registered Marketplace Facilitator.`,
  TBD_REMIT:
    i`Tax was collected for this order but the remittance responsibility ` +
    i`(Wish or Merchant) will be determined shortly based on various ` +
    i`factors including the fulfillment method.`,
};

const RemitPopover: React.FC<Props> = ({ remitTypes, ...props }: Props) => {
  const { children, className, style, showIcon, ...otherProps } = props;
  const styles = useStylesheet();

  const isHybridRemitType = remitTypes.length > 1;
  const { [0]: remitType } = remitTypes;

  const image: string | undefined = useMemo(() => {
    if (remitType === "NO_REMIT") {
      return illustrations.lightBulbYellow;
    }

    if (remitType === "MERCHANT_REMIT") {
      return illustrations.lightBulb;
    }
  }, [remitType]);

  const popoverProps: Partial<PopoverProps> = {
    popoverContent: RemitTypeDescriptions[remitType],
    popoverMaxWidth: 300,
    popoverMinWidth: 300,
    popoverIcon: image,
    popoverFontSize: 14,
    ...otherProps,
  };

  if (isHybridRemitType) {
    return <>{children}</>;
  }

  if (showIcon) {
    return (
      <div className={css(styles.root, className, style)}>
        {children}
        <div className={css(styles.info)}>
          <Info {...popoverProps} />
        </div>
      </div>
    );
  }

  return <Popover {...popoverProps}>{children}</Popover>;
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItem: "center",
        },
        info: {
          alignSelf: "center",
          marginLeft: 7,
        },
      }),
    []
  );
};

export default observer(RemitPopover);
