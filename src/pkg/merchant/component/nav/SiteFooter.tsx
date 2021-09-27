/* eslint-disable local-rules/no-empty-link */
import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";
import { Info } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

export type SiteFooterProps = BaseProps & {
  readonly insetX?: number;
};

type OptionListType = {
  readonly text: string;
  readonly href: string;
  readonly info?: string;
  readonly show?: boolean;
};

const APIList: Array<OptionListType> = [
  {
    text: `API 2.0`,
    href: "/documentation/api/v2",
    info: i`Not ready to switch to the update? Select this version.`,
  },
  {
    text: `API 3.0`,
    href: "/documentation/api/v3/reference",
    info: i`For all the latest features, select this version.`,
  },
];

const PartnerList: Array<OptionListType> = [
  {
    text: i`Wish App Store`,
    href: "/merchant_apps",
  },
  {
    text: ci18n("Developer as in software developer", "Developer Resources"),
    href: "/partner-developer",
  },
  {
    text: i`Other Partners`,
    href: "/partners",
  },
];

@observer
class SiteFooter extends Component<SiteFooterProps> {
  @computed
  get styles() {
    const { dimenStore } = AppStore.instance();
    const { insetX = dimenStore.pageGuideX } = this.props;
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: dimenStore.isSmallScreen ? "column" : "row",
        alignItems: dimenStore.isSmallScreen ? "flex-start" : "center",
        flexWrap: "wrap",
        justifyContent: dimenStore.isSmallScreen ? "flex-start" : "center",
        padding: `0px ${insetX}px 0px ${insetX}px`,
        backgroundColor: colors.pageBackground,
        boxShadow: "0 2px 4px 0 rgba(175, 199, 209, 0.2)",
        borderTop: "solid 1px rgba(175, 199, 209, 0.5)",
      },
      item: {
        fontSize: 14,
        fontWeight: fonts.weightMedium,
        lineHeight: 1.43,
        color: palettes.textColors.DarkInk,
        margin: "13px 30px 13px 0px",
      },
      copyright: {
        padding: "10px 0px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontSize: 16,
        fontWeight: fonts.weightMedium,
        lineHeight: 1.43,
        alignSelf: dimenStore.isSmallScreen ? "stretch" : undefined,
        color: palettes.textColors.DarkInk,
      },
      link: {
        display: "flex",
        padding: "5px 0px 7px 0px",
        fontSize: 14,
        fontWeight: fonts.weightMedium,
        lineHeight: 1.43,
        color: palettes.textColors.DarkInk,
        textAlign: "center",
        justifyContent: "center",
      },
      info: {
        marginLeft: "5px",
        marginTop: "2px",
        color: palettes.textColors.DarkInk,
        fontFamily: fonts.proxima,
      },
      optionsList: {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        fontFamily: fonts.proxima,
      },
    });
  }

  renderOptionList(optionList: Array<OptionListType>) {
    return (
      <div className={css(this.styles.optionsList)}>
        {optionList
          .filter((api) => api.show === undefined || api.show)
          .map((api) => (
            <Link
              key={api.href}
              href={api.href}
              className={css(this.styles.link)}
              style={{ color: palettes.textColors.DarkInk }}
            >
              {api.text}
              {api.info && (
                <Info
                  className={css(this.styles.info)}
                  text={api.info}
                  size={14}
                  position="top right"
                  sentiment="info"
                />
              )}
            </Link>
          ))}
      </div>
    );
  }

  render() {
    const { className, style } = this.props;
    return (
      <section className={css(this.styles.root, className, style)}>
        <Popover
          className={css(this.styles.item)}
          popoverContent={() => this.renderOptionList(PartnerList)}
          position="top center"
          contentWidth={162}
        >
          <Link
            style={{
              color: palettes.textColors.DarkInk,
              fontWeight: fonts.weightMedium,
            }}
          >
            Partners &#x25B4;
          </Link>
        </Popover>
        <Link
          href="/terms-of-service"
          className={css(this.styles.item)}
          style={{ color: palettes.textColors.DarkInk }}
        >
          Terms of Service
        </Link>
        <Link
          href="/privacy-policy"
          className={css(this.styles.item)}
          style={{ color: palettes.textColors.DarkInk }}
        >
          Privacy Policy
        </Link>
        <Link
          href="/policy/home"
          className={css(this.styles.item)}
          style={{ color: palettes.textColors.DarkInk }}
        >
          Merchant Policies
        </Link>
        <Link
          href="/intellectual-property"
          className={css(this.styles.item)}
          style={{ color: palettes.textColors.DarkInk }}
        >
          Intellectual Property
        </Link>
        <Popover
          className={css(this.styles.item)}
          popoverContent={() => this.renderOptionList(APIList)}
          position={"top center"}
          contentWidth={82}
        >
          <Link
            href="#"
            style={{
              color: palettes.textColors.DarkInk,
              fontWeight: fonts.weightMedium,
            }}
            isRouterLink
          >
            API &#x25B4;
          </Link>
        </Popover>
        {/* <Link
         href="/mobile"
         className={css(this.styles.item)}
         style={{ color: palettes.textColors.DarkInk }}
        >
         Mobile Apps
        </Link> */}

        {/* This should always be last */}
        <div className={css(this.styles.copyright)}>
          © {new Date().getFullYear()} ContextLogic Inc.
        </div>
      </section>
    );
  }
}

export default SiteFooter;
