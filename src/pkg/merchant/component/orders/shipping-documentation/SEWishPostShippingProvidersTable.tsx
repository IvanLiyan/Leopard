/* eslint-disable filenames/match-regex */

import React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { DataGrid } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type SEWishPostShippingProvidersTableProps = BaseProps & {
  readonly shippingProviders: ReadonlyArray<string>;
};

const SEWishPostShippingProvidersTable = (
  props: SEWishPostShippingProvidersTableProps
) => {
  const { shippingProviders } = props;
  const styles = useStylesheet();
  return (
    <DataGrid
      data={shippingProviders}
      className={css(styles.root)}
      numColumns={3}
      textStyle={{
        fontSize: 16,
        padding: "5px 0px",
      }}
    />
  );
};

export default observer(SEWishPostShippingProvidersTable);

const useStylesheet = () =>
  StyleSheet.create({
    root: {
      padding: 30,
    },
  });
