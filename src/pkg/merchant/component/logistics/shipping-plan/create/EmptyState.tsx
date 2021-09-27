/*
 * EmptyState.tsx
 *
 * Created by Sola Ogunsakin on Fri May 7 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Text, Layout } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

type Props = BaseProps & {};

const EmptyState: React.FC<Props> = ({ style, className }: Props) => {
  const styles = useStylesheet();
  return (
    <Layout.FlexColumn style={[style, className]} justifyContent="center">
      <Illustration
        name="personUsingBinoculars"
        alt="no results"
        style={styles.illustration}
      />
      <Text>Add products by clicking on the select SKUs button</Text>
    </Layout.FlexColumn>
  );
};

export default observer(EmptyState);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "150px 20px",
        },
        illustration: {
          margin: "40px 0px",
          height: 180,
        },
      }),
    []
  );
};
