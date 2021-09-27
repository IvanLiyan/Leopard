import * as React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { PrimaryButton } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly onFilter: () => Promise<unknown>;
  readonly onCancel: () => unknown;
  readonly onClose: () => unknown;
  readonly active: boolean;
};

const PaymentDetailsFilter = (props: Props) => {
  const styles = useStyleSheet();

  const { className, children, onFilter, onCancel, onClose, active } = props;

  return (
    <div className={css(styles.root, className)}>
      <div className={css(styles.header)}>
        <section className={css(styles.title)}>Payment Filters</section>
        {active && (
          <Button
            onClick={onCancel}
            hideBorder
            style={{
              padding: "7px 0px",
              color: palettes.textColors.DarkInk,
            }}
          >
            Deselect all
          </Button>
        )}
      </div>
      {children}
      <div className={css(styles.footer)}>
        <Button
          onClick={onClose}
          style={[
            styles.button,
            {
              padding: "7px 20px",
              borderRadius: 3,
              color: palettes.textColors.DarkInk,
            },
          ]}
        >
          Close
        </Button>
        <PrimaryButton onClick={onFilter} className={css(styles.button)}>
          Apply Filters
        </PrimaryButton>
      </div>
    </div>
  );
};

const useStyleSheet = () =>
  React.useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          padding: 20,
        },
        header: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        },
        title: {
          color: palettes.textColors.Ink,
          fontSize: 20,
          lineHeight: "34px",
          cursor: "default",
          userSelect: "none",
        },
        footer: {
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 10,
        },
        button: {
          margin: 4,
        },
      }),
    []
  );

export default observer(PaymentDetailsFilter);
