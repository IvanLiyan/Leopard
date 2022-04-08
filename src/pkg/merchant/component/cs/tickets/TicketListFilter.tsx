/*
 * TicketListFilter.tsx
 *
 * Created by Sola Ogunsakin on 03/25/2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { SimpleSelect, Text, Layout } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { useIntQueryParam, useIntArrayQueryParam } from "@toolkit/url";
import { InitialData } from "@toolkit/cs/center";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly initialData: InitialData;
};

const TicketListFilter: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    initialData: {
      platformConstants: {
        cs: { issues },
      },
    },
  } = props;
  const styles = useStylesheet();

  const [issueTypes, setIssueTypes] = useIntArrayQueryParam("issue_types");
  const [, setOffset] = useIntQueryParam("offset");

  const options = issues.map((issue) => ({
    value: issue.id.toString(),
    text: issue.label.toString(),
  }));

  return (
    <Layout.FlexColumn
      className={css(styles.root, className, style)}
      alignItems="stretch"
    >
      <Text className={css(styles.title)}>Filters</Text>
      <Layout.FlexRow justifyContent="space-between">
        <Text>Issue Type</Text>
        <SimpleSelect
          className={css(styles.select)}
          options={options}
          onSelected={(value: string) => {
            setIssueTypes([parseInt(value)]);
            setOffset(0);
          }}
          selectedValue={
            issueTypes != null && issueTypes.length > 0
              ? issueTypes[0].toString()
              : undefined
          }
          placeholder={i`Select an issue type`}
        />
      </Layout.FlexRow>
    </Layout.FlexColumn>
  );
};

export default observer(TicketListFilter);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 20,
        },
        title: {
          fontSize: 20,
          lineHeight: 1,
          marginBottom: 20,
          cursor: "default",
          userSelect: "none",
        },
        select: {
          marginLeft: 10,
        },
      }),
    []
  );
};
