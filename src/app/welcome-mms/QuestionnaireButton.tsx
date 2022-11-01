/*
 * QuestionnaireButton.tsx
 *
 * Created by Don Sirivat on Mon Jan 24 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { PrimaryButton } from "@ContextLogic/lego";
import { PrimaryButtonProps } from "@ContextLogic/lego";

const QuestionnaireButton = (props: PrimaryButtonProps) => {
  const { children, style, className, ...buttonProps } = props;
  const styles = useStylesheet();

  return (
    <PrimaryButton {...buttonProps} style={[styles.button, style, className]}>
      {children || i`Complete the Questionnaire`}
    </PrimaryButton>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        button: {
          borderRadius: 50,
          padding: "10px 25px",
          fontSize: 14,
        },
      }),
    [],
  );
};

export default observer(QuestionnaireButton);
