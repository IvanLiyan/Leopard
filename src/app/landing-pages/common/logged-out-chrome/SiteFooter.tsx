import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Layout, Popover, Text } from "@ContextLogic/lego";
import { Info } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";
import { useDeviceStore } from "@core/stores/DeviceStore";
import { useTheme } from "@core/stores/ThemeStore";
import { css } from "@core/toolkit/styling";
import { merchFeURL } from "@core/toolkit/router";
import Link from "@core/components/Link";

export type SiteFooterProps = BaseProps;

type OptionListType = {
  readonly text: string;
  readonly href: string;
  readonly info?: string;
  readonly show?: boolean;
};

const APIList: Array<OptionListType> = [
  {
    text: `API 2.0`,
    href: merchFeURL("/documentation/api/v2"),
    info: i`Not ready to switch to the update? Select this version.`,
  },
  {
    text: `API 3.0`,
    href: merchFeURL("/documentation/api/v3/reference"),
    info: i`For all the latest features, select this version.`,
  },
];

const PartnerList: Array<OptionListType> = [
  {
    text: i`Wish Partner Network`,
    href: "https://wish-partner.com",
  },
  {
    text: ci18n("Developer as in software developer", "Developer Resources"),
    href: merchFeURL("/partner-developer"),
  },
];

const SiteFooter: React.FC<SiteFooterProps> = ({ className, style }) => {
  const deviceStore = useDeviceStore();
  const { isSmallScreen } = deviceStore;

  const styles = useStylesheet({ isSmallScreen });

  const renderOptionList = (optionList: Array<OptionListType>) => {
    return (
      <Layout.FlexColumn style={styles.optionsList}>
        {optionList
          .filter((api) => api.show === undefined || api.show)
          .map((api) => (
            <Link
              key={api.href}
              href={api.href}
              style={[styles.link, styles.linkWithInfo]}
            >
              <Text weight="semibold" style={styles.linkWithInfoText}>
                {api.text}
              </Text>
              {api.info && (
                <Info
                  style={styles.info}
                  text={api.info}
                  size={14}
                  position="top right"
                  sentiment="info"
                />
              )}
            </Link>
          ))}
      </Layout.FlexColumn>
    );
  };

  return (
    <section className={css(styles.root, className, style)}>
      <Popover
        popoverContent={() => renderOptionList(PartnerList)}
        position="top center"
        contentWidth={162}
      >
        <Link style={styles.link}>Partners &#x25B4;</Link>
      </Popover>
      <Link href={merchFeURL("/terms-of-service")} style={styles.link}>
        Terms of Service
      </Link>
      <Link href={merchFeURL("/privacy-policy")} style={styles.link}>
        Privacy Policy
      </Link>
      <Link href={merchFeURL("/policy/home")} style={styles.link}>
        Merchant Policies
      </Link>
      <Link href={merchFeURL("/intellectual-property")} style={styles.link}>
        Intellectual Property
      </Link>
      <Link
        href={merchFeURL("/trust-and-safety/regulator-portal")}
        style={styles.link}
      >
        Trust & Safety Regulator Portal
      </Link>
      <Popover
        popoverContent={() => renderOptionList(APIList)}
        position={"top center"}
        contentWidth={82}
      >
        <Link href="#" style={styles.link}>
          API &#x25B4;
        </Link>
      </Popover>

      <Text className={css(styles.copyright)} weight="medium">
        © {new Date().getFullYear()} ContextLogic Inc.
      </Text>
    </section>
  );
};

export default observer(SiteFooter);

const useStylesheet = ({
  isSmallScreen,
}: {
  readonly isSmallScreen: boolean;
}) => {
  const { textDark, pageBackground, borderPrimary } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          alignItems: isSmallScreen ? "flex-start" : "center",
          flexWrap: "wrap",
          justifyContent: isSmallScreen ? "flex-start" : "center",
          padding: `16px 0px`,
          backgroundColor: pageBackground,
          borderTop: `solid 1px ${borderPrimary}`,
          gap: 24,
        },
        link: {
          fontSize: 14,
          lineHeight: 1.43,
          color: textDark,
        },
        linkWithInfo: {
          display: "flex",
          gap: 4,
          alignItems: "center",
        },
        linkWithInfoText: {
          minWidth: "fit-content",
        },
        copyright: {
          padding: "10px 0px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontSize: 16,
          lineHeight: 1.43,
          alignSelf: isSmallScreen ? "stretch" : undefined,
          color: textDark,
        },
        info: {
          color: textDark,
        },
        optionsList: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: 12,
          gap: 8,
        },
      }),
    [isSmallScreen, textDark, pageBackground, borderPrimary],
  );
};
