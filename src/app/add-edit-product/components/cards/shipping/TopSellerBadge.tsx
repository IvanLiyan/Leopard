/*
 * TopSellerBadge.tsx
 *
 * Created by Jonah Dlin on Thu Nov 04 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Popover, Text } from "@ContextLogic/lego";
import Illustration from "@core/components/Illustration";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps;

const TopSellerBadge: React.FC<Props> = ({ style, className }: Props) => {
  const styles = useStylesheet();
  return (
    <Popover
      style={[style, className]}
      popoverContent={() => (
        <Text style={styles.popover}>
          This is a top selling country on Wish.
        </Text>
      )}
    >
      <Illustration
        name="topSeller"
        className={css(styles.icon)}
        alt={i`Top seller`}
      />
    </Popover>
  );
};

export default observer(TopSellerBadge);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        popover: {
          padding: 16,
        },
        icon: {
          width: 24,
          height: 24,
        },
      }),
    [],
  );
};
