import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";
import moment from "moment/moment";

/* Lego Components */
import { SimpleBannerItem, Markdown } from "@ContextLogic/lego";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Toolkit */
import { formatDatetimeLocalized } from "@toolkit/datetime";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { Datetime } from "@schema/types";

import { termsUpdateBanner } from "@assets/illustrations";

export type TermsUpdateBannerProps = BaseProps & {
  readonly logParams: {
    [field: string]: string;
  };
  readonly releaseDate?: Pick<Datetime, "unix">;
};

const TermsUpdateBanner: React.FC<TermsUpdateBannerProps> = (
  props: TermsUpdateBannerProps
) => {
  const { logParams, releaseDate } = props;
  const { primary } = useTheme();
  const styles = useStylesheet();
  const dateFormat = "MMMM D, YYYY";
  const effectiveDate = useMemo(
    () => moment.unix(releaseDate?.unix || 1633320000).add(30, "days"),
    [releaseDate]
  );
  const formattedEffectiveDate = formatDatetimeLocalized(
    effectiveDate,
    dateFormat
  );
  return (
    <SimpleBannerItem
      title={i`Update on Merchant Terms of Service and Agreement`}
      body={() => (
        <>
          <Markdown
            text={
              i`There has been a change to the ` +
              i`[Merchant Terms of Service and Agreement](/terms-of-service). ` +
              i`These terms take effect on ${formattedEffectiveDate} for existing merchants.`
            }
            openLinksInNewTab
          />
          <Markdown
            text={
              i`By continuing to use the Wish Services on or after ${formattedEffectiveDate}, ` +
              i`you have accepted the updated Merchant Terms of Service and Agreement ` +
              i`and you have agreed to be bound by and comply with them.`
            }
            style={styles.termsParagraph}
          />
        </>
      )}
      bannerImg={termsUpdateBanner}
      cta={{
        text: i`View Terms of Service`,
        href: "/terms-of-service",
        style: {
          backgroundColor: primary,
        },
      }}
      logParams={{
        banner_key: "TermsUpdateBanner",
        ...logParams,
      }}
    />
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        termsParagraph: {
          marginTop: 20,
        },
      }),
    []
  );
};

export default observer(TermsUpdateBanner);
