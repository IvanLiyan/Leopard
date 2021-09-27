import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";
import { StaggeredFadeIn } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Toolkit Imports */

/* Merchant Components */
import MerchantAppGridItem from "@merchant/component/external/merchant-apps/store/MerchantAppGridItem";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { MerchantAppListing } from "@merchant/api/merchant-apps";
import { Locale } from "@toolkit/locales";

type MerchantAppTableResultsProps = BaseProps & {
  readonly merchantApps: ReadonlyArray<MerchantAppListing>;
  readonly isLoading: boolean;
  readonly selectedLanguages: ReadonlyArray<Locale>;
};

const MerchantAppTableResults = (props: MerchantAppTableResultsProps) => {
  const styles = useStylesheet(props);
  const { isLoading, merchantApps, selectedLanguages } = props;

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (merchantApps.length == 0) {
    return <h3 className={css(styles.noResult)}>No results found</h3>;
  }

  return (
    <StaggeredFadeIn animationDurationMs={800}>
      <div className={css(styles.root)}>
        <div className={css(styles.grid)}>
          {merchantApps.map((merchantApp) => (
            <div className={css(styles.itemContainer)} key={merchantApp.name}>
              <MerchantAppGridItem
                merchantApp={merchantApp}
                selectedLanguages={selectedLanguages}
              />
            </div>
          ))}
          <div className={css(styles.itemContainer)} />
          <div className={css(styles.itemContainer)} />
        </div>
      </div>
    </StaggeredFadeIn>
  );
};

export default observer(MerchantAppTableResults);

const useStylesheet = (props: MerchantAppTableResultsProps) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        grid: {
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        },
        noResult: {},
        itemContainer: {
          paddingTop: 30,
          flex: "1 0 330px",
          "@media (max-width: 600px)": {
            flex: "1 0 230px",
          },
        },
      }),
    []
  );
};
