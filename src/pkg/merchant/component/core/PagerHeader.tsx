//
//  src/nav/PagerHeader.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 6/16/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//
import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Pager, PagerProps } from "@ContextLogic/lego";
import WelcomeHeader, { WelcomeHeaderProps } from "./WelcomeHeader";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import DeviceStore from "@stores/DeviceStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type PagerHeaderProps = BaseProps & {
  readonly headerProps: WelcomeHeaderProps;
  readonly pagerProps: PagerProps;
};

@observer
class PagerHeader extends Component<PagerHeaderProps> {
  static Content = Pager.Content;

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
    });
  }

  render() {
    const { headerProps, pagerProps, children, className, style } = this.props;
    const deviceStore = DeviceStore.instance();
    return (
      <div className={css(this.styles.root, className, style)}>
        <WelcomeHeader
          hideBorder
          paddingX={deviceStore.pageGuideX}
          {...headerProps}
        />
        <Pager tabsPadding={`0px ${deviceStore.pageGuideX}`} {...pagerProps}>
          {children}
        </Pager>
      </div>
    );
  }
}

export default PagerHeader;
