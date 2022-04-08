//
//  ExplanationBanner.tsx
//  Project-Lego
//
//  Created by Richard Ye on 12/04/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
import React, { useMemo, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { StaggeredFadeIn } from "@ContextLogic/lego";
import Icon from "@merchant/component/core/DEPRECATED_Icon";

import { IconName } from "@merchant/component/core/DEPRECATED_Icon";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import ExplanationBannerItem from "./ExplanationBannerItem";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type ExplanationBannerProps = BaseProps & {
  readonly separatorIcon?: IconName;
};

type Addition = {
  Item: typeof ExplanationBannerItem;
};

type ExplanationBannerType = React.ComponentType<ExplanationBannerProps> &
  Addition;

const ExplanationBannerIcon = (props: { readonly icon: IconName }) => {
  const { icon } = props;
  const styles = useStylesheet();

  return <Icon name={icon} className={css(styles.icon)} />;
};

const ExplanationBanner = observer((props: ExplanationBannerProps) => {
  const { style, className, separatorIcon = "arrowRightBlue" } = props;
  const styles = useStylesheet();
  const passedInChildren = useChildren(props);

  if (passedInChildren.length === 0) {
    return null;
  }

  const elementChildren: Array<ReactNode> = [];
  passedInChildren.forEach((child, i) => {
    if (i !== 0 && separatorIcon) {
      // eslint-disable-next-line local-rules/no-imperative-jsx
      elementChildren.push(
        // eslint-disable-next-line react/no-array-index-key
        <ExplanationBannerIcon icon={separatorIcon} key={`epc-icon-${i}`} />
      );
    }
    elementChildren.push(child);
  });

  return (
    <StaggeredFadeIn className={css(styles.root, className, style)}>
      {elementChildren}
    </StaggeredFadeIn>
  );
}) as ExplanationBannerType;

ExplanationBanner.Item = ExplanationBannerItem;

export default ExplanationBanner;

const useChildren = (props: ExplanationBannerProps) => {
  const { children } = props;
  return useMemo(() => {
    return React.Children.toArray(children).filter((e) =>
      React.isValidElement(e)
    );
  }, [children]);
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          overflowY: "auto",
          justifyContent: "center",
        },
        icon: {
          flex: "0 0 auto",
          margin: "25px 10px 0",
          alignSelf: "flex-start",
        },
      }),
    []
  );
};
