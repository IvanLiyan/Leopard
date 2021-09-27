/*
 * SettingsRow.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/29/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Plus Components */
import {
  Markdown,
  HorizontalField,
  HorizontalFieldProps,
} from "@ContextLogic/lego";

/* Relative Imports */
import EditButton from "./EditButton";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly title: string;
  readonly onEdit?: () => unknown;
  readonly popoverMarkdown?: string | null | undefined;
  readonly isLoading?: boolean;
  readonly popoverSentiment?: HorizontalFieldProps["popoverSentiment"];
};

const SettingsRow: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    children,
    title,
    onEdit,
    popoverMarkdown,
    isLoading,
    popoverSentiment,
  } = props;
  const styles = useStylesheet(props);

  const popoverContent = popoverMarkdown
    ? () => <Markdown text={popoverMarkdown} className={css(styles.markdown)} />
    : undefined;

  const editButton = onEdit ? (
    <EditButton onEdit={onEdit} isLoading={isLoading} />
  ) : undefined;

  return (
    <div className={css(styles.root, className, style)}>
      <HorizontalField
        title={title}
        centerTitleVertically
        centerContentVertically
        popoverContent={popoverContent}
        popoverPosition={"right center"}
        popoverSentiment={popoverSentiment}
        style={{ flex: 1 }}
        titleAlign="start"
      >
        {children}
      </HorizontalField>
      {editButton}
    </div>
  );
};

export default observer(SettingsRow);

const useStylesheet = (props: Props) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          justifyContent: "space-between",
          ":not(:last-child)": {
            paddingBottom: 30,
          },
        },
        markdown: {
          margin: "12px 21px",
          maxWidth: 196,
        },
      }),
    []
  );
};
