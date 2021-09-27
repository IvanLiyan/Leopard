/*
 *
 * HeaderList.tsx
 * Merchant Plus
 *
 * Created by Jonah Dlin on 9/15/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import TurndownService from "turndown";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Info, H6 } from "@ContextLogic/lego";
import { OrderCsvColumnSchema } from "@schema/types";

type Props = BaseProps & {
  readonly title: string;
  readonly headers: ReadonlyArray<OrderCsvColumnSchema>;
};

const HeaderList: React.FC<Props> = (props: Props) => {
  const { className, style, title, headers } = props;
  const styles = useStylesheet();

  const [turndown] = useState<TurndownService>(new TurndownService());

  const rows = headers.map((header) => {
    const { name, description } = header;
    const markdownDescription = turndown.turndown(description);
    return (
      <div className={css(styles.row)} key={name}>
        {name}
        {description != null && (
          <Info className={css(styles.rowInfo)} text={markdownDescription} />
        )}
      </div>
    );
  });

  return (
    <div className={css(styles.root, className, style)}>
      <H6 className={css(styles.title)}>{title}</H6>
      <div className={css(styles.rowsContainer)}>{rows}</div>
    </div>
  );
};

const infoTextWidth = 230;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        title: {
          marginBottom: 12,
        },
        rowsContainer: {},
        row: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 16,
          lineHeight: "24px",
          ":not(:last-child)": {
            marginBottom: 12,
          },
        },
        rowInfo: {
          marginLeft: 8,
        },
        infoText: {
          width: infoTextWidth,
          padding: 12,
          fontSize: 14,
          lineHeight: "20px",
        },
      }),
    []
  );
};

export default observer(HeaderList);
