/*
 *
 * CountryShipping.tsx
 *
 * Created by Yuqing He on 10/30/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo } from "react";
import { css } from "@toolkit/styling";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Illustration } from "@merchant/component/core";
import { Text } from "@ContextLogic/lego";

import { Popover } from "@merchant/component/core";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type BadgeColumnProps = BaseProps & {
  readonly isTimeToDoorExpress: boolean | null | undefined;
  readonly topGMVCountry: boolean | null | undefined;
};

const BadgeColumn: React.FC<BadgeColumnProps> = ({
  isTimeToDoorExpress,
  topGMVCountry,
  className,
  style,
}: BadgeColumnProps) => {
  const styles = useStylesheet();
  return (
    <div className={css(styles.root, className, style)}>
      {topGMVCountry && (
        <Popover
          popoverContent={i`This is a top-selling country on Wish.`}
          position="top center"
          className={css(styles.badge)}
          popoverMaxWidth={350}
        >
          <Illustration name="crownGray" alt={i`Top GMV Country`} />
        </Popover>
      )}
      {isTimeToDoorExpress && (
        <Popover
          popoverContent={() => {
            return (
              <div className={css(styles.popoverContent)}>
                <Text weight="bold">Wish Express</Text>
                <Text>
                  Your Max Delivery Days qualifies this shipping option for Wish
                  Express.
                </Text>
              </div>
            );
          }}
          position="top center"
        >
          <Illustration name="wishExpressTruck" alt="wish express" />
        </Popover>
      )}
      {!isTimeToDoorExpress && !topGMVCountry && <div> -- </div>}
    </div>
  );
};

export default observer(BadgeColumn);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          userSelect: "none",
        },
        badge: {
          marginRight: 16,
        },
        popoverContent: {
          padding: 15,
          maxWidth: 150,
          minWidth: 300,
          fontSize: 14,
          lineHeight: 1.5,
        },
      }),
    []
  );
};
