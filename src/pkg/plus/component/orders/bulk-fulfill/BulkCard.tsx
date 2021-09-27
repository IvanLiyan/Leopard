/*
 *
 * BulkCard.tsx
 * Merchant Plus
 *
 * Created by Jonah Dlin on 9/14/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { CSSProperties, StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { Card, H6 } from "@ContextLogic/lego";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly title: string;
  readonly contentContainerStyle?: CSSProperties | string;
};

const BulkCard: React.FC<Props> = (props: Props) => {
  const { className, style, title, contentContainerStyle, children } = props;
  const styles = useStylesheet();

  return (
    <Card
      className={css(styles.root, className, style)}
      title={() => <H6>{title}</H6>}
      contentContainerStyle={contentContainerStyle}
    >
      {children}
    </Card>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
      }),
    [],
  );
};

export default observer(BulkCard);
