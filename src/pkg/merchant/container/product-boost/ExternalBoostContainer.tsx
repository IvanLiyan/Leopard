/*
 * SocialAdsBoostContainer.tsx
 *
 * Created by Jonah Dlin on Thu Mar 11 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { css } from "@toolkit/styling";

import { useTheme } from "@stores/ThemeStore";

import { Markdown } from "@ContextLogic/lego";
import { PageGuide, WelcomeHeader } from "@merchant/component/core";
import ExternalBoost from "@merchant/component/product-boost/external-boost/ExternalBoost";
import { ExternalBoostInitialData } from "@toolkit/product-boost/external-boost/external-boost";
import { zendeskURL } from "@toolkit/url";

type Props = {
  readonly initialData: ExternalBoostInitialData;
};

const ExternalBoostContainer: React.FC<Props> = ({ initialData }: Props) => {
  const styles = useStylesheet();
  const learnMore = `[${i`Learn more`}](${zendeskURL("1260803771770")})`;
  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`ExternalBoost`}
        body={() => (
          <Markdown
            className={css(styles.bannerParagraph)}
            text={
              i`Market your products among wider audiences beyond Wish.` +
              i` Wish and external platforms optimize your ExternalBoost ads and ` +
              i`provide you with ads performance insights. ${learnMore}`
            }
            openLinksInNewTab
          />
        )}
        maxIllustrationWidth={318}
        illustration="socialAdsBoost"
        hideBorder
      />
      <PageGuide>
        <ExternalBoost
          className={css(styles.content)}
          initialData={initialData}
        />
      </PageGuide>
    </div>
  );
};

export default observer(ExternalBoostContainer);

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: pageBackground,
        },
        bannerParagraph: {
          paddingTop: 8,
          fontSize: 16,
          lineHeight: "24px",
        },
        content: {
          marginTop: 24,
        },
      }),
    [pageBackground],
  );
};
