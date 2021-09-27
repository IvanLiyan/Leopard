/*eslint-disable local-rules/unnecessary-list-usage*/

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* External Libraries */
import moment from "moment-timezone";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { formatDatetimeLocalized } from "@toolkit/datetime";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import DetailSection from "@merchant/component/external/release-notes/DetailSection";
import OperationBadge from "@merchant/component/external/api-explorer-v3/OperationBadge";
import CodeWrapper from "@merchant/component/external/release-notes/CodeWrapper";

/* Type Imports */
import { ReleaseNoteDetail } from "@merchant/api/release-notes";

type VersionSectionProps = {
  readonly title: string;
  readonly subtitle: string | null | undefined;
  readonly releaseNote: ReleaseNoteDetail;
};

const DATE_FORMAT = "YYYY-MM-DD hh:mm";

const VersionSection = ({
  title,
  subtitle,
  releaseNote,
}: VersionSectionProps) => {
  const styles = useStyleSheet();

  const {
    new_apis: newAPIs,
    deprecated_apis: deprecatedAPIs,
    changed_apis: changedAPIs,
    deleted_apis: deletedAPIs,
  } = releaseNote;

  const dateLocal = moment.utc(subtitle).local();

  return (
    <>
      <div className={css(styles.versionTitle)} key={title}>
        {formatDatetimeLocalized(dateLocal, DATE_FORMAT)}
      </div>

      {newAPIs && newAPIs.length > 0 && (
        <>
          <h3>Added the following endpoints:</h3>
          <ul>
            {newAPIs.map(({ title, method, path }) => (
              <li key={title}>
                <OperationBadge
                  type={method || "GET"}
                  className={css(styles.methodTag)}
                />
                <CodeWrapper>{path}</CodeWrapper>
              </li>
            ))}
          </ul>
        </>
      )}

      {deletedAPIs && deletedAPIs.length > 0 && (
        <>
          <h3>Removed the following endpoints:</h3>
          <ul>
            {deletedAPIs.map(({ title, method, path }) => (
              <li key={title}>
                <OperationBadge
                  type={method || "GET"}
                  className={css(styles.methodTag)}
                />
                <CodeWrapper>{path}</CodeWrapper>
              </li>
            ))}
          </ul>
        </>
      )}

      {deprecatedAPIs && deprecatedAPIs.length > 0 && (
        <>
          <h3>Deprecated the following endpoints:</h3>
          <ul>
            {deprecatedAPIs.map(({ title, method, path }) => (
              <li key={title}>
                <OperationBadge
                  type={method || "GET"}
                  className={css(styles.methodTag)}
                />
                <CodeWrapper>{path}</CodeWrapper>
              </li>
            ))}
          </ul>
        </>
      )}

      {changedAPIs && changedAPIs.length > 0 && (
        <>
          <h3>Updated the following endpoints:</h3>
          <ul>
            {changedAPIs.map(({ title, method, path, detail }) => (
              <li key={title}>
                <OperationBadge
                  type={method || "GET"}
                  className={css(styles.methodTag)}
                />
                <CodeWrapper>{path}</CodeWrapper>
                {detail && <DetailSection detail={detail} />}
              </li>
            ))}
          </ul>
        </>
      )}
      <hr className={css(styles.hr)} />
    </>
  );
};

const useStyleSheet = () => {
  const { textWhite } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        methodTag: {
          lineHeight: "18px",
          fontSize: 12,
          fontWeight: fonts.weightBold,
          padding: "0px 5px",
          marginRight: 5,
          color: textWhite,
        },
        hr: {
          ":last-of-type": {
            display: "none",
          },
        },
        versionTitle: {
          fontStyle: "normal",
          fontWeight: fonts.weightNormal,
          fontSize: "24px",
          lineHeight: "32px",
        },
      }),
    [textWhite]
  );
};

export default VersionSection;
