//

/* eslint-disable local-rules/no-empty-link */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { PrimaryButton } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { ThemedLabel } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant API */
import * as merchantAppsApi from "@merchant/api/merchant-apps";

/* Merchant Model */
import { MerchantAppPreviewState } from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";
import { translatedLocaleNames } from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";

/* Merchant Components */

import { UpdateRequestState } from "@merchant/api/merchant-apps";
import { Theme } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

type UpdateRequestStateDetailsType = {
  [state in UpdateRequestState]: {
    readonly theme: Theme;
    readonly name: string;
    readonly popover: string;
  };
};

export const UpdateRequestStateDetails: Partial<UpdateRequestStateDetailsType> = {
  PENDING: {
    theme: "DarkYellow",
    name: i`Pending Review`,
    popover: i`Your recent changes are being reviewed.`,
  },
  REJECTED: {
    theme: "DarkRed",
    name: i`Rejected`,
    popover:
      i`We have identified some issues with your update request. ` +
      i`Please revise your update request to resolve these issues ` +
      i`and resubmit for review.`,
  },
};

export type MerchantAppUpdateRequestProps = BaseProps & {
  readonly previewState: MerchantAppPreviewState;
};

const MerchantAppUpdateRequest = (props: MerchantAppUpdateRequestProps) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();

  const { previewState } = props;

  const onClickCancel = () => {
    new ConfirmationModal(
      i`Are you sure you want to cancel your recent update request? ` +
        i`This action cannot be undone.`
    )
      .setHeader({
        title: i`Cancel update request`,
      })
      .setCancel(i`Go back`)
      .setAction(i`Cancel update`, async () => {
        await merchantAppsApi
          .cancelUpdateRequest({ client_id: previewState.clientId || "" })
          .call();
        toastStore.positive(i`Your update request has been cancelled.`, {
          deferred: true,
        });
        navigationStore.reload();
      })
      .render();
  };

  const { updateRequestState, changedData } = previewState;
  if (updateRequestState == null || changedData == null) {
    return null;
  }
  const listingDetails = UpdateRequestStateDetails[updateRequestState];

  if (listingDetails == null) {
    return null;
  }

  const { descriptions, intros } = changedData;

  return (
    <div className={css(styles.card)}>
      <div className={css(styles.cardRow)}>
        <div className={css(styles.cardTitle)}>Updates pending approval</div>
        <ThemedLabel
          theme={listingDetails.theme}
          popoverContent={listingDetails.popover}
        >
          {listingDetails.name}
        </ThemedLabel>
      </div>
      <table className={css(styles.cardTable)}>
        <tbody>
          {previewState.changedData?.name && (
            <tr className={css(styles.cardTableRow)}>
              <th className={css(styles.cardTableHeader)}>
                <div className={css(styles.configTitles)}>Name</div>
              </th>
              <td>
                <div className={css(styles.config)}>
                  {previewState.changedData.name}
                </div>
              </td>
            </tr>
          )}
          {intros && (
            <tr className={css(styles.cardTableRow)}>
              <th className={css(styles.cardTableHeader)}>
                <div className={css(styles.configTitles)}>
                  Value proposition
                </div>
              </th>
              <td>
                <div className={css(styles.config)}>
                  {Object.keys(intros).map((locale, _) => {
                    return (
                      <div key={locale}>
                        <div className={css(styles.configTitles)}>
                          {translatedLocaleNames[locale].name}
                        </div>
                        {(intros as any)[locale]}
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
          )}
          {descriptions && (
            <tr className={css(styles.cardTableRow)}>
              <th className={css(styles.cardTableHeader)}>
                <div className={css(styles.configTitles)}>Description</div>
              </th>
              <td>
                <div className={css(styles.config)}>
                  {Object.keys(descriptions).map((locale, _) => {
                    return (
                      <div key={locale}>
                        <div className={css(styles.configTitles)}>
                          {translatedLocaleNames[locale].name}
                        </div>
                        {(descriptions as any)[locale]}
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
          )}
          {previewState.changedData?.logo_source && (
            <tr className={css(styles.cardTableRow)}>
              <th className={css(styles.cardTableHeader)}>
                <div className={css(styles.configTitles)}>App logo</div>
              </th>
              <td>
                <div className={css(styles.illustrationConfig)}>
                  <img
                    className={css(styles.illustration)}
                    src={previewState.changedData.logo_source}
                  />
                </div>
              </td>
            </tr>
          )}
          {previewState.changedData?.website && (
            <tr className={css(styles.cardTableRow)}>
              <th className={css(styles.cardTableHeader)}>
                <div className={css(styles.configTitles)}>Website</div>
              </th>
              <td>
                <div className={css(styles.config)}>
                  {previewState.changedData.website}
                </div>
              </td>
            </tr>
          )}
          {previewState.changedData?.supported_languages && (
            <tr className={css(styles.cardTableRow)}>
              <th className={css(styles.cardTableHeader)}>
                <div className={css(styles.configTitles)}>
                  Supported languages
                </div>
              </th>
              <td>
                <div className={css(styles.config)}>
                  {previewState.changedData.supported_languages
                    .map((locale) => translatedLocaleNames[locale].name)
                    .join(", ")}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className={css(styles.cardRow)}>
        <div className={css(styles.configContainer)}>
          <div className={css(styles.buttonRow)}>
            {previewState.updateRequestState != "REJECTED" && (
              <div className={css(styles.buttonContainer)}>
                <PrimaryButton
                  href="/merchant_app/update"
                  className={css(styles.actionButton)}
                  style={{ padding: "7px 13px" }}
                >
                  Edit update
                </PrimaryButton>
              </div>
            )}
            {previewState.updateRequestState == "REJECTED" && (
              <div className={css(styles.buttonContainer)}>
                <PrimaryButton
                  href="/merchant_app/update?continuePrevious=true"
                  className={css(styles.actionButton)}
                  style={{ padding: "7px 13px" }}
                >
                  Revise update
                </PrimaryButton>
              </div>
            )}
            <div className={css(styles.buttonContainer)}>
              <SecondaryButton
                className={css(styles.largePrimaryButton)}
                type="default"
                padding="7px 13px"
                onClick={async () => onClickCancel()}
              >
                Cancel update
              </SecondaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(MerchantAppUpdateRequest);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          borderTop: `4px ${palettes.greyScaleColors.LightGrey} solid`,
          padding: "20px 0",
          backgroundColor: colors.white,
          marginTop: 10,
        },
        cardRow: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          flexWrap: "wrap",
          justifyContent: "space-between",
        },
        buttonRow: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          flexWrap: "wrap",
          minWidth: 237,
          height: 35,
          marginTop: "20px",
        },
        paddedLeft: {
          paddingLeft: 25,
        },

        actionButton: {
          height: 25,
          marginRight: 5,
        },
        largePrimaryButton: {
          marginRight: 5,
        },
        cardTitle: {
          color: palettes.textColors.Ink,
          fontWeight: fonts.weightBold,
          fontSize: 14,
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

        config: {
          color: palettes.textColors.Ink,
          fontSize: "14px",
          ":not(:last-child)": {
            marginBottom: 10,
          },
        },
        illustrationConfig: {
          color: palettes.textColors.Ink,
          fontSize: "14px",
          width: 100,
        },
        configTitles: {
          color: palettes.textColors.Ink,
          fontSize: "14px",
          fontWeight: fonts.weightSemibold,
          marginRight: "10px",
        },
        configContainer: {
          ":not(:last-child)": {
            marginBottom: 35,
          },
          minWidth: 174,
        },
        buttonContainer: {
          height: "100%",
          display: "flex",
        },
        illustration: {
          alignSelf: "center",
          backgroundColor: "#ffffff",
        },
      }),
    []
  );
};
