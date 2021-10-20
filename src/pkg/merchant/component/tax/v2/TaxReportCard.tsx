import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, DownloadButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { weightSemibold } from "@toolkit/fonts";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useNavigationStore } from "@stores/NavigationStore";

export type TaxReportCardProps = BaseProps & {
  readonly isEnabled: boolean;
};

const TaxReportCard: React.FC<TaxReportCardProps> = ({
  className,
  style,
  isEnabled,
}: TaxReportCardProps) => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();

  return (
    <Card className={css(styles.root, className, style)}>
      <div className={css(styles.header)}>Tax Reports</div>
      <div className={css(styles.content)}>
        <div className={css(styles.paragraph)}>
          Download and export your tax reports for tax remittance.
        </div>
        <DownloadButton
          className={css(styles.exportButton)}
          popoverContent={null}
          disabled={!isEnabled}
          onClick={() => navigationStore.navigate("/tax/reports")}
        >
          Export reports
        </DownloadButton>
      </div>
    </Card>
  );
};

export default observer(TaxReportCard);

const useStylesheet = () => {
  const { borderPrimaryDark, textDark, textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          padding: 24,
        },
        header: {
          paddingBottom: 14,
          borderBottom: `1px dashed ${borderPrimaryDark}`,
          fontSize: 20,
          lineHeight: "28px",
          color: textBlack,
          fontWeight: weightSemibold,
        },
        content: {
          marginTop: 16,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        },
        paragraph: {
          color: textDark,
          fontSize: 16,
          lineHeight: "24px",
        },
        exportButton: {
          marginTop: 12,
        },
      }),
    [borderPrimaryDark, textDark, textBlack],
  );
};
