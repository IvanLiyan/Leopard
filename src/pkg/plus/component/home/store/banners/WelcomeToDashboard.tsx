import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { css } from "@toolkit/styling";
import { H7 } from "@ContextLogic/lego";

/* Lego Components */
import BaseHomeBanner from "@plus/component/home/BaseHomeBanner";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly isOnboarding: boolean;
};

const WelcomeToDashboard: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { isOnboarding = false } = props;

  return (
    <BaseHomeBanner
      {...props}
      title={i`Welcome to your Store Dashboard`}
      body={
        <H7 className={css(styles.body)}>
          {isOnboarding
            ? i`Help us verify your store information by providing details about your location.`
            : i`Start saving time on inventory management today`}
        </H7>
      }
      illustration="storeShopper"
    />
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        body: {
          fontSize: 18,
        },
      }),
    []
  );
};

export default observer(WelcomeToDashboard);
