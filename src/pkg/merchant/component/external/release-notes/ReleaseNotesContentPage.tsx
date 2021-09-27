import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react-lite";
import { useRequest } from "@toolkit/api";
import { css } from "@toolkit/styling";

/* Merchant API */
import { getApiReleaseNotes } from "@merchant/api/release-notes";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Merchant Components */
import VersionSection from "@merchant/component/external/release-notes/VersionSection";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

type ReleaseNotesContentPageProps = {
  readonly resource: string;
};

const ReleaseNotesContentPage = (props: ReleaseNotesContentPageProps) => {
  const styles = useStylesheet();
  const { resource } = props;
  const [resp] = useRequest(
    getApiReleaseNotes({ api_resource_name: resource }),
  );
  const dependencyInfo = resp?.data?.dependency_info;
  const releaseNotes = resp?.data?.release_notes;

  if (!dependencyInfo || !releaseNotes) {
    return <LoadingIndicator />;
  }

  const { api_dependency: resourceName } = dependencyInfo;

  return (
    <div className={css(styles.root)}>
      <h1 className={css(styles.title)}>{resourceName} Release Notes</h1>
      {releaseNotes.map(({ title, subtitle, release_note: releaseNote }) => (
        <VersionSection
          key={title}
          title={title}
          subtitle={subtitle}
          releaseNote={releaseNote}
        />
      ))}
    </div>
  );
};

export default observer(ReleaseNotesContentPage);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "10px 50px 10px 100px",
          color: textBlack,
        },
        title: {
          lineHeight: "40px",
        },
      }),
    [textBlack],
  );
};
