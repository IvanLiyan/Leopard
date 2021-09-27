/*
 * EuVatQuestionnaireContainer.tsx
 *
 * Created by Betty Chen on Mon June 2 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Lego Components */
import { Layout } from "@ContextLogic/lego";

/* Merchant Components */
import EuVatQuestionnaire from "@merchant/component/tax/EuVatQuestionnaire";
import { PageGuide } from "@merchant/component/core";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Model */
import { EuVatQuestionnaireInitialData } from "@toolkit/tax/eu-vat";

type Props = BaseProps & {
  readonly initialData: EuVatQuestionnaireInitialData;
};

const EuVatQuestionnaireContainer: React.FC<Props> = ({
  initialData,
}: Props) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn className={css(styles.root)}>
      <PageGuide>
        <EuVatQuestionnaire
          initialData={initialData}
          className={css(styles.questionnaire)}
        />
      </PageGuide>
    </Layout.FlexColumn>
  );
};

export default observer(EuVatQuestionnaireContainer);

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: pageBackground,
        },
        questionnaire: {
          marginTop: 64,
        },
      }),
    [pageBackground]
  );
};
