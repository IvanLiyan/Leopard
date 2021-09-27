import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { weightBold } from "@toolkit/fonts";

/* Merchant API */
import { getCodeSamples } from "@merchant/api/partner-developer";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Toolkit */
import { useRequest } from "@toolkit/api";
import { css } from "@toolkit/styling";

// copied from incoming data
const defaultLanguage = "shell_curl";

type Props = {
  readonly maxWidth?: string;
};

const PartnerDeveloperCodeSection = (props: Props) => {
  const styles = useStylesheet();
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const [response] = useRequest(getCodeSamples({}));
  const codeSamples = response?.data?.code_samples;
  if (!codeSamples) {
    return <LoadingIndicator />;
  }
  const codeSample = codeSamples.find(({ lang }) => lang === selectedLanguage);
  const codeSampleSource = codeSample ? codeSample.source : i`None available`;
  return (
    <div className={css(styles.content)}>
      <div className={css(styles.contentPanel)}>
        <div className={css(styles.contentColumn)}>
          <div className={css(styles.contentRow)}>
            {codeSamples.map(({ title, lang }) => {
              const style = [styles.menuItem];
              if (selectedLanguage === lang) {
                style.push(styles.selected);
              }
              return (
                <div
                  className={css(style)}
                  key={title}
                  onClick={() => setSelectedLanguage(lang)}
                >
                  {title}
                </div>
              );
            })}
          </div>
          <div className={css(styles.codeBox)}>
            <div className={css(styles.code)}>{codeSampleSource}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const useStylesheet = () => {
  const { textWhite, borderPrimary, primary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          display: "flex",
          padding: "60px 20px",
          justifyContent: "center",
          alignItems: "center",
          "@media (max-width: 1000px)": {
            flexDirection: "column",
            padding: "0 20px",
          },
        },
        contentPanel: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 100px 0 0",
          maxWidth: 750,
          "@media (max-width: 1000px)": {
            flexDirection: "column",
            maxWidth: "100%",
            margin: 20,
          },
        },
        contentRow: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginBottom: 30,
          flexWrap: "wrap",
        },
        contentColumn: {
          display: "flex",
          flexDirection: "column",
          width: "100%",
        },
        codeBox: {
          maxWidth: 450,
          width: "100%",
          height: 200,
          border: `1px solid ${borderPrimary}`,
          borderRadius: 4,
          padding: 16,
          overflowY: "scroll",
        },
        code: {
          width: "100%",
          wordBreak: "break-all",
          whiteSpace: "pre-wrap",
        },
        menuItem: {
          fontSize: "16px",
          padding: "8px 20px",
          fontWeight: weightBold,
          ":hover": {
            cursor: "pointer",
          },
        },
        selected: {
          color: textWhite,
          backgroundColor: primary,
          borderRadius: 32,
        },
      }),
    [borderPrimary, primary, textWhite]
  );
};

export default PartnerDeveloperCodeSection;
