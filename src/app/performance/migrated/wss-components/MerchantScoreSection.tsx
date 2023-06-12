import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import PageGuide from "@core/components/PageGuide";
import Dashboard from "./Dashboard";

/* Model */
import { PerformanceHealthInitialData } from "@performance/migrated/toolkit/stats";

type Props = BaseProps & {
  readonly initialData: PerformanceHealthInitialData;
};

const MerchantScoreSection = (props: Props) => {
  const { initialData } = props;

  const { className, style } = props;
  const styles = useStylesheet();

  return (
    <PageGuide className={css(styles.root, className, style)} relaxed>
      <Dashboard style={styles.dashboard} initialData={initialData} />
    </PageGuide>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          justifyContent: "center",
        },
        section: {
          ":not(:last-child)": {
            marginBottom: 32,
          },
        },
        dashboard: {
          marginBottom: 32,
        },
      }),
    [],
  );
};

export default observer(MerchantScoreSection);
