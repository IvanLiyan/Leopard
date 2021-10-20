import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { CheckboxField } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { wishExpressTruck } from "@assets/illustrations";
import { redX, greenCheckmark } from "@assets/icons";
import { useStringEnumArrayQueryParam } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CommerceProductStatus, WarehouseShippingType } from "@schema/types";

import { useTheme } from "@stores/ThemeStore";

type Props = BaseProps & {
  readonly canManageShipping: boolean;
};

const ProductListFilter: React.FC<Props> = (props: Props) => {
  const { className, style, canManageShipping } = props;
  const styles = useStylesheet();

  const [saleStatuses, setSaleStatuses] =
    useStringEnumArrayQueryParam("sales_status");

  const [shippingTypes, setShippingTypes] =
    useStringEnumArrayQueryParam<WarehouseShippingType>("shipping_type");

  const addSaleStatus = (status: CommerceProductStatus) => {
    if (saleStatuses.includes(status)) {
      return;
    }
    setSaleStatuses([...saleStatuses, status]);
  };

  const removeSaleStatus = (status: CommerceProductStatus) => {
    if (!saleStatuses.includes(status)) {
      return;
    }
    setSaleStatuses(saleStatuses.filter((_status) => _status != status));
  };

  const setSaleStatus = (status: CommerceProductStatus, enabled: boolean) => {
    if (enabled) {
      addSaleStatus(status);
    } else {
      removeSaleStatus(status);
    }
  };

  const addShippingType = (type: WarehouseShippingType) => {
    if (shippingTypes.includes(type)) {
      return;
    }
    setShippingTypes([...shippingTypes, type]);
  };

  const removeShippingType = (type: WarehouseShippingType) => {
    if (!shippingTypes.includes(type)) {
      return;
    }
    setShippingTypes(shippingTypes.filter((_type) => _type != type));
  };

  const setShippingType = (type: WarehouseShippingType, enabled: boolean) => {
    if (enabled) {
      addShippingType(type);
    } else {
      removeShippingType(type);
    }
  };

  return (
    <div className={css(styles.root, className, style)}>
      <section className={css(styles.title)}>Filter by</section>
      <CheckboxField
        title={i`Available for sale`}
        icon={greenCheckmark}
        onChange={(checked) => setSaleStatus("ENABLED", checked)}
        checked={saleStatuses.includes("ENABLED")}
        className={css(styles.filter)}
      />
      <CheckboxField
        title={i`Unavailable for sale`}
        icon={redX}
        onChange={(checked) => setSaleStatus("DISABLED", checked)}
        checked={saleStatuses.includes("DISABLED")}
        className={css(styles.filter)}
      />
      {canManageShipping && (
        <CheckboxField
          title={i`Wish Express`}
          icon={wishExpressTruck}
          onChange={(checked) => setShippingType("WISH_EXPRESS", checked)}
          checked={shippingTypes.includes("WISH_EXPRESS")}
          className={css(styles.filter)}
        />
      )}
    </div>
  );
};

export default observer(ProductListFilter);

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          padding: 20,
        },
        title: {
          color: textDark,
          fontSize: 20,
          marginBottom: 20,
          cursor: "default",
          userSelect: "none",
        },
        filter: {
          margin: "5px 0px",
        },
      }),
    [textDark],
  );
};
