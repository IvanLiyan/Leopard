/* eslint-disable local-rules/no-empty-link */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { PrimaryButton, ThemedLabel, Link, Select } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import MerchantAppOauthDetails from "@merchant/component/external/merchant-apps/MerchantAppOauthDetails";
import MerchantAppUpdateRequest, {
  UpdateRequestStateDetails,
} from "@merchant/component/external/merchant-apps/MerchantAppUpdateRequest";

/* Merchant API */
import * as merchantAppsApi from "@merchant/api/merchant-apps";

/* Merchant Model */
import { MerchantAppPreviewState } from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";
import MerchantAppShowState from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";

import { Locale } from "@toolkit/locales";

import { ListingState } from "@merchant/api/merchant-apps";
import { Theme } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

/* Relative imports */
import WebhookTableSection from "./WebhookTableSection";

type ListingStateDetailsType = {
  [state in ListingState]: {
    readonly theme: Theme;
    readonly name: string;
    readonly popover: string;
  };
};

const ListingStateDetails: ListingStateDetailsType = {
  CREATED_PENDING: {
    theme: "DarkYellow",
    name: i`Pending Review`,
    popover:
      i`Your app has been created and is ready to use, ` +
      i`however the public details of your app are pending review.`,
  },
  APPROVED: {
    theme: "CashGreen",
    name: i`Approved`,
    popover: i`Your app details are approved.`,
  },
  UPDATED_PENDING: {
    theme: "DarkYellow",
    name: i`Updated Pending Review`,
    popover: i`Updates of your app are pending review`,
  },
  REJECTED: {
    theme: "DarkRed",
    name: i`Rejected`,
    popover:
      i`We have identified some issues with your app details. ` +
      i`Your app will continue to work, ` +
      i`but your app details will not be published.`,
  },
  HIDDEN: {
    theme: "LightGrey",
    name: i`Hidden`,
    popover: i`Your app has been hidden from the Wish App Store.`,
  },
  DISABLED: {
    theme: "DarkRed",
    name: i`Disabled`,
    popover:
      i`Your app has been disabled. ` +
      i`It will not be able to make requests to the API and ` +
      i`will not be visible in the Wish App Store.`,
  },
};

export type MerchantAppShowProps = BaseProps & {
  readonly previewState: MerchantAppPreviewState;
  readonly showState: MerchantAppShowState;
};

const MerchantAppConfigDetails = (props: MerchantAppShowProps) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();

  const { previewState, showState } = props;

  const onClickDelete = () => {
    new ConfirmationModal(
      i`Are you sure you want to delete your app? This action cannot be undone.`
    )
      .setHeader({
        title: i`Delete app`,
      })
      .setCancel(i`Cancel`)
      .setAction(i`Delete app`, async () => {
        await merchantAppsApi
          .deleteMerchantApp({ client_id: previewState.clientId || "" })
          .call();
        toastStore.positive(i`Your app has been deleted.`, {
          deferred: true,
        });
        navigationStore.navigate(`/`);
      })
      .render();
  };

  // if you find this please fix the any types (legacy)
  let listingDetails = (ListingStateDetails as any)[
    previewState.listingState || -1
  ];
  if (previewState.isDisabled) {
    listingDetails = ListingStateDetails.DISABLED;
  }

  const includedLocales = Array.from(showState.includedLocales);
  if (
    includedLocales.length &&
    previewState.previewLocale &&
    !includedLocales.includes(previewState.previewLocale)
  ) {
    previewState.previewLocale = includedLocales[0];
  }

  return (
    <>
      <div className={css(styles.card)}>
        <div className={css(styles.cardRow)}>
          <div className={css(styles.cardTitle)}>Visible only to you</div>
        </div>
        <table className={css(styles.cardTable)}>
          <tbody>
            <tr className={css(styles.cardTableRow)}>
              <th className={css(styles.cardTableHeader)}>
                <div className={css(styles.configTitles)}>Client ID</div>
              </th>
              <td>
                <div className={css(styles.config)}>
                  {previewState.clientId}
                </div>
              </td>
            </tr>
            <tr className={css(styles.cardTableRow)}>
              <th className={css(styles.cardTableHeader)}>
                <div className={css(styles.configTitles)}>Client Secrets</div>
              </th>
              <td>
                <div className={css(styles.config)}>
                  <MerchantAppOauthDetails previewState={previewState} />
                </div>
              </td>
            </tr>
            <tr className={css(styles.cardTableRow)}>
              <th className={css(styles.cardTableHeader)}>
                <div className={css(styles.configTitles)}>Redirect URI</div>
              </th>
              <td>
                <div className={css(styles.config)}>
                  {showState.mainForm.redirectUri}
                </div>
              </td>
            </tr>
            {!(
              previewState.updateRequestState != null &&
              previewState.updateRequestState in UpdateRequestStateDetails
            ) && (
              <tr className={css(styles.cardTableRow)}>
                <th className={css(styles.cardTableHeader)}>
                  <div className={css(styles.configTitles)}>
                    Approval Status
                  </div>
                </th>
                <td>
                  <div className={css(styles.config)}>
                    <ThemedLabel
                      theme={listingDetails.theme}
                      popoverContent={listingDetails.popover}
                    >
                      {listingDetails.name}
                    </ThemedLabel>
                  </div>
                </td>
              </tr>
            )}
            {showState.existingLocaleOptions.length > 1 && (
              <tr className={css(styles.cardTableRow)}>
                <th className={css(styles.cardTableHeader)}>
                  <div className={css(styles.localeSelectTitle)}>
                    View listing in
                  </div>
                </th>
                <td>
                  <div className={css(styles.selectField)}>
                    <Select
                      options={showState.existingLocaleOptions}
                      onSelected={(locale: Locale) => {
                        previewState.previewLocale = locale;
                      }}
                      selectedValue={previewState.previewLocale}
                      minWidth={150}
                      position="bottom left"
                      buttonHeight={30}
                    />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {previewState.updateRequestState != null &&
          previewState.updateRequestState in UpdateRequestStateDetails && (
            <MerchantAppUpdateRequest previewState={previewState} />
          )}
        {!(
          previewState.updateRequestState &&
          previewState.updateRequestState in UpdateRequestStateDetails
        ) && (
          <div className={css(styles.buttonCardRow)}>
            <div className={css(styles.configContainer)}>
              <div className={css(styles.buttonRow)}>
                <div className={css(styles.buttonContainer)}>
                  <PrimaryButton
                    href="/merchant_app/update"
                    className={css(styles.actionButton)}
                    style={{ padding: "7px 13px" }}
                  >
                    Edit app listing
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={css(styles.deleteCardRow)}>
          <div className={css(styles.buttonContainer)}>
            <Link
              onClick={async () => onClickDelete()}
              style={{ color: palettes.reds.DarkestRed }}
            >
              Delete listing
            </Link>
          </div>
        </div>
      </div>
      <WebhookTableSection
        infoText={
          i`Create webhooks to subscribe to events via push notifications sent to ` +
          i`URLs specified by you. You may leverage these notifications to take ` +
          i`actions on behalf of your Wish merchants.`
        }
        className={css(styles.webhook)}
      />
    </>
  );
};

export default observer(MerchantAppConfigDetails);

const useStylesheet = () => {
  const maxWidth = 600;

  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          padding: 20,
          backgroundColor: colors.white,
          marginTop: 20,
          maxWidth,
        },
        cardRow: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          flexWrap: "wrap",
        },
        buttonCardRow: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          flexWrap: "wrap",
          margin: "20px 0px",
        },
        buttonRow: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          flexWrap: "wrap",
          minWidth: 237,
          height: 35,
        },
        actionButton: {
          height: 25,
          marginRight: 5,
        },
        deleteCardRow: {
          borderTop: `4px ${palettes.greyScaleColors.LightGrey} solid`,
          paddingTop: 10,
          backgroundColor: colors.white,
          marginTop: 10,
        },
        cardTitle: {
          color: palettes.textColors.Ink,
          fontWeight: fonts.weightBold,
          fontSize: 18,
          marginBottom: 20,
          marginRight: 20,
        },
        cardTable: {
          border: "1px solid black",
          textAlign: "left",
          borderCollapse: "separate",
          borderSpacing: "0px 15px",
          borderStyle: "none",
        },
        cardTableRow: {
          verticalAlign: "top",
        },
        cardTableHeader: {
          paddingRight: "20px",
        },
        selectField: {
          maxWidth: 200,
        },
        config: {
          color: palettes.textColors.Ink,
          fontSize: "14px",
          ":not(:last-child)": {
            marginBottom: 10,
          },
        },
        configTitles: {
          color: palettes.textColors.Ink,
          fontSize: "14px",
          fontWeight: fonts.weightSemibold,
          marginRight: "10px",
        },
        localeSelectTitle: {
          color: palettes.textColors.Ink,
          fontSize: "14px",
          fontWeight: fonts.weightSemibold,
          marginRight: 10,
          padding: "7px 0px",
        },
        configContainer: {
          ":not(:last-child)": {
            paddingRight: 20,
          },
          minWidth: 174,
        },
        buttonContainer: {
          height: "100%",
          display: "flex",
        },
        table: {
          marginTop: 24,
        },
        webhook: {
          maxWidth,
        },
      }),
    []
  );
};
