import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

/* Merchant Components */
import ClientSettingsSection from "@merchant/component/external/merchant-apps/ClientSettingsSection";
import ConnectedAppGridItem from "@merchant/component/external/merchant-apps/ConnectedAppGridItem";

/* Merchant API */
import * as merchantAppsApi from "@merchant/api/merchant-apps";
import { getAuthorizedAppListingsRequest } from "@merchant/api/merchant-apps";

/* Toolkit */
import { useRequest } from "@toolkit/api";

const ClientSettingsConnectedApps = () => {
  const styles = useStylesheet();
  const merchantAppUrl = "/merchant_apps";

  const [response, refreshAppListings] = useRequest(
    getAuthorizedAppListingsRequest({})
  );

  const authorizedAppListings = response?.data;

  if (!authorizedAppListings) {
    return <LoadingIndicator />;
  }

  return (
    <ClientSettingsSection
      title={i`Connected apps`}
      style={{ marginBottom: 36 }}
    >
      {authorizedAppListings.length > 0 ? (
        <div className={css(styles.grid)}>
          {authorizedAppListings.map(
            ({ app_details: appDetails, action_to_scope: actionToScope }) => (
              <ConnectedAppGridItem
                className={css(styles.gridItem)}
                key={appDetails.client_id}
                merchantApp={appDetails}
                actionToScope={actionToScope}
                onClickRemoveAction={async () => {
                  const params = { client_id: appDetails.client_id };
                  try {
                    await merchantAppsApi.removeAuthorization(params).call();
                    await refreshAppListings();
                  } catch (e) {
                    // eslint-disable no-empty
                  }
                }}
              />
            )
          )}
        </div>
      ) : (
        <div className={css(styles.emptyPrivateAppRoot)}>
          <Illustration
            name="shapesEmptyState"
            className={css(styles.contentImage)}
            alt={i`Picture representing empty connected apps page`}
          />
          <div className={css(styles.contentTitle)}>
            You haven't added any apps yet
          </div>
          <div className={css(styles.contentMessageWrapper)}>
            <Link className={css(styles.contentAction)} href={merchantAppUrl}>
              Explore apps
            </Link>
          </div>
        </div>
      )}
    </ClientSettingsSection>
  );
};

export default observer(ClientSettingsConnectedApps);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        emptyPrivateAppRoot: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          padding: "40px 0",
          flex: 1,
        },
        privateAppRoot: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          backgroundColor: "white",
          padding: "24px",
        },
        contentImage: {
          marginBottom: 16,
        },
        contentTitle: {
          fontSize: 16,
          fontWeight: fonts.weightBold,
          color: palettes.textColors.Ink,
          lineHeight: 1.5,
          marginBottom: 8,
        },
        contentMessageWrapper: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        },
        contentMessage: {
          fontSize: 12,
          color: palettes.textColors.Ink,
          paddingRight: 5,
          lineHeight: 1.5,
        },
        contentAction: {
          fontSize: 12,
          color: palettes.coreColors.WishBlue,
          fontWeight: fonts.weightSemibold,
          cursor: "pointer",
          lineHeight: 1.5,
        },
        modalWrapper: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
        },
        modalFormInputWrapper: {
          backgroundColor: palettes.greyScaleColors.LighterGrey,
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          padding: "36px 100px",
        },
        modalTextInput: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          height: 40,
        },
        modalFormField: {
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: 20,
        },
        modalFormFieldContent: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          flex: 1,
        },
        appName: {
          fontSize: 20,
          fontWeight: fonts.weightBold,
          lineHeight: 1.4,
          color: palettes.textColors.Ink,
          marginBottom: 30,
        },
        appContentWrapper: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
        },
        infoTitle: {
          width: "90px",
          fontSize: 14,
          color: palettes.textColors.Ink,
          fontWeight: fonts.weightSemibold,
          lineHeight: 1.4,
          marginRight: 44,
          textAlign: "right",
        },
        infoText: {
          fontSize: 14,
          color: palettes.textColors.Ink,
          fontWeight: fonts.weightSemibold,
          lineHeight: 1.4,
          marginRight: 30,
        },
        dateText: {
          fontSize: 12,
          fontWeight: fonts.weightMedium,
          color: palettes.textColors.LightInk,
          paddingRight: 10,
        },
        infoTextWrapper: {
          display: "flex",
          alignItems: "center",
          marginBottom: 20,
        },
        trashImage: {
          marginLeft: "10px",
          cursor: "pointer",
        },
        buttonWrapper: {
          display: "flex",
          alignSelf: "stretch",
        },
        updateButton: {
          padding: "6px 38px",
        },
        deleteButton: {
          backgroundColor: palettes.reds.DarkerRed,
          borderColor: palettes.reds.DarkerRed,
          marginLeft: "10px",
          ":hover": {
            opacity: 0.5,
            cursor: "pointer",
          },
        },
        addKeyText: {
          fontSize: 12,
        },
        grid: {
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
        },
        gridItem: {
          "@media (min-width: 1064px)": {
            marginTop: 24,
            maxWidth: 416,
            ":nth-child(odd)": {
              marginRight: 24,
            },
            ":nth-child(-n+2)": {
              marginTop: 0,
            },
          },
          "@media (max-width: 1063px)": {
            marginTop: 24,
            marginRight: 0,
            ":nth-child(odd)": {
              marginRight: 0,
            },
            ":nth-child(-n+1)": {
              marginTop: 0,
            },
            alignSelf: "stretch",
          },
          width: "100%",
        },
      }),
    []
  );
};
