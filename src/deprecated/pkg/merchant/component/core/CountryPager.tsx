//
//  component/nav/CountryPager.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 8/7/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//
import React, { Component, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Pager } from "@ContextLogic/lego";
import Flag from "./Flag";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import { getCountryName } from "@toolkit/countries";

import DeviceStore from "@stores/DeviceStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryCode } from "@toolkit/countries";

export type CountryPagerProps = BaseProps & {
  readonly currentCountryCode?: CountryCode;
  readonly onTabChange?: (countryCode: CountryCode) => unknown;
  readonly maxVisibleTabs?: number;
  readonly hideHeaderBorder?: boolean;
};

export type ContentProps = BaseProps & {
  readonly countryCode: CountryCode;
  readonly disabled: boolean;
};

const MAX_VISIBLE_TABS_DEFAULT = 6;

@observer
class CountryPager extends Component<CountryPagerProps> {
  static Content = (
    props: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > &
      ContentProps
  ) => {
    const { countryCode, ...otherProps } = props;
    return <div {...otherProps}>{props.children}</div>;
  };

  static demoWithVerticalLayout = true;

  static demoRender = `
<CountryPager currentCountryCode="au" onTabChange={(countryCode) => {}}>
  <CountryPager.Content countryCode="us">
    United States tab
  </CountryPager.Content>
  <CountryPager.Content countryCode="au">
    Australia tab
  </CountryPager.Content>
  <CountryPager.Content countryCode="it">
    Italy tab
  </CountryPager.Content>
  <CountryPager.Content countryCode="za">
    South Africa tab
  </CountryPager.Content>
</CountryPager>
`;

  static defaultProps = {
    maxVisibleTabs: MAX_VISIBLE_TABS_DEFAULT,
  };

  renderCountry(countryCode: CountryCode) {
    const countryName = getCountryName(countryCode);

    return (
      <div className={css(this.styles.header)} title={countryName}>
        <div className={css(this.styles.headerContent)}>
          <Flag
            countryCode={countryCode}
            aspectRatio={"4x3"}
            className={css(this.styles.flag)}
          />
          <section className={css(this.styles.headerText)}>
            {countryName}
          </section>
        </div>
      </div>
    );
  }

  @computed
  get children(): ReadonlyArray<ReactNode> {
    const { children: childrenProp } = this.props;
    const children = React.Children.toArray(childrenProp).filter((_) => !!_);

    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) {
        return null;
      }
      const countryCode = child.props.countryCode.toUpperCase();
      return React.cloneElement(child, {
        titleValue: () => this.renderCountry(countryCode),
        disabled: child.props.disabled,
        tabKey: countryCode,
      });
    });
  }

  @computed
  get styles() {
    const deviceStore = DeviceStore.instance();

    return StyleSheet.create({
      root: {},
      header: {
        display: "flex",
        padding: "15px 35px",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: palettes.textColors.White,
        minWidth: deviceStore.isSmallScreen ? 100 : 150,
      },
      headerContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
      flag: {
        height: 17,
        borderRadius: 1,
        marginRight: 8,
      },
      headerText: {
        fontSize: 14,
        fontWeight: fonts.weightMedium,
        lineHeight: 1.43,
        color: palettes.textColors.DarkInk,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      },
      pagerButtonContainer: {
        top: 0,
        bottom: 0,
        paddingBottom: 14,
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        zIndex: 1,
      },
    });
  }

  render() {
    const {
      maxVisibleTabs,
      currentCountryCode,
      onTabChange,
      hideHeaderBorder,
      className,
    } = this.props;

    const deviceStore = DeviceStore.instance();
    return (
      <Pager
        className={css(this.styles.root, className)}
        maxVisibleTabs={deviceStore.isSmallScreen ? 2 : maxVisibleTabs}
        selectedTabKey={currentCountryCode && currentCountryCode.toUpperCase()}
        onTabChange={onTabChange}
        hideHeaderBorder={hideHeaderBorder}
        equalSizeTabs
      >
        {this.children}
      </Pager>
    );
  }
}

export default CountryPager;
