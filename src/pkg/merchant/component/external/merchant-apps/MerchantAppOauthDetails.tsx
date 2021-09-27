/* eslint-disable local-rules/no-empty-link */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import moment from "moment-timezone";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import * as icons from "@assets/icons";

/* Merchant API */
import * as merchantAppsApi from "@merchant/api/merchant-apps";

/* Merchant Model */
import { MerchantAppPreviewState } from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { formatDatetimeLocalized } from "@toolkit/datetime";

export type MerchantAppOauthProps = BaseProps & {
  readonly previewState: MerchantAppPreviewState;
  readonly secretStyle?: any;
  readonly dateStyle?: any;
  readonly addKeyStyle?: any;
};

const MerchantAppOauthDetails = (props: MerchantAppOauthProps) => {
  const styles = useStylesheet();

  const { previewState, dateStyle, secretStyle, addKeyStyle } = props;

  const [isClientSecretLoading, setIsClientSecretLoading] = useState(false);

  const formatDateString = (pythonDate: string) => {
    const mDate = moment.utc(pythonDate);
    if (mDate.tz(moment.tz.guess()) !== undefined) {
      return formatDatetimeLocalized(mDate.tz(moment.tz.guess()), "ll z");
    }
    return formatDatetimeLocalized(mDate, "ll z");
  };

  const onClickAddKey = async () => {
    setIsClientSecretLoading(true);
    const resp = await merchantAppsApi
      .addClientSecret({ client_id: previewState.clientId })
      .call();
    if (resp.data && resp.data.client_secrets) {
      const newClientSecrets = [...resp.data.client_secrets];
      setIsClientSecretLoading(false);
      previewState.clientSecrets = newClientSecrets;
    }
  };

  const onClickDeleteKey = (secret: string) => {
    new ConfirmationModal(
      i`Are you sure you want to delete client secret ` +
        i`key **${secret}**? You cannot undo this action.`,
    )
      .setHeader({
        title: i`Delete key`,
      })
      .setCancel(i`Cancel`)
      .setAction(i`Delete key`, async () => {
        const resp = await merchantAppsApi
          .deleteClientSecret({
            client_id: previewState.clientId,
            secret,
          })
          .call();
        if (resp.data && resp.data.client_secrets) {
          const newClientSecrets = [...resp.data.client_secrets];
          previewState.clientSecrets = newClientSecrets;
        }
      })
      .render();
  };

  return (
    <>
      <table>
        <tbody>
          {previewState.clientSecrets.map((value, index) => {
            return (
              <tr key={value.secret}>
                <td>
                  <div
                    className={css(secretStyle || styles.clientSecretSecret)}
                  >
                    {value.secret}
                  </div>
                </td>
                <td>
                  <div className={css(dateStyle || styles.clientSecretDate)}>
                    {value.date_added &&
                      i`added ${formatDateString(value.date_added)}`}
                  </div>
                </td>
                {previewState.clientSecrets.length > 1 && (
                  <td>
                    <img
                      className={css(styles.deleteSecretImg)}
                      src={icons.deletedBlue}
                      onClick={async () => onClickDeleteKey(value.secret)}
                    />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {previewState.clientSecrets.length === 1 &&
        (isClientSecretLoading ? (
          <LoadingIndicator type={"spinner"} size={20} />
        ) : (
          <Link
            className={addKeyStyle ? css(addKeyStyle) : undefined}
            onClick={async () => onClickAddKey()}
          >
            Add second key
          </Link>
        ))}
    </>
  );
};

export default observer(MerchantAppOauthDetails);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        clientSecretSecret: {
          paddingRight: "10px",
        },
        clientSecretDate: {
          color: palettes.textColors.LightInk,
          fontSize: "14px",
          ":not(:empty)": { paddingLeft: "15px", paddingRight: "10px" },
        },
        deleteSecretImg: {
          cursor: "pointer",
        },
      }),
    [],
  );
};
