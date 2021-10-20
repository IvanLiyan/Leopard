import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Merchant Components */
import MerchantCsSurvey from "@merchant/component/cs/survey/MerchantCsSurvey";
import MerchantCsCompletedSurvey from "@merchant/component/cs/survey/MerchantCsCompletedSurvey";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useUIStateBool } from "@toolkit/ui-state";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

const MerchantCsHubContainer: React.FC<Record<string, never>> = () => {
  const styles = useStylesheet();
  const {
    value: hasCompletedCsSurvey,
    isLoading,
    update: setHasCompletedCsSurvey,
  } = useUIStateBool("HAS_COMPLETED_CS_SURVEY");

  return (
    <LoadingIndicator loadingComplete={!isLoading}>
      <div className={css(styles.root)}>
        <WelcomeHeader
          title={i`Customer Service Program (Coming Soon)`}
          illustration="merchantCsHubHeader"
          className={css(styles.header)}
          body={
            i`Join the waitlist and learn more about our soon-to-be launched ` +
            i`Customer Service Program below.`
          }
        />
        {hasCompletedCsSurvey ? (
          <MerchantCsCompletedSurvey style={styles.completedCard} />
        ) : (
          <MerchantCsSurvey
            style={styles.content}
            onUpdate={() => setHasCompletedCsSurvey(true)}
          />
        )}
      </div>
    </LoadingIndicator>
  );
};
export default observer(MerchantCsHubContainer);

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
          backgroundColor: pageBackground,
          paddingBottom: 64,
        },
        header: {
          minHeight: 200,
        },
        content: {
          marginTop: 64,
          width: "70%",
          alignSelf: "center",
        },
        completedCard: {
          marginTop: 64,
          marginLeft: 120,
          marginRight: 120,
          marginBottom: 64,
        },
      }),
    [pageBackground],
  );
};
