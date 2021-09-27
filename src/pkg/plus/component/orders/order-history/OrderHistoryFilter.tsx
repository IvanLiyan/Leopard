import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { CheckboxGroupField } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import OrderStateLabel from "./OrderStateLabel";
import { useStringArrayQueryParam } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CheckboxGroupFieldOptionType as OptionType } from "@ContextLogic/lego";
import { CommerceTransactionState } from "@schema/types";
import { useTheme } from "@merchant/stores/ThemeStore";
import { wishExpressTruck } from "@assets/icons";

type Props = BaseProps & {};

const OrderHistoryFilter: React.FC<Props> = (props: Props) => {
  const { className, style } = props;
  const styles = useStylesheet();

  const [states, setStates] = useStringArrayQueryParam("states");
  const [badges, setBadges] = useStringArrayQueryParam("badges");

  const onCheckedStatus = ({ value }: OptionType<CommerceTransactionState>) => {
    const typeSet = new Set(states || []);
    if (typeSet.has(value)) {
      typeSet.delete(value);
    } else {
      typeSet.add(value);
    }
    setStates(Array.from(typeSet));
  };

  const statusOptions: ReadonlyArray<OptionType<
    CommerceTransactionState
  >> = useMemo(() => {
    return [
      { value: "REFUNDED", title: () => <OrderStateLabel state="REFUNDED" /> },
      { value: "SHIPPED", title: () => <OrderStateLabel state="SHIPPED" /> },
    ];
  }, []);

  const onCheckedBadges = ({ value }: OptionType<string>) => {
    const typeSet = new Set(badges || []);
    if (typeSet.has(value)) {
      typeSet.delete(value);
    } else {
      typeSet.add(value);
    }
    setBadges(Array.from(typeSet));
  };

  const badgeOptions: ReadonlyArray<OptionType<string>> = useMemo(() => {
    return [
      { value: "wish_express", title: i`Wish Express`, icon: wishExpressTruck },
    ];
  }, []);

  return (
    <div className={css(styles.root, className, style)}>
      <section className={css(styles.title)}>Filter by</section>
      <CheckboxGroupField
        className={css(styles.filterGroup)}
        title={i`Status`}
        options={statusOptions}
        onChecked={onCheckedStatus}
        selected={states || []}
      />
      <CheckboxGroupField
        className={css(styles.filterGroup)}
        title={i`Badge`}
        options={badgeOptions}
        onChecked={onCheckedBadges}
        selected={badges || []}
      />
    </div>
  );
};

export default observer(OrderHistoryFilter);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          padding: 20,
        },
        title: {
          color: textBlack,
          fontSize: 20,
          marginBottom: 20,
          cursor: "default",
          userSelect: "none",
        },
        filterGroup: {
          ":not(:first-child)": {
            marginTop: 20,
          },
        },
      }),
    [textBlack]
  );
};
